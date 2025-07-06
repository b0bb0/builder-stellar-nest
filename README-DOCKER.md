# 🐳 Docker Environment for Luminous Flow Scanner

A comprehensive Docker setup for the Luminous Flow security scanner application with development and production environments.

## 🚀 Quick Start (60 seconds)

```bash
# 1. Make scripts executable (one-time setup)
chmod +x *.sh

# 2. Quick start development environment
./docker-quick-start.sh

# 3. Access your application
# 🌐 Web: http://localhost:8080
# 🔌 WebSocket: ws://localhost:8081
# 🗄️ DB Admin: http://localhost:8082
```

## 📁 Docker Files Overview

| File                      | Purpose                 | Usage                          |
| ------------------------- | ----------------------- | ------------------------------ |
| `Dockerfile`              | Production build        | Multi-stage optimized image    |
| `Dockerfile.dev`          | Development build       | Hot reload + dev tools         |
| `docker-compose.yml`      | Development environment | Local development with volumes |
| `docker-compose.prod.yml` | Production environment  | Production deployment          |
| `docker-dev.sh`           | Development helper      | Easy dev commands              |
| `docker-quick-start.sh`   | Instant setup           | One-command start              |
| `docker-status.sh`        | Status dashboard        | Comprehensive monitoring       |
| `setup-docker.sh`         | Initial setup           | Automated environment setup    |

## 🛠️ Development Workflow

### Method 1: Quick Start (Recommended for beginners)

```bash
./docker-quick-start.sh
```

### Method 2: Full Development Environment

```bash
# Initial setup (first time only)
./setup-docker.sh

# Daily development
./docker-dev.sh dev          # Start with logs
./docker-dev.sh logs         # View logs
./docker-dev.sh exec bash    # Access container
./docker-dev.sh stop         # Stop containers
```

### Method 3: Manual Control

```bash
# Build and start
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📊 Monitoring & Status

### Comprehensive Dashboard

```bash
./docker-status.sh           # Full dashboard
./docker-status.sh health    # Health checks only
./docker-status.sh resources # Resource usage
```

### Quick Checks

```bash
./docker-dev.sh status       # Container status
curl http://localhost:8080/api/health  # Health endpoint
docker-compose ps            # Container list
```

## 🔧 Configuration

### Environment Files

| File              | Purpose                  | Required     |
| ----------------- | ------------------------ | ------------ |
| `.env`            | Development config       | ✅ Yes       |
| `.env.docker`     | Docker-specific settings | 📋 Optional  |
| `.env.production` | Production config        | 🏭 Prod only |

### Key Configuration Options

```bash
# .env file
NODE_ENV=development
PORT=8080
DATABASE_URL=./data/scanner.db

# AI Features (optional)
OPENAI_API_KEY=your_key_here
AI_ENABLED=true

# Scanner Settings
MAX_CONCURRENT_SCANS=5
NUCLEI_TIMEOUT=300
```

## 🏭 Production Deployment

### Quick Production Setup

```bash
# 1. Configure production environment
cp .env.example .env.production
nano .env.production  # Edit with production settings

# 2. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 3. Verify
curl http://your-domain.com/api/health
```

### Production Checklist

- [ ] Configure `.env.production` with real values
- [ ] Set up SSL certificates (if using Nginx)
- [ ] Configure domain name and CORS
- [ ] Set secure API keys
- [ ] Configure log rotation
- [ ] Set up monitoring
- [ ] Configure backups

## 🗄️ Data Management

### Backup & Restore

```bash
# Create backup
./docker-dev.sh backup

# Restore backup
./docker-dev.sh restore backup-20231201-143022.tar.gz

# Manual backup
docker run --rm -v scanner_data_dev:/data -v $(pwd):/backup alpine tar czf /backup/manual-backup.tar.gz -C /data .
```

### Database Access

```bash
# SQLite Web Interface (development)
docker-compose --profile tools up -d
# Visit: http://localhost:8082

# Direct database access
docker-compose exec luminous-flow-dev sqlite3 /app/data/development.db
```

## 🔒 Security Features

### Container Security

- ✅ Non-root user execution
- ✅ Minimal attack surface (Alpine Linux)
- ✅ Multi-stage builds
- ✅ Security-focused dependencies
- ✅ Resource limits

### Network Security

- ✅ Isolated Docker networks
- ✅ CORS configuration
- ✅ Health checks
- ✅ Port isolation

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Application won't start

```bash
# Check logs
./docker-dev.sh logs

# Rebuild containers
./docker-dev.sh clean
./docker-dev.sh build
```

#### Port conflicts

```bash
# Check what's using port 8080
lsof -i :8080

# Or use different port
HOST_PORT=8081 docker-compose up -d
```

#### Database issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

#### Out of memory

```bash
# Check memory usage
docker stats

# Free up memory
docker system prune -f
```

#### Nuclei templates not found

```bash
# Update templates
./docker-dev.sh update-templates

# Or rebuild
docker-compose build --no-cache
```

### Debug Mode

```bash
# Enable debug logging
echo "LOG_LEVEL=debug" >> .env
./docker-dev.sh restart
```

### Performance Issues

```bash
# Monitor resources
./docker-status.sh resources

# Check system resources
free -h
df -h
```

## 📈 Performance Optimization

### Development

- Use volume mounts for fast file changes
- Anonymous volumes for node_modules
- Debug logging for troubleshooting

### Production

- Multi-stage builds reduce image size
- Production dependencies only
- Optimized Dockerfile layers
- Health checks for reliability

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t luminous-flow .

      - name: Run tests
        run: |
          docker-compose up -d
          # Add your tests here
          docker-compose down
```

### Automated Deployment Script

```bash
#!/bin/bash
# deploy.sh
git pull
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
docker system prune -f
```

## 📚 Advanced Usage

### Multiple Environments

```bash
# Development
docker-compose up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Custom Networks

```bash
# Create custom network
docker network create luminous-network

# Use in compose
networks:
  default:
    external: true
    name: luminous-network
```

### Health Monitoring

```bash
# Custom health check
./docker-status.sh health

# Automated monitoring
while true; do
  ./docker-status.sh health
  sleep 60
done
```

## 🎯 Best Practices

### Development

1. **Use hot reload** for faster development
2. **Volume mount source code** for live editing
3. **Keep logs visible** during development
4. **Regular backups** of development data

### Production

1. **Multi-stage builds** for smaller images
2. **Health checks** for monitoring
3. **Resource limits** to prevent issues
4. **Regular updates** for security

### Maintenance

1. **Regular cleanup** with `docker system prune`
2. **Monitor disk usage** with `docker system df`
3. **Update base images** regularly
4. **Log rotation** for long-running containers

## 🆘 Getting Help

### Self-Help

1. Check status: `./docker-status.sh`
2. View logs: `./docker-dev.sh logs`
3. Restart: `./docker-dev.sh restart`
4. Clean rebuild: `./docker-dev.sh clean && ./docker-dev.sh build`

### Support Information

When seeking help, include:

- Output of `./docker-status.sh`
- Container logs
- Your `.env` file (with secrets removed)
- Docker and system information

## 📖 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Container Security Guide](https://docs.docker.com/engine/security/)

---

## 🎉 You're All Set!

Your Docker environment is now configured and ready for development. Start with the quick start command and explore the various tools provided.

**Happy coding! 🚀**
