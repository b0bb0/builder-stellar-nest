#!/bin/bash

# Master Docker Management Script for Luminous Flow Scanner
# Single entry point for all Docker operations

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Script version
VERSION="1.0.0"

# Function to show the main menu
show_menu() {
    clear
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║          🐳 LUMINOUS FLOW DOCKER MANAGER v${VERSION}           ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Choose an option:${NC}"
    echo ""
    echo -e "${GREEN}Quick Actions:${NC}"
    echo "  ${BLUE}1${NC}) Quick Start           - Start development environment immediately"
    echo "  ${BLUE}2${NC}) Status Dashboard      - View comprehensive system status"
    echo "  ${BLUE}3${NC}) View Logs             - Show application logs"
    echo "  ${BLUE}4${NC}) Stop All              - Stop all running containers"
    echo ""
    echo -e "${GREEN}Setup & Configuration:${NC}"
    echo "  ${BLUE}5${NC}) Initial Setup         - Complete environment setup"
    echo "  ${BLUE}6${NC}) Environment Summary   - Show current configuration"
    echo "  ${BLUE}7${NC}) Make Scripts Executable - Fix permissions for all scripts"
    echo ""
    echo -e "${GREEN}Development:${NC}"
    echo "  ${BLUE}8${NC}) Development Mode      - Start with live reload"
    echo "  ${BLUE}9${NC}) Container Shell       - Access container bash shell"
    echo "  ${BLUE}10${NC}) Restart Containers   - Restart all containers"
    echo "  ${BLUE}11${NC}) Rebuild Images       - Clean rebuild of Docker images"
    echo ""
    echo -e "${GREEN}Data Management:${NC}"
    echo "  ${BLUE}12${NC}) Backup Data          - Create backup of application data"
    echo "  ${BLUE}13${NC}) Restore Data         - Restore data from backup"
    echo "  ${BLUE}14${NC}) Reset Database       - Reset database (⚠️  Data loss)"
    echo ""
    echo -e "${GREEN}Production:${NC}"
    echo "  ${BLUE}15${NC}) Production Deploy    - Deploy production environment"
    echo "  ${BLUE}16${NC}) Production Status    - Check production containers"
    echo ""
    echo -e "${GREEN}Maintenance:${NC}"
    echo "  ${BLUE}17${NC}) Clean Up             - Remove unused Docker resources"
    echo "  ${BLUE}18${NC}) Update Templates     - Update Nuclei security templates"
    echo "  ${BLUE}19${NC}) System Information   - Show Docker and system info"
    echo ""
    echo -e "${GREEN}Help & Documentation:${NC}"
    echo "  ${BLUE}20${NC}) Help                 - Show help information"
    echo "  ${BLUE}21${NC}) Documentation        - View documentation files"
    echo ""
    echo -e "${BLUE}0${NC}) Exit"
    echo ""
    echo -n -e "${CYAN}Enter your choice [0-21]: ${NC}"
}

# Function to execute based on choice
execute_choice() {
    local choice=$1
    
    case $choice in
        1)
            echo -e "${GREEN}Starting quick development environment...${NC}"
            ./docker-quick-start.sh
            ;;
        2)
            echo -e "${GREEN}Loading status dashboard...${NC}"
            ./docker-status.sh
            ;;
        3)
            echo -e "${GREEN}Showing application logs...${NC}"
            ./docker-dev.sh logs
            ;;
        4)
            echo -e "${YELLOW}Stopping all containers...${NC}"
            ./docker-dev.sh stop
            ;;
        5)
            echo -e "${GREEN}Running initial setup...${NC}"
            ./setup-docker.sh
            ;;
        6)
            echo -e "${GREEN}Showing environment summary...${NC}"
            ./docker-summary.sh
            ;;
        7)
            echo -e "${GREEN}Making scripts executable...${NC}"
            chmod +x *.sh
            echo -e "${GREEN}✅ All scripts are now executable${NC}"
            ;;
        8)
            echo -e "${GREEN}Starting development mode...${NC}"
            ./docker-dev.sh dev
            ;;
        9)
            echo -e "${GREEN}Accessing container shell...${NC}"
            ./docker-dev.sh exec bash
            ;;
        10)
            echo -e "${YELLOW}Restarting containers...${NC}"
            ./docker-dev.sh restart
            ;;
        11)
            echo -e "${YELLOW}Rebuilding Docker images...${NC}"
            ./docker-dev.sh clean
            echo "Waiting 3 seconds..."
            sleep 3
            ./docker-dev.sh build
            ;;
        12)
            echo -e "${GREEN}Creating data backup...${NC}"
            ./docker-dev.sh backup
            ;;
        13)
            echo -e "${CYAN}Available backups:${NC}"
            ls -la backup-*.tar.gz 2>/dev/null || echo "No backups found"
            echo ""
            echo -n "Enter backup filename: "
            read backup_file
            if [ -f "$backup_file" ]; then
                ./docker-dev.sh restore "$backup_file"
            else
                echo -e "${RED}Backup file not found: $backup_file${NC}"
            fi
            ;;
        14)
            echo -e "${RED}⚠️  WARNING: This will delete all data!${NC}"
            echo -n "Type 'YES' to confirm: "
            read confirm
            if [ "$confirm" = "YES" ]; then
                echo -e "${YELLOW}Resetting database...${NC}"
                docker-compose down -v
                docker-compose up -d
                echo -e "${GREEN}Database reset complete${NC}"
            else
                echo -e "${GREEN}Operation cancelled${NC}"
            fi
            ;;
        15)
            echo -e "${GREEN}Deploying production environment...${NC}"
            if [ ! -f .env.production ]; then
                echo -e "${YELLOW}Creating .env.production from template...${NC}"
                cp .env.example .env.production
                echo -e "${YELLOW}⚠️  Please edit .env.production with production values${NC}"
            fi
            docker-compose -f docker-compose.prod.yml up -d
            ;;
        16)
            echo -e "${GREEN}Checking production status...${NC}"
            docker-compose -f docker-compose.prod.yml ps
            ;;
        17)
            echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
            ./docker-dev.sh clean
            ;;
        18)
            echo -e "${GREEN}Updating Nuclei templates...${NC}"
            ./docker-dev.sh update-templates
            ;;
        19)
            echo -e "${GREEN}System information:${NC}"
            echo ""
            echo -e "${BLUE}Docker Version:${NC}"
            docker --version 2>/dev/null || echo "Docker not available"
            echo ""
            echo -e "${BLUE}Docker Compose Version:${NC}"
            docker-compose --version 2>/dev/null || docker compose version 2>/dev/null || echo "Docker Compose not available"
            echo ""
            echo -e "${BLUE}System Resources:${NC}"
            echo "Memory: $(free -h | awk 'NR==2{printf "%.1f/%.1f GB", $3/1024/1024, $2/1024/1024}')"
            echo "Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')"
            ;;
        20)
            show_help
            ;;
        21)
            show_documentation_menu
            ;;
        0)
            echo -e "${GREEN}Goodbye! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
}

