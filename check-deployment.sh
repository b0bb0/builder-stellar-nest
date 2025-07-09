#!/bin/bash

# Deployment Status Checker for LUMINOUS FLOW
# Quick status validation and health monitoring

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}🛡️  LUMINOUS FLOW - Status Monitor${NC}"
    echo -e "${PURPLE}🔍 Deployment Health Check${NC}"
    echo -e "${PURPLE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if application is deployed and healthy
check_deployment_status() {
    print_info "Checking deployment status..."
    
    # Check if production process is running
    if pgrep -f "node.*build.mjs" > /dev/null; then
        local pid=$(pgrep -f "node.*build.mjs")
        print_success "Production server is running (PID: $pid)"
    else
        print_error "Production server is not running"
        return 1
    fi
    
    # Check API health
    if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
        local health_response=$(curl -s http://localhost:8080/api/health)
        local status=$(echo "$health_response" | jq -r '.status // "unknown"')
        local mode=$(echo "$health_response" | jq -r '.mode // "unknown"')
        
        if [ "$status" = "ok" ]; then
            print_success "API is healthy (mode: $mode)"
        else
            print_error "API health check failed (status: $status)"
            return 1
        fi
    else
        print_error "API is not responding"
        return 1
    fi
    
    # Check web interface
    if curl -s http://localhost:8080/ > /dev/null 2>&1; then
        print_success "Web interface is accessible"
    else
        print_error "Web interface is not accessible"
        return 1
    fi
    
    return 0
}

# Show detailed deployment information
show_deployment_info() {
    print_info "Deployment Information:"
    echo ""
    
    # Show process information
    if pgrep -f "node.*build.mjs" > /dev/null; then
        local pid=$(pgrep -f "node.*build.mjs")
        print_info "Process Details:"
        ps -p $pid -o pid,ppid,cmd,etime,pmem,pcpu --no-headers
        echo ""
    fi
    
    # Show API endpoints
    print_info "Available Endpoints:"
    echo "  🌐 Web Interface: http://localhost:8080"
    echo "  🔧 API Health: http://localhost:8080/api/health"
    echo "  📡 API Ping: http://localhost:8080/api/ping"
    echo "  🔍 Scanner Health: http://localhost:8080/api/v2/scanner/health"
    echo ""
    
    # Show system resources
    print_info "System Resources:"
    echo "  Memory Usage: $(free -h | awk 'NR==2{printf "%.1fG/%.1fG (%.0f%%)", $3/1024, $2/1024, $3*100/$2}')"
    echo "  Disk Usage: $(df -h . | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')"
    echo "  Load Average: $(uptime | awk -F'load average:' '{ print $2 }')"
    echo ""
}

# Test API functionality
test_api_functionality() {
    print_info "Testing API functionality..."
    
    # Test health endpoint
    local health_result=$(curl -s http://localhost:8080/api/health)
    if echo "$health_result" | jq . > /dev/null 2>&1; then
        print_success "Health endpoint returns valid JSON"
    else
        print_error "Health endpoint returns invalid response"
        return 1
    fi
    
    # Test ping endpoint
    if curl -s http://localhost:8080/api/ping | grep -q "LUMINOUS FLOW"; then
        print_success "Ping endpoint is working"
    else
        print_error "Ping endpoint failed"
        return 1
    fi
    
    # Test scanner health endpoint
    if curl -s http://localhost:8080/api/v2/scanner/health | jq . > /dev/null 2>&1; then
        print_success "Scanner health endpoint is working"
    else
        print_error "Scanner health endpoint failed"
        return 1
    fi
    
    return 0
}

# Show monitoring commands
show_monitoring_commands() {
    print_info "Monitoring Commands:"
    echo ""
    echo "📊 Real-time logs:"
    echo "  tail -f deployment.log"
    echo ""
    echo "🔄 Restart deployment:"
    echo "  ./detect-and-deploy.sh --force"
    echo ""
    echo "⏹️  Stop deployment:"
    echo "  pkill -f 'node.*build.mjs'"
    echo ""
    echo "📈 Start monitoring:"
    echo "  ./monitor-deployment.sh &"
    echo ""
}

# Main execution
main() {
    print_header
    
    if check_deployment_status; then
        echo ""
        show_deployment_info
        
        if test_api_functionality; then
            echo ""
            print_success "🎉 All systems operational!"
            print_info "LUMINOUS FLOW is fully deployed and healthy"
        else
            echo ""
            print_warning "Deployment is running but some API tests failed"
        fi
    else
        echo ""
        print_error "Deployment is not healthy or not running"
        print_info "Run './detect-and-deploy.sh' to deploy the application"
        exit 1
    fi
    
    echo ""
    show_monitoring_commands
}

# Handle command line arguments
case "${1:-status}" in
    "status"|"")
        main
        ;;
    "quick")
        print_header
        if check_deployment_status; then
            print_success "🎉 Deployment is healthy"
        else
            print_error "Deployment issues detected"
            exit 1
        fi
        ;;
    "api")
        print_header
        test_api_functionality
        ;;
    "help")
        print_header
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  status (default) - Full deployment status check"
        echo "  quick           - Quick health check only"
        echo "  api             - Test API functionality only"
        echo "  help            - Show this help message"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac