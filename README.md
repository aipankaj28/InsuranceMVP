# Insurance Wizard MVP 🇮🇳

A modern, responsive, and AI-powered insurance recommendation engine tailored for the Indian market.

## Features

- **Email OTP Authentication**: Secure login flow using Gmail SMTP.
- **AI-Powered Recommendations**: Utilizes Google Gemini to provide personalized insurance advice.
- **Smart Wizard**: multi-step data capture including DOB, income, and family dependent details.
- **User Dashboard**: Overview of current plans and historical recommendations.
- **Persistent Storage**: Lightweight SQLite database for profile and history management.
- **Glassmorphic UI**: Premium, mobile-first design with smooth animations.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: FastAPI, SQLAlchemy, SQLite.
- **AI**: Google Generative AI (Gemini).

## Getting Started

### Prerequisites

- Node.js
- Python 3.10+
- Gmail App Password (for OTP emails)
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Insurance-Gemini
   ```

2. Setup Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. Configure Environment:
   Create a `.env` file in the `backend/` directory based on `.env.example`.

4. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   ```

5. Run the App:
   Use the root `run_app.bat` (Windows) or start both services manually.

## License

MIT
