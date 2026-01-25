from pydantic import BaseModel, Field
from typing import List, Optional

class PolicyAddOn(BaseModel):
    name: str
    description: str

class UserProfileHint(BaseModel):
    full_name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    city: Optional[str] = None

class PolicyExtractionResult(BaseModel):
    filename: str
    provider_name: Optional[str] = None
    policy_name: Optional[str] = None
    coverage_amount_val: Optional[int] = 0
    coverage_amount_str: Optional[str] = "Unknown"
    currency: str = "INR"
    add_ons: List[PolicyAddOn] = []
    expiry_date: Optional[str] = None
    premium_amount: Optional[float] = 0.0
    is_valid_policy: bool = False
    confidence_score: float = 0.0
    raw_summary: Optional[str] = None
    policy_type: Optional[str] = "OTHER" # LIFE, HEALTH, OTHER
    user_hint: Optional[UserProfileHint] = None
    prompt_sent: Optional[str] = None

class BatchExtractionResponse(BaseModel):
    results: List[PolicyExtractionResult]
    total_processed: int
    success_count: int
    aggregated_profile: Optional[UserProfileHint] = None
    show_debug: bool = False
