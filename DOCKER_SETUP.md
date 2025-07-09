# 🐳 Docker Setup Guide - Fusion Scanner

This guide provides comprehensive instructions for running Fusion Scanner using Docker with pre-configured settings.

## 🚀 Quick Start

### Option 1: One-Command Setup

```bash
# Run the quick start script
./docker-start.sh
```

### Option 2: Manual Commands

```bash
# Basic deployment (app only)
npm run docker:up

# Full deployment (with all services)
npm run docker:up-full

# Production deployment
npm run docker:up-prod
```

### Option 3: Pre-configured Image

```bash
# Build and run pre-configured image
npm run docker:build-pre
npm run docker:run-pre
```

## 📦 Available Deployments

### 1. Basic Deployment

- **Fusion Scanner App** only
- **SQLite database** with sample data
- **Pre-configured** with demo mode
- **Ready to use** immediately

```bash
docker-compose up -d
```

**Access Points:**

- App: http://localhost:8080
- Health: http://localhost:8080/api/health
- API: http://localhost:8080/api/ping

### 2. Full Deployment

Includes all optional services:

- **Fusion Scanner App**
- **Traefik** reverse proxy
- **Redis** for caching
- **PostgreSQL** database

```bash
docker-compose --profile proxy --profile cache --profile database up -d
```

**Access Points:**

- App: http://localhost:8080
- Traefik Dashboard: http://localhost:8090
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 3. Production Deployment

Optimized for production with:

- **SSL/TLS** termination
- **Auto-scaling**
- **Enhanced security**
- **Performance optimization**

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file from the template:

```bash
cp .env.docker .env
# Edit .env with your settings
```

Key configurations:

```env
# Basic Settings
NODE_ENV=production
PORT=8080
DEMO_MODE=true

# Scanner Settings
MAX_CONCURRENT_SCANS=5
SCAN_TIMEOUT=300000

# Security
CORS_ORIGIN=*
RATE_LIMIT_MAX=100

# Features
WEBSOCKET_ENABLED=true
AI_ANALYSIS_ENABLED=false
```

### Custom Configuration

1. **App Settings**: Edit `docker/config/app-config.json`
2. **Environment**: Edit `docker/config/default.env`
3. **Database**: Modify `docker/init-database.sql`

## 🛠️ Pre-configured Features

### ✅ What's Included Out-of-the-Box

- **✨ Sample Data**: Pre-loaded with demo scans and vulnerabilities
- **🔧 Nuclei Integration**: Latest templates pre-downloaded
- **📊 Database**: SQLite with optimized schema
- **🔐 Security**: Configured rate limiting and CORS
- **📝 Logging**: Structured logging with rotation
- **🩺 Health Checks**: Built-in monitoring endpoints
- **🌐 WebSocket**: Real-time scan updates
- **📋 Sample Scans**: Demo vulnerabilities and analysis

### 🎯 Target Examples

Pre-configured with safe demo targets:

- `https://httpbin.org` - HTTP testing service
- `https://demo.testfire.net` - Banking demo app
- `https://juice-shop.herokuapp.com` - Vulnerable web app

### 📊 Sample Data Included

- **2 demo scans** with realistic results
- **8 sample vulnerabilities** (Critical to Low severity)
- **AI analysis examples** with recommendations
- **Scan logs** showing progression

## 🚀 Usage Examples

### Run a Demo Scan

```bash
# Start the application
docker-compose up -d

# Create a new scan (via API)
curl -X POST http://localhost:8080/api/v2/scanner/start \
  -H "Content-Type: application/json" \
  -d '{"target": "https://httpbin.org", "tools": ["basic"]}'

# Check scan status
curl http://localhost:8080/api/v2/scanner/status/YOUR_SCAN_ID
```

### View Sample Data

```bash
# Access the database
docker-compose exec fusion-scanner sqlite3 /app/data/scanner.db

# View existing scans
.tables
SELECT * FROM scans;
SELECT * FROM vulnerabilities LIMIT 5;
```

### Monitor Logs

```bash
# View all logs
docker-compose logs -f

# View app logs only
docker-compose logs -f fusion-scanner

# View real-time application logs
docker-compose exec fusion-scanner tail -f /app/logs/application.log
```

