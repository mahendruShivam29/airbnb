@echo off
echo ========================================
echo Testing Full Docker Deployment Locally
echo ========================================
echo.

echo 1. Stopping any running containers...
docker-compose down

echo.
echo 2. Building and starting all services...
echo This may take a while for the first build...
docker-compose up --build -d

echo.
echo 3. Waiting for services to initialize...
timeout /t 30

echo.
echo ========================================
echo Deployment Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Access Points:
echo   Frontend:         http://localhost:5173
echo   Traveler Service: http://localhost:4001
echo   Owner Service:    http://localhost:4003
echo   Property Service: http://localhost:4002
echo   AI Agent:         http://localhost:8001
echo ========================================
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause
