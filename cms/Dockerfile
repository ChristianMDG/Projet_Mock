FROM node:22-alpine AS builder

WORKDIR /opt/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build Strapi admin
RUN npm run build

# Runtime stage
FROM node:22-alpine

WORKDIR /opt/app

# Install runtime dependencies
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S strapi && \
  adduser -S strapi -u 1001

# Copy from builder
COPY --from=builder /opt/app ./

# Create uploads directory and set permissions
RUN mkdir -p public/uploads && \
  chown -R strapi:strapi /opt/app

# Switch to non-root user
USER strapi

EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://127.0.0.1:1337/_health || exit 1

CMD ["npm", "run", "start"]