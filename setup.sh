#!/bin/bash

# LiveTV Setup Script
echo "🚀 Setting up LiveTV - Plex Alternative with Live TV Support"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p media/{movies,tv-shows,music,live-tv}
mkdir -p config/playlists
mkdir -p nginx/ssl

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 media/
chmod -R 755 config/

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration before starting the services"
fi

# Create default admin user script
echo "👤 Creating default admin user script..."
cat > create_admin.py << 'EOF'
#!/usr/bin/env python3
import sys
import os
sys.path.append('backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Import models
from backend.models import User
from backend.config import settings

# Create database connection
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("Admin user already exists!")
            return
        
        # Create admin user
        hashed_password = pwd_context.hash("admin123")
        admin_user = User(
            username="admin",
            email="admin@livetv.local",
            hashed_password=hashed_password,
            is_admin=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        print("✅ Admin user created successfully!")
        print("   Username: admin")
        print("   Password: admin123")
        print("   ⚠️  Please change the default password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
EOF

chmod +x create_admin.py

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run: docker-compose up -d --build"
echo "3. Wait for services to start (about 2-3 minutes)"
echo "4. Open http://localhost in your browser"
echo "5. Login with admin/admin123"
echo ""
echo "🎬 Add your media files to the ./media directory"
echo "📺 Add M3U playlists to ./config/playlists/"
echo "⚙️  Configure Xtream Codes through the web interface"
