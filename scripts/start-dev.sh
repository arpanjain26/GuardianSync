#!/bin/bash
# Start all GuardianSync services in development mode
echo "🛡️  Starting GuardianSync Development Environment"
echo "=================================================="

# Start AI Engine
echo "🤖 Starting AI Engine on port 8000..."
cd ai-engine && uvicorn app.main:app --reload --port 8000 &
AI_PID=$!

# Start Server
echo "🖥️  Starting Server on port 5000..."
cd ../server && npm run dev &
SERVER_PID=$!

# Start Client
echo "🌐 Starting Client on port 5173..."
cd ../client && npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ All services started!"
echo "   AI Engine: http://localhost:8000"
echo "   Server:    http://localhost:5000"
echo "   Client:    http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $AI_PID $SERVER_PID $CLIENT_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
