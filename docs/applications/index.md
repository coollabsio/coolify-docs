---
title: Applications
description: Deploy web applications on Coolify with Nixpacks, Docker, static sites, build packs, environment variables, and automated deployments.
---

# Applications

Application could be any type of web application. It could be a static site, a NodeJS application, a PHP application, etc.

For complex applications, you can use Docker Compose based deployments or the one-click services.

## How Deployments Work

Coolify deploys all applications as Docker containers. This means your app runs inside an isolated container on your server.

**Key Concepts:**
- **Docker Image:** A packaged version of your application with all dependencies included
- **Container:** A running instance of your Docker image
- **Build Process:** Transforms your source code into a Docker image ready for deployment

You have two options for deploying applications:

1. **Build on Coolify:** Use [build packs](/applications/build-packs/overview) to automatically create Docker images from your source code
2. **Use Pre-built Images:** Deploy existing images from registries like [Docker Hub](https://hub.docker.com/?utm_source=coolify.io) or [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry?utm_source=coolify.io)

::: tip Resource Management
Building Docker images can be resource-intensive. You can use a dedicated [build server](/knowledge-base/server/build-server) to handle builds separately from your production server.
:::

## Examples
::: info
  The list is not complete.

  You can host almost any application that you want, not just the ones listed here.
:::

- [Vite](/applications/vite)
- [Django](/applications/django)
- [Jekyll](/applications/jekyll)
- [Vue.js](/applications/vuejs)
- [Next.js](/applications/nextjs)
- [Nuxt](/applications/nuxt)
- [Laravel](/applications/laravel)
- [Symfony](/applications/symfony)
- [Ruby on Rails](/applications/rails)
- [SvelteKit](/applications/svelte-kit)


## General Configuration

### Commands

You can overwrite the default commands by setting a custom value on the UI.

- Build
- Install
- Start

::: info
  If you leave it empty, Nixpacks will detect which commands to run. For
  example, in Nodejs, it will check the lock files and run `npm ci` or `yarn
  install` or `pnpm install` accordingly.
:::

### Base Directory

It is useful for monorepos. You can set the base directory for all the commands that will be executed by Coolify.

### Public Directory

If you are building a static site, it is important to set the public directory, so the builder will know which directory to serve.

### Port Exposes

Port exposes are required for Docker Engine to know which ports to expose. The first port will be the default port for health checks.

Examples:

If you have a NodeJS application that listens on port 3000, you can set it like this: `3000`.
If you have a PHP-FPM application that listens on port 9000, you can set it like this: `9000`.
If you have a Nginx server that listens on port 80, you can set it like this: `80`.

### Port Mappings

::: warning
  You will lose some functionality if you map a port to the host system, like
  `Rolling Updates`.
:::

If you would like to map a port to the host system (server), you can do it here like this: `8080:80`.

This will map the port 8080 on the host system to the port 80 inside the container.

::: info
  If you would like to get performance boost and you do not need any domain
  (websocket server with VERY high traffic), you can map its port to the host,
  so the request will not go through the proxy.
:::

## Advanced

### Static Site (Is it a static site?)

> This feature is only available for Nixpacks buildpacks.

If you need to serve a static site (SPA, HTML, etc), you can set this to `true`. It will be served by Nginx. `Disabled by default`.

### Force HTTPS

If you would like to force HTTPS, so no HTTP connections allowed, you can set this to `true`. `Enabled by default`.

### Auto Deploy

> This feature is only available for GitHub App based repositories.

If you would like to deploy automatically when a new commit is pushed to the repository, you can set this to `true`. `Enabled by default`.

### Preview Deployments

Preview deployments are a great way to test your application before merging it into the main branch. Imagine it like a staging environment.

#### URL Template

You can setup your preview URL with a custom template. Default is <span v-pre>`{{pr_id}}.{{domain}}`</span>.

This means that if you open a Pull Request with the ID `123`, and you resource domain is `example.com` the preview URL will be `123.example.com`.

:::success TIP
  If you have several domains for your resource, the first will be used as the{" "}
  <span v-pre>`{{ domain }}`</span> part.
:::

#### Automated Preview Deployments

> This feature is only available for GitHub App based repositories.

If you would like to deploy a preview version of your application (based on a Pull Requests), you can set this to `true`. `Disabled by default`.

If set to `true`, all PR's that are opened against the resource's configured branch, will be deployed to a unique URL.

#### Manually Triggered Preview Deployments

You can manually deploy a Pull Request to a unique URL by clicking on the `Deploy` button on the Pull Request page.

### Git Submodules

If you are using git submodules, you can set this to `true`. `Enabled by default`.

### Git LFS

If you are using git lfs, you can set this to `true`. `Enabled by default`.

### Environment Variables

[Read here](/knowledge-base/environment-variables)

### Persistent Storage

[Read here](/knowledge-base/persistent-storage)

### Health Checks

By default, all containers are checked for liveness.

:::warning
  Traefik Proxy won't work if the container has health check defined, but it is
  `unhealthy`. If you do not know how to set up health checks, turn it off.
:::

### Rollbacks

You can rollback to a previous version of your resource. At the moment, only local images are supported, so you can only rollback to a locally available docker image.

### Resource Limits

By default, the container won't have any resource limits. You can set the limits here. For more details, read the [Docker documentation](https://docs.docker.com/reference/compose-file/services).

## Deployment Types

There are several types of application deployments available.

- Public Git Repository
- Private Git Repository ([GitHub App](https://docs.github.com/en/apps/using-github-apps/about-using-github-apps))
- Private Git Repository ([Deploy Key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys))
- Based on a Dockerfile
- Based on a Docker Compose
- Based on a Docker Image

## Build Packs

Build packs help transform your source code into Docker images. Coolify supports several build pack options to match different deployment needs:

- **[Nixpacks](/applications/build-packs/nixpacks)** - Automatic detection and building (recommended for most applications)
- **[Static](/applications/build-packs/static)** - For static sites and SPAs
- **[Dockerfile](/applications/build-packs/dockerfile)** - Use your own custom Dockerfile
- **[Docker Compose](/applications/build-packs/docker-compose)** - For multi-service applications
- **Docker Image** - Deploy pre-built images from registries

For detailed guides on each build pack, see the [Build Packs section](/applications/build-packs/overview).

:::tip Quick Start
Coolify uses [Nixpacks](https://nixpacks.com) by default, which automatically detects your application type and builds it accordingly. For most applications, you won't need to configure anything.
:::
