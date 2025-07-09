#!/bin/bash

# Quick Start Script for Docker Environment
# Minimal setup for immediate development

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Luminous Flow - Quick Docker Start${NC}"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "${YELLOW}Creating .env from template...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✅ .env created${NC}"
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
fi

# Start development environment
echo -e "${BLUE}Starting development environment...${NC}"

# Check if docker-compose command exists
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo -e "${RED}❌ Docker Compose not found${NC}"
    exit 1
fi

# Build and start
echo "Building containers (this may take a few minutes on first run)..."
$COMPOSE_CMD build

echo "Starting containers..."
$COMPOSE_CMD up -d

# Wait for health check
echo -e "${BLUE}Waiting for application to be ready...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:8080/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Application failed to start${NC}"
        echo "Check logs with: $COMPOSE_CMD logs"
        exit 1
    fi
    echo "Attempt $i/30..."
    sleep 2
done

echo ""
echo -e "${GREEN}🎉 Success! Your application is running:${NC}"
echo ""
echo -e "🌐 Web Interface:  ${BLUE}http://localhost:8080${NC}"
echo -e "🔌 WebSocket:      ${BLUE}ws://localhost:8081${NC}"
echo -e "🗄️  Database Admin: ${BLUE}http://localhost:8082${NC} (if tools enabled)"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  $COMPOSE_CMD logs -f           # View logs"
echo "  $COMPOSE_CMD exec luminous-flow-dev bash  # Access container"
echo "  $COMPOSE_CMD down              # Stop containers"
echo "  $COMPOSE_CMD ps                # Show status"
echo ""
echo -e "${YELLOW}📖 For more options, see: ./docker-dev.sh help${NC}"
