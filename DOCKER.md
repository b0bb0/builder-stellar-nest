# Docker Environment Configuration

This document provides comprehensive instructions for setting up and using Docker with the Luminous Flow Scanner application.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available for containers
- 10GB+ disk space for images and volumes

## 🏗️ Docker Architecture

### Container Structure

```
┌─────────────────────────────────────────┐
│              Docker Environment          │
├─────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐│
│  │  Luminous Flow  │  │   SQLite Web    ││
│  │   Application   │  │   (Optional)    ││
│  │                 │  │                 ││
│  │  Port: 8080     │  │  Port: 8082     ││
│  │  WS: 8081       │  │                 ││
│  └─────────────────┘  └─────────────────┘│
├─────────────────────────────────────────┤
│              Shared Volumes              │
│  • scanner_data (Database & Files)      │
│  • scanner_logs (Application Logs)      │
│  • nuclei_templates (Security Templates)│
└───────��─────────────────────────────────┘
```

### Available Docker Files

1. **`Dockerfile`** - Optimized production build with multi-stage
2. **`Dockerfile.dev`** - Development build with hot reload
3. **`docker-compose.yml`** - Development environment
4. **`docker-compose.prod.yml`** - Production environment

## 🚀 Quick Start

### Development Environment

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Start development environment
./docker-dev.sh dev

# 3. Access the application
# - Web UI: http://localhost:8080
# - WebSocket: ws://localhost:8081
# - DB Admin: http://localhost:8082 (if tools profile enabled)
```

### Production Environment

```bash
# 1. Configure production environment
cp .env.example .env.production
# Edit .env.production with production settings

# 2. Start production environment
docker-compose -f docker-compose.prod.yml up -d

# 3. Access the application
# - Web UI: http://localhost:8080 (or your domain)
```

## 🛠️ Development Workflow

### Using the Helper Script

The `docker-dev.sh` script provides convenient commands for development:

```bash
# Build containers
./docker-dev.sh build

# Start development environment
./docker-dev.sh dev

# View logs
./docker-dev.sh logs

# Execute commands in container
./docker-dev.sh exec npm install
./docker-dev.sh exec bash

# Stop containers
./docker-dev.sh stop

# Restart containers
./docker-dev.sh restart

# Show container status
./docker-dev.sh status

# Clean up everything
./docker-dev.sh clean

# Create data backup
./docker-dev.sh backup

# Restore from backup
./docker-dev.sh restore backup-20231201-143022.tar.gz

# Update Nuclei templates
./docker-dev.sh update-templates

# Run tests
./docker-dev.sh test
```

### Manual Docker Commands

If you prefer manual control:

```bash
# Build development image
docker-compose build

# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f luminous-flow-dev

# Execute commands
docker-compose exec luminous-flow-dev npm install
docker-compose exec luminous-flow-dev bash

# Stop environment
docker-compose down

# Remove volumes (⚠️ Data loss)
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables

Create and configure your `.env` file:

```bash
# Server Configuration
NODE_ENV=development
PORT=8080

# Database Configuration
DATABASE_URL=./data/scanner.db

# Nuclei Configuration
NUCLEI_PATH=/usr/local/bin/nuclei
NUCLEI_TEMPLATES_PATH=./nuclei-templates
NUCLEI_TIMEOUT=300
NUCLEI_RATE_LIMIT=150
NUCLEI_MAX_CONCURRENT=25

# AI Configuration (optional)
OPENAI_API_KEY=your_key_here
AI_MODEL=gpt-4
AI_ENABLED=true

# Security Configuration
MAX_SCAN_DURATION=3600
MAX_CONCURRENT_SCANS=5

# WebSocket Configuration
WS_ENABLED=true
WS_PORT=8081
```

### Docker-Specific Configuration

The `.env.docker` file contains Docker-specific settings:

```bash
# Container Configuration
CONTAINER_NAME=luminous-flow-dev
HOST_PORT=8080
WS_PORT=8081

# Volume Configuration
DATA_VOLUME=scanner_data_dev
LOGS_VOLUME=scanner_logs_dev
TEMPLATES_VOLUME=nuclei_templates_dev
```

### Profiles

Use Docker Compose profiles to control which services start:

```bash
# Start with database admin tool
docker-compose --profile tools up -d

# Start only main application
docker-compose up -d luminous-flow-dev
```

## 📊 Monitoring & Debugging

### Health Checks

The application includes built-in health checks:

```bash
# Check container health
docker-compose ps

# View health check logs
docker inspect luminous-flow-dev | grep -A 10 '"Health"'

# Manual health check
curl http://localhost:8080/api/health
```

### Logs

Access different types of logs:

