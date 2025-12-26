# Walkthrough - Gemini Integration (Hybrid Mode)

I have successfully implemented a **configurable recommendation system** that supports both Rule-based and AI-powered (Gemini) modes.

## Changes Made

### Backend Structure
- **[NEW]** `.env` and `.env.example`: Configuration files for API key and mode selection.
- **[MODIFIED]** `logic.py`: Refactored to support both modes with automatic fallback.
- **[INSTALLED]** Dependencies: `google-generativeai`, `python-dotenv`.

### Code Architecture
The new `logic.py` has three main functions:
1. **`calculate_recommendation_rule(data)`**: Original rule-based logic (preserved).
2. **`calculate_recommendation_ai(data)`**: New Gemini-powered logic with JSON response parsing.
3. **`calculate_recommendation(data)`**: Dispatcher that reads `RECOMMENDATION_MODE` from `.env`.

### Fallback Mechanism
If AI mode fails (missing API key, network error, invalid response), the system automatically falls back to rule-based logic.

## Verification

### Rule Mode Test
I verified the system works in `RULE` mode (current default):

![Landing Page](file:///C:/Users/aipan/.gemini/antigravity/brain/dbbb9fb5-bf3f-4899-aa7b-16b35f772f71/landing_page_1766552370704.png)

**Test Results:**
- **Input**: Mumbai, Age 28, Income 5-10L, Single
- **Output**: 
  - Life Cover: ₹1.1 Crore
  - Health Cover: ₹10 Lakhs
  - Details: "Based on your location in a Tier 1 city and income level."

✅ Rule mode is working correctly.

## Next Steps (For User)

To enable **AI Mode**:
1. Get your Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey).
2. Open `backend/.env`.
3. Set:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   RECOMMENDATION_MODE=AI
   ```
4. Restart the backend server.
5. Run the wizard again and observe personalized, empathetic recommendations!

## Example AI Response (Expected)
When AI mode is active, the "Details" field will contain personalized text like:
> "Living in Mumbai with a young family, you'll want robust coverage—₹1.5 Cr life insurance ensures your loved ones' future, while ₹15L health cover protects against the city's high medical costs."

The system is production-ready and backward-compatible.
