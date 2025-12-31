from pydantic import ValidationError
from typing import Dict, Optional, List
from pydantic import BaseModel

# Simplified version of UserData to test validation logic
class UserData(BaseModel):
    first_name: str
    last_name: str
    dob: str
    mobile: str
    income_level: str
    city: str
    gender: str
    marital_status: str
    support_parents: bool
    career_stage: str
    employment_type: str
    lifestyle: str
    smoking_status: str
    family_health_history: List[str]
    dependents: Optional[Dict[str, bool]] = {} # The fix
    num_children: Optional[int] = 0

def test_validation():
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "dob": "1990-01-01",
        "mobile": "1234567890",
        "income_level": "₹10-20 lakhs",
        "city": "Mumbai",
        "gender": "Male",
        "marital_status": "Married",
        "support_parents": True,
        "career_stage": "Growth Gear",
        "employment_type": "Salaried",
        "lifestyle": "Active",
        "smoking_status": "Never",
        "family_health_history": [],
        # "dependents": {"Spouse": True} # This was missing or malformed
    }
    
    try:
        user = UserData(**payload)
        print("SUCCESS: Payload validated correctly!")
        print(f"Dependents: {user.dependents}")
    except ValidationError as e:
        print(f"FAILURE: Validation failed: {e}")

if __name__ == "__main__":
    test_validation()
