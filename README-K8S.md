# 🛡️ AI-Powered Vulnerability Assessment Platform - Kubernetes Deployment

Complete self-contained Kubernetes deployment for the AI-powered vulnerability assessment platform featuring Scanner Dashboard, Advanced Assessment Platform, Security Center, and Interactive Vulnerability Network.

## 🚀 Quick Start

```bash
# One-command deployment
./deploy-k8s.sh

# Access the platform
kubectl port-forward -n vulnerability-scanner service/vulnerability-scanner-service 8080:8080
```

**Platform will be available at:**

- 🌐 **Main Interface**: http://localhost:8080
- 🔌 **WebSocket**: ws://localhost:8081
- 📊 **Monitoring**: http://localhost:8080/metrics

## 📋 Prerequisites

- Kubernetes 1.20+
- kubectl configured
- Docker (for building images)
- 4GB+ RAM available in cluster
- 50GB+ storage available

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ingress       │────│ Scanner Pods    │────│     Redis       │
│   Controller    │    │ (HPA: 2-10)     │    │   (Cache)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LoadBalancer  │    │ Persistent      │    │   Monitoring    │
│   (Optional)    │    │ Volumes         │    │   (Prometheus)  │
└──────────���──────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Components

### Core Services

- **vulnerability-scanner**: Main application pods (2-10 replicas with HPA)
- **redis**: Caching and session management
- **nginx-ingress**: Load balancing and SSL termination

### Storage

- **data**: SQLite database and scan results (10GB)
- **logs**: Application logs (5GB)
- **reports**: Generated reports (20GB)
- **nuclei-templates**: Vulnerability signatures (2GB)
- **backups**: Automated backups (50GB)

### Monitoring & Maintenance

- **ServiceMonitor**: Prometheus metrics collection
- **CronJobs**: Automated cleanup and backups
- **HPA**: Horizontal Pod Autoscaler
- **PDB**: Pod Disruption Budget

## 🎯 Features Included

### 🖥️ User Interfaces

- **Scanner Dashboard**: Main vulnerability scanning interface
- **Advanced Assessment**: Comprehensive security analysis platform
- **Security Center**: AI-powered dashboard with metrics and insights
- **Interactive Vulnerability Network**: Animated threat visualization

### 🔍 Scanning Capabilities

- **Nuclei**: 3000+ vulnerability templates
- **Nmap**: Network discovery and port scanning
- **Subfinder**: Subdomain enumeration
- **Custom AI Analysis**: Machine learning threat detection

### ☸️ Kubernetes Features

- **Auto-scaling**: HPA based on CPU/Memory
- **High Availability**: Multi-replica deployment
- **Rolling Updates**: Zero-downtime deployments
- **Health Checks**: Liveness, readiness, and startup probes
- **Resource Management**: Limits, quotas, and QoS
- **Security**: RBAC, SecurityContext, NetworkPolicies

## 🛠️ Deployment Commands

```bash
# Full deployment
./deploy-k8s.sh deploy

# Check status
./deploy-k8s.sh status

# Port forwarding for local access
./deploy-k8s.sh port-forward

# View logs
./deploy-k8s.sh logs

# Scale deployment
./deploy-k8s.sh scale 5

# Update with new image
./deploy-k8s.sh update --build

# Create backup
./deploy-k8s.sh backup

# Shell access
./deploy-k8s.sh shell

# Cleanup everything
./deploy-k8s.sh cleanup
```

## 📦 Manual Kubernetes Commands

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check pod status
kubectl get pods -n vulnerability-scanner

# View service endpoints
kubectl get endpoints -n vulnerability-scanner

# Check HPA status
kubectl get hpa -n vulnerability-scanner

# View ingress
kubectl get ingress -n vulnerability-scanner

# Check storage
kubectl get pvc -n vulnerability-scanner
```

## 🔐 Security Configuration

### RBAC

- ServiceAccount with minimal permissions
- Role-based access control
- Network policies (optional)

### Secrets Management

```bash
# Update secrets
kubectl create secret generic vulnerability-scanner-secrets \
  --from-literal=session-secret="your-secure-session-secret" \
  --from-literal=jwt-secret="your-secure-jwt-secret" \
  -n vulnerability-scanner --dry-run=client -o yaml | kubectl apply -f -
```

### Pod Security

- Non-root user (UID: 1001)
- Read-only root filesystem
- Dropped capabilities
- Security context constraints

## 📈 Scaling & Performance

### Horizontal Pod Autoscaler

```yaml
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Resource Management

```yaml
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2
    memory: 4Gi
```

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment vulnerability-scanner --replicas=5 -n vulnerability-scanner

# Check scaling status
kubectl get hpa -n vulnerability-scanner
```

## 💾 Data Management

### Persistent Storage

- **SQLite Database**: Scan results and configuration
- **Reports**: PDF and JSON exports
- **Logs**: Application and access logs
- **Templates**: Nuclei vulnerability signatures

### Backup Strategy

```bash
# Automated daily backups (1 AM)
# Manual backup
kubectl create job --from=cronjob/vulnerability-scanner-backup manual-backup-$(date +%Y%m%d) -n vulnerability-scanner

# List backups
kubectl exec -it deployment/vulnerability-scanner -n vulnerability-scanner -- ls -la /backups/

