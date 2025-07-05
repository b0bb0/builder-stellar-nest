# 🛡️ LUMINOUS FLOW - Production Deployment Guide

## 📥 Download & Setup

### 1. Clone the Repository

```bash
# Download the application
git clone <your-repo-url> luminous-flow
cd luminous-flow

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the configuration file
nano .env
```

## ⚙️ Production Environment Setup

### 1. Environment Variables (.env)

```bash
# Server Configuration
PORT=8080
NODE_ENV=production

# Database Configuration
DATABASE_URL=./data/production.db

# Nuclei Scanner Configuration
NUCLEI_PATH=/usr/local/bin/nuclei
NUCLEI_TEMPLATES_PATH=/opt/nuclei-templates
NUCLEI_TIMEOUT=600
NUCLEI_RATE_LIMIT=100
NUCLEI_MAX_CONCURRENT=15

# AI Analysis (Optional - OpenAI integration)
AI_ENABLED=true
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4

# Security Configuration
MAX_SCAN_DURATION=3600
MAX_CONCURRENT_SCANS=3
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=50

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/scanner.log

# WebSocket Configuration
WS_ENABLED=true

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com
```

## 🔧 Nuclei Installation & Configuration

### Ubuntu/Debian Installation

```bash
# Method 1: Using Go (Recommended)
# Install Go first
sudo apt update
sudo apt install golang-go

# Install Nuclei
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Add Go bin to PATH
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc
source ~/.bashrc

# Verify installation
nuclei -version
```

### Alternative: Binary Installation

```bash
# Download latest release
curl -L https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_3.2.9_linux_amd64.zip -o nuclei.zip

# Extract and install
unzip nuclei.zip
sudo mv nuclei /usr/local/bin/
sudo chmod +x /usr/local/bin/nuclei

# Verify
nuclei -version
```

### Template Setup

```bash
# Create templates directory
sudo mkdir -p /opt/nuclei-templates

# Update templates (run as the app user)
nuclei -update-templates -templates-directory /opt/nuclei-templates

# Set permissions
sudo chown -R $USER:$USER /opt/nuclei-templates
```

## 🗃️ Database Configuration

### Automatic Setup

The application will automatically create the SQLite database and tables on first run.

### Manual Database Setup (Optional)

```bash
# Create data directory
mkdir -p ./data

# Set permissions
chmod 755 ./data
```

### Database Schema

The application automatically creates these tables:

- `scans` - Scan records and metadata
- `vulnerabilities` - Individual vulnerability findings
- `ai_analyses` - AI analysis results
- `scan_logs` - Detailed scan logging

## 🚀 Production Build & Deployment

### 1. Build the Application

```bash
# Build frontend and backend
npm run build

# The built files will be in:
# - dist/spa/ (frontend)
# - dist/server/ (backend)
```

### 2. Production Start

```bash
# Start production server
npm start

# Or run directly
node dist/server/node-build.mjs
```

### 3. Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start dist/server/node-build.mjs --name "luminous-flow"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

# Install system dependencies for Nuclei
RUN apk add --no-cache curl unzip

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Install Nuclei
RUN curl -L https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_3.2.9_linux_amd64.zip -o nuclei.zip && \
    unzip nuclei.zip && \
    mv nuclei /usr/local/bin/ && \
    chmod +x /usr/local/bin/nuclei && \
    rm nuclei.zip

# Create data and logs directories
RUN mkdir -p /app/data /app/logs /app/nuclei-templates

# Update Nuclei templates
RUN nuclei -update-templates -templates-directory /app/nuclei-templates

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  luminous-flow:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=/app/data/production.db
      - NUCLEI_PATH=/usr/local/bin/nuclei
      - NUCLEI_TEMPLATES_PATH=/app/nuclei-templates
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./nuclei-templates:/app/nuclei-templates
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🔒 Security Configuration

### 1. Firewall Setup

```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 8080  # Application
sudo ufw enable
```

### 2. SSL/TLS (Nginx Reverse Proxy)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## 📊 Monitoring & Logging

### 1. Log Rotation

```bash
# Add to /etc/logrotate.d/luminous-flow
/path/to/luminous-flow/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
```

### 2. Health Monitoring

```bash
# Add to crontab for health checks
*/5 * * * * curl -f http://localhost:8080/api/health > /dev/null 2>&1 || echo "Luminous Flow is down" | mail -s "Alert" admin@yourdomain.com
```

## 🔧 Maintenance

### Database Backup

```bash
# Backup database
sqlite3 ./data/production.db ".backup backup-$(date +%Y%m%d-%H%M%S).db"

# Automated backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/luminous-flow"
mkdir -p $BACKUP_DIR
sqlite3 ./data/production.db ".backup $BACKUP_DIR/scanner-$(date +%Y%m%d-%H%M%S).db"
find $BACKUP_DIR -name "scanner-*.db" -mtime +7 -delete
EOF

chmod +x backup.sh
```

### Template Updates

```bash
# Update Nuclei templates weekly
nuclei -update-templates -templates-directory /opt/nuclei-templates
```

## 🚨 Troubleshooting

### Common Issues

1. **Nuclei not found**

   ```bash
   which nuclei
   echo $PATH
   ```

2. **Database permission errors**

   ```bash
   chmod 755 ./data
   chown $USER:$USER ./data/production.db
   ```

3. **Port already in use**

   ```bash
   lsof -i :8080
   # Change PORT in .env file
   ```

4. **WebSocket connection fails**
   - Check firewall settings
   - Verify reverse proxy configuration
   - Ensure WS_ENABLED=true in .env

### Health Check Endpoints

- `GET /api/health` - Basic health check
- `GET /api/v2/scanner/health` - Detailed system status
- `GET /api/ping` - Simple connectivity test

## 📈 Performance Optimization

### 1. System Resources

- **Minimum**: 2 CPU cores, 4GB RAM
- **Recommended**: 4 CPU cores, 8GB RAM
- **Storage**: 20GB+ for templates and logs

### 2. Configuration Tuning

```bash
# Adjust in .env for your system
MAX_CONCURRENT_SCANS=2        # Lower for limited resources
NUCLEI_MAX_CONCURRENT=10      # Reduce for slower systems
NUCLEI_RATE_LIMIT=50          # Conservative rate limiting
```

## 🎯 Quick Start Commands

```bash
# Complete production setup
git clone <repo> luminous-flow && cd luminous-flow
cp .env.example .env
# Edit .env with your settings
npm install
npm run build
npm start
```

Your LUMINOUS FLOW vulnerability scanner is now ready for production! 🛡️🚀
