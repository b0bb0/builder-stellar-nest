#!/bin/bash

# AI-Powered Vulnerability Assessment Platform - Kubernetes Deployment Script
# Complete self-contained Kubernetes deployment

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
NAMESPACE="vulnerability-scanner"
KUBE_DIR="./k8s"
IMAGE_NAME="vulnerability-scanner"
IMAGE_TAG="latest"
REGISTRY=""
CONTEXT=""

# Functions
print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}🛡️  Vulnerability Assessment Platform${NC}"
    echo -e "${PURPLE}🤖 AI-Powered Security Scanner${NC}"
    echo -e "${PURPLE}☸️  Kubernetes Deployment${NC}"
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

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Check Docker (for building image)
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if connected to Kubernetes cluster
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Not connected to a Kubernetes cluster. Please configure kubectl."
        exit 1
    fi
    
    # Set context if provided
    if [ -n "$CONTEXT" ]; then
        kubectl config use-context "$CONTEXT"
    fi
    
    print_success "Prerequisites check passed"
    
    # Show cluster info
    print_info "Connected to cluster:"
    kubectl cluster-info | grep "Kubernetes control plane"
}

# Build Docker image
build_image() {
    print_info "Building vulnerability scanner Docker image..."
    
    # Build the image
    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
    
    # Tag for registry if specified
    if [ -n "$REGISTRY" ]; then
        docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
        print_info "Pushing to registry: ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
        docker push "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    fi
    
    print_success "Docker image built successfully"
}

# Create namespace and apply manifests
deploy_kubernetes() {
    print_info "Deploying to Kubernetes..."
    
    # Apply manifests in order
    local manifests=(
        "00-namespace.yaml"
        "01-configmap.yaml"
        "02-secrets.yaml"
        "03-storage.yaml"
        "04-redis.yaml"
        "05-scanner-deployment.yaml"
        "06-scanner-service.yaml"
        "07-nginx-ingress.yaml"
        "08-autoscaling.yaml"
        "09-monitoring.yaml"
        "10-backup.yaml"
    )
    
    for manifest in "${manifests[@]}"; do
        if [ -f "$KUBE_DIR/$manifest" ]; then
            print_info "Applying $manifest..."
            kubectl apply -f "$KUBE_DIR/$manifest"
        else
            print_warning "Manifest not found: $KUBE_DIR/$manifest"
        fi
    done
    
    print_success "Kubernetes manifests applied successfully"
}

# Wait for deployment
wait_for_deployment() {
    print_info "Waiting for deployments to be ready..."
    
    # Wait for Redis
    kubectl wait --for=condition=available --timeout=300s deployment/vulnerability-scanner-redis -n $NAMESPACE
    
    # Wait for main scanner
    kubectl wait --for=condition=available --timeout=600s deployment/vulnerability-scanner -n $NAMESPACE
    
    # Wait for nginx
    kubectl wait --for=condition=available --timeout=300s deployment/nginx-ingress -n $NAMESPACE
    
    print_success "All deployments are ready"
}

# Show deployment status
show_status() {
    echo ""
    print_header
    
    print_info "Deployment Status:"
    kubectl get pods -n $NAMESPACE -o wide
    echo ""
    
    print_info "Services:"
    kubectl get services -n $NAMESPACE
    echo ""
    
    print_info "Ingress:"
    kubectl get ingress -n $NAMESPACE
    echo ""
    
    print_info "Storage:"
    kubectl get pvc -n $NAMESPACE
    echo ""
    
    # Get access information
    print_info "Access Information:"
    
    # NodePort access
    NODE_PORT=$(kubectl get service vulnerability-scanner-nodeport -n $NAMESPACE -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "N/A")
    if [ "$NODE_PORT" != "N/A" ]; then
        NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}' 2>/dev/null || \
                  kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}' 2>/dev/null || echo "localhost")
        echo -e "${CYAN}🌐 NodePort Access:${NC} http://$NODE_IP:$NODE_PORT"
    fi
    
    # Ingress access
    INGRESS_IP=$(kubectl get ingress vulnerability-scanner-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$INGRESS_IP" ]; then
        echo -e "${CYAN}🌐 Ingress Access:${NC} http://$INGRESS_IP"
    else
        echo -e "${CYAN}🌐 Ingress Access:${NC} http://vulnerability-scanner.local (add to /etc/hosts)"
    fi
    
    # Port forwarding option
    echo -e "${CYAN}🔌 Port Forward:${NC} kubectl port-forward -n $NAMESPACE service/vulnerability-scanner-service 8080:8080"
    echo ""
    
    print_info "Management Commands:"
    echo -e "${CYAN}View logs:${NC} kubectl logs -f -n $NAMESPACE deployment/vulnerability-scanner"
    echo -e "${CYAN}Scale up:${NC} kubectl scale deployment vulnerability-scanner --replicas=5 -n $NAMESPACE"
    echo -e "${CYAN}Update image:${NC} kubectl set image deployment/vulnerability-scanner vulnerability-scanner=${IMAGE_NAME}:${IMAGE_TAG} -n $NAMESPACE"
    echo -e "${CYAN}Shell access:${NC} kubectl exec -it -n $NAMESPACE deployment/vulnerability-scanner -- /bin/bash"
    echo ""
}

