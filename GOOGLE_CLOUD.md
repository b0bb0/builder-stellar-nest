# Google Cloud Deployment Guide

This guide will help you deploy the Fusion Scanner application to Google Cloud Platform using Cloud Run.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Cloud CLI**: Install the `gcloud` CLI tool
3. **Docker**: Install Docker for local testing (optional)
4. **Project Setup**: Create a Google Cloud project

## Quick Setup

### 1. Install Google Cloud CLI

```bash
# On macOS
brew install google-cloud-sdk

# On Ubuntu/Debian
sudo apt-get install google-cloud-cli

# On Windows
# Download and install from: https://cloud.google.com/sdk/docs/install
```

### 2. Authenticate and Setup

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID (replace with your actual project ID)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Configure Deployment Script

Edit the `deploy-gcp.sh` file and set your project ID:

```bash
# Edit deploy-gcp.sh
PROJECT_ID="your-actual-project-id"
```

### 4. Deploy to Google Cloud

```bash
# Option 1: Use the deployment script (recommended)
npm run deploy:gcp

# Option 2: Manual deployment
npm run docker:build
npm run gcp:build
npm run gcp:deploy
```

## Deployment Options

### Option 1: Automated Deployment Script

The `deploy-gcp.sh` script handles the entire deployment process:

```bash
./deploy-gcp.sh
```

This script will:

- Enable required Google Cloud APIs
- Build and push the Docker image
- Deploy to Cloud Run
- Provide the service URL
- Test the deployment

### Option 2: Manual Steps

1. **Build the application locally**:

   ```bash
   npm run build
   ```

2. **Build Docker image**:

   ```bash
   docker build -t gcr.io/YOUR_PROJECT_ID/fusion-scanner .
   ```

3. **Push to Google Container Registry**:

   ```bash
   gcloud auth configure-docker
   docker push gcr.io/YOUR_PROJECT_ID/fusion-scanner
   ```

4. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy fusion-scanner \
     --image gcr.io/YOUR_PROJECT_ID/fusion-scanner \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080 \
     --memory 2Gi \
     --cpu 2
   ```

### Option 3: Cloud Build (CI/CD)

For automated deployments, use Cloud Build:

1. **Submit build**:

   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

2. **Set up triggers** (optional):
   - Connect your repository to Cloud Build
   - Set up automatic deployments on push

## Configuration

### Environment Variables

The application automatically sets these environment variables in production:

- `NODE_ENV=production`
- `PORT=8080`

To add custom environment variables, update the deployment configuration:

```bash
gcloud run services update fusion-scanner \
  --set-env-vars "CUSTOM_VAR=value" \
  --region us-central1
```

### Resource Configuration

Default Cloud Run configuration:

- **Memory**: 2GB
- **CPU**: 2 vCPU
- **Max instances**: 10
- **Timeout**: 300 seconds
- **Concurrency**: 100 requests per instance

To modify these settings, update the `cloud-run-service.yaml` file or use gcloud commands:

```bash
gcloud run services update fusion-scanner \
  --memory 4Gi \
  --cpu 4 \
  --max-instances 20 \
  --region us-central1
```

## Monitoring and Management

### View Logs

```bash
# Tail logs in real-time
gcloud run logs tail fusion-scanner --region us-central1

# View recent logs
gcloud run logs read fusion-scanner --region us-central1
```

### Service Management

```bash
# Get service details
gcloud run services describe fusion-scanner --region us-central1

# Update service
gcloud run services update fusion-scanner --region us-central1

# Delete service
gcloud run services delete fusion-scanner --region us-central1
```

### Health Checks

The application includes health check endpoints:

- **Health**: `https://your-service-url/api/health`
- **Ping**: `https://your-service-url/api/ping`

## Cost Optimization

### Cloud Run Pricing

Cloud Run charges based on:

- **CPU and Memory**: Only when processing requests
- **Requests**: Number of requests processed
- **Cold starts**: Minimal cost for instance startup

### Optimization Tips

1. **Set minimum instances to 0** for cost savings (default)
2. **Use appropriate memory/CPU** allocation
3. **Implement request caching** where possible
4. **Monitor usage** with Cloud Monitoring

## Security

### Default Security Features

- **HTTPS only**: All traffic is encrypted
- **IAM integration**: Controlled access
- **VPC support**: Network isolation (if needed)
- **Container scanning**: Automatic vulnerability detection

### Additional Security

```bash
# Restrict access to authenticated users only
gcloud run services update fusion-scanner \
  --no-allow-unauthenticated \
  --region us-central1

# Add custom domain with SSL
gcloud run domain-mappings create \
  --service fusion-scanner \
  --domain your-domain.com \
  --region us-central1
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check Docker configuration and dependencies
2. **Service won't start**: Check logs and health endpoints
3. **Authentication errors**: Verify gcloud auth and project settings
4. **Resource limits**: Increase memory/CPU if needed

### Debug Commands

```bash
# Check service status
gcloud run services list

# View detailed service info
gcloud run services describe fusion-scanner --region us-central1

# Check recent deployments
gcloud run revisions list --service fusion-scanner --region us-central1
```

## Support

For issues specific to:

- **Google Cloud**: Check [Cloud Run documentation](https://cloud.google.com/run/docs)
- **Application**: Check the main project README.md
- **Billing**: Monitor usage in Google Cloud Console

## Next Steps

After deployment:

1. Set up monitoring and alerting
2. Configure custom domains
3. Set up CI/CD with Cloud Build
4. Implement backup strategies
5. Scale configuration as needed

Your application should now be running on Google Cloud Run! 🚀
