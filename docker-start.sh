#!/bin/bash

# Fusion Scanner - Docker Quick Start
# ===================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "🚀 Fusion Scanner - Docker Quick Start"
echo ""

# Show available options
echo "Available deployment options:"
echo ""
echo "1) Basic deployment (App only)"
echo "2) Full deployment (App + Proxy + Cache + Database)"
echo "3) Production deployment"
echo "4) Build and run pre-configured image"
echo "5) View logs"
echo "6) Stop all services"
echo "7) Clean up (remove containers and volumes)"
echo ""

read -p "Select an option (1-7): " choice

case $choice in
    1)
        print_status "Starting basic deployment..."
        docker-compose up -d
        ;;
    2)
        print_status "Starting full deployment with all services..."
        docker-compose --profile proxy --profile cache --profile database up -d
        ;;
    3)
        print_status "Starting production deployment..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        ;;
    4)
        print_status "Building pre-configured image..."
        docker build -f Dockerfile.preconfigured -t fusion-scanner-pre .
        print_status "Starting pre-configured container..."
        docker run -d -p 8080:8080 --name fusion-scanner-pre fusion-scanner-pre
        ;;
    5)
        print_status "Showing logs..."
        docker-compose logs -f
        ;;
    6)
        print_status "Stopping all services..."
        docker-compose down
        docker stop fusion-scanner-pre 2>/dev/null || true
        docker rm fusion-scanner-pre 2>/dev/null || true
        ;;
    7)
        print_warning "This will remove all containers and volumes. Are you sure? (y/N)"
        read -p "" confirm
        if [[ $confirm == [yY] ]]; then
            print_status "Cleaning up..."
            docker-compose down -v
            docker stop fusion-scanner-pre 2>/dev/null || true
            docker rm fusion-scanner-pre 2>/dev/null || true
            docker rmi fusion-scanner-pre 2>/dev/null || true
            docker volume prune -f
            print_success "Cleanup completed"
        else
            print_status "Cleanup cancelled"
        fi
        ;;
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

if [[ $choice -le 4 ]]; then
    echo ""
    print_success "Deployment started!"
    print_status "The application will be available at: http://localhost:8080"
    print_status "Health check: http://localhost:8080/api/health"
    print_status "API documentation: http://localhost:8080/api/ping"
    
    if [[ $choice == 2 || $choice == 3 ]]; then
        print_status "Traefik dashboard: http://localhost:8090"
    fi
    
    echo ""
    print_status "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart: docker-compose restart"
    echo "  Check status: docker-compose ps"
fi
