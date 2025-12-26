import os
from dotenv import load_dotenv

load_dotenv()

print("Testing Gemini API directly...")
print("=" * 60)

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {api_key[:20]}..." if api_key else "API Key: NOT FOUND")

try:
    import google.generativeai as genai
    print("google.generativeai package: IMPORTED")
    
    genai.configure(api_key=api_key)
    print("Gemini configured successfully")
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Model created: gemini-1.5-flash")
    
    prompt = "Say 'Hello from Gemini!' in exactly 5 words."
    print(f"\nSending test prompt: {prompt}")
    
    response = model.generate_content(prompt)
    print(f"\nResponse received:")
    print(response.text)
    
    print("\n" + "=" * 60)
    print("SUCCESS: Gemini API is working!")
    
except Exception as e:
    import traceback
    print(f"\nERROR: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
