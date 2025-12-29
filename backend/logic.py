import os
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============================================================================
# RULE-BASED LOGIC (Original)
# ============================================================================

def get_city_tier(city_name: str) -> str:
    tier_1 = ["mumbai", "delhi", "bangalore", "bengaluru", "hyderabad", "chennai", "kolkata", "pune"]
    tier_2 = ["ahmedabad", "surat", "jaipur", "lucknow", "kanpur", "nagpur", "indore", "thane", "bhopal", "visakhapatnam"]
    
    city = city_name.lower().strip()
    if city in tier_1:
        return "Tier 1"
    elif city in tier_2:
        return "Tier 2"
    return "Tier 3"

def parse_income(income_level: str) -> int:
    mapping = {
        "<5L": 400000,
        "5-10L": 750000,
        "10-20L": 1500000,
        ">20L": 2500000
    }
    return mapping.get(income_level, 500000)

def calculate_age(dob_str: str) -> int:
    try:
        dob = datetime.fromisoformat(dob_str)
        today = datetime.today()
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    except (ValueError, TypeError):
        return 30  # Default age if parsing fails

def calculate_recommendation_rule(data: dict) -> dict:
    """Updated rule-based recommendation logic for full family structure"""
    income_val = parse_income(data.get("income_level", "<5L"))
    age = calculate_age(data.get("dob", ""))
    city_tier = get_city_tier(data.get("city", ""))
    is_smoker = data.get("is_smoker", False)
    dependents = data.get("dependents", {})
    num_children = data.get("num_children", 0)

    # Life Insurance Rule: 15x-20x Annual Income based on age and dependents
    multiplier = 15
    if age < 35:
        multiplier = 20
    elif age > 50:
        multiplier = 10
        
    # Boost multiplier if they have kids or spouse
    if dependents.get("Spouse") or num_children > 0:
        multiplier += 2
    
    # Smoking impact: Smoker might need more coverage or higher premium (logic-wise we increase coverage requirement)
    if is_smoker:
        # Increase coverage by 20% if smoker
        life_cover_amount = int(income_val * multiplier * 1.2)
    else:
        life_cover_amount = income_val * multiplier
    
    # Health Insurance Rule
    base_health = 500000
    if city_tier == "Tier 1":
        base_health = 1000000
    elif city_tier == "Tier 2":
        base_health = 750000
        
    # family impact
    members_count = 1 # Self
    if dependents.get("Spouse"): members_count += 1
    members_count += num_children
    if dependents.get("Mother"): members_count += 1
    if dependents.get("Father"): members_count += 1
    if dependents.get("Mother-In-Law"): members_count += 1
    if dependents.get("Father-In-Law"): members_count += 1
    
    # Increase health cover based on family members
    if members_count > 1:
        base_health = int(base_health * (1 + (members_count - 1) * 0.3))

    # Format strings
    life_cover_str = f"₹{life_cover_amount/10000000:.1f} Crore" if life_cover_amount >= 10000000 else f"₹{life_cover_amount/100000:.0f} Lakhs"
    health_cover_str = f"₹{base_health/100000:.0f} Lakhs"
    
    details = f"Coverage designed for your profile including {members_count} family members in a {city_tier} city."
    if is_smoker:
        details += " Note: Smoking status affects premium and coverage needs."

    return {
        "life_cover": life_cover_str,
        "health_cover": health_cover_str,
        "details": details,
        "reasoning": f"Based on your income of {data.get('income_level')} and family size of {members_count}, we recommend this coverage level to ensure financial stability.",
        "recommended_features": [
            {"name": "Critical Illness Cover", "reason": "Recommended for long-term health protection."},
            {"name": "No Room Rent Capping", "reason": "Ensures you get any room type during hospitalization."}
        ],
        "icon": "🚀" if life_cover_amount > 10000000 else "🛡️"
    }

# ============================================================================
# AI-BASED LOGIC (Gemini)
# ============================================================================

def calculate_recommendation_ai(data: dict) -> dict:
    """AI-powered recommendation using Google Gemini"""
    try:
        import google.generativeai as genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        
        genai.configure(api_key=api_key)
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        model = genai.GenerativeModel(model_name)
        
        # Build prompt
        prompt = f"""You are an expert Indian insurance advisor. Based on the following user profile, recommend life and health insurance coverage amounts.

User Profile:
- Age: {data.get('age', 25)}
- Gender: {data.get('gender', 'Not specified')}
- City: {data.get('city', 'Unknown')}
- Annual Income: {data.get('income_level', '<5L')}
- Family Status: {data.get('family_status', 'Single')}
- Smoker: {'Yes' if data.get('is_smoker') else 'No'}
- Years of Experience: {data.get('experience', 0)}

Provide a recommendation in EXACTLY this JSON format:
{{
  "life_cover": "₹X Crore" or "₹X Lakhs",
  "health_cover": "₹X Lakhs",
  "details": "A short tagline summary (one sentence).",
  "reasoning": "A detailed 2-3 sentence explanation of WHY these specific cover amounts were chosen based on the user's age, gender, income, smoking status, and city tier.",
  "recommended_features": [
    {{ "name": "Maternity Benefit", "reason": "Explain why this feature is suitable based on the user's demographic (e.g., if female and of child-bearing age)." }},
    {{ "name": "Critical Illness Cover", "reason": "Reason for adding this (e.g., lifestyle, age)." }},
    {{ "name": "No Room Rent Capping", "reason": "Why this is important in their city tier." }}
  ],
  "icon": "🚀" or "🛡️" or "💼"
}}

Be specific and empathetic. Mention the user's gender or family situation where relevant. Avoid generic advice."""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Try to extract JSON from response
        # Sometimes Gemini wraps JSON in markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        result = json.loads(response_text)
        
        # Validate required fields
        required_fields = ["life_cover", "health_cover", "details", "reasoning", "recommended_features", "icon"]
        if not all(field in result for field in required_fields):
            raise ValueError("AI response missing required fields")
        
        return result
        
    except Exception as e:
        import traceback
        print(f"AI recommendation failed: {e}")
        print(f"Full traceback:")
        traceback.print_exc()
        print("Falling back to rule-based logic...")
        return calculate_recommendation_rule(data)

# ============================================================================
# MAIN DISPATCHER
# ============================================================================

def calculate_recommendation(data: dict) -> dict:
    """Main entry point - dispatches to AI or Rule based on config"""
    mode = os.getenv("RECOMMENDATION_MODE", "RULE").upper()
    
    if mode == "AI":
        result = calculate_recommendation_ai(data)
    else:
        result = calculate_recommendation_rule(data)
    
    # Add mode to response for debugging
    result["mode"] = mode
    return result
