#!/bin/bash

# Docker Status Dashboard
# Provides comprehensive status information about the Docker environment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Function to print section headers
print_header() {
    echo -e "\n${PURPLE}================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_subheader() {
    echo -e "\n${CYAN}--- $1 ---${NC}"
}

# Function to check service status
check_service_status() {
    local service=$1
    local url=$2
    
    if curl -f "$url" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $service is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ $service is not responding${NC}"
        return 1
    fi
}

# Function to get container resource usage
get_container_stats() {
    echo -e "${BLUE}Container Resource Usage:${NC}"
    if command -v docker &> /dev/null; then
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" 2>/dev/null | grep -E "(luminous|CONTAINER)" || echo "No containers running"
    else
        echo "Docker not available"
    fi
}

# Function to show container status
show_container_status() {
    echo -e "${BLUE}Container Status:${NC}"
    if command -v docker-compose &> /dev/null; then
        docker-compose ps 2>/dev/null || echo "No docker-compose containers found"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null 2>&1; then
        docker compose ps 2>/dev/null || echo "No docker compose containers found"
    else
        echo "Docker Compose not available"
    fi
}

# Function to show volume information
show_volume_info() {
    echo -e "${BLUE}Volume Information:${NC}"
    if command -v docker &> /dev/null; then
        docker volume ls 2>/dev/null | grep -E "(scanner_|DRIVER)" || echo "No volumes found"
        
        echo -e "\n${BLUE}Volume Usage:${NC}"
        docker system df -v 2>/dev/null | grep -A 20 "Local Volumes:" | grep -E "(scanner_|SIZE)" || echo "Volume usage information not available"
    else
        echo "Docker not available"
    fi
}

# Function to check application health
check_application_health() {
    print_subheader "Application Health Checks"
    
    check_service_status "Main Application" "http://localhost:8080/api/health"
    check_service_status "Database Admin" "http://localhost:8082" || echo -e "${YELLOW}ℹ️  Database admin may not be enabled${NC}"
    
    # Check if ports are accessible
    echo -e "\n${BLUE}Port Accessibility:${NC}"
    
    if nc -z localhost 8080 2>/dev/null; then
        echo -e "${GREEN}✅ Port 8080 (HTTP) is accessible${NC}"
    else
        echo -e "${RED}❌ Port 8080 (HTTP) is not accessible${NC}"
    fi
    
    if nc -z localhost 8081 2>/dev/null; then
        echo -e "${GREEN}✅ Port 8081 (WebSocket) is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Port 8081 (WebSocket) is not accessible${NC}"
    fi
    
    if nc -z localhost 8082 2>/dev/null; then
        echo -e "${GREEN}✅ Port 8082 (DB Admin) is accessible${NC}"
    else
        echo -e "${YELLOW}ℹ️  Port 8082 (DB Admin) is not accessible (may be disabled)${NC}"
    fi
}

# Function to show recent logs
show_recent_logs() {
    print_subheader "Recent Application Logs"
    if command -v docker-compose &> /dev/null; then
        echo -e "${BLUE}Last 10 log entries:${NC}"
        docker-compose logs --tail=10 luminous-flow-dev 2>/dev/null || echo "No logs available"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null 2>&1; then
        echo -e "${BLUE}Last 10 log entries:${NC}"
        docker compose logs --tail=10 luminous-flow-dev 2>/dev/null || echo "No logs available"
    else
        echo "Docker Compose not available"
    fi
}

