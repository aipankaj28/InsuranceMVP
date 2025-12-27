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

app = FastAPI()

# Initialize Database on Startup
@app.on_event("startup")
async def startup_event():
    try:
        log_now("Starting startup event sequence...")
        log_now("Initializing database...")
        init_db()
        log_now("Database initialized successfully.")
    except Exception as e:
        log_now(f"FATAL: Database initialization failed: {str(e)}")
        traceback.print_exc()
        sys.exit(1)

@app.on_event("shutdown")
async def shutdown_event():
    log_now("--- BACKEND SHUTTING DOWN ---")

log_now("Configuring CORS...")
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]
frontend_url = os.getenv("FRONTEND_URL", "").strip()
if frontend_url:
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
log_now("CORS configuration complete.")

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

if __name__ == "__main__":
    import uvicorn
    # Use the port assigned by Railway or default to 8000
    port = int(os.getenv("PORT", 8000))
    log_now(f"Starting Uvicorn manual runner on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
