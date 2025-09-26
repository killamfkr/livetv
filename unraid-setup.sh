#!/bin/bash

# LiveTV Unraid Setup Script
echo "🚀 Setting up LiveTV on Unraid"

# Create necessary directories in Unraid appdata
echo "📁 Creating Unraid appdata directories..."
mkdir -p /mnt/user/appdata/livetv/media/{movies,tv-shows,music,live-tv}
mkdir -p /mnt/user/appdata/livetv/config/playlists
mkdir -p /mnt/user/appdata/livetv/database
mkdir -p /mnt/user/appdata/livetv/nginx/ssl

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 /mnt/user/appdata/livetv/

# Create environment file for Unraid
echo "📝 Creating Unraid environment file..."
cat > /mnt/user/appdata/livetv/.env << 'EOF'
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
cat > /mnt/user/appdata/livetv/docker-compose.override.yml << 'EOF'
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

# Create Unraid-specific README
echo "📚 Creating Unraid setup instructions..."
cat > /mnt/user/appdata/livetv/README-UNRAID.md << 'EOF'
# LiveTV on Unraid

## Quick Setup

1. **Copy this directory** to your Unraid server
2. **Run the setup script**: `./unraid-setup.sh`
3. **Start the services**: `docker-compose up -d`
4. **Access LiveTV**: http://your-unraid-ip

## Directory Structure

```
/mnt/user/appdata/livetv/
├── media/                    # Your media files
│   ├── movies/              # Movie files
│   ├── tv-shows/            # TV show files
│   ├── music/               # Music files
│   └── live-tv/             # Live TV recordings
├── config/playlists/         # M3U playlist files
├── database/                 # PostgreSQL data
└── nginx/ssl/               # SSL certificates
```

## Adding Media

1. **Movies**: Place in `/mnt/user/appdata/livetv/media/movies/`
2. **TV Shows**: Place in `/mnt/user/appdata/livetv/media/tv-shows/`
3. **Music**: Place in `/mnt/user/appdata/livetv/media/music/`
4. **M3U Playlists**: Place in `/mnt/user/appdata/livetv/config/playlists/`

## Default Login

- **Username**: admin
- **Password**: admin123
- **Change these after first login!**

## Management Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## Unraid Template

For easy installation, use the included `unraid-template.xml` file in the Unraid Community Applications.
EOF

echo "✅ Unraid setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy this directory to your Unraid server"
echo "2. Run: ./unraid-setup.sh"
echo "3. Start: docker-compose up -d"
echo "4. Access: http://your-unraid-ip"
echo ""
echo "🎬 Add your media files to /mnt/user/appdata/livetv/media/"
echo "📺 Add M3U playlists to /mnt/user/appdata/livetv/config/playlists/"
echo "⚙️  Configure Xtream Codes through the web interface"
