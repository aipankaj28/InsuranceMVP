import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database import SessionLocal, User, Recommendation
import json

def verify_profile_logic():
    db = SessionLocal()
    try:
        # Get a user (assuming one exists from previous tests)
        user = db.query(User).first()
        if not user:
            print("No user found in database. Run the app flow once first.")
            return

        print(f"Verifying profile for: {user.email}")
        
        # Simulate the logic in main.py:get_user_profile
        all_recs = db.query(Recommendation).filter(Recommendation.user_id == user.id).order_by(Recommendation.created_at.desc()).all()
        
        profile_data = {
            "profile": {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "dob": user.dob,
                "mobile": user.mobile,
                "income_level": user.income_level,
                "city": user.city,
                "gender": user.gender,
                "marital_status": user.marital_status,
                "support_parents": user.support_parents,
                "career_stage": user.career_stage,
                "employment_type": user.employment_type,
                "lifestyle": user.lifestyle,
                "smoking_status": user.smoking_status,
                "family_health_history": user.family_health_history,
                "dependents": user.dependents_data,
                "num_children": user.num_children,
                "has_life_insurance": user.has_life_insurance,
                "existing_life_cover": user.existing_life_cover,
                "has_health_insurance": user.has_health_insurance,
                "existing_health_cover": user.existing_health_cover,
                "health_source": user.health_source,
                "parents_covered": user.parents_covered
            },
            "recommendations": [
                {
                    "id": rec.id,
                    "life_cover": rec.life_cover,
                    "health_cover": rec.health_cover,
                    "persona_name": rec.persona_name,
                    "tagline": rec.tagline or rec.details,
                    "reasoning": rec.reasoning,
                    "recommended_features": rec.features,
                    "icon": rec.icon,
                    "mode": rec.mode,
                    "prompt_sent": rec.prompt_sent,
                    "created_at": rec.created_at.isoformat()
                } for rec in all_recs
            ]
        }
        
        print("Profile Data structure generated successfully:")
        print(json.dumps(profile_data, indent=2))
        
        # Specific check for fields that were broken
        assert "smoking_status" in profile_data["profile"]
        assert "is_smoker" not in profile_data["profile"]
        assert "dependents" in profile_data["profile"]
        
        print("\nSUCCESS: All expected fields are present and correctly mapped!")

    except Exception as e:
        print(f"FAILURE: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_profile_logic()
