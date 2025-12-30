from sqlalchemy import create_engine, Column, Integer, String, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Ensure a 'data' directory exists within the backend folder
DATA_DIR = os.path.join(BASE_DIR, "data")
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "insurance_wizard.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    dob = Column(String)
    mobile = Column(String)
    income_level = Column(String)
    city = Column(String)
    gender = Column(String)
    marital_status = Column(String)
    support_parents = Column(Boolean, default=False)
    career_stage = Column(String)
    employment_type = Column(String)
    lifestyle = Column(String)
    smoking_status = Column(String) # Never, Occasionally, Regularly
    family_health_history = Column(JSON) # List of conditions
    # Gap Analysis fields (Phase 2)
    has_life_insurance = Column(Boolean, default=False)
    existing_life_cover = Column(String) # Stored as string like "₹50 Lakhs"
    has_health_insurance = Column(Boolean, default=False)
    existing_health_cover = Column(String)
    health_source = Column(String) # Employer, Personal, Both
    parents_covered = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # JSON field for dependents structure
    dependents_data = Column(JSON)
    num_children = Column(Integer, default=0)

    recommendations = relationship("Recommendation", back_populates="user")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    life_cover = Column(String)
    health_cover = Column(String)
    persona_name = Column(String)
    tagline = Column(String)
    details = Column(String)
    reasoning = Column(String)
    features = Column(JSON)
    icon = Column(String)
    prompt_sent = Column(String) # Store the prompt for debugging
    mode = Column(String) # AI or RULE
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recommendations")

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
