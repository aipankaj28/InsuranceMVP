# Implementation Plan - Gemini AI Integration (Hybrid Mode)

## Goal
Implement a configurable backend that can switch between **Rule-Based** (Legacy) and **AI-Based** (Gemini) recommendation logic.

## User Review Required
> [!IMPORTANT]
> - You will need a Google Gemini API Key.
> - A new environment variable `RECOMMENDATION_MODE` will control the behavior.

## Proposed Changes

### Backend
#### [NEW] `backend/.env`
File to store configuration:
```env
GEMINI_API_KEY=your_key_here
RECOMMENDATION_MODE=AI  # Options: AI | RULE
```

#### [MODIFY] `backend/requirements.txt`
- Add `google-generativeai`
- Add `python-dotenv`

#### [MODIFY] `backend/logic.py`
- Refactor existing logic into `calculate_recommendation_rule(data)`.
- Implement new logic `calculate_recommendation_ai(data)`:
    - Import `google.generativeai`.
    - Configure Gemini 1.5 Flash.
    - generate content with JSON structure enforcement.
- Create main dispatcher `calculate_recommendation(data)`:
    - Reads `RECOMMENDATION_MODE` from env (default to `RULE`).
    - Calls appropriate function.
    - Handles AI errors by falling back to Rule-based logic (Robustness).

## Verification Plan
### Manual Verification
1.  **Test Rule Mode**: Set `RECOMMENDATION_MODE=RULE` in `.env`, run wizard, verify standard output.
2.  **Test AI Mode**: Set `RECOMMENDATION_MODE=AI`, run wizard.
    - Verify "Details" contains personalized text (e.g., "Given you live in Tier 1 Mumbai...").
    - Verify "Icon" and cover amounts are reasonable.
3.  **Test Fallback**: Temporarily break the API key and ensure it falls back to Rule mode gracefully.
