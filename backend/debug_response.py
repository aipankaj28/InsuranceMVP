import requests
import json

r = requests.post('http://localhost:8000/api/recommend', json={
    'age': 30,
    'experience': 5,
    'income_level': 'High',
    'city': 'Bangalore',
    'family_status': 'Married with 2 dependents'
})

data = r.json()

with open('response_debug.txt', 'w', encoding='utf-8') as f:
    f.write("=== FULL API RESPONSE ===\n\n")
    f.write(json.dumps(data, indent=2, ensure_ascii=False))
    f.write("\n\n=== ANALYSIS ===\n\n")
    f.write(f"Mode: {data.get('mode')}\n")
    f.write(f"Details length: {len(data.get('details', ''))}\n")
    f.write(f"Full details:\n{data.get('details', '')}\n")
    f.write(f"\nContains 'Tier 1': {'Tier 1' in data.get('details', '')}\n")
    f.write(f"Contains 'personalized': {'personalized' in data.get('details', '').lower()}\n")

print("Response saved to response_debug.txt")
