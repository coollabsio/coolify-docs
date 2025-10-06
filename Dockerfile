# Stage 1: Build Stage (oven/bun:1.1.44-alpine, ARM64)
FROM oven/bun:1.1.44-alpine AS builder

ARG VITE_ANALYTICS_DOMAIN=coolify.io/docs
ARG VITE_SITE_URL=https://coolify.io/docs/
ENV VITE_ANALYTICS_DOMAIN=${VITE_ANALYTICS_DOMAIN}
ENV VITE_SITE_URL=${VITE_SITE_URL}
RUN apk add --no-cache nodejs npm

# Set working directory and copy necessary files
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb ./

# Install Git and dependencies
RUN --mount=type=cache,target=/var/cache/apk \
    apk update && apk add --no-cache git

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.bun \
    --mount=type=cache,target=/root/.cache/bun \
    bun install

# Copy only necessary files for build
COPY docs/ ./docs/
COPY nginx/ ./nginx/
COPY tailwind.config.js .
COPY env.d.ts .
COPY tsconfig*.json ./

# Build with cache
RUN --mount=type=cache,target=/root/.bun \
    --mount=type=cache,target=/root/.cache/bun \
    --mount=type=cache,target=/app/docs/.vitepress/.cache \
    --mount=type=cache,target=/app/docs/.vitepress/cache \
    bun run build

# Stage 2: NGINX Unprivileged Setup (1.27.3-alpine-slim, ARM64)
FROM nginxinc/nginx-unprivileged:1.27.3-alpine-slim AS final

# Set working directory for NGINX and copy built files from the build stage
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html/docs

# Copy custom NGINX configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy custom redirects NGINX configuration
COPY nginx/redirects.conf /etc/nginx/conf.d/redirects.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
