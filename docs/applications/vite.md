---
title: Vite
description: Deploy Vite applications on Coolify with TypeScript or JavaScript, Nixpacks build process, and static site generation.
---

# Vite

Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.

[Example repository.](https://github.com/coollabsio/coolify-examples/tree/main/vite)

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Static Build (TypeScript or JavaScript)

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
RUN npm run build

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### With Client-Side Routing

If your Vite app uses client-side routing (e.g., React Router, Vue Router), create a custom nginx configuration:

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
RUN npm run build

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

4. Create an `nginx.conf` file for client-side routing:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Deploy with Nixpacks

Nixpacks provides automatic detection of your Vite project.

### Vanilla TypeScript Build (Static)

- Set `Build Pack` to `nixpacks`.
- Enable `Is it a static site?`.
- Set `Publish Directory` to `dist`.

### Vanilla JavaScript Build (Static)

- Set `Build Pack` to `nixpacks`.
- Enable `Is it a static site?`.
- Set `Publish Directory` to `dist`.
