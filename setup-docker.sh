#!/bin/bash

# Docker Environment Setup Script
# Automates the initial setup of the Docker development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  Docker Environment Setup${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo ""
}

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

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Function to check system requirements
check_requirements() {
    print_step "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        echo "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Check available disk space (need at least 5GB)
    available_space=$(df / | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 5242880 ]; then # 5GB in KB
        print_warning "Less than 5GB of disk space available. Docker images may take significant space."
    fi
    
    # Check available memory (need at least 2GB)
    available_memory=$(free -m | awk 'NR==2{print $7}')
    if [ "$available_memory" -lt 2048 ]; then
        print_warning "Less than 2GB of available memory. Performance may be impacted."
    fi
    
    print_success "System requirements check passed"
}

# Function to setup environment files
setup_environment() {
    print_step "Setting up environment files..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
        else
            print_error ".env.example not found. Cannot create .env file."
            exit 1
        fi
    else
        print_info ".env file already exists"
    fi
    
    # Load environment variables
    if [ -f .env.docker ]; then
        set -a
        source .env.docker
        set +a
        print_success "Loaded Docker environment variables"
    fi
    
    # Make docker-dev.sh executable
    if [ -f docker-dev.sh ]; then
        chmod +x docker-dev.sh
        print_success "Made docker-dev.sh executable"
    fi
    
    # Make this script executable
    chmod +x setup-docker.sh
}

# Function to create necessary directories
create_directories() {
    print_step "Creating necessary directories..."
    
    # Create directories that might be needed
    mkdir -p data logs nuclei-templates
    
    print_success "Directories created"
}

# Function to pull base images
pull_images() {
    print_step "Pulling Docker base images..."
    
    # Pull Node.js base image
    docker pull node:18-alpine
    
    # Pull SQLite Web image (optional)
    docker pull coleifer/sqlite-web
    
    # Pull Nginx image (for production)
    docker pull nginx:alpine
    
    print_success "Base images pulled successfully"
}

# Function to build application images
build_images() {
    print_step "Building application images..."
    
    # Build development image
    print_info "Building development image..."
    docker-compose build --no-cache
    
    print_success "Application images built successfully"
}

# Function to setup volumes
setup_volumes() {
    print_step "Setting up Docker volumes..."
    
    # Create named volumes
    docker volume create scanner_data_dev 2>/dev/null || true
    docker volume create scanner_logs_dev 2>/dev/null || true
    docker volume create nuclei_templates_dev 2>/dev/null || true
    
    print_success "Docker volumes created"
}

# Function to test the setup
test_setup() {
    print_step "Testing Docker setup..."
    
    # Start containers
    print_info "Starting containers for testing..."
    docker-compose up -d
    
    # Wait for containers to start
    print_info "Waiting for containers to be ready..."
    sleep 10
    
    # Test health endpoint
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8080/api/health >/dev/null 2>&1; then
            print_success "Health check passed"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Health check failed after $max_attempts attempts"
            print_info "Showing container logs:"
            docker-compose logs
            docker-compose down
            exit 1
        fi
        
        print_info "Attempt $attempt/$max_attempts - waiting for application to start..."
        sleep 2
        ((attempt++))
    done
    
    # Stop test containers
    print_info "Stopping test containers..."
    docker-compose down
    
    print_success "Docker setup test completed successfully"
}

# Function to show next steps
show_next_steps() {
    print_success "Docker environment setup completed!"
    echo ""
    echo -e "${GREEN}🎉 Your Docker environment is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Configure your environment:"
    echo "   ${BLUE}nano .env${NC}"
    echo ""
    echo "2. Start development environment:"
    echo "   ${BLUE}./docker-dev.sh dev${NC}"
    echo ""
    echo "3. Access your application:"
    echo "   ${BLUE}http://localhost:8080${NC} - Web interface"
    echo "   ${BLUE}ws://localhost:8081${NC} - WebSocket connection"
    echo ""
    echo "4. View logs:"
    echo "   ${BLUE}./docker-dev.sh logs${NC}"
    echo ""
    echo "5. Get help:"
    echo "   ${BLUE}./docker-dev.sh help${NC}"
    echo "   ${BLUE}cat DOCKER.md${NC}"
    echo ""
    echo "Useful commands:"
    echo "   ${BLUE}./docker-dev.sh status${NC}       - Show container status"
    echo "   ${BLUE}./docker-dev.sh exec bash${NC}    - Access container shell"
    echo "   ${BLUE}./docker-dev.sh backup${NC}       - Create data backup"
    echo "   ${BLUE}./docker-dev.sh clean${NC}        - Clean up resources"
    echo ""
}

# Function to handle setup options
handle_options() {
    local skip_build=false
    local skip_test=false
    local quick_setup=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-build)
                skip_build=true
                shift
                ;;
            --skip-test)
                skip_test=true
                shift
                ;;
            --quick)
                quick_setup=true
                skip_test=true
                shift
                ;;
            --help)
                echo "Docker Environment Setup Script"
                echo ""
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --skip-build    Skip building Docker images"
                echo "  --skip-test     Skip testing the setup"
                echo "  --quick         Quick setup (skip build and test)"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Execute setup steps
    print_header
    
    check_requirements
    setup_environment
    create_directories
    
    if [ "$quick_setup" = false ]; then
        pull_images
        setup_volumes
        
        if [ "$skip_build" = false ]; then
            build_images
        fi
        
        if [ "$skip_test" = false ]; then
            test_setup
        fi
    else
        print_info "Quick setup mode - skipping image build and testing"
        setup_volumes
    fi
    
    show_next_steps
}

# Main execution
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    handle_options "$@"
fi
