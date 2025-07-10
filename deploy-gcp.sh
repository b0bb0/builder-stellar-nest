#!/bin/bash

# Google Cloud Platform deployment script for Fusion Scanner

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# --- Configuration ---
# Values can be overridden by command-line arguments or environment variables
PROJECT_ID_OVERRIDE=""
REGION_OVERRIDE="${1:-us-central1}"
SERVICE_NAME_OVERRIDE="${2:-fusion-scanner}"

# --- Functions ---
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
    exit 1
}

# --- Pre-flight checks ---
print_status "Performing pre-flight checks..."

# Check for gcloud
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it from https://cloud.google.com/sdk/docs/install"
fi

# Check for authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_error "Not authenticated with gcloud. Please run: gcloud auth login"
fi

# --- Resolve Configuration ---
print_status "Resolving GCP configuration..."

# Project ID
if [ -n "$PROJECT_ID_OVERRIDE" ]; then
    PROJECT_ID="$PROJECT_ID_OVERRIDE"
    print_status "Using provided Project ID: $PROJECT_ID"
elif [ -n "$(gcloud config get-value project)" ]; then
    PROJECT_ID=$(gcloud config get-value project)
    print_status "Detected Project ID from gcloud config: $PROJECT_ID"
else
    print_error "PROJECT_ID is not set. Please provide it as an argument, set it in the script, or run 'gcloud config set project YOUR_PROJECT_ID'."
fi

# Region and Service Name
REGION="$REGION_OVERRIDE"
SERVICE_NAME="$SERVICE_NAME_OVERRIDE"
print_status "Region: $REGION"
print_status "Service Name: $SERVICE_NAME"

# Artifact Registry Configuration
AR_REPO_NAME="$SERVICE_NAME-repo"
IMAGE_NAME="${REGION}-docker.pkg.dev/$PROJECT_ID/$AR_REPO_NAME/$SERVICE_NAME"

# --- Main Deployment Logic ---
print_status "Starting deployment to Google Cloud Platform for project $PROJECT_ID..."

# Set the project for the current session
gcloud config set project $PROJECT_ID

# Enable required APIs
print_status "Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# Create Artifact Registry repository if it doesn't exist
print_status "Checking for Artifact Registry repository: $AR_REPO_NAME..."
if ! gcloud artifacts repositories describe "$AR_REPO_NAME" --location="$REGION" --project="$PROJECT_ID" &> /dev/null; then
    print_warning "Artifact Registry repository not found. Creating it now..."
    gcloud artifacts repositories create "$AR_REPO_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --description="Docker repository for $SERVICE_NAME" \
        --project="$PROJECT_ID"
    print_success "Repository '$AR_REPO_NAME' created."
else
    print_status "Artifact Registry repository already exists."
fi

# Submit the build to Google Cloud Build
print_status "Submitting build to Google Cloud Build..."
gcloud builds submit --config cloudbuild.yaml \
    --substitutions=_REGION="$REGION",_REPO_NAME="$AR_REPO_NAME",_SERVICE_NAME="$SERVICE_NAME" .

print_success "Docker image built and pushed to Artifact Registry successfully."

# Deploy to Cloud Run
print_status "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_NAME:latest" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)')

print_success "Deployment completed successfully!"
print_success "Service URL: $SERVICE_URL"
print_success "Health check endpoint: $SERVICE_URL/api/health"

# --- Post-deployment Test ---
print_status "Testing the deployment with a health check..."
if curl -s -f "$SERVICE_URL/api/health" > /dev/null; then
    print_success "Health check passed! Service is up and running."
else
    print_warning "Health check failed. The service might still be initializing. Check the logs for more details."
fi

echo ""
print_status "Useful commands:"
echo "  View logs: gcloud run logs tail --service $SERVICE_NAME --region $REGION --project $PROJECT_ID"
echo "  Update service: gcloud run services update $SERVICE_NAME --region $REGION --project $PROJECT_ID"
echo "  Delete service: gcloud run services delete $SERVICE_NAME --region $REGION --project $PROJECT_ID"
