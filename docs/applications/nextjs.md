---
title: NextJS
description: Deploy Next.js applications on Coolify with server-side rendering, static builds, Nixpacks, or custom Dockerfile configurations.
---

# NextJS

NextJS is a React framework that enables functionality such as server-side rendering and generating static websites.

[Example repository.](https://github.com/coollabsio/coolify-examples/tree/main/nextjs)

## Deploy with Dockerfile

If you want more control over the build process or are experiencing issues with Nixpacks, using a Dockerfile is the recommended approach.

### Server Build (Node.js)

For server-side rendered Next.js applications.

#### Prerequisites

1. Set `Ports Exposes` to `3000`.
2. Set `Build Pack` to `Dockerfile`.
3. Add `output: 'standalone'` to your `next.config.js`:

```javascript
module.exports = {
  output: 'standalone',
}
```

4. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS base

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

> [!TIP]
> This Dockerfile is from the official [Next.js with Docker example](https://github.com/vercel/next.js/tree/canary/examples/with-docker?utm_source=coolify.io). It uses multi-stage builds to create a minimal production image.

### Static Build (SPA)

For static exports that don't require a Node.js server.

#### Prerequisites

1. Set `Ports Exposes` to `80`.
2. Set `Build Pack` to `Dockerfile`.
3. Add `output: 'export'` to your `next.config.js`:

```javascript
module.exports = {
  output: 'export',
}
```

4. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Deploy with Nixpacks

Nixpacks provides a simpler setup with automatic detection of your project configuration.

### Server Build (Node.js)

- Set `Build Pack` to `nixpacks`.

### Static Build (SPA)

- Set `Build Pack` to `nixpacks`.
- Enable `Is it a static site?`.
- Set `Output Directory` to `out`.
