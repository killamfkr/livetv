@echo off
echo 🚀 Building LiveTV Docker images locally...

REM Build the main application image
echo 📦 Building main application image...
docker build -t livetv:latest .

REM Build the frontend image
echo 📦 Building frontend image...
docker build -t livetv-frontend:latest ./frontend

echo ✅ Build complete!
echo.
echo 📋 To start the services:
echo docker-compose -f docker-compose.build.yml up -d
echo.
echo 📋 To stop the services:
echo docker-compose -f docker-compose.build.yml down
echo.
echo 🌐 Access the application at: http://localhost
echo 👤 Default login: admin / admin123
pause
