@echo off
echo ========================================
echo Starting Airbnb Microservices
echo ========================================
echo.

echo Checking infrastructure...
docker ps --filter "name=airbnb" >nul 2>&1
if errorlevel 1 (
    echo Starting MongoDB and Kafka...
    docker-compose -f docker-compose.infrastructure.yml up -d
    timeout /t 30 /nobreak
) else (
    echo Infrastructure already running
)

echo.
echo Starting microservices in new windows...
echo.

REM Start Traveler Service
echo Starting Traveler Service on port 4001...
start "Traveler Service" cmd /k "cd /d "%~dp0traveler-service" && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Owner Service
echo Starting Owner Service on port 4003...
start "Owner Service" cmd /k "cd /d "%~dp0owner-service" && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Property Service
if exist "%~dp0property-service\package.json" (
    echo Starting Property Service on port 4002...
    start "Property Service" cmd /k "cd /d "%~dp0property-service" && npm run dev"
    timeout /t 3 /nobreak >nul
)

REM Start AI Agent Service
if exist "%~dp0ai-agent\start-ai-agent.bat" (
    echo Starting AI Agent Service on port 8001...
    start "AI Agent Service" cmd /k "cd /d "%~dp0ai-agent" && start-ai-agent.bat"
    timeout /t 3 /nobreak >nul
)

REM Start React Client
echo Starting React Client on port 5173...
start "React Client" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Service URLs:
echo   Frontend:         http://localhost:5173
echo   Traveler Service: http://localhost:4001
echo   Owner Service:    http://localhost:4003
echo   Property Service: http://localhost:4002
echo   AI Agent:         http://localhost:8001
echo.
echo Wait 10-15 seconds for all services to fully start...
echo.
echo Check the individual service windows for logs and status
echo.
pause
