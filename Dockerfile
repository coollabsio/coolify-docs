# Stage 1: Build Stage (oven/bun:1.4.4-alpine)
FROM oven/bun:1.4.4-alpine AS builder

ARG VITE_ANALYTICS_DOMAIN=coolify.io/docs
ARG VITE_SITE_URL=https://coolify.io/docs/
ENV VITE_ANALYTICS_DOMAIN=${VITE_ANALYTICS_DOMAIN}
ENV VITE_SITE_URL=${VITE_SITE_URL}
RUN apk add --no-cache nodejs npm fontconfig ttf-dejavu font-noto font-noto-emoji
RUN fc-cache -f

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

# Safe default (no X-Robots-Tag). Replaced below when this image is built for a preview host.
COPY nginx/preview-robots.conf /etc/nginx/conf.d/preview-robots.conf

# Same site URL as the builder stage. Redeclared here because Docker ARGs do not cross stages.
# Only an exact coolify.io build stays indexable. Every other host (next.coolify.io included)
# gets X-Robots-Tag on the responses from this image, and the HTML build emits a matching meta tag.
ARG VITE_SITE_URL=https://coolify.io/docs/
USER root
RUN host=$(printf '%s' "$VITE_SITE_URL" | sed -E 's#^[a-zA-Z][a-zA-Z0-9+.-]*://([^/:]+).*#\1#') && \
    case "$host" in \
      coolify.io) \
        printf '# Indexable docs host (%s). No sitewide X-Robots-Tag.\n' "$host" > /etc/nginx/conf.d/preview-robots.conf ;; \
      *) \
        printf 'add_header X-Robots-Tag "noindex, nofollow" always;\n' > /etc/nginx/conf.d/preview-robots.conf ;; \
    esac && \
    chmod 644 /etc/nginx/conf.d/preview-robots.conf
USER nginx

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
