# LiveTV - Plex Alternative with Live TV Support

A modern, Docker-based media server alternative to Plex with comprehensive live TV support through M3U playlists and Xtream Codes API integration.

## 🌟 Features

- 🎬 **Media Library Management** - Organize and stream your movies and TV shows
- 📺 **Live TV Support** - M3U playlist and Xtream Codes integration
- 🔍 **Smart Search** - Find content quickly with advanced search and filtering
- 📱 **Responsive Web Interface** - Modern UI that works on desktop, tablet, and mobile
- 🔐 **User Management** - Multi-user support with role-based access control
- 🚀 **Docker Ready** - Easy deployment with Docker Compose
- ⚡ **Fast Streaming** - Optimized for smooth playback with range request support
- 🎨 **Modern UI** - Beautiful, intuitive interface with dark theme
- 📊 **EPG Support** - Electronic Program Guide for live TV channels
- 🔄 **Auto-refresh** - Automatic playlist updates and channel refresh

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- 10GB+ free disk space for media

### Installation

#### Windows
1. **Run the setup script**
   ```cmd
   setup.bat
   ```

2. **Start the services**
   ```cmd
   start.bat
   ```

#### Linux/macOS
1. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start the services**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### Manual Setup
1. **Clone and configure**
   ```bash
   git clone https://github.com/killamfkr/livetv.git
   cd livetv
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Start the services**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**
   - Open `http://localhost` in your browser
   - Login with: `admin` / `admin123`

## 📁 Directory Structure

```
livetv/
├── media/                    # Your media files
│   ├── movies/              # Movie files
│   ├── tv-shows/            # TV show files
│   ├── music/               # Music files
│   └── live-tv/             # Live TV recordings
├── config/
│   └── playlists/           # M3U playlist files
├── backend/                 # FastAPI backend
├── frontend/                # React frontend
├── nginx/                   # Nginx configuration
└── docker-compose.yml       # Docker services
```

## 🎬 Media Management

### Supported Formats
- **Video**: MP4, MKV, AVI, MOV, WMV, FLV, WebM
- **Audio**: MP3, FLAC, AAC, OGG, WAV
- **Live TV**: M3U, M3U8, Xtream Codes

### Adding Media
1. Place your media files in the appropriate directories:
   - Movies → `./media/movies/`
   - TV Shows → `./media/tv-shows/`
   - Music → `./media/music/`

2. The system will automatically scan and index your media

## 📺 Live TV Setup

### M3U Playlists
1. **Upload M3U files**:
   - Go to Settings → Live TV
   - Upload your M3U playlist file
   - The system will parse and add all channels

2. **Supported M3U formats**:
   - Standard M3U
   - Extended M3U (with metadata)
   - M3U8 (HLS playlists)

### Xtream Codes Integration
1. **Add Xtream Codes provider**:
   - Go to Settings → Live TV
   - Enter your Xtream Codes URL, username, and password
   - The system will automatically fetch channels and EPG data

2. **Supported Xtream Codes features**:
   - Live TV channels
   - VOD (Video on Demand)
   - Series
   - EPG data

## 🔧 Configuration

### Environment Variables
Edit the `.env` file to configure:

```env
# Database
DATABASE_URL=postgresql://livetv:livetv_password@postgres:5432/livetv
POSTGRES_PASSWORD=your_secure_password

# JWT Security
JWT_SECRET=your_super_secret_jwt_key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Media
MEDIA_PATH=/media
MAX_FILE_SIZE=10737418240  # 10GB

# API
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### Nginx Configuration
The included Nginx configuration provides:
- Reverse proxy for API and frontend
- Range request support for video streaming
- Gzip compression
- Security headers
- Rate limiting

## 🛠️ API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Media
- `GET /api/media` - List all media
- `GET /api/media/{id}` - Get media details
- `GET /api/media/{id}/stream` - Stream media content
- `GET /api/media/{id}/thumbnail` - Get media thumbnail

### Live TV
- `GET /api/live-tv/channels` - List live TV channels
- `GET /api/live-tv/channels/{id}` - Get channel details
- `GET /api/live-tv/channels/{id}/stream` - Stream live TV
- `GET /api/live-tv/epg` - Get EPG data
- `GET /api/live-tv/categories` - Get channel categories

### Playlists
- `GET /api/playlists` - List playlists
- `POST /api/playlists/upload` - Upload M3U playlist
- `POST /api/playlists/xtream` - Add Xtream Codes
- `DELETE /api/playlists/{id}` - Delete playlist

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | 3000 | React web interface |
| **Backend** | 8000 | FastAPI application |
| **PostgreSQL** | 5432 | Database |
| **Redis** | 6379 | Caching |
| **Nginx** | 80/443 | Reverse proxy |

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access** - Admin and user permissions
- **Input Validation** - All inputs are validated and sanitized
- **CORS Protection** - Configured for secure cross-origin requests
- **Rate Limiting** - API rate limiting to prevent abuse
- **Security Headers** - Comprehensive security headers via Nginx

## 🚀 Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database Migrations
```bash
cd backend
alembic upgrade head
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks
- Backend: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`
- Database: Check container status

## 🛠️ Troubleshooting

### Common Issues

1. **Services won't start**
   - Check Docker is running
   - Ensure ports 80, 3000, 8000 are available
   - Check logs: `docker-compose logs`

2. **Media not loading**
   - Verify media files are in correct directories
   - Check file permissions
   - Ensure supported file formats

3. **Live TV not working**
   - Verify M3U playlist format
   - Check Xtream Codes credentials
   - Ensure network connectivity

4. **Performance issues**
   - Increase Docker memory allocation
   - Check disk space
   - Monitor resource usage

### Reset Everything
```bash
docker-compose down -v
docker system prune -a
# Then run setup again
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- React for the powerful frontend library
- Docker for containerization
- All the open-source libraries that make this possible

---

**Made with ❤️ for the media streaming community**
