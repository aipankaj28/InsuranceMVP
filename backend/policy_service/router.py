from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List, Optional
import json
from .engine import policy_engine
from .schemas import BatchExtractionResponse, PolicyExtractionResult
import asyncio
from auth import get_current_user

router = APIRouter(prefix="/api/policy", tags=["Policy Service"])

# Protected extraction endpoint
@router.post("/extract-multiple", response_model=BatchExtractionResponse)
async def extract_multiple_policies(
    files: List[UploadFile] = File(...),
    passwords: Optional[str] = File(None), # Optional JSON string: {"filename": "password"}
    user_payload: dict = Depends(get_current_user)
):
    """
    Extract details from multiple policy documents in parallel.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    # Parse passwords if provided
    password_map = {}
    if passwords:
        try:
            password_map = json.loads(passwords)
        except Exception:
            pass

    tasks = []
    for file in files:
        # Read file content
        content = await file.read()
        mime_type = file.content_type
        filename = file.filename
        
        # Get password for this specific file if it exists
        pw = password_map.get(filename)
        
        # Schedule extraction with optional password
        tasks.append(policy_engine.extract_details(content, filename, mime_type, password=pw))

    # Execute all extractions in parallel
    results = await asyncio.gather(*tasks)

    success_count = sum(1 for r in results if r.is_valid_policy)
    
    # Simple logic to aggregate profile hints: take the first non-null values found
    agg_name = next((r.user_hint.full_name for r in results if r.user_hint and r.user_hint.full_name), None)
    agg_dob = next((r.user_hint.dob for r in results if r.user_hint and r.user_hint.dob), None)
    agg_gender = next((r.user_hint.gender for r in results if r.user_hint and r.user_hint.gender), None)
    agg_city = next((r.user_hint.city for r in results if r.user_hint and r.user_hint.city), None)
    agg_marital = next((r.user_hint.marital_status for r in results if r.user_hint and r.user_hint.marital_status), None)
    agg_children = next((r.user_hint.num_children for r in results if r.user_hint and r.user_hint.num_children is not None), None)
    
    from .schemas import UserProfileHint
    aggregated_profile = UserProfileHint(
        full_name=agg_name,
        dob=agg_dob,
        gender=agg_gender,
        city=agg_city,
        marital_status=agg_marital,
        num_children=agg_children
    ) if any([agg_name, agg_dob, agg_gender, agg_city, agg_marital, agg_children is not None]) else None

    import os
    show_debug = os.getenv("SHOW_DEBUG_INFO", "false").lower() == "true"

    return BatchExtractionResponse(
        results=results,
        total_processed=len(files),
        success_count=success_count,
        aggregated_profile=aggregated_profile,
        show_debug=show_debug
    )
