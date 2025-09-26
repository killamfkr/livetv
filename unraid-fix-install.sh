#!/bin/bash

# LiveTV Unraid Fix Installation Script
echo "🔧 Fixing LiveTV Unraid Installation Issues"

# Check if running on Unraid
if [ ! -d "/mnt/user" ]; then
    echo "❌ This script is designed for Unraid systems"
    echo "Please run this on your Unraid server"
    exit 1
fi

# Create appdata directory
echo "📁 Creating Unraid appdata directories..."
mkdir -p /mnt/user/appdata/livetv
cd /mnt/user/appdata/livetv

# Download the repository if not exists
if [ ! -d "livetv" ]; then
    echo "📥 Downloading LiveTV source code..."
    git clone https://github.com/killamfkr/livetv.git
    cd livetv
    cp -r * /mnt/user/appdata/livetv/
    cd /mnt/user/appdata/livetv
else
    echo "ℹ️  LiveTV directory already exists, updating..."
    cd livetv
    git pull origin main
    cp -r * /mnt/user/appdata/livetv/
    cd /mnt/user/appdata/livetv
fi

# Create necessary directories
echo "📁 Creating media directories..."
mkdir -p media/{movies,tv-shows,music,live-tv}
mkdir -p config/playlists
mkdir -p database
mkdir -p nginx/ssl

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 /mnt/user/appdata/livetv/
chown -R nobody:users /mnt/user/appdata/livetv/

# Create environment file
echo "📝 Creating environment file..."
cat > .env << 'EOF'
# LiveTV Unraid Configuration
DATABASE_URL=postgresql://livetv:livetv_password@postgres:5432/livetv
REDIS_URL=redis://redis:6379
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=30
MEDIA_PATH=/media
POSTGRES_PASSWORD=livetv_password
EOF

# Create Unraid-specific docker-compose override
echo "🐳 Creating Unraid Docker Compose configuration..."
cat > docker-compose.override.yml << 'EOF'
version: '3.8'

services:
  postgres:
    volumes:
      - /mnt/user/appdata/livetv/database:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    restart: unless-stopped

  backend:
    volumes:
      - /mnt/user/appdata/livetv/media:/media
      - /mnt/user/appdata/livetv/config:/app/config
    restart: unless-stopped

  frontend:
    restart: unless-stopped

  nginx:
    restart: unless-stopped
EOF

# Create startup script
echo "📝 Creating startup script..."
cat > start-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
echo "🚀 Starting LiveTV services..."
docker-compose up -d --build
echo "✅ LiveTV started successfully!"
echo "🌐 Access at: http://your-unraid-ip"
echo "👤 Login with: admin / admin123"
EOF

chmod +x start-livetv.sh

# Create stop script
echo "📝 Creating stop script..."
cat > stop-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
echo "🛑 Stopping LiveTV services..."
docker-compose down
echo "✅ LiveTV stopped successfully!"
EOF

chmod +x stop-livetv.sh

# Create update script
echo "📝 Creating update script..."
cat > update-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
echo "🔄 Updating LiveTV..."
git pull origin main
docker-compose down
docker-compose up -d --build
echo "✅ LiveTV updated successfully!"
EOF

chmod +x update-livetv.sh

# Create status script
echo "📝 Creating status script..."
cat > status-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
echo "📊 LiveTV Status:"
echo "=================="
docker-compose ps
echo ""
echo "📋 Container Logs:"
echo "=================="
docker-compose logs --tail=10
EOF

chmod +x status-livetv.sh

# Create fix script
echo "📝 Creating fix script..."
cat > fix-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
echo "🔧 Fixing LiveTV issues..."

# Stop all containers
echo "🛑 Stopping all containers..."
docker-compose down

# Remove old images
echo "🗑️  Removing old images..."
docker rmi livetv:latest 2>/dev/null || true
docker rmi livetv-frontend:latest 2>/dev/null || true

# Clean up Docker
echo "🧹 Cleaning up Docker..."
docker system prune -f

# Rebuild everything
echo "🔨 Rebuilding LiveTV..."
docker-compose up -d --build

echo "✅ LiveTV fixed successfully!"
echo "🌐 Access at: http://your-unraid-ip"
echo "👤 Login with: admin / admin123"
EOF

chmod +x fix-livetv.sh

echo "✅ LiveTV Unraid fix installation complete!"
echo ""
echo "📋 Available commands:"
echo "====================="
echo "Start LiveTV:    ./start-livetv.sh"
echo "Stop LiveTV:     ./stop-livetv.sh"
echo "Update LiveTV:   ./update-livetv.sh"
echo "Check Status:    ./status-livetv.sh"
echo "Fix Issues:      ./fix-livetv.sh"
echo ""
echo "🎬 Add your media files to /mnt/user/appdata/livetv/media/"
echo "📺 Add M3U playlists to /mnt/user/appdata/livetv/config/playlists/"
echo "⚙️  Configure Xtream Codes through the web interface"
echo ""
echo "📁 All files are located in: /mnt/user/appdata/livetv/"
echo ""
echo "🚀 To start LiveTV now, run: ./start-livetv.sh"