# Function to show help
show_help() {
    echo -e "${GREEN}Luminous Flow Docker Manager Help${NC}"
    echo ""
    echo -e "${CYAN}Available Scripts:${NC}"
    echo "  ./docker.sh              - This interactive manager"
    echo "  ./docker-quick-start.sh  - Quick start development"
    echo "  ./docker-dev.sh          - Development helper commands"
    echo "  ./docker-status.sh       - Status dashboard"
    echo "  ./setup-docker.sh        - Initial environment setup"
    echo "  ./docker-summary.sh      - Configuration summary"
    echo ""
    echo -e "${CYAN}Common Commands:${NC}"
    echo "  ./docker-dev.sh dev      - Start development with logs"
    echo "  ./docker-dev.sh logs     - View logs"
    echo "  ./docker-dev.sh stop     - Stop containers"
    echo "  ./docker-dev.sh restart  - Restart containers"
    echo "  ./docker-dev.sh exec bash - Access container shell"
    echo ""
    echo -e "${CYAN}Direct Docker Commands:${NC}"
    echo "  docker-compose ps        - Show container status"
    echo "  docker-compose logs -f   - Follow logs"
    echo "  docker-compose exec luminous-flow-dev bash - Container shell"
    echo ""
}

# Function to show documentation menu
show_documentation_menu() {
    echo -e "${GREEN}📖 Available Documentation:${NC}"
    echo ""
    echo "1) README-DOCKER.md    - Complete setup guide"
    echo "2) DOCKER.md           - Comprehensive documentation"
    echo "3) .env.example        - Environment configuration template"
    echo "4) docker-compose.yml  - Development configuration"
    echo ""
    echo -n "Enter number to view (or press Enter to continue): "
    read doc_choice
    
    case $doc_choice in
        1)
            if [ -f README-DOCKER.md ]; then
                less README-DOCKER.md
            else
                echo "README-DOCKER.md not found"
            fi
            ;;
        2)
            if [ -f DOCKER.md ]; then
                less DOCKER.md
            else
                echo "DOCKER.md not found"
            fi
            ;;
        3)
            if [ -f .env.example ]; then
                cat .env.example
            else
                echo ".env.example not found"
            fi
            ;;
        4)
            if [ -f docker-compose.yml ]; then
                cat docker-compose.yml
            else
                echo "docker-compose.yml not found"
            fi
            ;;
        *)
            return
            ;;
    esac
}

# Function to pause and wait for user input
pause() {
    echo ""
    echo -n -e "${CYAN}Press Enter to continue...${NC}"
    read
}

# Main interactive loop
main() {
    # Check if scripts exist and make them executable
    if [ ! -x "docker-quick-start.sh" ] || [ ! -x "docker-dev.sh" ]; then
        echo -e "${YELLOW}Making scripts executable...${NC}"
        chmod +x *.sh 2>/dev/null || true
    fi
    
    while true; do
        show_menu
        read choice
        echo ""
        
        if execute_choice "$choice"; then
            if [ "$choice" != "0" ]; then
                pause
            fi
        else
            echo -e "${RED}An error occurred. Please try again.${NC}"
            pause
        fi
    done
}

# Handle command line arguments
if [ $# -eq 0 ]; then
    main
else
    case "$1" in
        quick|start)
            ./docker-quick-start.sh
            ;;
        status)
            ./docker-status.sh
            ;;
        dev)
            ./docker-dev.sh dev
            ;;
        logs)
            ./docker-dev.sh logs
            ;;
        stop)
            ./docker-dev.sh stop
            ;;
        setup)
            ./setup-docker.sh
            ;;
        summary)
            ./docker-summary.sh
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown command: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
fi
