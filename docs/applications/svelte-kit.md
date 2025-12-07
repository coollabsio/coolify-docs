---
title: SvelteKit
description: Deploy SvelteKit applications on Coolify with static builds using adapter-static or Node server builds with adapter-node.
---

# SvelteKit

SvelteKit is a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Node Server (`adapter-node`)

For server-side rendered SvelteKit applications.

#### Prerequisites

1. Install the Node adapter: `npm install @sveltejs/adapter-node`.
2. Update your `svelte.config.js` to use `adapter-node`:

```javascript
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter()
  }
};
```

3. Set `Ports Exposes` to `3000`.
4. Set `Build Pack` to `Dockerfile`.
5. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:24
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]
```

> [!TIP]
> This multi-stage build prunes dev dependencies, resulting in a smaller production image.

### Static Build (`adapter-static`)

For static sites that don't require a Node.js server.

#### Prerequisites

1. Install the static adapter: `npm install @sveltejs/adapter-static`.
2. Update your `svelte.config.js` to use `adapter-static`:

```javascript
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html' // for SPA mode
    })
  }
};
```

3. Set `Ports Exposes` to `80`.
4. Set `Build Pack` to `Dockerfile`.
5. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Deploy with Nixpacks

Nixpacks provides automatic detection of your SvelteKit project.

### Static Build (`adapter-static`)

You need to use `@sveltejs/adapter-static` ([docs](https://kit.svelte.dev/docs/adapter-static?utm_source=coolify.io)) adapter to build a static site.

1. Set your site to static `on` (under `Build Pack` section).
2. Set your `Publish Directory` to `/build`.

### Node Server (`adapter-node`)

You need to use `@sveltejs/adapter-node` ([docs](https://kit.svelte.dev/docs/adapter-node?utm_source=coolify.io)) adapter to build a Node server-based SvelteKit app.

1. Set your site to static to `off` (under `Build Pack` section).
2. Set your `Start Command` to `node build`.
