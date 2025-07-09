# AI-Powered Vulnerability Assessment Platform - Production Docker Image
# Includes: Scanner Dashboard, Advanced Assessment, Security Center, Vulnerability Network

# Build stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    curl \
    unzip \
    sqlite \
    bash \
    ca-certificates \
    python3 \
    make \
    g++ \
    git

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies and security tools
RUN apk add --no-cache \
    curl \
    unzip \
    sqlite \
    bash \
    ca-certificates \
    nmap \
    nmap-scripts \
    bind-tools \
    wget \
    openssl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared

# Install Nuclei vulnerability scanner
RUN curl -L https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_3.2.9_linux_amd64.zip -o nuclei.zip && \
    unzip nuclei.zip && \
    mv nuclei /usr/local/bin/ && \
    chmod +x /usr/local/bin/nuclei && \
    rm nuclei.zip

# Install Subfinder for subdomain discovery
RUN curl -L https://github.com/projectdiscovery/subfinder/releases/latest/download/subfinder_2.6.3_linux_amd64.zip -o subfinder.zip && \
    unzip subfinder.zip && \
    mv subfinder /usr/local/bin/ && \
    chmod +x /usr/local/bin/subfinder && \
    rm subfinder.zip

# Create application directories
RUN mkdir -p /app/data /app/logs /app/nuclei-templates /app/reports

# Update Nuclei templates for latest vulnerability signatures
RUN nuclei -update-templates -templates-directory /app/nuclei-templates

# Create non-root user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser

# Set proper permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 8080 8081

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Environment variables
ENV NODE_ENV=production \
    PORT=8080 \
    WS_PORT=8081 \
    DATABASE_URL=/app/data/production.db \
    NUCLEI_PATH=/usr/local/bin/nuclei \
    NUCLEI_TEMPLATES_PATH=/app/nuclei-templates \
    SUBFINDER_PATH=/usr/local/bin/subfinder \
    NMAP_PATH=/usr/bin/nmap \
    LOG_LEVEL=info \
    MAX_CONCURRENT_SCANS=5 \
    NUCLEI_TIMEOUT=600 \
    NUCLEI_RATE_LIMIT=150

# Start the application
CMD ["npm", "start"]
