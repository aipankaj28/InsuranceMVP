"""
Integration test to verify AI mode is working correctly
"""
import requests
import json

# Test data - matching the UserData schema
test_payload = {
    "age": 30,
    "experience": 5,
    "income_level": "High",
    "city": "Bangalore",
    "family_status": "Married with 2 dependents"
}

print("=" * 60)
print("Testing AI Mode Integration")
print("=" * 60)

# Make request to the API
url = "http://localhost:8000/api/recommend"
print(f"\nSending POST request to: {url}")
print(f"Payload: {json.dumps(test_payload, indent=2)}")

try:
    response = requests.post(url, json=test_payload)
    response.raise_for_status()
    
    result = response.json()
    
    print("\n" + "=" * 60)
    print("RESPONSE RECEIVED")
    print("=" * 60)
    
    # Check if we got a valid response
    if "recommendation" in result:
        rec = result["recommendation"]
        
        print(f"\nMode Used: {rec.get('mode', 'UNKNOWN')}")
        print(f"\nPlan Type: {rec.get('plan_type', 'N/A')}")
        print(f"Coverage: Rs.{rec.get('coverage', 0):,}")
        print(f"Premium: Rs.{rec.get('premium', 0):,}/year")
        
        print(f"\nDetails:\n{rec.get('details', 'N/A')}")
        
        # Verify AI mode
        print("\n" + "=" * 60)
        print("VERIFICATION")
        print("=" * 60)
        
        mode = rec.get('mode', '')
        details = rec.get('details', '')
        
        if mode == 'AI':
            print("[PASS] Mode is set to AI")
        else:
            print(f"[FAIL] Mode is '{mode}' (expected 'AI')")
        
        # Check for AI-specific characteristics
        ai_indicators = [
            "personalized" in details.lower(),
            "empathetic" in details.lower() or "understand" in details.lower(),
            "tier 1 city" not in details.lower(),  # Rule-based phrase
            len(details) > 100  # AI responses tend to be longer
        ]
        
        if any(ai_indicators):
            print("[PASS] Response contains AI-generated characteristics")
            print(f"  - Length: {len(details)} characters")
            print(f"  - Contains personalized language: {'Yes' if 'personalized' in details.lower() else 'No'}")
        else:
            print("[FAIL] Response appears to be rule-based")
            print("  Rule-based indicator: 'Tier 1 city' phrase detected" if "tier 1 city" in details.lower() else "")
        
        print("\n" + "=" * 60)
        if mode == 'AI' and any(ai_indicators):
            print("TEST PASSED: AI Mode is working!")
        else:
            print("TEST FAILED: AI Mode is not working properly")
        print("=" * 60)
        
    else:
        print("\n[FAIL] ERROR: No recommendation in response")
        print(f"Response: {json.dumps(result, indent=2)}")
        
except requests.exceptions.RequestException as e:
    print(f"\n[FAIL] ERROR: Failed to connect to API")
    print(f"Error: {e}")
    print("\nMake sure the backend server is running on http://localhost:8000")
except Exception as e:
    print(f"\n[FAIL] ERROR: {e}")

