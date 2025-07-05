# Multi-stage build for optimized production image

# Build stage
FROM node:18-alpine AS builder

# Install system dependencies for building
RUN apk add --no-cache \
    curl \
    unzip \
    sqlite \
    bash \
    ca-certificates \
    python3 \
    make \
    g++

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy application code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install runtime system dependencies
RUN apk add --no-cache \
    curl \
    unzip \
    sqlite \
    bash \
    ca-certificates

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Copy other necessary files
COPY shared ./shared

# Install Nuclei
RUN curl -L https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_3.2.9_linux_amd64.zip -o nuclei.zip && \
    unzip nuclei.zip && \
    mv nuclei /usr/local/bin/ && \
    chmod +x /usr/local/bin/nuclei && \
    rm nuclei.zip

# Create directories
RUN mkdir -p /app/data /app/logs /app/nuclei-templates

# Update Nuclei templates
RUN nuclei -update-templates -templates-directory /app/nuclei-templates

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S luminous -u 1001

# Set ownership
RUN chown -R luminous:nodejs /app

# Switch to non-root user
USER luminous

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Start application
CMD ["npm", "start"]
