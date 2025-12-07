---
title: VitePress
description: Deploy VitePress documentation sites on Coolify with Vite, Vue, Nixpacks, and static site generation from Markdown files.
---

# VitePress

Vite & Vue Powered Static Site Generator. Markdown to Beautiful Docs in Minutes.

[Example repository.](https://github.com/coollabsio/coolify-examples/tree/main/vitepress)

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Static Build

#### Prerequisites

1. Set `Ports Exposes` to `80`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run docs:build

FROM nginx
COPY --from=build /app/.vitepress/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> [!NOTE]
> Adjust the build command (`docs:build`) and output path (`.vitepress/dist`) based on your project configuration. Check your `package.json` scripts and VitePress config for the correct values.

### With Custom Base Path

If your VitePress site is deployed to a subdirectory, you may need to configure nginx for proper routing:

#### Prerequisites

1. Set `Ports Exposes` to `80`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run docs:build

FROM nginx
COPY --from=build /app/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

4. Create an `nginx.conf` file:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
```

## Deploy with Nixpacks

Nixpacks provides automatic detection of your VitePress project.

### Build (Static)

- Use `Nixpacks`.
- Turn on `Is it a static site?`.
- Set `Base Directory` to `/.vitepress/static`.
- Set `Publish Directory` to `/.vitepress/dist`.
