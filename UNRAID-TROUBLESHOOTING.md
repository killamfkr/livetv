# LiveTV Unraid Troubleshooting Guide

## 🚨 Common Errors & Solutions

### Error: "Unable to find image 'livetv:latest' locally"

**Problem**: Unraid is trying to pull a non-existent Docker image.

**Solution**: Use the Docker Compose installation method instead.

```bash
# SSH into your Unraid server
wget https://raw.githubusercontent.com/killamfkr/livetv/main/unraid-fix-install.sh
chmod +x unraid-fix-install.sh
./unraid-fix-install.sh
```

### Error: "pull access denied for livetv"

**Problem**: Docker is trying to pull from Docker Hub instead of building locally.

**Solution**: Build from source using Docker Compose.

```bash
cd /mnt/user/appdata/livetv
docker-compose up -d --build
```

### Error: "Permission denied"

**Problem**: Incorrect file permissions on Unraid.

**Solution**: Fix permissions.

```bash
chmod -R 755 /mnt/user/appdata/livetv/
chown -R nobody:users /mnt/user/appdata/livetv/
```

### Error: "Port already in use"

**Problem**: Another service is using ports 80 or 443.

**Solution**: Check and stop conflicting services.

```bash
# Check what's using port 80
netstat -tulpn | grep :80

# Check what's using port 443
netstat -tulpn | grep :443

# Stop conflicting services or change ports in docker-compose.yml
```

### Error: "Database connection failed"

**Problem**: PostgreSQL container not running or not accessible.

**Solution**: Check database container.

```bash
# Check container status
docker-compose ps

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

## 🔧 Quick Fix Commands

### Complete Reset
```bash
cd /mnt/user/appdata/livetv
docker-compose down
docker system prune -f
docker-compose up -d --build
```

### Check Status
```bash
cd /mnt/user/appdata/livetv
docker-compose ps
docker-compose logs
```

### Restart Services
```bash
cd /mnt/user/appdata/livetv
docker-compose restart
```

### Update LiveTV
```bash
cd /mnt/user/appdata/livetv
git pull origin main
docker-compose down
docker-compose up -d --build
```

## 📊 Diagnostic Commands

### Check Container Status
```bash
docker ps -a
docker-compose ps
```

### Check Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs postgres
docker-compose logs redis
docker-compose logs frontend
docker-compose logs nginx
```

### Check Disk Space
```bash
df -h
du -sh /mnt/user/appdata/livetv/
```

### Check Network
```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :443
netstat -tulpn | grep :8000
netstat -tulpn | grep :3000
```

### Check Permissions
```bash
ls -la /mnt/user/appdata/livetv/
ls -la /mnt/user/appdata/livetv/media/
ls -la /mnt/user/appdata/livetv/config/
```

## 🚀 Installation Methods

### Method 1: Automated Fix (Recommended)
```bash
wget https://raw.githubusercontent.com/killamfkr/livetv/main/unraid-fix-install.sh
chmod +x unraid-fix-install.sh
./unraid-fix-install.sh
```

### Method 2: Manual Docker Compose
```bash
mkdir -p /mnt/user/appdata/livetv
cd /mnt/user/appdata/livetv
git clone https://github.com/killamfkr/livetv.git .
docker-compose up -d --build
```

### Method 3: Step-by-Step Manual
```bash
# 1. Create directory
mkdir -p /mnt/user/appdata/livetv
cd /mnt/user/appdata/livetv

# 2. Clone repository
git clone https://github.com/killamfkr/livetv.git .

# 3. Create media directories
mkdir -p media/{movies,tv-shows,music,live-tv}
mkdir -p config/playlists
mkdir -p database

# 4. Set permissions
chmod -R 755 /mnt/user/appdata/livetv/
chown -R nobody:users /mnt/user/appdata/livetv/

# 5. Start services
docker-compose up -d --build
```

## 🔍 Troubleshooting Steps

### Step 1: Check Prerequisites
- [ ] Unraid 6.8+ installed
- [ ] Docker enabled
- [ ] At least 4GB RAM available
- [ ] 10GB+ free disk space

### Step 2: Check Installation
- [ ] Repository cloned successfully
- [ ] All directories created
- [ ] Permissions set correctly
- [ ] Docker Compose file present

### Step 3: Check Services
- [ ] All containers running
- [ ] No port conflicts
- [ ] Database accessible
- [ ] Redis accessible

### Step 4: Check Access
- [ ] Web interface accessible
- [ ] Login working
- [ ] Media files visible
- [ ] Live TV working

## 📞 Getting Help

### Check Logs First
```bash
cd /mnt/user/appdata/livetv
docker-compose logs --tail=50
```

### Common Issues
1. **Port conflicts** - Change ports in docker-compose.yml
2. **Permission issues** - Fix with chmod/chown commands
3. **Disk space** - Free up space or move to different drive
4. **Memory issues** - Increase Docker memory allocation
5. **Network issues** - Check firewall and network settings

### Support Resources
- **GitHub Issues**: https://github.com/killamfkr/livetv/issues
- **Unraid Forums**: Search for "LiveTV" in Unraid forums
- **Documentation**: https://github.com/killamfkr/livetv

## 🎯 Best Practices

### Regular Maintenance
```bash
# Update LiveTV
cd /mnt/user/appdata/livetv
./update-livetv.sh

# Check status
./status-livetv.sh

# Clean up Docker
docker system prune -f
```

### Backup
```bash
# Backup configuration
cp -r /mnt/user/appdata/livetv/config /mnt/user/backups/livetv-config-$(date +%Y%m%d)

# Backup database
docker-compose exec postgres pg_dump -U livetv livetv > /mnt/user/backups/livetv-db-$(date +%Y%m%d).sql
```

### Monitoring
```bash
# Check resource usage
docker stats

# Check disk usage
du -sh /mnt/user/appdata/livetv/*

# Check logs for errors
docker-compose logs | grep -i error
```

---

**Need more help? Check the logs and share the specific error message!**
