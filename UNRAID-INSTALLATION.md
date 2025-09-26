# LiveTV Unraid Installation Guide

This guide will help you install LiveTV on your Unraid server using the Community Applications template.

## 📋 Prerequisites

- Unraid 6.8+ (recommended 6.10+)
- Community Applications plugin installed
- At least 4GB RAM available
- 10GB+ free disk space for media

## 🚀 Installation Methods

### Method 1: Docker Compose Installation (Recommended)

1. **SSH into your Unraid server**
2. **Download and run the installation script**:
   ```bash
   wget https://raw.githubusercontent.com/killamfkr/livetv/main/unraid-docker-compose-install.sh
   chmod +x unraid-docker-compose-install.sh
   ./unraid-docker-compose-install.sh
   ```
3. **Start LiveTV**:
   ```bash
   cd /mnt/user/appdata/livetv
   ./start-livetv.sh
   ```
4. **Access at**: `http://your-unraid-ip`

### Method 2: Manual Docker Compose

1. **SSH into your Unraid server**
2. **Create appdata directory**:
   ```bash
   mkdir -p /mnt/user/appdata/livetv
   cd /mnt/user/appdata/livetv
   ```
3. **Clone the repository**:
   ```bash
   git clone https://github.com/killamfkr/livetv.git .
   ```
4. **Start the services**:
   ```bash
   docker-compose up -d --build
   ```

### Method 3: Community Applications (Advanced)

1. **Install Community Applications** (if not already installed)
2. **Use the simple template** for basic setup
3. **Follow Docker Compose method** for full functionality


## ⚙️ Configuration

### Required Paths

| Path | Description | Default |
|------|-------------|---------|
| **Media Directory** | Your media files | `/mnt/user/appdata/livetv/media` |
| **Config Directory** | Configuration and M3U playlists | `/mnt/user/appdata/livetv/config` |
| **Database Directory** | PostgreSQL database storage | `/mnt/user/appdata/livetv/database` |

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| **JWT_SECRET** | JWT authentication secret | `your_super_secret_jwt_key_change_this_in_production` | ✅ Change this! |
| **POSTGRES_PASSWORD** | Database password | `livetv_password` | ✅ Change this! |
| **WEB_PORT** | Web interface port | `80` | Optional |
| **HTTPS_PORT** | HTTPS port | `443` | Optional |

### Port Configuration

| Port | Service | Description |
|------|---------|-------------|
| **80** | Nginx | Web interface (HTTP) |
| **443** | Nginx | Web interface (HTTPS) |
| **8000** | Backend | API server (internal) |
| **3000** | Frontend | React app (internal) |
| **5432** | PostgreSQL | Database (internal) |
| **6379** | Redis | Cache (internal) |

## 📁 Directory Structure

After installation, your Unraid appdata directory will look like this:

```
/mnt/user/appdata/livetv/
├── media/                    # Your media files
│   ├── movies/              # Movie files
│   ├── tv-shows/            # TV show files
│   ├── music/               # Music files
│   └── live-tv/             # Live TV recordings
├── config/playlists/         # M3U playlist files
├── database/                 # PostgreSQL data
├── nginx/ssl/               # SSL certificates
├── .env                     # Environment configuration
└── docker-compose.override.yml
```

## 🎬 Adding Media

### Movies
1. **Place movie files** in `/mnt/user/appdata/livetv/media/movies/`
2. **Supported formats**: MP4, MKV, AVI, MOV, WMV, FLV, WebM
3. **Organization**: Flat structure or organized by folders

### TV Shows
1. **Place TV show files** in `/mnt/user/appdata/livetv/media/tv-shows/`
2. **Organization**: Show Name/Season/Episode structure recommended
3. **Supported formats**: Same as movies

### Music
1. **Place music files** in `/mnt/user/appdata/livetv/media/music/`
2. **Supported formats**: MP3, FLAC, AAC, OGG, WAV
3. **Organization**: Artist/Album structure recommended

### Live TV
1. **M3U playlists**: Place in `/mnt/user/appdata/livetv/config/playlists/`
2. **Xtream Codes**: Configure through web interface
3. **EPG data**: Automatically fetched for supported sources

