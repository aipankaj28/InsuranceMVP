# Suggestions to Take the App to the Next Level

Current Status: MVP (Minimum Viable Product)
- **Frontend**: Monolithic React component (`Wizard.jsx`), Visuals are good (Glassmorphism), but code structure is brittle.
- **Backend**: Rule-based Python logic (`logic.py`), stateless (no database).
- **Missing**: True Intelligence (AI), Persistence (Database), Robustness (Types, Tests).

Here is a roadmap of suggestions to evolve this into a robust, AI-powered platform.

---

## 🏗️ 1. Architecture & Code Quality (Strong Foundation)

Before adding complex features, we should clean up the current base to make it scalable.

### 🧹 **A. Frontend Modularization (Refactoring)**
- **Issue**: `Wizard.jsx` is a ~350 line monolith handling UI, Logic, and Animations.
- **Plan**: Split into smaller components:
    - `WizardStep.jsx`: Generic wrapper for animation logic.
    - `steps/StepLife101.jsx`, `steps/StepPersonalInfo.jsx`, etc.
    - `WizardController.jsx`: Managing state (steps, form data).
- **Benefit**: Easier to maintain and test individual steps.

### 🛡️ **B. Type Safety (TypeScript)**
- **Issue**: JS is prone to runtime errors (e.g., misspellings in `formData`).
- **Plan**: Rename `.jsx` to `.tsx` and define interfaces:
    ```typescript
    interface UserData {
        age: number;
        city: string;
        family_status: 'Single' | 'Married' | 'Married with Kids';
        // ...
    }
    ```
- **Benefit**: Catch errors during development, better autocomplete.

### ⚡ **C. Smart Data Fetching (React Query)**
- **Issue**: Using raw `fetch` allows for race conditions and manual loading states.
- **Plan**: Integrate `@tanstack/react-query`.
- **Benefit**: Automatic caching, retries, and cleaner loading/error states.

---

## 🧠 2. AI & Intelligence (The "Gemini" Factor)

Currently, the "intelligence" is just 50 lines of `if/else` in `logic.py`. Let's make it actually smart.

### 🤖 **A. Gemini Integration (Backend)**
- **Issue**: Recommendations are static and rule-based.
- **Plan**: Replace `logic.py` with a call to Google's Gemini API.
    - **Prompt**: "Act as an expert Indian Insurance Advisor. User is {age}, lives in {city} (Tier {tier}), earns {income}. Recommend life/health cover and EXPLAIN WHY in empathetic terms."
- **Benefit**: Dynamic, personalized explanations that feel human.

### 💬 **B. "Why this amount?" Explainer**
- **Feature**: Hover over the recommended amount to see a breakdown.
    - *Example*: "Why ₹2 Crore? Because you live in Mumbai (High COL) and have 2 dependents."
- **Benefit**: Builds trust with the user.

### 🗣️ **C. AI Chatbot Assistant**
- **Feature**: A small floating chat bubble to answer questions like "What is Waiting Period?" or "Is maternity covered?".
- **Benefit**: Keeps users on the page instead of Googling terms.

---

## 🚀 3. Platform Maturity (Production Ready)

### 💾 **A. Persistence (Database)**
- **Issue**: If I refresh, I lose my quote. I can't "Save for later".
- **Plan**: Add a lightweight DB (SQLite for now, Postgres later).
    - Table `leads`: Stores `age`, `city`, `phone`, `calculated_cover`.
- **Benefit**: You can retarget users or let them retrieve past quotes.

### 🔒 **B. User Accounts (Auth)**
- **Feature**: "Sign in with Google" to save your profile.
- **Plan**: Use Supabase or Auth0 for easy integration.
- **Benefit**: Long-term user retention.

### 🧪 **C. Testing Strategy**
- **Plan**: Add Vitest for unit testing the logic (even if it's AI, we can test format).
- **Benefit**: Confidence that changes don't break the wizard.

---

## 📋 Recommended Next Step
I recommend we start with **Part 1 (Code Refactoring)** to prepare the ground, and then immediately move to **Part 2-A (Gemini Integration)** to deliver on the "AI" promise.

**Shall we start with refactoring the Wizard into smaller components?**
