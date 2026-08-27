# Multi-stage build for SSR React dashboard application
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

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application for SSR (client + server bundles)
RUN npm run build

# Runtime stage
FROM node:latest AS runtime

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create non-root user with home directory
RUN groupadd -g 1001 nodejs && \
  useradd -u 1001 -g nodejs -m nodejs

# Copy package files for production
COPY package*.json ./

# Install production dependencies + tsx for running TypeScript
RUN npm ci --only=production && npm install tsx

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Copy server files
COPY --from=builder /app/server.prod.ts ./server.prod.ts
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://127.0.0.1:3001/health || exit 1

CMD ["node", "--import", "tsx", "server.prod.ts"]
