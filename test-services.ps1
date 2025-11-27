# Test Microservices - Airbnb Lab 2
# This script will test the health and connectivity of all services

Write-Host "🧪 Testing Airbnb Microservices..." -ForegroundColor Green
Write-Host ""

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $Name - OK" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ $Name - FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        return $false
    }
}

# Test Infrastructure
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📦 Testing Infrastructure" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test Docker containers
Write-Host "Docker Containers:" -ForegroundColor Yellow
docker ps --filter "name=airbnb" --format "table {{.Names}}\t{{.Status}}" | Out-String | Write-Host
Write-Host ""

# Test Microservices
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 Testing Microservices" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$travelerOk = Test-Endpoint "Traveler Service" "http://localhost:4001/health"
$ownerOk = Test-Endpoint "Owner Service" "http://localhost:4003/health"
$propertyOk = Test-Endpoint "Property Service" "http://localhost:4002/health"
$clientOk = Test-Endpoint "React Client" "http://localhost:5173"

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$totalTests = 4
$passedTests = @($travelerOk, $ownerOk, $propertyOk, $clientOk) | Where-Object { $_ -eq $true } | Measure-Object | Select-Object -ExpandProperty Count

Write-Host "Tests Passed: $passedTests / $totalTests" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host ""

if ($passedTests -eq $totalTests) {
    Write-Host "🎉 All services are running correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
    Write-Host "2. Create a Traveler account and login" -ForegroundColor White
    Write-Host "3. Create a booking to test Kafka messaging" -ForegroundColor White
    Write-Host "4. Open an incognito window and create an Owner account" -ForegroundColor White
    Write-Host "5. Check Owner's dashboard for the booking request" -ForegroundColor White
    Write-Host "6. Accept/Decline the booking" -ForegroundColor White
    Write-Host "7. Check Traveler's bookings to see the updated status" -ForegroundColor White
} else {
    Write-Host "⚠️  Some services are not responding" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Cyan
    Write-Host "1. Check if all .env files are created" -ForegroundColor White
    Write-Host "2. Verify MongoDB and Kafka are running: docker ps" -ForegroundColor White
    Write-Host "3. Check service logs in their respective windows" -ForegroundColor White
    Write-Host "4. Ensure ports 4001, 4002, 4003, 5173 are not in use" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
