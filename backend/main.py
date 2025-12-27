import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from logic import calculate_recommendation
from pydantic import BaseModel
from auth import generate_otp, store_otp, send_otp_email, verify_otp_logic, create_access_token, decode_access_token

from database import init_db, get_db, User, Recommendation
from sqlalchemy.orm import Session

app = FastAPI()

# Initialize Database
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        os.getenv("FRONTEND_URL", "").strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import Dict, Optional

class UserData(BaseModel):
    first_name: str
    last_name: str
    dob: str
    mobile: str
    income_level: str
    city: str
    dependents: Dict[str, bool]
    num_children: Optional[int] = 0

class LoginRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str

# Dependency to verify JWT
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    return payload

@app.get("/")
def read_root():
    return {"message": "Insurance Wizard Backend is Running!"}

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    email = request.email.lower().strip()
    otp = generate_otp()
    
    # Send email
    success = send_otp_email(email, otp)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP email")
    
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
    user.dependents_data = data.dependents
    user.num_children = data.num_children
    
    # Save the recommendation
    db_recommendation = Recommendation(
        user=user,
        life_cover=result.get("life_cover"),
        health_cover=result.get("health_cover"),
        details=result.get("details"),
        icon=result.get("icon"),
        mode=result.get("mode")
    )
    db.add(db_recommendation)
    db.commit()
    
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
            "dependents": user.dependents_data,
            "num_children": user.num_children
        },
        "recommendations": [
            {
                "id": rec.id,
                "life_cover": rec.life_cover,
                "health_cover": rec.health_cover,
                "details": rec.details,
                "icon": rec.icon,
                "mode": rec.mode,
                "created_at": rec.created_at.isoformat()
            } for rec in all_recs
        ]
    }
