#!/bin/bash

echo "========================================"
echo "🚀 Starting Airbnb Microservices"
echo "========================================"
echo ""

echo "📋 Checking infrastructure..."
if ! docker ps --filter "name=airbnb" | grep -q "airbnb"; then
    echo "⚠️  Infrastructure not running. Starting MongoDB and Kafka..."
    docker-compose -f docker-compose.infrastructure.yml up -d
    echo "⏳ Waiting 30 seconds for services to be ready..."
    sleep 30
else
    echo "✅ Infrastructure already running"
fi

echo ""
echo "📦 Starting microservices in new windows..."
echo ""

# Function to start a process in a new Git Bash window
start_service() {
    local name=$1
    local port=$2
    local dir=$3
    local color=$4
    
    echo "Starting $name (Port $port)..."
    
    # Try to use 'start' (Windows) to open new Git Bash or terminal
    if command -v start >/dev/null; then
        # This opens a new Git Bash window executing the command
        start "" "$SHELL" -c "cd '$dir' && echo -e '\033[${color}m$name\033[0m' && npm run dev; exec bash"
    else
        echo "❌ Could not open new window. Please run 'npm run dev' in '$dir' manually."
    fi
}

# Start Traveler Service
start_service "TRAVELER SERVICE" 4001 "traveler-service" "36" # Cyan
sleep 3

# Start Owner Service
start_service "OWNER SERVICE" 4003 "owner-service" "35" # Magenta
sleep 3

# Start Property Service
if [ -f "property-service/package.json" ]; then
    start_service "PROPERTY SERVICE" 4002 "property-service" "32" # Green
    sleep 3
fi

# Start React Client
start_service "REACT CLIENT" 5173 "client" "34" # Blue

echo ""
echo "========================================"
echo "✨ All services are starting!"
echo "========================================"
echo ""
echo "📍 Service URLs:"
echo "   • Frontend:         http://localhost:5173"
echo "   • Traveler Service: http://localhost:4001"
echo "   • Owner Service:    http://localhost:4003"
echo "   • Property Service: http://localhost:4002"
echo ""
echo "⏳ Wait 10-15 seconds for all services to fully start..."
echo ""
echo "📝 Check the individual service windows for logs and status"
echo ""
read -p "Press Enter to exit..."