# Port forward for easy access
port_forward() {
    print_info "Setting up port forwarding..."
    print_info "Access the platform at: http://localhost:8080"
    print_info "WebSocket at: ws://localhost:8081"
    print_info "Press Ctrl+C to stop port forwarding"
    
    kubectl port-forward -n $NAMESPACE service/vulnerability-scanner-service 8080:8080 8081:8081
}

# Clean up resources
cleanup() {
    print_warning "This will delete all vulnerability scanner resources. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Deleting resources..."
        kubectl delete namespace $NAMESPACE --ignore-not-found=true
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Backup data
backup() {
    print_info "Creating manual backup..."
    
    # Create backup job
    kubectl create job --from=cronjob/vulnerability-scanner-backup manual-backup-$(date +%Y%m%d-%H%M%S) -n $NAMESPACE
    
    print_info "Backup job created. Check status with:"
    echo "kubectl get jobs -n $NAMESPACE"
}

# Update deployment
update() {
    print_info "Updating vulnerability scanner..."
    
    # Build new image
    if [ "$1" = "--build" ]; then
        build_image
    fi
    
    # Rolling update
    kubectl rollout restart deployment/vulnerability-scanner -n $NAMESPACE
    kubectl rollout status deployment/vulnerability-scanner -n $NAMESPACE --timeout=600s
    
    print_success "Update completed"
}

# Scale deployment
scale() {
    local replicas=${1:-2}
    print_info "Scaling vulnerability scanner to $replicas replicas..."
    
    kubectl scale deployment vulnerability-scanner --replicas=$replicas -n $NAMESPACE
    kubectl rollout status deployment/vulnerability-scanner -n $NAMESPACE
    
    print_success "Scaling completed"
}

# Main script logic
main() {
    case "${1:-deploy}" in
        "deploy")
            print_header
            check_prerequisites
            build_image
            deploy_kubernetes
            wait_for_deployment
            show_status
            ;;
        "status")
            show_status
            ;;
        "port-forward"|"pf")
            port_forward
            ;;
        "logs")
            kubectl logs -f -n $NAMESPACE deployment/vulnerability-scanner
            ;;
        "shell")
            kubectl exec -it -n $NAMESPACE deployment/vulnerability-scanner -- /bin/bash
            ;;
        "cleanup")
            cleanup
            ;;
        "backup")
            backup
            ;;
        "update")
            update "$2"
            ;;
        "scale")
            scale "$2"
            ;;
        "build")
            build_image
            ;;
        "restart")
            kubectl rollout restart deployment/vulnerability-scanner -n $NAMESPACE
            kubectl rollout restart deployment/vulnerability-scanner-redis -n $NAMESPACE
            ;;
        "help")
            echo "AI-Powered Vulnerability Assessment Platform - Kubernetes Management"
            echo ""
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  deploy          - Full deployment (default)"
            echo "  status          - Show deployment status"
            echo "  port-forward    - Port forward for local access"
            echo "  logs            - Follow application logs"
            echo "  shell           - Open shell in container"
            echo "  backup          - Create manual backup"
            echo "  update [--build]- Update deployment (optionally rebuild image)"
            echo "  scale <replicas>- Scale deployment"
            echo "  build           - Build Docker image only"
            echo "  restart         - Restart all services"
            echo "  cleanup         - Delete all resources"
            echo "  help            - Show this help"
            echo ""
            echo "Environment Variables:"
            echo "  REGISTRY        - Docker registry URL"
            echo "  CONTEXT         - Kubernetes context to use"
            echo "  IMAGE_TAG       - Docker image tag (default: latest)"
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
