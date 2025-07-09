#!/bin/bash
# Simple deployment monitoring script

HEALTH_URL="http://localhost:8080/api/health"
LOG_FILE="deployment-monitor.log"

while true; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if curl -s "$HEALTH_URL" > /dev/null 2>&1; then
        echo "[$timestamp] ✅ Application is healthy" >> "$LOG_FILE"
    else
        echo "[$timestamp] ❌ Application health check failed" >> "$LOG_FILE"
    fi
    
    sleep 60
done
