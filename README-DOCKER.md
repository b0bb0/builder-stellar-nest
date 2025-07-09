# 🛡️ AI-Powered Vulnerability Assessment Platform - Docker Deployment

Complete Docker deployment for the AI-powered vulnerability assessment platform featuring Scanner Dashboard, Advanced Assessment Platform, Security Center, and Interactive Vulnerability Network.

## 🚀 Quick Start

```bash
# Clone and deploy in one command
git clone <repository>
cd vulnerability-assessment-platform
./deploy-docker.sh
```

**Platform will be available at:**

- 🌐 **Main Interface**: http://localhost
- 🔌 **WebSocket**: ws://localhost:8081
- 💾 **Database Admin**: http://localhost:8082 (optional)

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available
- 10GB+ disk space

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │────│ Vuln Scanner    │────│     Redis       │
│   (Port 80/443) │    │ (Port 8080)     │    │   (Cache)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │   (Persistent)  │
                       └─────────────────┘
```

## 🔧 Services

### Core Services

- **vulnerability-scanner**: Main application with all scanning capabilities
- **redis**: Caching and session management
- **nginx**: Reverse proxy with SSL termination (optional)

### Optional Services

- **db-admin**: SQLite database administration interface
- **watchtower**: Automatic container updates

## 🎯 Features Included

### 🖥️ User Interfaces

- **Scanner Dashboard**: Main vulnerability scanning interface
- **Advanced Assessment**: Comprehensive security analysis platform
- **Security Center**: AI-powered dashboard with metrics and insights
- **Interactive Vulnerability Network**: Animated threat visualization

### 🔍 Scanning Capabilities

- **Nuclei**: 3000+ vulnerability templates
- **Nmap**: Network discovery and port scanning
- **Subfinder**: Subdomain enumeration
- **Custom AI Analysis**: Machine learning threat detection

### 📊 Real-time Features

- **WebSocket Integration**: Live scan progress and updates
- **Animated Visualizations**: Moving vulnerability network maps
- **Dynamic Dashboards**: Real-time security metrics
- **Progressive Scan Results**: Instant vulnerability discovery

## 🛠️ Management Commands

```bash
# Deployment
./deploy-docker.sh deploy     # Full deployment (default)
./deploy-docker.sh start      # Start services
./deploy-docker.sh stop       # Stop services
./deploy-docker.sh restart    # Restart services

# Monitoring
./deploy-docker.sh logs       # Follow logs
./deploy-docker.sh status     # Service status

# Maintenance
./deploy-docker.sh backup     # Create backup
./deploy-docker.sh update     # Update platform
./deploy-docker.sh clean      # Remove everything
```

## 🔐 Security Configuration

### Environment Variables (.env.production)

```bash
# Security Secrets (CHANGE IN PRODUCTION!)
SESSION_SECRET=your-secure-session-secret
JWT_SECRET=your-secure-jwt-secret

# Scanner Performance
MAX_CONCURRENT_SCANS=5
NUCLEI_TIMEOUT=600
NUCLEI_RATE_LIMIT=150

# AI Configuration
AI_ENABLED=true
AI_CONFIDENCE_THRESHOLD=0.85
```

### Rate Limiting

- API calls: 1000 requests per 15 minutes
- Scan requests: 1 scan per second per IP
- WebSocket connections: 1000 concurrent

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale vulnerability scanners
docker compose -f docker-compose.prod.yml up -d --scale vulnerability-scanner=3

# Scale with load balancer
docker compose --profile proxy up -d
```

### Resource Limits

```yaml
deploy:
  resources:
    limits:
      memory: 2G
      cpus: "1.0"
    reservations:
      memory: 512M
      cpus: "0.5"
```

## 💾 Data Persistence

### Volumes

- `vuln_data`: Scan results and database
- `vuln_logs`: Application logs
- `vuln_reports`: Generated reports
- `nuclei_templates`: Vulnerability signatures
- `redis_data`: Cache and sessions

### Backup & Restore

```bash
# Create backup
./deploy-docker.sh backup

# Restore from backup
docker run --rm -v vuln_data:/data -v ./backups/backup-name:/backup alpine \
  tar xzf /backup/data.tar.gz -C /data
```

## 🔧 Development Mode

```bash
# Start development environment
docker-compose up -d

# Development with hot reload
docker-compose -f docker-compose.yml up -d
```

## 🌐 SSL/HTTPS Setup

1. **Enable Nginx profile:**

```bash
docker compose --profile proxy up -d
```

2. **Add SSL certificates:**

```bash
# Copy certificates
cp your-cert.pem ssl_certs/cert.pem
cp your-key.pem ssl_certs/key.pem

# Update nginx.conf (uncomment SSL section)
```

3. **Use Let's Encrypt:**

```bash
# Automatic SSL with Certbot
docker run --rm -v ssl_certs:/etc/letsencrypt certbot/certbot \
  certonly --standalone -d yourdomain.com
```

## 📊 Monitoring

### Health Checks

- **Application**: `http://localhost/api/health`
- **Database**: Built-in SQLite connectivity check
- **Redis**: Redis ping command
- **WebSocket**: Connection test endpoint

### Logs

```bash
# Application logs
docker compose logs -f vulnerability-scanner

# All services
docker compose logs -f

# Real-time monitoring
docker stats
```

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**

```bash
# Check port usage
sudo netstat -tlnp | grep :80

# Use different ports
HOST_PORT=8080 docker compose up -d
```

**Memory issues:**

```bash
# Check memory usage
docker stats --no-stream

# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory
```

**Permission errors:**

```bash
# Fix volume permissions
sudo chown -R 1001:1001 ./data ./logs
```

### Debug Mode

```bash
# Enable debug logging
echo "LOG_LEVEL=debug" >> .env.production
docker compose restart
```

## 🔄 Updates

### Automatic Updates

```bash
# Enable automatic updates
docker compose --profile auto-update up -d
```

### Manual Updates

```bash
# Update to latest version
./deploy-docker.sh update

# Update specific service
docker compose pull vulnerability-scanner
docker compose up -d vulnerability-scanner
```

## 🧪 Testing

```bash
# Run tests in container
docker compose exec vulnerability-scanner npm test

# Load testing
curl -X POST http://localhost/api/scan \
  -H "Content-Type: application/json" \
  -d '{"target": {"url": "https://example.com"}}'
```

## 📦 Production Deployment Checklist

- [ ] Update security secrets in `.env.production`
- [ ] Configure SSL certificates
- [ ] Set up proper backup schedule
- [ ] Configure monitoring and alerting
- [ ] Review resource limits
- [ ] Test disaster recovery procedures
- [ ] Configure firewall rules
- [ ] Set up log rotation
- [ ] Configure email notifications
- [ ] Test automatic updates

## 🆘 Support

For issues and support:

1. Check logs: `./deploy-docker.sh logs`
2. Verify health: `curl http://localhost/api/health`
3. Review configuration: `./deploy-docker.sh status`
4. Restart services: `./deploy-docker.sh restart`

## 📄 License

AI-Powered Vulnerability Assessment Platform - Production Ready Docker Deployment
