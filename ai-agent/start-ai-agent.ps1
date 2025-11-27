# Start AI Agent Service
# This script starts the AI Agent microservice for local development

Write-Host "🚀 Starting AI Agent Service..." -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "✅ .env file created. Please update with your API keys:" -ForegroundColor Green
    Write-Host "   - GOOGLE_API_KEY (required for AI features)" -ForegroundColor White
    Write-Host "   - TAVILY_API_KEY (optional, for enhanced search)" -ForegroundColor White
    Write-Host "   - MONGODB_URI (default: mongodb://localhost:27017)" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to continue after updating .env file"
}

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
    Write-Host "✅ Virtual environment created." -ForegroundColor Green
    Write-Host ""
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Cyan
& ".\.venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

Write-Host ""
Write-Host "✅ AI Agent service is starting on port 8001..." -ForegroundColor Green
Write-Host "   API Endpoint: http://localhost:8001" -ForegroundColor White
Write-Host "   Docs: http://localhost:8001/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Yellow
Write-Host ""

# Start the service
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
