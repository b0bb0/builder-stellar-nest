#!/bin/bash

# Google Cloud Platform deployment script for Fusion Scanner

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=""
REGION="us-central1"
SERVICE_NAME="fusion-scanner"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Functions
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

# Check if PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
    print_error "PROJECT_ID is not set. Please edit this script and set your Google Cloud Project ID."
    echo "Example: PROJECT_ID=\"my-project-id\""
    exit 1
fi

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_error "Not authenticated with gcloud. Please run: gcloud auth login"
    exit 1
fi

print_status "Starting deployment to Google Cloud Platform..."

# Set the project
print_status "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
print_status "Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push the Docker image
print_status "Building Docker image..."
docker build -t $IMAGE_NAME:latest .

print_status "Configuring Docker for Google Container Registry..."
gcloud auth configure-docker

print_status "Pushing image to Google Container Registry..."
docker push $IMAGE_NAME:latest

# Deploy to Cloud Run
print_status "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production,PORT=8080

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

print_success "Deployment completed successfully!"
print_success "Service URL: $SERVICE_URL"
print_success "Health check: $SERVICE_URL/api/health"

# Test the deployment
print_status "Testing the deployment..."
if curl -s "$SERVICE_URL/api/health" > /dev/null; then
    print_success "Health check passed! Service is running correctly."
else
    print_warning "Health check failed. The service might still be starting up."
    print_status "You can check the logs with: gcloud run logs tail $SERVICE_NAME --region $REGION"
fi

echo ""
print_status "Useful commands:"
echo "  View logs: gcloud run logs tail $SERVICE_NAME --region $REGION"
echo "  Update service: gcloud run services update $SERVICE_NAME --region $REGION"
echo "  Delete service: gcloud run services delete $SERVICE_NAME --region $REGION"
