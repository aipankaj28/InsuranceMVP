# Insurance Gemini: Reverse-Inquiry Gap Analysis

This update introduces a new, autonomous flow within the **Smart Policy Review** feature. Users can now start by uploading their existing insurance documents, which the AI uses to pre-populate their profile and identify coverage gaps.

## 🛠️ Key New Features

### 1. Reverse-Inquiry Flow
- **Policy-First Approach**: Instead of doing the Wizard first, users can upload documents to begin.
- **Auto-Extraction**: The AI extracts and aggregates personal details (Name, DOB, City, Gender, Marital Status, Children) directly from the policies.
- **Visual Verification**: Extracted fields are visually marked with a **Sparkles (✨)** icon, giving users confidence in what the AI found.
- **Password Support**: The system now detects encrypted PDFs. If a file is locked, users are prompted to enter a password, which is used to unlock the file in-memory for AI analysis.
- **Smart Form**: Any missing profile details are requested via a comprehensive pre-filled form that highlights AI-extracted data.
- **Automated Gap Report**: Once completed, the system calculates the AI-recommended ideal coverage and immediately compares it against the extracted totals to show the deficit.
- **Direct Recommendation Link**: If a gap is found, a "Fix My Gaps" button takes users directly to handpicked insurance plans tailored to their specific shortfall.

### 2. Backend Persistence & Sync
- **Marital Status & Children**: The AI now looks for spouse and children details within the policy nominees/dependents.
- **Persistent Profiles**: Extracted data is saved to the permanent database via updated `/api/user/sync-profile` and `/api/user/profile` endpoints.
- **Cross-Flow Sync**: Data found in policies is available if the user later decides to use the standard Wizard.

## 🚀 Final Deployment Instructions

To see these changes in action:

1.  Go to your **Railway Dashboard**.
2.  Select your **backend** service and click **"Redeploy"** or **"Rebuild without Cache"**.
3.  Once deployed, navigate to **Smart Policy Review** (now called **Policy Gap Analysis**).
4.  Upload a policy document and follow the new guided extraction flow.

## ✅ Verification Checklist

- [x] **AI Extraction**: Personal details are extracted into hints.
- [x] **Database Persistence**: Extracted info pre-fills the final form.
- [x] **Gap Report**: Visual comparison of recommended vs. actual coverage.
- [x] **Existing Flow**: Wizard remains untouched and fully functional.
