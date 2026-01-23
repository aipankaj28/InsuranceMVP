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
    
    return BatchExtractionResponse(
        results=results,
        total_processed=len(files),
        success_count=success_count
    )
