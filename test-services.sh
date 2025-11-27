#!/bin/bash

echo "🧪 Testing Airbnb Microservices..."
echo ""

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo "✅ $name - OK"
        return 0
    else
        echo "❌ $name - FAILED"
        return 1
    fi
}

echo "═══════════════════════════════════════"
echo "📦 Testing Infrastructure"
echo "═══════════════════════════════════════"
echo ""

docker ps --filter "name=airbnb" --format "table {{.Names}}\t{{.Status}}"
echo ""

echo "═══════════════════════════════════════"
echo "🔧 Testing Microservices"
echo "═══════════════════════════════════════"
echo ""

passed=0
total=4

test_endpoint "Traveler Service" "http://localhost:4001/health" && ((passed++))
test_endpoint "Owner Service" "http://localhost:4003/health" && ((passed++))
test_endpoint "Property Service" "http://localhost:4002/health" && ((passed++))
test_endpoint "React Client" "http://localhost:5173" && ((passed++))

echo ""
echo "═══════════════════════════════════════"
echo "📊 Test Summary"
echo "═══════════════════════════════════════"
echo ""

echo "Tests Passed: $passed / $total"
echo ""

if [ $passed -eq $total ]; then
    echo "🎉 All services are running correctly!"
else
    echo "⚠️  Some services are not responding"
fi

echo ""
read -p "Press Enter to exit..."
