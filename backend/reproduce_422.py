import requests

API_BASE_URL = "http://localhost:8000"

# Mock token (if needed, but 422 happens before auth if schema is wrong, or maybe after)
# Actually, FastAPI validates schema AFTER Depends(get_current_user)? 
# No, usually it validates body before or during injection.

payload = {
    "recommended_life_cover": "₹1.5 Crore",
    "recommended_life_cover_val": 15000000,
    "recommended_health_cover": "₹10 Lakhs",
    "recommended_health_cover_val": 1000000,
    "recommended_features": ["Critical Illness", "No Room Rent Capping"],
    "has_life_insurance": False,
    "existing_life_cover_val": 0,
    "life_provider": "",
    "life_policy_name": "",
    "has_health_insurance": False,
    "existing_health_cover_val": 0,
    "health_provider": "",
    "health_policy_name": "",
    "health_source": "",
    "first_name": "Test",
    "age": 30,
    "income_level": "₹5-10 lakhs",
    "city": "Mumbai"
}

# We need a token to pass get_current_user
# Let's try to get one
auth_response = requests.post(f"{API_BASE_URL}/api/auth/otp", json={"email": "test@example.com"})
print(f"OTP response: {auth_response.status_code}")

# Use a mock token or bypass if possible (but we can't bypass easily without changing code)
# Let's assume the error is 422, which is validation error.

response = requests.post(f"{API_BASE_URL}/api/policy-recommendations", json=payload)
print(f"Status Code: {response.status_code}")
if response.status_code == 422:
    print(response.json())
