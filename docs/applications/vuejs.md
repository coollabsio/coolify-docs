---
title: Vue
description: Deploy Vue.js applications on Coolify with server builds using Node/Express or static SPA builds with routing support.
---

# Vue

Vue.js is an approachable, performant and versatile framework for building web user interfaces.

[Example repository.](https://github.com/coollabsio/coolify-examples/tree/main/vue)

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Server Build (Node.js/Express)

For Vue applications with a custom Node.js server (e.g., Express).

#### Prerequisites

1. Set `Ports Exposes` to `3000`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "server.js"]
```

### Static Build (SPA)

For standard Vue single-page applications.

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

### Static Build with Vue Router (SPA)

For Vue applications using Vue Router with history mode.

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

4. Create an `nginx.conf` file for Vue Router history mode:

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

Nixpacks provides automatic detection of your Vue project.

### Server Build (Node.js/Express)

- Set `Build Pack` to `nixpacks`.
- Set `Start Command` to `node server.js`.

### Static Build (SPA)

- Set `Build Pack` to `nixpacks`.
- Enable `Is it a static site?`.
- Set `Output Directory` to `dist`.

### Static Build with Vue Router (SPA)

- Set `Build Pack` to `nixpacks`.
- Enable `Is it a static site?`.
- Set `Output Directory` to `dist`.
