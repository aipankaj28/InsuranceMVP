@echo off
echo Starting Indian Employee Insurance App MVP...

echo Starting Backend (Port 8000)...
start cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn main:app --reload"

echo Waiting for 5 seconds...
timeout /t 5

echo Starting Frontend (Port 5173)...
start cmd /k "cd frontend && npm run dev"

echo Done! Open http://localhost:5173 in your browser.
pause
