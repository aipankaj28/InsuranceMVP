import sqlite3
import os

def migrate():
    db_path = os.path.join("backend", "data", "insurance_wizard.db")
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}. No migration needed.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Migrations for users table
    cursor.execute("PRAGMA table_info(users)")
    existing_users_columns = [col[1] for col in cursor.fetchall()]
    
    users_columns_to_add = [
        ("current_step", "INTEGER DEFAULT 1"),
        ("is_smoker", "BOOLEAN DEFAULT 0"),
        ("company_name", "VARCHAR"),
        ("industry_type", "VARCHAR")
    ]

    for col_name, col_def in users_columns_to_add:
        if col_name not in existing_users_columns:
            print(f"Adding column {col_name} to users table...")
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
                conn.commit()
                print(f"Column {col_name} added successfully.")
            except Exception as e:
                print(f"Failed to add column {col_name} to users: {e}")
        else:
            print(f"Column {col_name} already exists in users table.")

    # Migrations for recommendations table
    cursor.execute("PRAGMA table_info(recommendations)")
    existing_rec_columns = [col[1] for col in cursor.fetchall()]
    
    rec_columns_to_add = [
        ("life_recommendations", "JSON"),
        ("health_recommendations", "JSON"),
        ("life_cover_val", "INTEGER DEFAULT 0"),
        ("health_cover_val", "INTEGER DEFAULT 0")
    ]

    for col_name, col_def in rec_columns_to_add:
        if col_name not in existing_rec_columns:
            print(f"Adding column {col_name} to recommendations table...")
            try:
                cursor.execute(f"ALTER TABLE recommendations ADD COLUMN {col_name} {col_def}")
                conn.commit()
                print(f"Column {col_name} added successfully.")
            except Exception as e:
                print(f"Failed to add column {col_name} to recommendations: {e}")
        else:
            print(f"Column {col_name} already exists in recommendations table.")

    conn.close()
    print("Migration check complete.")

if __name__ == "__main__":
    migrate()
