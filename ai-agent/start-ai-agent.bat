@echo off
REM Start AI Agent Service

echo Starting AI Agent Service...
echo.

REM Check if .env file exists
if not exist .env (
    echo .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo Please update .env with your API keys and press any key to continue...
    pause
)

REM Check if virtual environment exists
if not exist .venv (
    echo Creating Python virtual environment...
    python -m venv .venv
    echo Virtual environment created.
    echo.
)

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo AI Agent service starting on port 8001...
echo API Endpoint: http://localhost:8001
echo Docs: http://localhost:8001/docs
echo.
echo Press Ctrl+C to stop the service
echo.

REM Start the service
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
