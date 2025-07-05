#!/bin/bash

# Docker Development Helper Script
# Provides easy commands for Docker-based development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to setup environment
setup_env() {
    print_info "Setting up Docker environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
        else
            print_warning ".env.example not found. Please create .env manually."
        fi
    fi
    
    # Load Docker-specific environment
    if [ -f .env.docker ]; then
        set -a
        source .env.docker
        set +a
        print_success "Loaded Docker environment variables"
    fi
}

# Function to build containers
build() {
    print_info "Building Docker containers..."
    check_docker
    setup_env
    
    docker-compose build --no-cache
    print_success "Containers built successfully"
}

# Function to start development environment
dev() {
    print_info "Starting development environment..."
    check_docker
    setup_env
    
    # Build if images don't exist
    if ! docker-compose images -q luminous-flow-dev | grep -q .; then
        print_info "Images not found. Building..."
        docker-compose build
    fi
    
    docker-compose up -d
    print_success "Development environment started"
    print_info "Application available at: http://localhost:8080"
    print_info "WebSocket available at: ws://localhost:8081"
    print_info "Database admin (if enabled): http://localhost:8082"
    
    # Follow logs
    print_info "Following logs (Ctrl+C to stop watching)..."
    docker-compose logs -f luminous-flow-dev
}

# Function to stop containers
stop() {
    print_info "Stopping containers..."
    docker-compose down
    print_success "Containers stopped"
}

# Function to restart containers
restart() {
    print_info "Restarting containers..."
    stop
    dev
}

# Function to view logs
logs() {
    print_info "Showing container logs..."
    docker-compose logs -f "${1:-luminous-flow-dev}"
}

# Function to execute commands in container
exec() {
    local cmd="${1:-bash}"
    print_info "Executing: $cmd"
    docker-compose exec luminous-flow-dev $cmd
}

# Function to clean up Docker resources
clean() {
    print_warning "This will remove all containers, images, and volumes for this project"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up Docker resources..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Function to show container status
status() {
    print_info "Container status:"
    docker-compose ps
    
    print_info "\nContainer resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

# Function to backup data
backup() {
    local backup_file="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    print_info "Creating backup: $backup_file"
    
    docker run --rm \
        -v scanner_data_dev:/data \
        -v $(pwd):/backup \
        alpine tar czf /backup/$backup_file -C /data .
    
    print_success "Backup created: $backup_file"
}

# Function to restore data
restore() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        print_error "Please specify a backup file to restore"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will replace all current data"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Restoring from backup: $backup_file"
        
        docker run --rm \
            -v scanner_data_dev:/data \
            -v $(pwd):/backup \
            alpine sh -c "rm -rf /data/* && tar xzf /backup/$backup_file -C /data"
        
        print_success "Backup restored successfully"
        print_info "Restart containers to apply changes"
    else
        print_info "Restore cancelled"
    fi
}

# Function to update Nuclei templates
update_templates() {
    print_info "Updating Nuclei templates..."
    docker-compose exec luminous-flow-dev nuclei -update-templates
    print_success "Nuclei templates updated"
}

# Function to run tests in container
test() {
    print_info "Running tests in container..."
    docker-compose exec luminous-flow-dev npm test
}

# Function to show help
help() {
    echo "Docker Development Helper"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  build           Build Docker containers"
    echo "  dev             Start development environment"
    echo "  stop            Stop all containers"
    echo "  restart         Restart containers"
    echo "  logs [service]  Show container logs (default: luminous-flow-dev)"
    echo "  exec [command]  Execute command in container (default: bash)"
    echo "  status          Show container status and resource usage"
    echo "  clean           Remove all containers, images, and volumes"
    echo "  backup          Create data backup"
    echo "  restore <file>  Restore data from backup"
    echo "  update-templates Update Nuclei templates"
    echo "  test            Run tests in container"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev                    # Start development environment"
    echo "  $0 logs                   # Follow application logs"
    echo "  $0 exec npm install       # Install dependencies"
    echo "  $0 backup                 # Create data backup"
    echo "  $0 restore backup.tar.gz  # Restore from backup"
}

# Main command handler
case "${1:-help}" in
    build)
        build
        ;;
    dev)
        dev
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    exec)
        shift
        exec "$*"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    update-templates)
        update_templates
        ;;
    test)
        test
        ;;
    help|*)
        help
        ;;
esac
