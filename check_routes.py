import sys
import os

# Add backend to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

try:
    from main import app
    print("Routes registered in app:")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"Path: {route.path}, Methods: {route.methods}")
except Exception as e:
    print(f"Error importing app: {e}")
