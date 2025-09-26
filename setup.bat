@echo off
echo 🚀 Setting up LiveTV - Plex Alternative with Live TV Support

REM Create necessary directories
echo 📁 Creating directories...
if not exist "media\movies" mkdir "media\movies"
if not exist "media\tv-shows" mkdir "media\tv-shows"
if not exist "media\music" mkdir "media\music"
if not exist "media\live-tv" mkdir "media\live-tv"
if not exist "config\playlists" mkdir "config\playlists"
if not exist "nginx\ssl" mkdir "nginx\ssl"

REM Copy environment file
if not exist ".env" (
    echo 📝 Creating environment file...
    copy "env.example" ".env"
    echo ⚠️  Please edit .env file with your configuration before starting the services
)

echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your configuration
echo 2. Run: docker-compose up -d
echo 3. Wait for services to start (about 2-3 minutes)
echo 4. Run: python create_admin.py (to create default admin user)
echo 5. Open http://localhost in your browser
echo 6. Login with admin/admin123
echo.
echo 🎬 Add your media files to the .\media directory
echo 📺 Add M3U playlists to .\config\playlists\
echo ⚙️  Configure Xtream Codes through the web interface
pause
