import sqlite3
import os

db_path = os.path.join("backend", "data", "insurance_wizard.db")

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add is_smoker
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN is_smoker BOOLEAN DEFAULT 0")
        print("Successfully added is_smoker column.")
    except sqlite3.OperationalError:
        print("Column is_smoker already exists.")
    
    # Add gender
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN gender TEXT")
        print("Successfully added gender column.")
    except sqlite3.OperationalError:
        print("Column gender already exists.")
    
    # Add reasoning
    try:
        cursor.execute("ALTER TABLE recommendations ADD COLUMN reasoning TEXT")
        print("Successfully added reasoning column.")
    except sqlite3.OperationalError:
        print("Column reasoning already exists.")

    # Add features
    try:
        cursor.execute("ALTER TABLE recommendations ADD COLUMN features JSON")
        print("Successfully added features column.")
    except sqlite3.OperationalError:
        print("Column features already exists.")
    
    # New Onboarding v2 columns - recommendations
    rec_cols = [
        ("persona_name", "TEXT"),
        ("tagline", "TEXT"),
        ("prompt_sent", "TEXT")
    ]
    for col_name, col_type in rec_cols:
        try:
            cursor.execute(f"ALTER TABLE recommendations ADD COLUMN {col_name} {col_type}")
            print(f"Successfully added {col_name} to recommendations.")
        except sqlite3.OperationalError:
            print(f"Column {col_name} already exists in recommendations.")

    # New Onboarding v2 columns - users
    v2_cols = [
        ("marital_status", "TEXT"),
        ("support_parents", "BOOLEAN DEFAULT 0"),
        ("career_stage", "TEXT"),
        ("employment_type", "TEXT"),
        ("lifestyle", "TEXT"),
        ("smoking_status", "TEXT"),
        ("family_health_history", "JSON"),
        ("has_life_insurance", "BOOLEAN DEFAULT 0"),
        ("existing_life_cover", "TEXT"),
        ("has_health_insurance", "BOOLEAN DEFAULT 0"),
        ("existing_health_cover", "TEXT"),
        ("health_source", "TEXT"),
        ("parents_covered", "BOOLEAN DEFAULT 0"),
        # Phase 3 Fields
        ("life_provider", "TEXT"),
        ("life_policy_name", "TEXT"),
        ("health_provider", "TEXT"),
        ("health_policy_name", "TEXT"),
        ("parents_health_cover", "TEXT")
    ]
    
    for col_name, col_type in v2_cols:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            print(f"Successfully added {col_name} column.")
        except sqlite3.OperationalError:
            print(f"Column {col_name} already exists.")
    
    conn.commit()
    conn.close()
else:
    print(f"Database file not found at {db_path}. It will be created on next startup.")
