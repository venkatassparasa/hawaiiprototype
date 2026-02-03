#!/bin/bash

# Hawaii County TVR Compliance - Temporal Integration Startup Script
# This script starts the complete Temporal workflow management system

echo "🏝️  Hawaii County TVR Compliance - Temporal Integration Starting..."
echo "=================================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.temporal.yml" ]; then
    echo "❌ Please run this script from the compliance-dashboard directory."
    exit 1
fi

echo "🐳 Starting Temporal infrastructure with Docker Compose..."
docker-compose -f docker-compose.temporal.yml up -d

# Wait for Temporal to be ready
echo "⏳ Waiting for Temporal server to be ready..."
sleep 10

# Check if Temporal is responding
echo "🔍 Checking Temporal server health..."
for i in {1..30}; do
    if curl -s http://localhost:7233 > /dev/null 2>&1; then
        echo "✅ Temporal server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Temporal server failed to start within 30 seconds."
        echo "Check Docker logs with: docker-compose -f docker-compose.temporal.yml logs"
        exit 1
    fi
    echo "   Waiting for Temporal... ($i/30)"
    sleep 1
done

# Start the API server
echo "🚀 Starting the TVR Compliance API server..."
cd hawaii-vrbo-airbnb-crawler-api

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the API server in background
echo "🔧 Starting API server on port 3010..."
npm run dev &
API_PID=$!

# Wait for API server to be ready
echo "⏳ Waiting for API server to be ready..."
sleep 5

# Start the Temporal worker
echo "👷 Starting Temporal worker..."
npm run worker:dev &
WORKER_PID=$!

# Wait for worker to be ready
sleep 3

echo ""
echo "🎉 Temporal Integration is now running!"
echo "=================================================================="
echo "📊 Temporal UI:        http://localhost:8080"
echo "🔗 API Server:         http://localhost:3010"
echo "📚 API Documentation:   http://localhost:3010/docs"
echo "🏠 Dashboard UI:        http://localhost:5173 (if running)"
echo ""
echo "🛠️  Available Services:"
echo "   • Temporal Server (port 7233)"
echo "   • Temporal UI (port 8080)"
echo "   • PostgreSQL (port 5432)"
echo "   • Redis (port 6379)"
echo "   • API Server (port 3010)"
echo "   • Temporal Worker (background)"
echo ""
echo "🧪 To test the integration:"
echo "   1. Open http://localhost:8080 to view Temporal UI"
echo "   2. Open http://localhost:3010/docs to view API docs"
echo "   3. Start the dashboard: cd .. && npm run dev"
echo ""
echo "🛑 To stop all services:"
echo "   Press Ctrl+C to stop API and Worker"
echo "   Run: docker-compose -f docker-compose.temporal.yml down"
echo ""
echo "📝 Logs:"
echo "   API Server: Check terminal output"
echo "   Temporal:   docker-compose -f docker-compose.temporal.yml logs temporal"
echo "   Worker:     Check terminal output"
echo ""

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $API_PID $WORKER_PID 2>/dev/null; docker-compose -f docker-compose.temporal.yml down; echo "✅ All services stopped."; exit 0' INT

echo "✨ All services are running. Press Ctrl+C to stop."
echo ""

# Keep the script running
wait
