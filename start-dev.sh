#!/bin/bash

# Shooting Star Diary - Development Startup Script

echo "🌟 Starting Shooting Star Diary application..."
echo ""

# Check if MongoDB is running (optional - only if using local MongoDB)
echo "📋 Checking prerequisites..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if ports are available
if check_port 5000; then
    echo "❌ Port 5000 is already in use. Please stop the service or choose a different port."
    exit 1
fi

if check_port 5173; then
    echo "❌ Port 5173 is already in use. Please stop the service or choose a different port."
    exit 1
fi

echo "✅ Ports 5000 and 5173 are available"
echo ""

# Start backend
echo "🚀 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🌟 Application is starting up!"
echo "📊 Backend API: http://localhost:5000"
echo "🎨 Frontend App: http://localhost:5173"
echo ""
echo "💡 Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup when script exits
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All servers stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
