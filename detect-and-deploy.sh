#!/bin/bash

# LUMINOUS FLOW - Deployment Detection and Auto-Configuration Script
# Detects undeployed applications and configures the best deployment method

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Global variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOYMENT_METHOD=""
DEPLOYMENT_STATUS=""
HEALTH_CHECK_URL=""

# Utility functions
print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}🛡️  LUMINOUS FLOW - Deployment Detector${NC}"
    echo -e "${PURPLE}🤖 Auto-Configuration System${NC}"
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

print_step() {
    echo -e "${CYAN}🔄 $1${NC}"
}

# System capability detection functions
check_docker() {
    print_step "Checking Docker availability..."
    
    if command -v docker &> /dev/null; then
        if docker info &> /dev/null; then
            print_success "Docker is available and running"
            return 0
        else
            print_warning "Docker is installed but not running"
            return 1
        fi
    else
        print_warning "Docker is not installed"
        return 1
    fi
}

check_kubernetes() {
    print_step "Checking Kubernetes availability..."
    
    if command -v kubectl &> /dev/null; then
        if kubectl cluster-info &> /dev/null; then
            print_success "Kubernetes cluster is accessible"
            return 0
        else
            print_warning "kubectl available but no cluster connection"
            return 1
        fi
    else
        print_warning "kubectl is not installed"
        return 1
    fi
}

check_node() {
    print_step "Checking Node.js environment..."
    
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        local node_version=$(node --version)
        local npm_version=$(npm --version)
        print_success "Node.js $node_version and npm $npm_version available"
        return 0
    else
        print_error "Node.js or npm not available"
        return 1
    fi
}

check_system_resources() {
    print_step "Checking system resources..."
    
    # Check available memory (in MB)
    local mem_available=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    local cpu_cores=$(nproc)
    local disk_available=$(df . | awk 'NR==2{print $4}')
    
    print_info "System Resources:"
    print_info "  - Available RAM: ${mem_available}MB"
    print_info "  - CPU Cores: ${cpu_cores}"
    print_info "  - Available Disk: ${disk_available}KB"
    
    # Minimum requirements check
    if [ "$mem_available" -gt 1024 ] && [ "$cpu_cores" -gt 1 ]; then
        print_success "System meets minimum requirements"
        return 0
    else
        print_warning "System may not meet minimum requirements"
        return 1
    fi
}

# Application state detection
detect_application_state() {
    print_step "Detecting current application state..."
    
    # Check if application is already running
    if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
        local health_response=$(curl -s http://localhost:8080/api/health)
        local app_mode=$(echo "$health_response" | jq -r '.mode // "unknown"')
        print_info "Application is running in $app_mode mode"
        
        if [ "$app_mode" = "development" ]; then
            print_warning "Application is only running in development mode"
            return 1
        else
            print_success "Application is running in production mode"
            return 0
        fi
    else
        print_warning "Application is not currently running"
        return 1
    fi
}

# Deployment method detection
detect_best_deployment_method() {
    print_step "Determining best deployment method..."
    
    local docker_available=false
    local k8s_available=false
    local node_available=false
    local system_resources_ok=false
    
    check_docker && docker_available=true
    check_kubernetes && k8s_available=true
    check_node && node_available=true
    check_system_resources && system_resources_ok=true
    
    # Decision logic for deployment method
    if [ "$k8s_available" = true ] && [ "$system_resources_ok" = true ]; then
        DEPLOYMENT_METHOD="kubernetes"
        print_success "Selected deployment method: Kubernetes (production-ready)"
    elif [ "$node_available" = true ]; then
        DEPLOYMENT_METHOD="nodejs"
        print_success "Selected deployment method: Node.js (direct)"
    elif [ "$docker_available" = true ]; then
        DEPLOYMENT_METHOD="docker"
        print_success "Selected deployment method: Docker (containerized)"
    else
        DEPLOYMENT_METHOD="none"
        print_error "No suitable deployment method available"
        return 1
    fi
    
    return 0
}

# Environment configuration
configure_environment() {
    print_step "Configuring environment for $DEPLOYMENT_METHOD deployment..."
    
    case $DEPLOYMENT_METHOD in
        "kubernetes")
            configure_kubernetes_environment
            ;;
        "docker")
            configure_docker_environment
            ;;
        "nodejs")
            configure_nodejs_environment
            ;;
        *)
            print_error "Unknown deployment method: $DEPLOYMENT_METHOD"
            return 1
            ;;
    esac
}

configure_kubernetes_environment() {
    print_info "Configuring Kubernetes environment..."
    
    # Ensure production environment file exists
    if [ ! -f .env.production ]; then
        cp .env.example .env.production
        print_info "Created .env.production from template"
    fi
    
    # Update environment for production
    sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env.production
    sed -i 's/LOG_LEVEL=info/LOG_LEVEL=warn/' .env.production
    
    HEALTH_CHECK_URL="http://localhost:8080/api/health"
    print_success "Kubernetes environment configured"
}

configure_docker_environment() {
    print_info "Configuring Docker environment..."
    
    # Ensure Docker environment file exists
    if [ ! -f .env.docker ]; then
        cp .env.example .env.docker
        print_info "Created .env.docker from template"
    fi
    
    # Update Docker-specific settings
    sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env.docker
    
    HEALTH_CHECK_URL="http://localhost:8080/api/health"
    print_success "Docker environment configured"
}

configure_nodejs_environment() {
    print_info "Configuring Node.js environment..."
    
    # Use production environment
    if [ ! -f .env.production ]; then
        cp .env.example .env.production
        print_info "Created .env.production from template"
    fi
    
    sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env.production
    sed -i 's/WS_ENABLED=true/WS_ENABLED=false/' .env.production
    
    HEALTH_CHECK_URL="http://localhost:8080/api/health"
    print_success "Node.js environment configured"
}

