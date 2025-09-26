# LiveTV for Unraid

A complete Plex alternative with live TV support, specifically optimized for Unraid deployment.

## 🚀 Quick Installation

### Method 1: Unraid Community Applications (Recommended)

1. **Install Community Applications plugin** if not already installed
2. **Add this repository** to Community Applications
3. **Search for "LiveTV"** in Community Applications
4. **Click Install** and configure your paths
5. **Start the container**

### Method 2: Manual Installation

1. **Download the template**:
   ```bash
   wget https://raw.githubusercontent.com/killamfkr/livetv/main/unraid-template.xml
   ```

2. **Add to Unraid**:
   - Go to Docker → Add Container
   - Click "Add" and select "From XML"
   - Upload the `unraid-template.xml` file

3. **Configure paths**:
   - Media Directory: `/mnt/user/appdata/livetv/media`
   - Config Directory: `/mnt/user/appdata/livetv/config`
   - Database Directory: `/mnt/user/appdata/livetv/database`

4. **Start the container**

## 📁 Directory Structure

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

## 🎬 Adding Media

### Movies
- Place movie files in `/mnt/user/appdata/livetv/media/movies/`
- Supported formats: MP4, MKV, AVI, MOV, WMV, FLV, WebM

### TV Shows
- Place TV show files in `/mnt/user/appdata/livetv/media/tv-shows/`
- Organize by show name and season

### Music
- Place music files in `/mnt/user/appdata/livetv/media/music/`
- Supported formats: MP3, FLAC, AAC, OGG, WAV

### Live TV
- Place M3U playlist files in `/mnt/user/appdata/livetv/config/playlists/`
- Configure Xtream Codes through the web interface

## 🔧 Configuration

### Environment Variables

The Unraid template includes these configurable options:

- **JWT Secret**: Change this for security
- **Database Password**: PostgreSQL password
- **Web Port**: Default 80 (change if needed)
- **HTTPS Port**: Default 443 (change if needed)

### Paths

- **Media Directory**: Where your media files are stored
- **Config Directory**: Configuration and M3U playlists
- **Database Directory**: PostgreSQL database storage

## 🌐 Access

- **Web Interface**: `http://your-unraid-ip`
- **Default Login**: admin / admin123
- **Change password** after first login!

## 🛠️ Management

### Starting/Stopping
- Use Unraid Docker interface
- Or command line: `docker-compose up -d`

### Logs
- View in Unraid Docker interface
- Or command line: `docker-compose logs -f`

### Updates
- Pull latest image in Unraid Docker interface
- Or command line: `docker-compose pull && docker-compose up -d`

## 🔒 Security

### Default Security
- JWT authentication
- Role-based access control
- Input validation
- CORS protection

### Recommended Security
1. **Change default passwords**
2. **Use strong JWT secret**
3. **Enable HTTPS** (add SSL certificates)
4. **Restrict network access** if needed

## 📊 Features

### Media Management
- ✅ Movie library
- ✅ TV show library
- ✅ Music library
- ✅ Thumbnail generation
- ✅ Metadata extraction

### Live TV
- ✅ M3U playlist support
- ✅ Xtream Codes integration
- ✅ Channel categorization
- ✅ EPG (Electronic Program Guide)
- ✅ Live streaming

### User Interface
- ✅ Modern web interface
- ✅ Mobile responsive
- ✅ Dark theme
- ✅ Search and filtering
- ✅ User management

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**
   - Check port conflicts
   - Verify directory permissions
   - Check logs for errors

2. **Media not loading**
   - Verify media files are in correct directories
   - Check file permissions
   - Ensure supported file formats

3. **Live TV not working**
   - Verify M3U playlist format
   - Check Xtream Codes credentials
   - Ensure network connectivity

4. **Performance issues**
   - Check Unraid system resources
   - Monitor disk space
   - Verify network speed

### Logs Location
- **Container logs**: Unraid Docker interface
- **Application logs**: Inside container at `/app/logs`

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

## 🔄 Updates

### Automatic Updates
- Use Unraid's built-in update system
- Or set up automatic updates with watchtower

### Manual Updates
1. **Stop the container**
2. **Pull latest image**
3. **Start the container**

## 📞 Support

- **GitHub Issues**: https://github.com/killamfkr/livetv/issues
- **Documentation**: https://github.com/killamfkr/livetv
- **Community**: Unraid Forums

## 🎯 Tips for Unraid Users

1. **Use cache drives** for better performance
2. **Set up automatic backups** of your database
3. **Monitor disk space** for media files
4. **Use Unraid's built-in monitoring** for system health
5. **Consider using Unraid's built-in reverse proxy** for external access

## 📈 Performance Optimization

### For Large Media Libraries
- Use SSD cache drives
- Increase Docker memory allocation
- Use wired network connections
- Consider using Unraid's built-in transcoding

### For Live TV
- Ensure stable internet connection
- Use wired network for streaming
- Monitor bandwidth usage
- Consider using Unraid's built-in network monitoring

---

**Made with ❤️ for the Unraid community**
