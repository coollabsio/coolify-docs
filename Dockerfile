# Stage 1: Build Stage (oven/bun:1.3.6-alpine)
FROM oven/bun:1.3.6-alpine AS builder

ARG VITE_ANALYTICS_DOMAIN=coolify.io/docs
ARG VITE_SITE_URL=https://coolify.io/docs/
ENV VITE_ANALYTICS_DOMAIN=${VITE_ANALYTICS_DOMAIN}
ENV VITE_SITE_URL=${VITE_SITE_URL}
RUN apk add --no-cache nodejs npm

# Set working directory and copy necessary files
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock ./

# Install Git and dependencies
RUN --mount=type=cache,target=/var/cache/apk \
    apk update && apk add --no-cache git

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.bun \
    --mount=type=cache,target=/root/.cache/bun \
    bun install

# Copy only necessary files for build
COPY config/ ./config/
COPY src/ ./src/
COPY nginx/ ./nginx/
COPY scripts/ ./scripts/
COPY env.d.ts .
COPY source.config.ts .
COPY tsconfig*.json ./
COPY vite.config.ts .
COPY public/ ./public/
COPY content/ ./content/

# Copy git history for lastUpdated timestamps
COPY .git/ ./.git/

# Build with cache
RUN --mount=type=cache,target=/root/.bun \
    --mount=type=cache,target=/root/.cache/bun \
    --mount=type=cache,target=/app/.source \
    bun run build

# Stage 2: NGINX Unprivileged Setup
FROM nginxinc/nginx-unprivileged:1.30.1-alpine-slim AS final

# Set working directory for NGINX and copy built files from the build stage
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy custom redirects NGINX configuration
COPY nginx/redirects.conf /etc/nginx/conf.d/redirects.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
