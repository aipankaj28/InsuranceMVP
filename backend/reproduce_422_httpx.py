import httpx
import json

async def main():
    API_BASE_URL = "http://localhost:8000"
    
    payload = {
        "recommended_life_cover": "₹1.5 Crore",
        "recommended_life_cover_val": 15000000,
        "recommended_health_cover": "₹10 Lakhs",
        "recommended_health_cover_val": 1000000,
        "recommended_features": ["Critical Illness", "No Room Rent Capping"],
        "has_life_insurance": False,
        "existing_life_cover_val": 0,
        "life_provider": "",
        "life_policy_name": "",
        "has_health_insurance": False,
        "existing_health_cover_val": 0,
        "health_provider": "",
        "health_policy_name": "",
        "health_source": "",
        "first_name": "Test",
        "age": 30,
        "income_level": "₹5-10 lakhs",
        "city": "Mumbai"
    }

    async with httpx.AsyncClient() as client:
        # Pass a fake token to pass the auth header check if it runs before validation
        headers = {"Authorization": "Bearer fake_token"}
        response = await client.post(f"{API_BASE_URL}/api/policy-recommendations", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 422:
            print(json.dumps(response.json(), indent=2))
        else:
            print(response.text)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
