import sqlite3
import os

db_path = os.path.join("backend", "data", "insurance_wizard.db")
if not os.path.exists(db_path):
    print("DB not found")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("--- User Columns ---")
    cursor.execute("PRAGMA table_info(users)")
    cols = cursor.fetchall()
    for col in cols:
        print(f"Name: {col[1]}, Type: {col[2]}")
        
    print("\n--- Sample User Data (Last 1) ---")
    cursor.execute("SELECT id, email, has_life_insurance, has_health_insurance FROM users ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    if row:
        print(row)
    else:
        print("No users found")
    
    conn.close()
