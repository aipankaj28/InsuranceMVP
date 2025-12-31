# FORCE UNBUFFERED PRINT FOR RAILWAY LOGS
import sys
import os
import logging
import traceback
from typing import Dict, Optional

def log_now(msg):
    print(f"--- [STARTUP LOG] {msg}", file=sys.stdout, flush=True)

log_now("--- BACKEND MODULE LOADING ---")

try:
    from fastapi import FastAPI, HTTPException, Depends, Header
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    from sqlalchemy.orm import Session
    
    from logic import calculate_recommendation
    from auth import generate_otp, store_otp, send_otp_email, verify_otp_logic, create_access_token, decode_access_token
    from database import init_db, get_db, User, Recommendation
    log_now("Modules imported successfully.")
except Exception as e:
    log_now(f"FATAL: Module import failed: {str(e)}")
    traceback.print_exc()
    sys.exit(1)

from contextlib import asynccontextmanager

# Initialize Database on Startup using modern lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    log_now("Starting startup lifespan sequence...")
    try:
        log_now("Initializing database...")
        init_db()
        log_now("Database initialized successfully.")
    except Exception as e:
        log_now(f"FATAL: Database initialization failed: {str(e)}")
        traceback.print_exc()
        sys.exit(1)
    
    yield # Application runs here
    
    log_now("--- BACKEND SHUTTING DOWN ---")

app = FastAPI(lifespan=lifespan)

log_now("Configuring CORS...")
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]
raw_frontend_url = os.getenv("FRONTEND_URL", "").strip()
if raw_frontend_url:
    # AUTOMATICALLY FIX MISSING PROTOCOL
    if not raw_frontend_url.startswith('http'):
        frontend_url = f"https://{raw_frontend_url}"
    else:
        frontend_url = raw_frontend_url
    
    # Remove trailing slash for Starlette compatibility
    frontend_url = frontend_url.rstrip('/')
    
    origins.append(frontend_url)
    log_now(f"Added CORS origin: {frontend_url}")
