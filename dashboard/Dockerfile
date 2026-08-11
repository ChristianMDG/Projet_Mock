FROM node:latest AS builder

WORKDIR /app

# Build arguments for dashboard environment variables
ARG VITE_API_URL
ARG VITE_DOMAIN_MAIN
ARG VITE_ENV=production
ARG VITE_DEBUG=false

# Set environment variables for the build process
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_DOMAIN_MAIN=${VITE_DOMAIN_MAIN}
ENV VITE_ENV=${VITE_ENV}
ENV VITE_DEBUG=${VITE_DEBUG}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:latest

WORKDIR /app

# Install curl for health checks and http-server for serving static files
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
  rm -rf /var/lib/apt/lists/* && \
  npm install -g http-server

# Create non-root user
RUN groupadd -g 1001 nodejs && \
  useradd -u 1001 -g nodejs -m nodejs

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://127.0.0.1:3001/health.json || exit 1

# Serve static files with health endpoint support
CMD ["http-server", "dist", "-p", "3001", "--cors", "-c-1"]