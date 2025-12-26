import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model_names = [
    "gemini-1.5-flash",
    "models/gemini-1.5-flash",
    "gemini-1.0-pro",
    "models/gemini-1.0-pro"
]

for name in model_names:
    print(f"Testing model: {name}")
    try:
        model = genai.GenerativeModel(name)
        response = model.generate_content("Say 'OK'")
        print(f"  SUCCESS: {response.text.strip()}")
        print(f"  Final working name: {name}")
        break
    except Exception as e:
        print(f"  FAILED: {e}")
