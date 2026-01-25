# AI-Driven Policy Categorization Implementation Plan

This plan fixes the issue where high-value health insurance policies are incorrectly identified as life insurance policies by delegating the categorization to the Gemini AI engine.

## Proposed Changes

### Backend: Policy Service

#### [MODIFY] [schemas.py](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/backend/policy_service/schemas.py)
- Add `policy_type: Optional[str] = "OTHER"` to the `PolicyExtractionResult` class.

#### [MODIFY] [engine.py](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/backend/policy_service/engine.py)
- Update the prompt to include a mandatory `policy_type` field.
- Instruct Gemini to categorize based on the document content:
  - `LIFE`: For Term, Whole Life, Endowment, etc.
  - `HEALTH`: For Mediclaim, Health, Critical Illness, etc.
  - `OTHER`: For non-insurance or general insurance (Motor, Travel, Home).

---

### Frontend: UI Integration

#### [MODIFY] [ReverseGapFlow.jsx](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/frontend/src/components/ReverseGapFlow.jsx)
- Update the calculation loop to sum coverages based on the new `policy_type` field:
  ```javascript
  if (r.policy_type === 'LIFE') life += r.coverage_amount_val;
  else if (r.policy_type === 'HEALTH') health += r.coverage_amount_val;
  ```

### Reverse Gap Flow UI Enhancements

#### [MODIFY] [ReverseGapFlow.jsx](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/frontend/src/components/ReverseGapFlow.jsx)
- **State Update**: Add `extractedFields` to track which fields were successfully filled via AI hints.
- **Form UI Update**: 
  - Show all relevant fields: Name, DOB, Gender, City, Marital Status, Children, Income, Smoking, Lifestyle.
  - Add a "Verified" badge (Sparkles icon) for AI-detected fields.
  - Highlight missing fields with a "Required" or "Need Input" indicator.
- **Input logic**: Ensure pre-filled fields are still editable but visually marked.

### Authentication & Bug Fixes

#### [MODIFY] [router.py](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/backend/policy_service/router.py)
- Import `get_current_user` and add it as a dependency to the `extract_multiple_policies` endpoint.
- Ensure all policy extraction requests are authenticated.

#### [MODIFY] [ReverseGapFlow.jsx](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/frontend/src/components/ReverseGapFlow.jsx)
- Import `useAuth` from context.
- Replace manual `localStorage.getItem('auth_token')` with `const { user } = useAuth()` and use `user?.token`.
- Add explicit error checking for the profile sync call to catch 401s early.

### Password Protected PDF Support

#### [MODIFY] [schemas.py](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/backend/policy_service/schemas.py)
- Add `is_locked: bool = False` to `PolicyExtractionResult`.

#### [MODIFY] [engine.py](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/backend/policy_service/engine.py)
- Integrate `pikepdf` to check if a PDF is encrypted.
- If encrypted and no password provided, return `is_locked=True`.
- If password provided, attempt to decrypt in memory before passing to Gemini.

#### [MODIFY] [router.py](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/backend/policy_service/router.py)
- Update multi-extraction endpoint to accept an optional mapping of filenames to passwords.

#### [MODIFY] [ReverseGapFlow.jsx](file:///c:/Pankaj/Projects/Antigravity/Insurance-Gemini/frontend/src/components/ReverseGapFlow.jsx)
- Update extraction UI to show password input for results with `is_locked=True`.
- **Flow Optimization**: Update `handleUpload` to only send files that are either new or currently locked.
- **Result Merging**: Merge newly extracted results with existing successful extractions to avoid redundant AI calls.
- Add "Unlock" action that triggers a re-extraction for that specific file.

## Verification Plan

### Manual Verification
1. Upload a password-protected PDF (e.g., LIC policy).
2. Verify that the UI shows a password prompt.
3. Enter the correct password and verify that extraction then succeeds.
4. Verify that the decrypted content is correctly processed by Gemini.
