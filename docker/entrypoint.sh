#!/bin/bash
set -e

# Fusion Scanner Docker Entrypoint
# =================================

echo "🚀 Starting Fusion Scanner..."
echo "📅 $(date)"
echo "🏷️  Version: ${APP_VERSION:-2.0}"
echo "🌍 Environment: ${NODE_ENV:-production}"

# Function to print colored output
print_status() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Load environment configuration
if [ -f /app/.env ]; then
    print_status "Loading environment configuration..."
    set -a
    source /app/.env
    set +a
else
    print_warning "No .env file found, using default settings"
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p /app/data /app/logs /app/config /app/nuclei-templates

# Set proper permissions
chmod 755 /app/data /app/logs /app/config
chmod 644 /app/.env 2>/dev/null || true

# Initialize database if it doesn't exist
if [ ! -f "/app/data/scanner.db" ]; then
    print_status "Initializing database..."
    if [ -f "/app/docker/init-database.sql" ]; then
        sqlite3 /app/data/scanner.db < /app/docker/init-database.sql
        print_success "Database initialized with sample data"
    else
        print_warning "Database initialization script not found"
    fi
else
    print_status "Database already exists, skipping initialization"
fi

# Update Nuclei templates if needed
if [ "${UPDATE_NUCLEI_TEMPLATES:-false}" = "true" ]; then
    print_status "Updating Nuclei templates..."
    nuclei -update-templates -templates-directory /app/nuclei-templates || {
        print_warning "Failed to update Nuclei templates, using existing ones"
    }
else
    print_status "Skipping Nuclei template update (set UPDATE_NUCLEI_TEMPLATES=true to enable)"
fi

# Check Nuclei installation
if command -v nuclei >/dev/null 2>&1; then
    NUCLEI_VERSION=$(nuclei -version 2>/dev/null | head -n1 || echo "unknown")
    print_success "Nuclei installed: $NUCLEI_VERSION"
else
    print_warning "Nuclei not found, some scanning features may not work"
fi

# Check required tools
print_status "Checking system requirements..."

# Check Node.js
NODE_VERSION=$(node --version 2>/dev/null || echo "unknown")
print_status "Node.js version: $NODE_VERSION"

# Check available memory
if [ -f /proc/meminfo ]; then
    TOTAL_MEM=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    TOTAL_MEM_GB=$((TOTAL_MEM / 1024 / 1024))
    print_status "Available memory: ${TOTAL_MEM_GB}GB"
    
    if [ $TOTAL_MEM_GB -lt 1 ]; then
        print_warning "Low memory detected. Consider increasing container memory allocation"
    fi
fi

# Check disk space
DISK_USAGE=$(df /app | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    print_warning "Disk usage is high: ${DISK_USAGE}%"
fi

# Perform health checks
print_status "Performing pre-start health checks..."

# Check if port is available
if netstat -tuln 2>/dev/null | grep -q ":${PORT:-8080} "; then
    print_error "Port ${PORT:-8080} is already in use"
    exit 1
fi

# Validate configuration files
if [ -f "/app/config/app-config.json" ]; then
    if ! node -e "JSON.parse(require('fs').readFileSync('/app/config/app-config.json', 'utf8'))" 2>/dev/null; then
        print_error "Invalid JSON in app-config.json"
        exit 1
    fi
    print_success "Configuration file validated"
else
    print_warning "App configuration file not found"
fi

# Set up log rotation if logrotate is available
if command -v logrotate >/dev/null 2>&1; then
    cat > /tmp/logrotate.conf << EOF
/app/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 scanner scanner
}
EOF
    print_status "Log rotation configured"
fi

# Set timezone if specified
if [ -n "${TZ}" ]; then
    export TZ
    print_status "Timezone set to: $TZ"
fi

# Display configuration summary
print_status "Configuration Summary:"
echo "  • Port: ${PORT:-8080}"
echo "  • Environment: ${NODE_ENV:-production}"
echo "  • Demo Mode: ${DEMO_MODE:-true}"
echo "  • Max Concurrent Scans: ${MAX_CONCURRENT_SCANS:-5}"
echo "  • WebSocket: ${WEBSOCKET_ENABLED:-true}"
echo "  • AI Analysis: ${AI_ANALYSIS_ENABLED:-false}"
echo "  • Database: ${DATABASE_PATH:-/app/data/scanner.db}"
echo "  • Logs: ${LOGS_PATH:-/app/logs}"

# Start the application based on the command
print_success "Starting application..."

# If the first argument is a flag (starts with -) or is empty, run the default command
if [ "${1#-}" != "$1" ] || [ $# -eq 0 ]; then
    print_status "Executing default command: npm start"
    exec npm start
fi

# Otherwise, execute the provided command
print_status "Executing custom command: $*"
exec "$@"
