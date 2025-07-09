#!/bin/bash

# AI-Powered Vulnerability Assessment Platform - Docker Deployment Script
# Complete setup for production-ready vulnerability scanner

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
LOG_FILE="./deploy.log"

# Functions
print_header() {
    echo -e "${PURPLE}=================================${NC}"
    echo -e "${PURPLE}🛡️  Vulnerability Assessment Platform${NC}"
    echo -e "${PURPLE}🤖 AI-Powered Security Scanner${NC}"
    echo -e "${PURPLE}=================================${NC}"
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

log_action() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! docker compose version &> /dev/null && ! docker-compose --version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Determine compose command
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Copy environment file if it doesn't exist
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f ".env.production.example" ]; then
            cp .env.production.example "$ENV_FILE"
            print_warning "Copied example environment file. Please review $ENV_FILE"
        else
            print_warning "Environment file $ENV_FILE not found. Using defaults."
        fi
    fi
    
    # Generate secrets if needed
    if grep -q "change-this-in-production" "$ENV_FILE" 2>/dev/null; then
        print_warning "Please update security secrets in $ENV_FILE before production use"
    fi
    
    print_success "Environment setup completed"
}

# Build and deploy
deploy() {
    print_info "Building and deploying containers..."
    log_action "Starting deployment"
    
    # Pull latest images
    print_info "Pulling latest base images..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" pull redis nginx 2>/dev/null || true
    
    # Build application image
    print_info "Building vulnerability scanner image..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" build --no-cache vulnerability-scanner
    
    # Start services
    print_info "Starting services..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" up -d vulnerability-scanner redis
    
    # Wait for services to be healthy
    print_info "Waiting for services to be ready..."
    sleep 30
    
    # Check health
    if $COMPOSE_CMD -f "$COMPOSE_FILE" ps vulnerability-scanner | grep -q "healthy\|Up"; then
        print_success "Vulnerability Assessment Platform deployed successfully!"
    else
        print_error "Deployment may have issues. Check logs with: $COMPOSE_CMD -f $COMPOSE_FILE logs"
        exit 1
    fi
    
    log_action "Deployment completed successfully"
}

# Show service information
show_info() {
    echo ""
    print_header
    
    print_info "Service Information:"
    echo -e "${CYAN}📊 Main Platform:${NC} http://localhost"
    echo -e "${CYAN}🔌 WebSocket:${NC} ws://localhost:8081"
    echo -e "${CYAN}💾 Database Admin:${NC} http://localhost:8082 (if enabled)"
    echo -e "${CYAN}📈 Redis:${NC} localhost:6379"
    echo ""
    
    print_info "Management Commands:"
    echo -e "${CYAN}View logs:${NC} $COMPOSE_CMD -f $COMPOSE_FILE logs -f"
    echo -e "${CYAN}Stop services:${NC} $COMPOSE_CMD -f $COMPOSE_FILE down"
    echo -e "${CYAN}Update platform:${NC} $COMPOSE_CMD -f $COMPOSE_FILE pull && $COMPOSE_CMD -f $COMPOSE_FILE up -d"
    echo -e "${CYAN}Scale scanners:${NC} $COMPOSE_CMD -f $COMPOSE_FILE up -d --scale vulnerability-scanner=3"
    echo ""
    
    print_info "Health Check:"
    if curl -f http://localhost/api/health >/dev/null 2>&1; then
        print_success "Platform is running and healthy"
    else
        print_warning "Platform health check failed. It may still be starting up."
    fi
}

# Backup function
backup() {
    print_info "Creating backup..."
    BACKUP_NAME="vuln-scanner-backup-$(date +%Y%m%d-%H%M%S)"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    mkdir -p "$BACKUP_PATH"
    
    # Backup volumes
    docker run --rm -v vuln_data:/data -v "$PWD/$BACKUP_PATH":/backup alpine tar czf /backup/data.tar.gz -C /data .
    docker run --rm -v vuln_logs:/logs -v "$PWD/$BACKUP_PATH":/backup alpine tar czf /backup/logs.tar.gz -C /logs .
    
    # Backup configuration
    cp "$ENV_FILE" "$BACKUP_PATH/"
    cp "$COMPOSE_FILE" "$BACKUP_PATH/"
    
    print_success "Backup created: $BACKUP_PATH"
}

# Main script logic
main() {
    case "${1:-deploy}" in
        "deploy")
            print_header
            check_prerequisites
            setup_environment
            deploy
            show_info
            ;;
        "start")
            print_info "Starting services..."
            $COMPOSE_CMD -f "$COMPOSE_FILE" up -d
            show_info
            ;;
        "stop")
            print_info "Stopping services..."
            $COMPOSE_CMD -f "$COMPOSE_FILE" down
            print_success "Services stopped"
            ;;
        "restart")
            print_info "Restarting services..."
            $COMPOSE_CMD -f "$COMPOSE_FILE" restart
            show_info
            ;;
        "logs")
            $COMPOSE_CMD -f "$COMPOSE_FILE" logs -f
            ;;
        "status")
            $COMPOSE_CMD -f "$COMPOSE_FILE" ps
            ;;
        "backup")
            backup
            ;;
        "clean")
            print_warning "This will remove all containers, volumes, and data. Are you sure? (y/N)"
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                $COMPOSE_CMD -f "$COMPOSE_FILE" down -v --rmi all
                docker system prune -f
                print_success "Cleanup completed"
            fi
            ;;
        "update")
            print_info "Updating platform..."
            $COMPOSE_CMD -f "$COMPOSE_FILE" pull
            $COMPOSE_CMD -f "$COMPOSE_FILE" up -d
            print_success "Update completed"
            ;;
        "help")
            echo "AI-Powered Vulnerability Assessment Platform - Docker Management"
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  deploy    - Full deployment (default)"
            echo "  start     - Start services"
            echo "  stop      - Stop services"
            echo "  restart   - Restart services"
            echo "  logs      - Follow logs"
            echo "  status    - Show service status"
            echo "  backup    - Create backup"
            echo "  clean     - Remove everything (dangerous)"
            echo "  update    - Update to latest version"
            echo "  help      - Show this help"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for available commands"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
