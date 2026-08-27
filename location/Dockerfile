# Multi-stage build for SSR React application
FROM node:latest AS builder

WORKDIR /app

# Build arguments for frontend environment variables
ARG VITE_API_URL
ARG VITE_CMS_API_URL
ARG VITE_CMS_API_KEY
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_FACEBOOK_APP_ID
ARG VITE_DOMAIN_CMS
ARG VITE_GA_MEASUREMENT_ID

# Set environment variables for the build process
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CMS_API_URL=${VITE_CMS_API_URL}
ENV VITE_CMS_API_KEY=${VITE_CMS_API_KEY}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ENV VITE_FACEBOOK_APP_ID=${VITE_FACEBOOK_APP_ID}
ENV VITE_DOMAIN_CMS=${VITE_DOMAIN_CMS}
ENV VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID}
ENV VITE_ENV=production
ENV VITE_DEBUG=false

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application for SSR
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
# Copy src/utils needed for server.prod.ts SEO imports
COPY --from=builder /app/src/utils ./src/utils
# Copy src/constants needed for seo.ts ROUTES import
COPY --from=builder /app/src/constants ./src/constants
# Copy src/dayjs needed for dayjs.ts custom locale import
COPY --from=builder /app/src/dayjs ./src/dayjs

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1

CMD ["node", "--import", "tsx", "server.prod.ts"]
