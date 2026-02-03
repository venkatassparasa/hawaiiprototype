@echo off
REM Hawaii County TVR Compliance - Temporal Integration Startup Script (Windows)
REM This script starts the complete Temporal workflow management system

echo 🏝️  Hawaii County TVR Compliance - Temporal Integration Starting...
echo ==================================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "docker-compose.temporal.yml" (
    echo ❌ Please run this script from the compliance-dashboard directory.
    pause
    exit /b 1
)

echo 🐳 Starting Temporal infrastructure with Docker Compose...
docker-compose -f docker-compose.temporal.yml up -d

REM Wait for Temporal to be ready
echo ⏳ Waiting for Temporal server to be ready...
timeout /t 10 /nobreak >nul

REM Check if Temporal is responding
echo 🔍 Checking Temporal server health...
for /l %%i in (1,1,30) do (
    curl -s http://localhost:7233 >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Temporal server is ready!
        goto :temporal_ready
    )
    if %%i==30 (
        echo ❌ Temporal server failed to start within 30 seconds.
        echo Check Docker logs with: docker-compose -f docker-compose.temporal.yml logs
        pause
        exit /b 1
    )
    echo    Waiting for Temporal... (%%i/30)
    timeout /t 1 /nobreak >nul
)

:temporal_ready

REM Start the API server
echo 🚀 Starting the TVR Compliance API server...
cd hawaii-vrbo-airbnb-crawler-api

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Start the API server in background
echo 🔧 Starting API server on port 3010...
start "API Server" cmd /k "npm run dev"

REM Wait for API server to be ready
echo ⏳ Waiting for API server to be ready...
timeout /t 5 /nobreak >nul

REM Start the Temporal worker
echo 👷 Starting Temporal worker...
start "Temporal Worker" cmd /k "npm run worker:dev"

REM Wait for worker to be ready
timeout /t 3 /nobreak >nul

echo.
echo 🎉 Temporal Integration is now running!
echo ==================================================================
echo 📊 Temporal UI:        http://localhost:8080
echo 🔗 API Server:         http://localhost:3010
echo 📚 API Documentation:   http://localhost:3010/docs
echo 🏠 Dashboard UI:        http://localhost:5173 (if running)
echo.
echo 🛠️  Available Services:
echo    • Temporal Server (port 7233)
echo    • Temporal UI (port 8080)
echo    • PostgreSQL (port 5432)
echo    • Redis (port 6379)
echo    • API Server (port 3010)
echo    • Temporal Worker (background)
echo.
echo 🧪 To test the integration:
echo    1. Open http://localhost:8080 to view Temporal UI
echo    2. Open http://localhost:3010/docs to view API docs
echo    3. Start the dashboard: cd .. && npm run dev
echo.
echo 🛑 To stop all services:
echo    1. Close the API Server and Worker command windows
echo    2. Run: docker-compose -f docker-compose.temporal.yml down
echo.
echo 📝 Logs:
echo    API Server: Check API Server command window
echo    Temporal:   docker-compose -f docker-compose.temporal.yml logs temporal
echo    Worker:     Check Temporal Worker command window
echo.

echo ✨ All services are running. Close this window to stop the script.
echo.
pause