else:
    log_now("No FRONTEND_URL found, using defaults.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
log_now(f"CORS configured with origins: {origins}")
log_now("CORS configuration complete.")

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
    family_health_history: list[str]
    is_smoker: Optional[bool] = False
    dependents: Optional[Dict[str, bool]] = {}
    num_children: Optional[int] = 0
    # Phase 2 Fields
    has_life_insurance: Optional[bool] = False
    existing_life_cover: Optional[str] = ""
    existing_life_cover_val: Optional[int] = 0
    has_health_insurance: Optional[bool] = False
    existing_health_cover: Optional[str] = ""
    existing_health_cover_val: Optional[int] = 0
    health_source: Optional[str] = ""
    parents_covered: Optional[bool] = False
    parents_health_cover: Optional[str] = ""
    parents_health_cover_val: Optional[int] = 0
    # Existing Policy Details
    life_provider: Optional[str] = ""
    life_policy_name: Optional[str] = ""
    health_provider: Optional[str] = ""
    health_policy_name: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str

class PolicyRecommendationRequest(BaseModel):
    recommended_life_cover: str
    recommended_health_cover: str
    recommended_features: list[str]
    has_life_insurance: bool
    existing_life_cover_val: Optional[int] = 0
    life_provider: Optional[str] = ""
    life_policy_name: Optional[str] = ""
    has_health_insurance: bool
    existing_health_cover_val: Optional[int] = 0
    health_provider: Optional[str] = ""
    health_policy_name: Optional[str] = ""
    health_source: Optional[str] = ""
    # Profile context
    first_name: str
    age: int
    income_level: str
    city: str

# Dependency to verify JWT
async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        log_now("AUTH ERROR: Missing Authorization header")
        raise HTTPException(status_code=401, detail="Missing authorization header")
        
    if not authorization.startswith("Bearer "):
        log_now(f"AUTH ERROR: Invalid header format: {authorization[:20]}...")
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    token = authorization.split(" ")[1]
    if token == "null" or token == "undefined" or not token:
        log_now(f"AUTH ERROR: Token is literal '{token}'")
        raise HTTPException(status_code=401, detail="Invalid token value")

    payload = decode_access_token(token)
    if not payload:
        log_now("AUTH ERROR: Token decoding failed (expired or invalid signature)")
        raise HTTPException(status_code=401, detail="Token expired or invalid")
        
    return payload

@app.get("/")
def read_root():
    return {"message": "Insurance Wizard Backend is Running!"}

@app.post("/api/auth/otp")
async def login(request: LoginRequest):
    email = request.email.lower().strip()
    otp = generate_otp()
    
    # Send email
    success, error_msg = send_otp_email(email, otp)
    if not success:
        raise HTTPException(status_code=500, detail=error_msg)
    
    # Store for verification
    store_otp(email, otp)
    return {"message": "OTP sent successfully"}

@app.post("/api/auth/verify")
async def verify(request: VerifyRequest):
    email = request.email.lower().strip()
    success, message = verify_otp_logic(email, request.otp)
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
    
    # Generate JWT
    token = create_access_token({"sub": email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/recommend")
def get_recommendation(data: UserData, user_payload = Depends(get_current_user), db: Session = Depends(get_db)):
    email = user_payload.get("sub")
    
    # Calculate recommendation
    result = calculate_recommendation(data.model_dump())
    
    # Persist or update User data
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email)
        db.add(user)
    
    user.first_name = data.first_name
    user.last_name = data.last_name
    user.dob = data.dob
    user.mobile = data.mobile
    user.income_level = data.income_level
    user.city = data.city
    user.gender = data.gender
    user.marital_status = data.marital_status
    user.support_parents = data.support_parents
    user.career_stage = data.career_stage
    user.employment_type = data.employment_type
    user.lifestyle = data.lifestyle
    user.smoking_status = data.smoking_status
    user.family_health_history = data.family_health_history
    user.num_children = data.num_children
    user.dependents_data = data.dependents
    user.is_smoker = data.is_smoker
    user.has_life_insurance = data.has_life_insurance
    user.existing_life_cover = data.existing_life_cover if data.has_life_insurance else ""
    user.existing_life_cover_val = data.existing_life_cover_val if data.has_life_insurance else 0
    user.has_health_insurance = data.has_health_insurance
    user.existing_health_cover = data.existing_health_cover if data.has_health_insurance else ""
    user.existing_health_cover_val = data.existing_health_cover_val if data.has_health_insurance else 0
    user.health_source = data.health_source if data.has_health_insurance else ""
    user.parents_covered = data.parents_covered if data.has_health_insurance else False
    user.parents_health_cover = data.parents_health_cover if (data.has_health_insurance and data.parents_covered) else ""
    user.parents_health_cover_val = data.parents_health_cover_val if (data.has_health_insurance and data.parents_covered) else 0
    
    # Policy Details
    user.life_provider = data.life_provider if data.has_life_insurance else ""
    user.life_policy_name = data.life_policy_name if data.has_life_insurance else ""
    user.health_provider = data.health_provider if data.has_health_insurance else ""
    user.health_policy_name = data.health_policy_name if data.has_health_insurance else ""
    
    # Save the recommendation
    db_recommendation = Recommendation(
        user=user,
        life_cover=result.get("life_cover"),
        health_cover=result.get("health_cover"),
        persona_name=result.get("persona_name"),
        tagline=result.get("tagline"),
        details=result.get("tagline"), # Fallback
        reasoning=result.get("reasoning"),
        features=result.get("recommended_features"),
        icon=result.get("icon"),
        mode=result.get("mode"),
        prompt_sent=result.get("prompt_sent")
    )
    db.add(db_recommendation)
    db.commit()
    
    # Return result with debug flag
    show_debug = os.getenv("SHOW_DEBUG_INFO", "false").lower() == "true"
    result["show_debug"] = show_debug
    
    return result

@app.post("/api/policy-recommendations")
def get_policy_recommendations(request: PolicyRecommendationRequest, user_payload = Depends(get_current_user)):
    from logic import calculate_policy_recommendations_ai
    result = calculate_policy_recommendations_ai(request.model_dump())
    result["show_debug"] = os.getenv("SHOW_DEBUG_INFO", "false").lower() == "true"
    return result

@app.get("/api/user/profile")
def get_user_profile(user_payload = Depends(get_current_user), db: Session = Depends(get_db)):
    email = user_payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return {"message": "User not found"}
    
    # Get all recommendations sorted by most recent first
    all_recs = db.query(Recommendation).filter(Recommendation.user_id == user.id).order_by(Recommendation.created_at.desc()).all()
    
    return {
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
            "existing_life_cover_val": user.existing_life_cover_val,
            "has_health_insurance": user.has_health_insurance,
            "existing_health_cover": user.existing_health_cover,
            "existing_health_cover_val": user.existing_health_cover_val,
            "health_source": user.health_source,
            "parents_covered": user.parents_covered,
            "parents_health_cover": user.parents_health_cover,
            "parents_health_cover_val": user.parents_health_cover_val,
            "life_provider": user.life_provider,
            "life_policy_name": user.life_policy_name,
            "health_provider": user.health_provider,
            "health_policy_name": user.health_policy_name
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
        ],
        "show_debug": os.getenv("SHOW_DEBUG_INFO", "false").lower() == "true"
    }

if __name__ == "__main__":
    import uvicorn
    # Use the port assigned by Railway or default to 8000
    port = int(os.getenv("PORT", 8000))
    log_now(f"Starting Uvicorn manual runner on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
