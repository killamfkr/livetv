#!/bin/bash

# LiveTV Unraid Docker Compose Installation Script
echo "🚀 Installing LiveTV on Unraid using Docker Compose"

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

# Download the repository
echo "📥 Downloading LiveTV source code..."
if [ -d "livetv" ]; then
    echo "ℹ️  LiveTV directory already exists, updating..."
    cd livetv
    git pull origin main
else
    git clone https://github.com/killamfkr/livetv.git
    cd livetv
fi

# Copy files to appdata
echo "📋 Copying files to appdata..."
cp -r * /mnt/user/appdata/livetv/
cd /mnt/user/appdata/livetv

# Create necessary directories
echo "📁 Creating media directories..."
mkdir -p media/{movies,tv-shows,music,live-tv}
mkdir -p config/playlists
mkdir -p database
mkdir -p nginx/ssl

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 /mnt/user/appdata/livetv/

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
docker-compose up -d --build
EOF

chmod +x start-livetv.sh

# Create stop script
echo "📝 Creating stop script..."
cat > stop-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
docker-compose down
EOF

chmod +x stop-livetv.sh

# Create update script
echo "📝 Creating update script..."
cat > update-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
git pull origin main
docker-compose down
docker-compose up -d --build
EOF

chmod +x update-livetv.sh

echo "✅ LiveTV installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start LiveTV: ./start-livetv.sh"
echo "2. Stop LiveTV: ./stop-livetv.sh"
echo "3. Update LiveTV: ./update-livetv.sh"
echo "4. Access at: http://your-unraid-ip"
echo "5. Login with: admin / admin123"
echo ""
echo "🎬 Add your media files to /mnt/user/appdata/livetv/media/"
echo "📺 Add M3U playlists to /mnt/user/appdata/livetv/config/playlists/"
echo "⚙️  Configure Xtream Codes through the web interface"
echo ""
echo "📁 All files are located in: /mnt/user/appdata/livetv/"