```bash
# Application logs
docker-compose logs -f luminous-flow-dev

# System logs
docker-compose exec luminous-flow-dev tail -f /app/logs/scanner.log

# Nuclei logs
docker-compose exec luminous-flow-dev tail -f /app/logs/nuclei.log
```

### Resource Monitoring

Monitor resource usage:

```bash
# Real-time resource usage
docker stats

# Container details
./docker-dev.sh status

# Volume usage
docker system df
```

## 🗄️ Data Management

### Backup & Restore

#### Using Helper Script

```bash
# Create backup
./docker-dev.sh backup

# Restore backup
./docker-dev.sh restore backup-20231201-143022.tar.gz
```

#### Manual Backup

```bash
# Backup data volume
docker run --rm \
  -v scanner_data_dev:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/data-backup.tar.gz -C /data .

# Restore data volume
docker run --rm \
  -v scanner_data_dev:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/data-backup.tar.gz -C /data
```

### Database Access

#### Using SQLite Web (Development)

```bash
# Start with tools profile
docker-compose --profile tools up -d

# Access at http://localhost:8082
```

#### Direct Database Access

```bash
# Access SQLite directly
docker-compose exec luminous-flow-dev sqlite3 /app/data/development.db

# Export database
docker-compose exec luminous-flow-dev sqlite3 /app/data/development.db .dump > backup.sql
```

## 🏭 Production Deployment

### Docker Compose Production

```bash
# 1. Configure environment
cp .env.example .env.production
# Edit production settings

# 2. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 3. Verify deployment
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:8080/api/health
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml luminous-flow

# Verify deployment
docker stack services luminous-flow
```

### Kubernetes

```bash
# Convert docker-compose to k8s manifests
kompose convert -f docker-compose.prod.yml

# Deploy to Kubernetes
kubectl apply -f .
```

## 🔒 Security

### Container Security

- Containers run as non-root user (`luminous`)
- Minimal attack surface with Alpine Linux
- Read-only root filesystem where possible
- Resource limits configured

### Network Security

```bash
# Isolate containers
docker network create --driver bridge luminous-network

# Use custom network
docker-compose -f docker-compose.prod.yml up -d
```

### Secrets Management

```bash
# Use Docker secrets in production
echo "secret_api_key" | docker secret create openai_api_key -

# Reference in compose file
secrets:
  - openai_api_key
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
lsof -i :8080

# Use different port
HOST_PORT=8081 docker-compose up -d
```

#### Out of Memory

```bash
# Check memory usage
docker stats

# Increase memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G
```

#### Database Locked

```bash
# Stop all containers
docker-compose down

# Remove lock files
docker-compose exec luminous-flow-dev rm -f /app/data/*.db-wal /app/data/*.db-shm

# Restart
docker-compose up -d
```

#### Nuclei Templates Not Found

```bash
# Update templates manually
./docker-dev.sh update-templates

# Or rebuild container
docker-compose build --no-cache
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
echo "LOG_LEVEL=debug" >> .env

# Restart with debug logs
docker-compose up -d
docker-compose logs -f
```

### Performance Issues

```bash
# Check resource limits
docker-compose exec luminous-flow-dev cat /proc/meminfo
docker-compose exec luminous-flow-dev cat /proc/cpuinfo

# Monitor performance
docker stats --no-stream
```

## 📝 Best Practices

### Development

1. **Use volume mounts** for source code during development
2. **Enable hot reload** for faster development cycles
3. **Use profiles** to control which services start
4. **Regular backups** of development data

### Production

1. **Multi-stage builds** to minimize image size
2. **Health checks** for container monitoring
3. **Resource limits** to prevent resource exhaustion
4. **Regular security updates** of base images

### Maintenance

1. **Regular image updates**:

   ```bash
   docker-compose pull
   docker-compose up -d
   ```

2. **Clean up unused resources**:

   ```bash
   docker system prune -f
   docker volume prune -f
   ```

3. **Monitor logs and metrics**:
   ```bash
   # Log rotation
   docker-compose exec luminous-flow-dev logrotate /etc/logrotate.conf
   ```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Docker Build

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
        run: docker run --rm luminous-flow npm test
```

### Automated Deployment

```bash
# Deploy script
#!/bin/bash
git pull
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
docker system prune -f
```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Security Best Practices](https://docs.docker.com/engine/security/)

## 🆘 Support

If you encounter issues:

1. Check the logs: `./docker-dev.sh logs`
2. Verify configuration: `./docker-dev.sh status`
3. Restart containers: `./docker-dev.sh restart`
4. Clean and rebuild: `./docker-dev.sh clean && ./docker-dev.sh build`

For persistent issues, create a support ticket with:

- Container logs
- System information (`docker info`)
- Configuration files (sanitized)
