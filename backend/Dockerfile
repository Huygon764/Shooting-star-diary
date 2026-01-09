# =============================================================================
# Stage 1: Builder - Install dependencies and compile TypeScript
# =============================================================================
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for native modules (if needed)
# RUN apk add --no-cache python3 make g++

# Copy package files first (better layer caching)
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to JavaScript
RUN yarn build

# Remove devDependencies after build
RUN yarn install --frozen-lockfile --production && yarn cache clean

# =============================================================================
# Stage 2: Runner - Production image
# =============================================================================
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

# Set environment
ENV NODE_ENV=production

# Copy built files and production dependencies from builder
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/package.json ./

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "dist/server.js"]