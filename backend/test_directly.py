import os
import json
from logic import calculate_recommendation
from dotenv import load_dotenv

load_dotenv()

test_data = {
    "age": 30,
    "experience": 5,
    "income_level": "High",
    "city": "Bangalore",
    "family_status": "Married with 2 dependents"
}

print("Running recommendation logic directly...")
try:
    result = calculate_recommendation(test_data)
    print("\nRESULT:")
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"\nCRITICAL ERROR: {e}")
