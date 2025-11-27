# Stop All Microservices - Airbnb Lab 2

Write-Host "🛑 Stopping Airbnb Microservices..." -ForegroundColor Red
Write-Host ""

# Function to kill processes on a specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue 2>$null
    if ($process) {
        $pid = $process.OwningProcess
        Write-Host "Stopping process on port $Port (PID: $pid)..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Stopped process on port $Port" -ForegroundColor Green
    } else {
        Write-Host "No process found on port $Port" -ForegroundColor Gray
    }
}

Write-Host "Stopping services on ports..." -ForegroundColor Cyan
Write-Host ""

# Stop all service ports
Stop-ProcessOnPort 4001  # Traveler Service
Stop-ProcessOnPort 4002  # Property Service
Stop-ProcessOnPort 4003  # Owner Service
Stop-ProcessOnPort 5173  # React Client

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$stopInfra = Read-Host "Do you want to stop infrastructure (MongoDB/Kafka)? (y/N)"

if ($stopInfra -eq 'y' -or $stopInfra -eq 'Y') {
    Write-Host ""
    Write-Host "Stopping infrastructure..." -ForegroundColor Yellow
    Set-Location "c:\Users\Lenovo\Documents\Data 236\Lab2\airbnb"
    docker-compose -f docker-compose.infrastructure.yml down
    Write-Host "✅ Infrastructure stopped" -ForegroundColor Green
} else {
    Write-Host "Infrastructure left running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ All services stopped!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
