# LiveTV Unraid Simple Installation

**Skip the Unraid template system entirely!** This method uses Docker Compose directly and avoids all template-related issues.

## 🚀 Quick Installation (No Template Required)

### Step 1: SSH into your Unraid server
```bash
ssh root@your-unraid-ip
```

### Step 2: Run the complete fix script
```bash
wget https://raw.githubusercontent.com/killamfkr/livetv/main/unraid-complete-fix.sh
chmod +x unraid-complete-fix.sh
./unraid-complete-fix.sh
```

### Step 3: Start LiveTV
```bash
cd /mnt/user/appdata/livetv
./start-livetv.sh
```

### Step 4: Access LiveTV
- Open `http://your-unraid-ip` in your browser
- Login with: `admin` / `admin123`

## 🎯 That's It!

No Unraid templates, no Docker Hub images, no "Unable to find image" errors. Everything builds locally from source code.

## 📋 Available Commands

After installation, you'll have these commands in `/mnt/user/appdata/livetv/`:

```bash
# Start LiveTV
./start-livetv.sh

# Stop LiveTV
./stop-livetv.sh

# Update LiveTV
./update-livetv.sh

# Check status
./status-livetv.sh

# Fix issues
./fix-livetv.sh

# Complete reset (if needed)
./reset-livetv.sh
```

## 🔧 If You Still Get Errors

### Error: "Unable to find image 'livetv:latest'"
**Solution**: Use the complete fix script above. It builds everything from source.

### Error: "Permission denied"
**Solution**: 
```bash
chmod -R 755 /mnt/user/appdata/livetv/
chown -R nobody:users /mnt/user/appdata/livetv/
```

### Error: "Port already in use"
**Solution**: Change ports in `docker-compose.yml` or stop conflicting services.

## 📁 Directory Structure

After installation:
```
/mnt/user/appdata/livetv/
├── media/                    # Your media files
│   ├── movies/              # Movie files
│   ├── tv-shows/            # TV show files
│   ├── music/               # Music files
│   └── live-tv/             # Live TV recordings
├── config/playlists/         # M3U playlist files
├── database/                 # PostgreSQL data
├── start-livetv.sh          # Start script
├── stop-livetv.sh           # Stop script
├── update-livetv.sh         # Update script
├── status-livetv.sh         # Status script
├── fix-livetv.sh            # Fix script
├── reset-livetv.sh          # Reset script
└── docker-compose.yml       # Docker Compose file
```

## 🎬 Adding Media

1. **Movies**: Place in `/mnt/user/appdata/livetv/media/movies/`
2. **TV Shows**: Place in `/mnt/user/appdata/livetv/media/tv-shows/`
3. **Music**: Place in `/mnt/user/appdata/livetv/media/music/`
4. **M3U Playlists**: Place in `/mnt/user/appdata/livetv/config/playlists/`

## 🔄 Updates

To update LiveTV to the latest version:
```bash
cd /mnt/user/appdata/livetv
./update-livetv.sh
```

## 🆘 Troubleshooting

### Check if services are running:
```bash
cd /mnt/user/appdata/livetv
./status-livetv.sh
```

### View logs:
```bash
cd /mnt/user/appdata/livetv
docker-compose logs
```

### Complete reset (deletes all data):
```bash
cd /mnt/user/appdata/livetv
./reset-livetv.sh
```

## ✅ Benefits of This Method

- ✅ **No Unraid template issues**
- ✅ **No Docker Hub dependencies**
- ✅ **Builds from source code**
- ✅ **Works offline**
- ✅ **Easy management scripts**
- ✅ **Proper Unraid integration**
- ✅ **Automatic updates**

## 🎉 Enjoy LiveTV!

This method completely bypasses the Unraid template system and gives you full control over your LiveTV installation.

---

**Need help? Check the logs first:**
```bash
cd /mnt/user/appdata/livetv
docker-compose logs
```
