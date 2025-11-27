# Start All Microservices - Airbnb Lab 2
# Run this script from the project root directory

Write-Host "🚀 Starting Airbnb Microservices..." -ForegroundColor Green
Write-Host ""

# Check if infrastructure is running
Write-Host "📋 Checking infrastructure..." -ForegroundColor Cyan
$mongoRunning = docker ps --filter "name=airbnb-mongodb" --format "{{.Names}}" 2>$null
$kafkaRunning = docker ps --filter "name=airbnb-kafka" --format "{{.Names}}" 2>$null

if (-not $mongoRunning -or -not $kafkaRunning) {
    Write-Host "⚠️  Infrastructure not running. Starting MongoDB and Kafka..." -ForegroundColor Yellow
    docker-compose -f docker-compose.infrastructure.yml up -d
    Write-Host "⏳ Waiting 30 seconds for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
} else {
    Write-Host "✅ Infrastructure already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Starting microservices in new windows..." -ForegroundColor Cyan
Write-Host ""

# Start Traveler Service
Write-Host "1️⃣  Starting Traveler Service (Port 4001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\traveler-service'; Write-Host '🧳 TRAVELER SERVICE' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 3

# Start Owner Service  
Write-Host "2️⃣  Starting Owner Service (Port 4003)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\owner-service'; Write-Host '🏠 OWNER SERVICE' -ForegroundColor Magenta; npm run dev"

Start-Sleep -Seconds 3

# Start Property Service (if it exists)
if (Test-Path "$PSScriptRoot\property-service\package.json") {
    Write-Host "3️⃣  Starting Property Service (Port 4002)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\property-service'; Write-Host '🏘️  PROPERTY SERVICE' -ForegroundColor Green; npm run dev"
    Start-Sleep -Seconds 3
    Start-Sleep -Seconds 3
}

# Start AI Agent Service
if (Test-Path "$PSScriptRoot\ai-agent\start-ai-agent.ps1") {
    Write-Host "🤖 Starting AI Agent Service (Port 8001)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-agent'; Write-Host '🤖 AI AGENT SERVICE' -ForegroundColor Cyan; .\start-ai-agent.ps1"
    Start-Sleep -Seconds 3
}

# Start Client
Write-Host "4️⃣  Starting React Client (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; Write-Host '⚛️  REACT CLIENT' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "✨ All services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Service URLs:" -ForegroundColor Cyan
Write-Host "   • Frontend:         http://localhost:5173" -ForegroundColor White
Write-Host "   • Traveler Service: http://localhost:4001" -ForegroundColor White
Write-Host "   • Owner Service:    http://localhost:4003" -ForegroundColor White
Write-Host "   • Property Service: http://localhost:4002" -ForegroundColor White
Write-Host "   • AI Agent:         http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Wait 10-15 seconds for all services to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 To check service health:" -ForegroundColor Cyan
Write-Host "   curl http://localhost:4001/health" -ForegroundColor Gray
Write-Host "   curl http://localhost:4003/health" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Check the individual service windows for logs and status" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window (services will keep running)..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
