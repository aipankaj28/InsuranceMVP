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
    
    conn.commit()
    conn.close()
else:
    print(f"Database file not found at {db_path}. It will be created on next startup.")