# Restore from backup
kubectl set env job/vulnerability-scanner-restore BACKUP_TO_RESTORE=vulnerability-scanner-20231201-010000 -n vulnerability-scanner
```

## 🔄 Updates & Maintenance

### Rolling Updates

```bash
# Update image
kubectl set image deployment/vulnerability-scanner vulnerability-scanner=vulnerability-scanner:v2.0 -n vulnerability-scanner

# Check rollout status
kubectl rollout status deployment/vulnerability-scanner -n vulnerability-scanner

# Rollback if needed
kubectl rollout undo deployment/vulnerability-scanner -n vulnerability-scanner
```

### Maintenance Tasks

```bash
# Update Nuclei templates
kubectl exec -it deployment/vulnerability-scanner -n vulnerability-scanner -- nuclei -update-templates

# Clean old reports
kubectl create job --from=cronjob/vulnerability-scanner-cleanup manual-cleanup-$(date +%Y%m%d) -n vulnerability-scanner

# Database maintenance
kubectl exec -it deployment/vulnerability-scanner -n vulnerability-scanner -- sqlite3 /app/data/production.db "VACUUM;"
```

## 🌐 Access Methods

### 1. Port Forward (Development)

```bash
kubectl port-forward -n vulnerability-scanner service/vulnerability-scanner-service 8080:8080
# Access: http://localhost:8080
```

### 2. NodePort (Direct cluster access)

```bash
# Get node IP and port
kubectl get nodes -o wide
kubectl get service vulnerability-scanner-nodeport -n vulnerability-scanner
# Access: http://<node-ip>:30080
```

### 3. Ingress (Production)

```bash
# Configure DNS or /etc/hosts
echo "<ingress-ip> vulnerability-scanner.local" >> /etc/hosts
# Access: http://vulnerability-scanner.local
```

### 4. LoadBalancer (Cloud)

```bash
# Change service type to LoadBalancer
kubectl patch service vulnerability-scanner-service -n vulnerability-scanner -p '{"spec":{"type":"LoadBalancer"}}'
# Get external IP
kubectl get service vulnerability-scanner-service -n vulnerability-scanner
```

## 📊 Monitoring

### Prometheus Metrics

- Application metrics: `/metrics`
- Custom vulnerability metrics
- Performance indicators

### Grafana Dashboard

```bash
# Import dashboard
kubectl apply -f k8s/09-monitoring.yaml

# Access Grafana (if deployed)
kubectl port-forward service/grafana 3000:3000 -n monitoring
```

### Health Checks

```bash
# Application health
curl http://localhost:8080/api/health

# Kubernetes health
kubectl get pods -n vulnerability-scanner
kubectl top pods -n vulnerability-scanner
```

## 🚨 Troubleshooting

### Common Issues

**Pods not starting:**

```bash
kubectl describe pods -n vulnerability-scanner
kubectl logs -f deployment/vulnerability-scanner -n vulnerability-scanner
```

**Storage issues:**

```bash
kubectl get pvc -n vulnerability-scanner
kubectl describe pvc vulnerability-scanner-data -n vulnerability-scanner
```

**Network issues:**

```bash
kubectl get endpoints -n vulnerability-scanner
kubectl describe service vulnerability-scanner-service -n vulnerability-scanner
```

**Resource constraints:**

```bash
kubectl top nodes
kubectl top pods -n vulnerability-scanner
kubectl describe hpa -n vulnerability-scanner
```

### Debug Commands

```bash
# Shell into pod
kubectl exec -it deployment/vulnerability-scanner -n vulnerability-scanner -- /bin/bash

# Check application logs
kubectl logs -f deployment/vulnerability-scanner -n vulnerability-scanner

# Network debugging
kubectl run debug --image=nicolaka/netshoot -it --rm -n vulnerability-scanner

# Resource usage
kubectl top pods -n vulnerability-scanner --sort-by=memory
```

## 🔧 Advanced Configuration

### Helm Deployment

```bash
# Deploy with Helm
helm install vulnerability-scanner ./helm -n vulnerability-scanner --create-namespace

# Upgrade
helm upgrade vulnerability-scanner ./helm -n vulnerability-scanner

# Custom values
helm install vulnerability-scanner ./helm -n vulnerability-scanner -f custom-values.yaml
```

### Custom Storage Class

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
  replication-type: none
```

### Network Policies

```bash
# Enable network policies
kubectl apply -f k8s/network-policies.yaml
```

## 📄 Production Checklist

- [ ] Update secrets in production
- [ ] Configure proper storage class
- [ ] Set up monitoring and alerting
- [ ] Configure backup retention
- [ ] Set resource limits and quotas
- [ ] Enable network policies
- [ ] Configure SSL/TLS
- [ ] Set up external DNS
- [ ] Configure log aggregation
- [ ] Test disaster recovery
- [ ] Document access procedures
- [ ] Set up automated updates

## 🆘 Support

For issues and support:

1. Check logs: `kubectl logs -f deployment/vulnerability-scanner -n vulnerability-scanner`
2. Verify health: `curl http://localhost:8080/api/health`
3. Check resources: `kubectl top pods -n vulnerability-scanner`
4. Review events: `kubectl get events -n vulnerability-scanner --sort-by='.firstTimestamp'`

## 📄 License

AI-Powered Vulnerability Assessment Platform - Self-Contained Kubernetes Deployment
