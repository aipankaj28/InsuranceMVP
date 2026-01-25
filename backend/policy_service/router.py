from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
from .engine import policy_engine
from .schemas import BatchExtractionResponse, PolicyExtractionResult
import asyncio

router = APIRouter(prefix="/api/policy", tags=["Policy Service"])

@router.post("/extract-multiple", response_model=BatchExtractionResponse)
async def extract_multiple_policies(files: List[UploadFile] = File(...)):
    """
    Extract details from multiple policy documents in parallel.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    tasks = []
    for file in files:
        # Read file content
        content = await file.read()
        mime_type = file.content_type
        filename = file.filename
        
        # Schedule extraction
        tasks.append(policy_engine.extract_details(content, filename, mime_type))

    # Execute all extractions in parallel
    results = await asyncio.gather(*tasks)

    success_count = sum(1 for r in results if r.is_valid_policy)
    
    # Simple logic to aggregate profile hints: take the first non-null values found
    agg_name = next((r.user_hint.full_name for r in results if r.user_hint and r.user_hint.full_name), None)
    agg_dob = next((r.user_hint.dob for r in results if r.user_hint and r.user_hint.dob), None)
    agg_gender = next((r.user_hint.gender for r in results if r.user_hint and r.user_hint.gender), None)
    agg_city = next((r.user_hint.city for r in results if r.user_hint and r.user_hint.city), None)
    
    from .schemas import UserProfileHint
    aggregated_profile = UserProfileHint(
        full_name=agg_name,
        dob=agg_dob,
        gender=agg_gender,
        city=agg_city
    ) if any([agg_name, agg_dob, agg_gender, agg_city]) else None

    import os
    show_debug = os.getenv("SHOW_DEBUG_INFO", "false").lower() == "true"

    return BatchExtractionResponse(
        results=results,
        total_processed=len(files),
        success_count=success_count,
        aggregated_profile=aggregated_profile,
        show_debug=show_debug
    )
