@echo off
echo 🚀 Starting LiveTV Services...

echo 📦 Starting Docker containers...
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak > nul

echo 👤 Creating default admin user...
python create_admin.py

echo ✅ LiveTV is now running!
echo 🌐 Open http://localhost in your browser
echo 👤 Login with: admin / admin123
echo.
echo 📋 To stop services: docker-compose down
echo 📋 To view logs: docker-compose logs -f
pause
