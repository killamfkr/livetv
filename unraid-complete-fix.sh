#!/bin/bash

# LiveTV Unraid Complete Fix - Bypasses Unraid template system
echo "🔧 LiveTV Unraid Complete Fix - No Template Required"

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
    cp -r * /mnt/user/appdata/livetv/
    cd /mnt/user/appdata/livetv
else
    git clone https://github.com/killamfkr/livetv.git
    cd livetv
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
echo "⏳ This may take a few minutes for the first build..."
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

# Create complete reset script
echo "📝 Creating complete reset script..."
cat > reset-livetv.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
echo "🔄 Complete LiveTV Reset..."

# Stop all containers
echo "🛑 Stopping all containers..."
docker-compose down

# Remove all images
echo "🗑️  Removing all images..."
docker rmi livetv:latest 2>/dev/null || true
docker rmi livetv-frontend:latest 2>/dev/null || true
docker rmi livetv_backend 2>/dev/null || true
docker rmi livetv_frontend 2>/dev/null || true

# Clean up Docker completely
echo "🧹 Cleaning up Docker..."
docker system prune -af
docker volume prune -f

# Remove database data (WARNING: This deletes all data!)
echo "⚠️  Removing database data..."
rm -rf database/*

# Rebuild everything from scratch
echo "🔨 Rebuilding LiveTV from scratch..."
docker-compose up -d --build

echo "✅ LiveTV completely reset!"
echo "🌐 Access at: http://your-unraid-ip"
echo "👤 Login with: admin / admin123"
EOF

chmod +x reset-livetv.sh

# Create Unraid-specific docker-compose file
echo "📝 Creating Unraid-specific docker-compose file..."
cat > docker-compose-unraid.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: livetv_db
    environment:
      POSTGRES_DB: livetv
      POSTGRES_USER: livetv
      POSTGRES_PASSWORD: livetv_password
    volumes:
      - /mnt/user/appdata/livetv/database:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - livetv_network
    restart: unless-stopped

  # Redis for caching
  redis:
    image: redis:7-alpine
    container_name: livetv_redis
    ports:
      - "6379:6379"
    networks:
      - livetv_network
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: livetv_backend
    environment:
      - DATABASE_URL=postgresql://livetv:livetv_password@postgres:5432/livetv
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your_jwt_secret_key_here
      - MEDIA_PATH=/media
    volumes:
      - /mnt/user/appdata/livetv/media:/media
      - /mnt/user/appdata/livetv/config:/app/config
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    networks:
      - livetv_network
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: livetv_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - livetv_network
    restart: unless-stopped

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: livetv_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - livetv_network
    restart: unless-stopped

networks:
  livetv_network:
    driver: bridge
EOF

# Create alternative start script using the Unraid-specific compose file
echo "📝 Creating alternative start script..."
cat > start-livetv-unraid.sh << 'EOF'
#!/bin/bash
cd /mnt/user/appdata/livetv
echo "🚀 Starting LiveTV services (Unraid-specific)..."
echo "⏳ This may take a few minutes for the first build..."
docker-compose -f docker-compose-unraid.yml up -d --build
echo "✅ LiveTV started successfully!"
echo "🌐 Access at: http://your-unraid-ip"
echo "👤 Login with: admin / admin123"
EOF

chmod +x start-livetv-unraid.sh

echo "✅ LiveTV Unraid complete fix installation finished!"
echo ""
echo "📋 Available commands:"
echo "====================="
echo "Start LiveTV:           ./start-livetv.sh"
echo "Start LiveTV (Unraid):  ./start-livetv-unraid.sh"
echo "Stop LiveTV:           ./stop-livetv.sh"
echo "Update LiveTV:         ./update-livetv.sh"
echo "Check Status:          ./status-livetv.sh"
echo "Fix Issues:            ./fix-livetv.sh"
echo "Complete Reset:        ./reset-livetv.sh"
echo ""
echo "🎬 Add your media files to /mnt/user/appdata/livetv/media/"
echo "📺 Add M3U playlists to /mnt/user/appdata/livetv/config/playlists/"
echo "⚙️  Configure Xtream Codes through the web interface"
echo ""
echo "📁 All files are located in: /mnt/user/appdata/livetv/"
echo ""
echo "🚀 To start LiveTV now, run: ./start-livetv.sh"
echo "   Or for Unraid-specific:  ./start-livetv-unraid.sh"
