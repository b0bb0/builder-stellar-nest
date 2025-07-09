#!/bin/bash

# Docker Environment Summary and Verification Script
# Shows the complete Docker setup status and provides next steps

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║               🐳 DOCKER ENVIRONMENT SUMMARY 🐳               ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════��═════════════════════════════╝${NC}"
echo ""

# Check if application is currently running
echo -e "${CYAN}📋 Current Application Status:${NC}"
if curl -f http://localhost:8080/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is currently running and healthy${NC}"
    echo -e "   🌐 Web Interface: ${BLUE}http://localhost:8080${NC}"
    echo -e "   🔌 WebSocket: ${BLUE}ws://localhost:8081${NC}"
else
    echo -e "${YELLOW}⚠️  Application is not currently running (normal if using non-Docker mode)${NC}"
fi

echo ""
echo -e "${CYAN}🐳 Docker Environment Status:${NC}"

# Check Docker availability
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    docker_version=$(docker --version 2>/dev/null | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "   Version: ${docker_version}"
else
    echo -e "${RED}❌ Docker is not installed or not accessible${NC}"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose is available${NC}"
    compose_version=$(docker-compose --version 2>/dev/null | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "   Version: ${compose_version}"
elif command -v docker &> /dev/null && docker compose version &> /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker Compose (plugin) is available${NC}"
    compose_version=$(docker compose version 2>/dev/null | cut -d' ' -f3)
    echo -e "   Version: ${compose_version}"
else
    echo -e "${RED}❌ Docker Compose is not available${NC}"
fi

echo ""
echo -e "${CYAN}📁 Docker Configuration Files:${NC}"

# Check Docker files
files=(
    "Dockerfile:Production Docker image"
    "Dockerfile.dev:Development Docker image with hot reload"
    "docker-compose.yml:Development environment"
    "docker-compose.prod.yml:Production environment"
    ".env:Environment configuration"
    ".env.docker:Docker-specific settings"
    ".env.production:Production configuration"
    ".dockerignore:Docker build optimization"
)

for file_desc in "${files[@]}"; do
    file="${file_desc%%:*}"
    desc="${file_desc##*:}"
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ ${file}${NC} - ${desc}"
    else
        echo -e "${YELLOW}⚠️  ${file}${NC} - ${desc} (missing)"
    fi
done

echo ""
echo -e "${CYAN}🛠️ Helper Scripts:${NC}"

scripts=(
    "docker-quick-start.sh:Quick start for immediate use"
    "docker-dev.sh:Development workflow helper"
    "docker-status.sh:Comprehensive status dashboard"
    "setup-docker.sh:Automated environment setup"
    "docker-summary.sh:This summary script"
)

for script_desc in "${scripts[@]}"; do
    script="${script_desc%%:*}"
    desc="${script_desc##*:}"
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo -e "${GREEN}✅ ${script}${NC} - ${desc} (executable)"
        else
            echo -e "${YELLOW}⚠️  ${script}${NC} - ${desc} (not executable - run: chmod +x ${script})"
        fi
    else
        echo -e "${RED}❌ ${script}${NC} - ${desc} (missing)"
    fi
done

echo ""
echo -e "${CYAN}📖 Documentation:${NC}"

docs=(
    "README-DOCKER.md:Complete Docker setup guide"
    "DOCKER.md:Comprehensive Docker documentation"
)

for doc_desc in "${docs[@]}"; do
    doc="${doc_desc%%:*}"
    desc="${doc_desc##*:}"
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ ${doc}${NC} - ${desc}"
    else
        echo -e "${YELLOW}⚠️  ${doc}${NC} - ${desc} (missing)"
    fi
done

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                     🚀 NEXT STEPS                           ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${GREEN}🎯 Choose your path:${NC}"
echo ""

echo -e "${BLUE}Option 1: Quick Start (Recommended for beginners)${NC}"
echo -e "   ${CYAN}chmod +x *.sh && ./docker-quick-start.sh${NC}"
echo -e "   Perfect for immediate testing and development"
echo ""

echo -e "${BLUE}Option 2: Full Setup (Recommended for regular use)${NC}"
echo -e "   ${CYAN}chmod +x *.sh && ./setup-docker.sh${NC}"
echo -e "   Complete environment setup with verification"
echo ""

echo -e "${BLUE}Option 3: Manual Control (For experienced users)${NC}"
echo -e "   ${CYAN}docker-compose build && docker-compose up -d${NC}"
echo -e "   Direct Docker Compose control"
echo ""

echo -e "${GREEN}📊 Monitoring & Management:${NC}"
echo -e "   ${CYAN}./docker-status.sh${NC}          - Comprehensive status dashboard"
echo -e "   ${CYAN}./docker-dev.sh status${NC}      - Quick status check"
echo -e "   ${CYAN}./docker-dev.sh logs${NC}        - View application logs"
echo -e "   ${CYAN}./docker-dev.sh exec bash${NC}   - Access container shell"
echo ""

echo -e "${GREEN}🗄️ Data Management:${NC}"
echo -e "   ${CYAN}./docker-dev.sh backup${NC}      - Create data backup"
echo -e "   ${CYAN}./docker-dev.sh restore <file>${NC} - Restore from backup"
echo ""

echo -e "${GREEN}🏭 Production Deployment:${NC}"
echo -e "   ${CYAN}docker-compose -f docker-compose.prod.yml up -d${NC}"
echo -e "   Configure .env.production first!"
echo ""

echo -e "${GREEN}📚 Documentation:${NC}"
echo -e "   ${CYAN}cat README-DOCKER.md${NC}        - Complete setup guide"
echo -e "   ${CYAN}cat DOCKER.md${NC}               - Detailed documentation"
echo ""

echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    ✨ FEATURES OVERVIEW                      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${GREEN}🔧 Development Features:${NC}"
echo "   • Hot reload for instant code changes"
echo "   • Volume mounts for live editing"
echo "   • Debug logging and monitoring"
echo "   • SQLite Web interface for database management"
echo "   • Automated backup and restore"
echo ""

echo -e "${GREEN}🏭 Production Features:${NC}"
echo "   • Multi-stage optimized builds"
echo "   • Security-hardened containers"
echo "   • Health checks and monitoring"
echo "   • Nginx reverse proxy support"
echo "   • Resource limits and optimization"
echo ""

echo -e "${GREEN}🛡️ Security Features:${NC}"
echo "   • Non-root container execution"
echo "   • Minimal attack surface (Alpine Linux)"
echo "   • Network isolation"
echo "   • CORS configuration"
echo "   • Secrets management"
echo ""

echo -e "${GREEN}📊 Monitoring Features:${NC}"
echo "   • Real-time resource monitoring"
echo "   • Health check endpoints"
echo "   • Comprehensive logging"
echo "   • Status dashboards"
echo "   • Performance metrics"
echo ""

echo -e "${YELLOW}💡 Pro Tips:${NC}"
echo "   • Use ${CYAN}./docker-status.sh${NC} regularly to monitor your environment"
echo "   • Keep your .env file updated with your specific configuration"
echo "   • Use ${CYAN}./docker-dev.sh backup${NC} before making major changes"
echo "   • Check logs with ${CYAN}./docker-dev.sh logs${NC} if something goes wrong"
echo ""

echo -e "${GREEN}🎉 Your Docker environment is ready to use!${NC}"
echo -e "${CYAN}Start with: ${YELLOW}./docker-quick-start.sh${NC}"