# Deployment execution
execute_deployment() {
    print_step "Executing $DEPLOYMENT_METHOD deployment..."
    
    case $DEPLOYMENT_METHOD in
        "kubernetes")
            execute_kubernetes_deployment
            ;;
        "docker")
            execute_docker_deployment
            ;;
        "nodejs")
            execute_nodejs_deployment
            ;;
        *)
            print_error "Cannot execute deployment for method: $DEPLOYMENT_METHOD"
            return 1
            ;;
    esac
}

execute_kubernetes_deployment() {
    print_info "Deploying to Kubernetes..."
    
    # Use existing K8s deployment script
    if [ -f "./deploy-k8s.sh" ]; then
        print_info "Using existing Kubernetes deployment script..."
        ./deploy-k8s.sh deploy
        DEPLOYMENT_STATUS="kubernetes-deployed"
    else
        print_error "Kubernetes deployment script not found"
        return 1
    fi
}

execute_docker_deployment() {
    print_info "Deploying with Docker..."
    
    # Build and start Docker containers
    if [ -f "./docker-dev.sh" ]; then
        print_info "Building and starting Docker containers..."
        ./docker-dev.sh build
        ./docker-dev.sh dev
        DEPLOYMENT_STATUS="docker-deployed"
    else
        print_error "Docker deployment script not found"
        return 1
    fi
}

execute_nodejs_deployment() {
    print_info "Deploying with Node.js..."
    
    # Build the application
    print_info "Building application..."
    npm run build
    
    # Stop any existing development server
    pkill -f "vite" || true
    pkill -f "node dist/server/node-build.mjs" || true
    
    # Start production server in background with production env
    print_info "Starting production server..."
    NODE_ENV=production npm start > deployment.log 2>&1 &
    local pid=$!
    echo $pid > .production.pid
    
    # Wait a moment for server to start
    sleep 10
    
    DEPLOYMENT_STATUS="nodejs-deployed"
    print_success "Node.js deployment started (PID: $pid)"
}

# Health validation
validate_deployment() {
    print_step "Validating deployment health..."
    
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_info "Health check attempt $attempt/$max_attempts..."
        
        if curl -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            local health_response=$(curl -s "$HEALTH_CHECK_URL")
            local status=$(echo "$health_response" | jq -r '.status // "unknown"')
            
            if [ "$status" = "ok" ]; then
                print_success "Deployment is healthy and responding"
                return 0
            fi
        fi
        
        sleep 10
        ((attempt++))
    done
    
    print_error "Deployment failed health validation"
    return 1
}

# Monitoring setup
setup_monitoring() {
    print_step "Setting up deployment monitoring..."
    
    # Create monitoring script
    cat > monitor-deployment.sh << 'EOF'
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
EOF
    
    chmod +x monitor-deployment.sh
    print_success "Monitoring script created: monitor-deployment.sh"
}

# Status reporting
generate_deployment_report() {
    print_step "Generating deployment report..."
    
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    cat > deployment-report.md << EOF
# LUMINOUS FLOW Deployment Report

**Generated:** $timestamp

## Deployment Summary

- **Method:** $DEPLOYMENT_METHOD
- **Status:** $DEPLOYMENT_STATUS
- **Health Check URL:** $HEALTH_CHECK_URL

## System Information

$(uname -a)

## Application Health

$(curl -s "$HEALTH_CHECK_URL" 2>/dev/null || echo "Health check failed")

## Next Steps

1. Monitor deployment using: \`./monitor-deployment.sh\`
2. Check logs for any issues
3. Verify all features are working correctly
4. Set up backup and recovery procedures

## Troubleshooting

If deployment fails:
1. Check system logs
2. Verify environment configuration
3. Ensure all dependencies are installed
4. Run health checks manually

EOF
    
    print_success "Deployment report generated: deployment-report.md"
}

# Main execution function
main() {
    print_header
    
    print_info "Starting deployment detection and configuration..."
    echo ""
    
    # Step 1: Detect current application state
    if detect_application_state; then
        print_warning "Application is already deployed. Use --force to redeploy."
        if [[ "${1:-}" != "--force" ]]; then
            exit 0
        fi
    fi
    
    # Step 2: Detect best deployment method
    if ! detect_best_deployment_method; then
        print_error "Unable to determine suitable deployment method"
        exit 1
    fi
    
    echo ""
    print_info "Proceeding with $DEPLOYMENT_METHOD deployment..."
    echo ""
    
    # Step 3: Configure environment
    if ! configure_environment; then
        print_error "Environment configuration failed"
        exit 1
    fi
    
    # Step 4: Execute deployment
    if ! execute_deployment; then
        print_error "Deployment execution failed"
        exit 1
    fi
    
    # Step 5: Validate deployment
    if ! validate_deployment; then
        print_error "Deployment validation failed"
        exit 1
    fi
    
    # Step 6: Setup monitoring
    setup_monitoring
    
    # Step 7: Generate report
    generate_deployment_report
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    print_info "Access your application at: $HEALTH_CHECK_URL"
    print_info "View deployment report: cat deployment-report.md"
    print_info "Monitor deployment: ./monitor-deployment.sh"
    echo ""
}

# Command line argument handling
case "${1:-}" in
    "detect")
        print_header
        detect_best_deployment_method
        ;;
    "status")
        print_header
        detect_application_state
        ;;
    "help")
        print_header
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  detect    - Only detect best deployment method"
        echo "  status    - Check current application status"
        echo "  help      - Show this help message"
        echo "  --force   - Force redeployment even if already deployed"
        echo ""
        echo "Default: Full deployment detection and configuration"
        ;;
    *)
        main "$@"
        ;;
esac