import requests
import json

BASE_URL = "http://localhost:8000"
TOKEN = "YOUR_TOKEN_HERE" # I'll have to get this or test without it if I can skip auth

payload = {
    "first_name": "Test",
    "last_name": "User",
    "dob": "1990-01-01",
    "mobile": "9876543210",
    "income_level": "₹10-20 lakhs",
    "city": "Mumbai",
    "gender": "Male",
    "marital_status": "Single",
    "support_parents": False,
    "career_stage": "Launch Pad",
    "employment_type": "Salaried (MNC/Large)",
    "lifestyle": "Active",
    "smoking_status": "Never",
    "family_health_history": [],
    "has_health_insurance": True,
    "has_life_insurance": True,
    "existing_life_cover": "₹50 Lakhs",
    "existing_health_cover": "₹5 Lakhs"
}

# This is just a draft, I can't easily run it without a token.
# But I can check the backend logs or add print statements.
