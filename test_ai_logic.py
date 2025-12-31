import os
import json
import sys
from dotenv import load_dotenv

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from logic import calculate_recommendation_ai

def test_ai_integration():
    # Load environment variables
    load_dotenv(os.path.join('backend', '.env'))
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in backend/.env")
        return

    print(f"Testing Gemini integration with key starting: {api_key[:5]}...")

    # Mock user data
    mock_data = {
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
        "employment_type": "Salaried (MNC/Large)",
        "lifestyle": "Moderately Active",
        "smoking_status": "Never",
        "family_health_history": ["No significant history"],
        "num_children": 1
    }

    try:
        print("Calling calculate_recommendation_ai...")
        result = calculate_recommendation_ai(mock_data)
        
        print("\n--- AI RESPONSE RECEIVED ---")
        print(json.dumps(result, indent=2))
        
        required_fields = ["life_cover", "health_cover", "persona_name", "tagline", "reasoning", "recommended_features", "icon"]
        missing = [f for f in required_fields if f not in result]
        
        if missing:
            print(f"\nFAILURE: Missing fields: {missing}")
        else:
            print("\nSUCCESS: All required fields present.")
            
    except Exception as e:
        print(f"\nERROR during AI calculation: {str(e)}")

if __name__ == "__main__":
    test_ai_integration()
