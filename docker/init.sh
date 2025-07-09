#!/bin/bash

# Fusion Scanner Initialization Script
# ====================================

set -e

echo "🔧 Initializing Fusion Scanner..."

# Create directories
mkdir -p /app/data /app/logs /app/config /app/nuclei-templates

# Set permissions
chmod 755 /app/data /app/logs /app/config
chmod 644 /app/config/* 2>/dev/null || true

# Initialize database with sample data
if [ ! -f "/app/data/scanner.db" ]; then
    echo "📊 Creating database with sample data..."
    sqlite3 /app/data/scanner.db < /app/docker/init-database.sql
    echo "✅ Database initialized"
else
    echo "ℹ️  Database already exists"
fi

# Create default configuration if not exists
if [ ! -f "/app/.env" ]; then
    echo "⚙️  Creating default environment configuration..."
    cp /app/docker/config/default.env /app/.env
    echo "✅ Environment configuration created"
fi

# Check Nuclei templates
if [ -d "/app/nuclei-templates" ] && [ "$(ls -A /app/nuclei-templates)" ]; then
    echo "✅ Nuclei templates found"
else
    echo "📥 Downloading Nuclei templates..."
    nuclei -update-templates -templates-directory /app/nuclei-templates || {
        echo "⚠️  Failed to download templates, using default configuration"
    }
fi

# Create log files
touch /app/logs/application.log
touch /app/logs/error.log
touch /app/logs/access.log

echo "🎉 Initialization complete!"