## 🔧 Management Commands

### Container Management

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Restart specific service
docker-compose restart fusion-scanner

# Check service status
docker-compose ps
```

### Data Management

```bash
# Backup database
docker-compose exec fusion-scanner cp /app/data/scanner.db /app/data/backup.db

# Reset to demo data
docker-compose exec fusion-scanner sqlite3 /app/data/scanner.db < /app/docker/init-database.sql

# Clear all data
docker-compose down -v
```

### Updates and Maintenance

```bash
# Update Nuclei templates
docker-compose exec fusion-scanner nuclei -update-templates

# Rebuild with latest changes
docker-compose build --no-cache

# Update to latest image
docker-compose pull && docker-compose up -d
```

## 📊 Monitoring and Health

### Health Checks

```bash
# Application health
curl http://localhost:8080/api/health

# Detailed health (if available)
curl http://localhost:8080/api/v2/scanner/health

# Container health
docker-compose ps
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Log sizes
docker-compose exec fusion-scanner du -sh /app/logs/*
```

## 🔒 Security Considerations

### Default Security Features

- ✅ **Non-root user** in container
- ✅ **Rate limiting** enabled
- ✅ **CORS protection** configured
- ✅ **Health checks** implemented
- ✅ **Secure headers** (Helmet.js)
- ✅ **Input validation** on API endpoints

### Production Security

```bash
# Use production deployment
npm run docker:up-prod

# Set strong passwords in .env
POSTGRES_PASSWORD=your_strong_password
REDIS_PASSWORD=your_redis_password

# Enable SSL (edit docker-compose.prod.yml)
SSL_ENABLED=true
DOMAIN=yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using port 8080
   lsof -i :8080
   # Or change port in .env
   PORT=8081
   ```

2. **Database Issues**

   ```bash
   # Reset database
   docker-compose exec fusion-scanner rm /app/data/scanner.db
   docker-compose restart fusion-scanner
   ```

3. **Permission Errors**

   ```bash
   # Fix permissions
   docker-compose exec fusion-scanner chown -R scanner:scanner /app/data
   ```

4. **Memory Issues**
   ```bash
   # Increase memory limit
   docker-compose exec fusion-scanner free -h
   # Edit docker-compose.yml to increase memory
   ```

### Debug Mode

```bash
# Enable debug logging
docker-compose exec fusion-scanner sh -c 'echo "LOG_LEVEL=debug" >> /app/.env'
docker-compose restart fusion-scanner

# View debug logs
docker-compose logs -f fusion-scanner
```

### Clean Reset

```bash
# Complete cleanup and restart
docker-compose down -v
docker system prune -f
npm run docker:up
```

## 📚 Advanced Configuration

### Custom Nuclei Templates

```bash
# Add custom templates
docker-compose exec fusion-scanner mkdir -p /app/nuclei-templates/custom
# Copy templates to the container
docker cp custom-template.yaml fusion-scanner-app:/app/nuclei-templates/custom/
```

### Environment Profiles

```bash
# Development
cp .env.docker .env.development

# Production
cp .env.docker .env.production
# Edit with production settings

# Load specific environment
docker-compose --env-file .env.production up -d
```

## 🚀 Deployment to Cloud

### Docker Hub

```bash
# Build and push
docker build -f Dockerfile.preconfigured -t youruser/fusion-scanner .
docker push youruser/fusion-scanner

# Run from Docker Hub
docker run -p 8080:8080 youruser/fusion-scanner
```

### Cloud Platforms

- **AWS ECS**: Use provided docker-compose files
- **Google Cloud Run**: See `GOOGLE_CLOUD.md`
- **Azure Container Instances**: Compatible with basic deployment
- **DigitalOcean Apps**: Use Dockerfile.preconfigured

## 📞 Support

For help with Docker deployment:

- 📖 Check this documentation
- 🐛 View container logs: `docker-compose logs -f`
- 🔧 Debug health: `curl localhost:8080/api/health`
- 💬 Open an issue with logs and configuration

---

**🎉 You're all set!** The application should now be running with all features pre-configured and ready to use.