# Function to show environment information
show_environment_info() {
    print_subheader "Environment Information"
    
    echo -e "${BLUE}Environment Files:${NC}"
    [ -f .env ] && echo -e "${GREEN}✅ .env exists${NC}" || echo -e "${RED}❌ .env missing${NC}"
    [ -f .env.docker ] && echo -e "${GREEN}✅ .env.docker exists${NC}" || echo -e "${YELLOW}⚠️  .env.docker missing${NC}"
    [ -f .env.production ] && echo -e "${GREEN}✅ .env.production exists${NC}" || echo -e "${YELLOW}ℹ️  .env.production missing${NC}"
    
    echo -e "\n${BLUE}Docker Files:${NC}"
    [ -f Dockerfile ] && echo -e "${GREEN}✅ Dockerfile exists${NC}" || echo -e "${RED}❌ Dockerfile missing${NC}"
    [ -f Dockerfile.dev ] && echo -e "${GREEN}✅ Dockerfile.dev exists${NC}" || echo -e "${YELLOW}⚠️  Dockerfile.dev missing${NC}"
    [ -f docker-compose.yml ] && echo -e "${GREEN}✅ docker-compose.yml exists${NC}" || echo -e "${RED}❌ docker-compose.yml missing${NC}"
    [ -f docker-compose.prod.yml ] && echo -e "${GREEN}✅ docker-compose.prod.yml exists${NC}" || echo -e "${YELLOW}⚠️  docker-compose.prod.yml missing${NC}"
    
    echo -e "\n${BLUE}Helper Scripts:${NC}"
    [ -f docker-dev.sh ] && echo -e "${GREEN}✅ docker-dev.sh exists${NC}" || echo -e "${YELLOW}⚠️  docker-dev.sh missing${NC}"
    [ -f setup-docker.sh ] && echo -e "${GREEN}✅ setup-docker.sh exists${NC}" || echo -e "${YELLOW}⚠️  setup-docker.sh missing${NC}"
    [ -f docker-quick-start.sh ] && echo -e "${GREEN}✅ docker-quick-start.sh exists${NC}" || echo -e "${YELLOW}⚠️  docker-quick-start.sh missing${NC}"
}

# Function to show system information
show_system_info() {
    print_subheader "System Information"
    
    echo -e "${BLUE}Docker Version:${NC}"
    if command -v docker &> /dev/null; then
        docker --version 2>/dev/null || echo "Docker version not available"
    else
        echo "Docker not installed or not accessible"
    fi
    
    echo -e "\n${BLUE}Docker Compose Version:${NC}"
    if command -v docker-compose &> /dev/null; then
        docker-compose --version 2>/dev/null || echo "Docker Compose version not available"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null 2>&1; then
        docker compose version 2>/dev/null || echo "Docker Compose version not available"
    else
        echo "Docker Compose not installed or not accessible"
    fi
    
    echo -e "\n${BLUE}System Resources:${NC}"
    echo "Memory: $(free -h | awk 'NR==2{printf "%.1f/%.1f GB (%.0f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')"
    echo "Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')"
    echo "Load: $(uptime | awk -F'load average:' '{print $2}')"
}

# Function to show quick actions
show_quick_actions() {
    print_subheader "Quick Actions"
    
    echo -e "${BLUE}Available Commands:${NC}"
    echo "  ./docker-quick-start.sh     - Quick start development environment"
    echo "  ./docker-dev.sh dev         - Start development with logs"
    echo "  ./docker-dev.sh logs        - View live logs"
    echo "  ./docker-dev.sh stop        - Stop all containers"
    echo "  ./docker-dev.sh restart     - Restart containers"
    echo "  ./docker-dev.sh status      - Detailed status information"
    echo "  ./docker-dev.sh clean       - Clean up resources"
    echo ""
    echo -e "${BLUE}Direct Access:${NC}"
    echo "  docker-compose exec luminous-flow-dev bash  - Access container shell"
    echo "  docker-compose logs -f                      - Follow logs"
    echo "  docker-compose ps                           - Show containers"
}

# Main dashboard
main() {
    clear
    print_header "🐳 Luminous Flow Docker Dashboard"
    
    echo -e "${CYAN}Generated at: $(date)${NC}"
    
    show_environment_info
    show_system_info
    show_container_status
    get_container_stats
    show_volume_info
    check_application_health
    show_recent_logs
    show_quick_actions
    
    echo -e "\n${GREEN}Dashboard complete!${NC}"
    echo -e "${YELLOW}💡 Tip: Run this script regularly to monitor your Docker environment${NC}"
}

# Handle command line arguments
case "${1:-main}" in
    health)
        check_application_health
        ;;
    logs)
        show_recent_logs
        ;;
    resources)
        get_container_stats
        show_volume_info
        ;;
    env)
        show_environment_info
        ;;
    system)
        show_system_info
        ;;
    *)
        main
        ;;
esac