## 🌐 Access and Usage

### Web Interface
- **URL**: `http://your-unraid-ip`
- **Default Login**: admin / admin123
- **Change password** after first login!

### Features Available
- ✅ Media library browsing
- ✅ Live TV streaming
- ✅ User management
- ✅ Settings configuration
- ✅ M3U playlist management
- ✅ Xtream Codes integration

## 🔧 Management

### Starting/Stopping
- **Unraid Interface**: Go to Docker → LiveTV → Start/Stop
- **Command Line**: `docker-compose up -d` / `docker-compose down`

### Logs
- **Unraid Interface**: Go to Docker → LiveTV → Logs
- **Command Line**: `docker-compose logs -f`

### Updates
- **Automatic**: Use Unraid's built-in update system
- **Manual**: Pull latest image and restart container

### Backups
- **Database**: Backup `/mnt/user/appdata/livetv/database/`
- **Config**: Backup `/mnt/user/appdata/livetv/config/`
- **Media**: Use Unraid's built-in backup system

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**
   - Check port conflicts (80, 443)
   - Verify directory permissions
   - Check logs for specific errors
   - Ensure sufficient disk space

2. **Media not loading**
   - Verify media files are in correct directories
   - Check file permissions (should be 755)
   - Ensure supported file formats
   - Check disk space

3. **Live TV not working**
   - Verify M3U playlist format
   - Check Xtream Codes credentials
   - Ensure network connectivity
   - Check firewall settings

4. **Performance issues**
   - Check Unraid system resources
   - Monitor disk I/O
   - Verify network speed
   - Consider using cache drives

### Log Locations
- **Container logs**: Unraid Docker interface
- **Application logs**: Inside container at `/app/logs`
- **Database logs**: PostgreSQL logs in container

### Reset Everything
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: This deletes all data!)
docker-compose down -v

# Remove images
docker rmi $(docker images -q)

# Start fresh
docker-compose up -d
```

## 🔒 Security Recommendations

### Essential Security
1. **Change default passwords**:
   - JWT secret
   - Database password
   - Admin user password

2. **Network security**:
   - Use Unraid's built-in firewall
   - Restrict access to trusted networks
   - Consider VPN access

3. **SSL/HTTPS**:
   - Add SSL certificates to `/mnt/user/appdata/livetv/nginx/ssl/`
   - Configure HTTPS in Nginx

### Advanced Security
1. **User management**:
   - Create specific users (not just admin)
   - Use strong passwords
   - Regular password updates

2. **Backup security**:
   - Encrypt backups
   - Store backups securely
   - Test restore procedures

## 📊 Performance Optimization

### For Large Media Libraries
- **Use SSD cache drives** for better performance
- **Increase Docker memory allocation** in Unraid
- **Use wired network connections** for streaming
- **Consider using Unraid's built-in transcoding**

### For Live TV
- **Ensure stable internet connection**
- **Use wired network for streaming**
- **Monitor bandwidth usage**
- **Consider using Unraid's built-in network monitoring**

### System Resources
- **Minimum**: 4GB RAM, 2 CPU cores
- **Recommended**: 8GB RAM, 4 CPU cores
- **For large libraries**: 16GB RAM, 8 CPU cores

## 🆘 Support

### Getting Help
- **GitHub Issues**: https://github.com/killamfkr/livetv/issues
- **Unraid Forums**: Search for "LiveTV" in Unraid forums
- **Documentation**: https://github.com/killamfkr/livetv

### Reporting Issues
When reporting issues, please include:
- Unraid version
- Docker version
- Container logs
- System specifications
- Steps to reproduce

## 🎯 Tips for Unraid Users

1. **Use cache drives** for better performance
2. **Set up automatic backups** of your database
3. **Monitor disk space** for media files
4. **Use Unraid's built-in monitoring** for system health
5. **Consider using Unraid's built-in reverse proxy** for external access
6. **Use Unraid's built-in network monitoring** for bandwidth tracking

---

**Made with ❤️ for the Unraid community**
