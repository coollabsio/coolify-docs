---
title: Nuxt
description: Deploy Nuxt applications on Coolify with server builds, static generation, and Nitro support using Nixpacks build configurations.
---

# Nuxt

Nuxt is an open source framework that makes web development intuitive and powerful.
Create performant and production-grade full-stack web apps and websites with confidence.

[Example repository.](https://github.com/coollabsio/coolify-examples/tree/main/nuxt)

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Server Build (using `nuxt build`)

For server-side rendered Nuxt applications.

#### Prerequisites

1. Set `Ports Exposes` to `3000`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24
WORKDIR /app
COPY --from=build /app/.output/ ./
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "/app/server/index.mjs"]
```

> [!TIP]
> This multi-stage build copies only the `.output` directory, resulting in a smaller production image.

### Static Build (using `nuxt generate`)

For static sites that don't require a Node.js server.

#### Prerequisites

1. Set `Ports Exposes` to `80`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run generate

FROM nginx
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nitro Server Build (using `nitro build`)

For Nitro-based applications, use the same Dockerfile as the Server Build above.

## Deploy with Nixpacks

Nixpacks provides automatic detection of your Nuxt project.

### Server Build (using `nuxt build`)

- Set `Build Pack` to `nixpacks`.
- Set `Start Command` to `node .output/server/index.mjs`.

Alternatively, you can set the `start` script inside `package.json` to `node .output/server/index.mjs`. Then Nixpacks will automatically use it as the start command.

### Static Build (using `nuxt generate`)

- Set `Build Pack` to `nixpacks`.
- Enable `Is it a static site?`.
- Set `Output Directory` to `dist`.

### Nitro Server Build (using `nitro build`)

- Set `Build Pack` to `nixpacks`.
- Set `Start Command` to `node .output/server/index.mjs`.

Alternatively, you can set the `start` script inside `package.json` to `node .output/server/index.mjs`. Then Nixpacks will automatically use it as the start command.
