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

#### Working with Private Git Submodules

When deploying applications with private Git submodules, you may encounter authentication failures during the clone process. This section explains how to properly configure your repository to work with Coolify.

##### Common Issues

You might see errors like:

```
fatal: could not read Username for 'https://github.com': No such device or address
fatal: clone of 'https://github.com/org/submodule.git' into submodule path failed
```

or

```
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

These errors occur because Coolify uses SSH protocol for Git operations, which requires proper authentication configuration for submodules.

##### Prerequisites

Before configuring submodules, ensure:

- Your GitHub App has access permissions to both the main repository AND all submodule repositories
- The "Submodules" checkbox in Advanced settings is enabled (it should be enabled by default)

##### Solution 1: Use Relative Paths (Recommended)

The most reliable solution is to use relative paths instead of absolute URLs in your `.gitmodules` file. This approach works because Coolify uses SSH protocol for authentication, and relative paths inherit the authentication from the parent repository.

**Before:**
```ini
[submodule "prisma"]
    path = prisma
    url = https://github.com/organization/prisma.git
```

**After:**
```ini
[submodule "prisma"]
    path = prisma
    url = ../prisma.git
```

::: success Important Notes
- All submodules must be from the same GitHub organization or user when using relative paths
- Keep the "Submodules" checkbox enabled in Advanced settings
- This solution works for both GitHub App and Deploy Key authentication methods
:::

##### Solution 2: SSH Key Configuration

If relative paths don't work for your use case, you can manually configure SSH keys:

1. Navigate to your Coolify server settings
2. Add the server's SSH key to your GitHub account's SSH keys (not just the repository's deploy keys)
3. Ensure the GitHub App has content access to all submodule repositories in your organization settings

##### Solution 3: Alternative Workaround

Some users have reported success with an alternative approach, though this is counter-intuitive:

1. Go to your application's Advanced settings
2. Uncheck the "Submodules" option

::: warning Note
This workaround has mixed results and may not work for all configurations. It's recommended to try Solution 1 first.
:::

##### Troubleshooting

If you're still experiencing issues:

1. **Verify GitHub App Permissions:**
   - Go to your GitHub organization settings
   - Navigate to GitHub Apps → Coolify
   - Ensure the app has access to all repositories including submodules

2. **Check Submodule URLs:**
   - Run `git submodule status` in your repository
   - Verify all submodule URLs are using relative paths
   - Ensure submodules are from the same organization

3. **Test Locally:**
   - Clone your repository with submodules locally: `git clone --recurse-submodules <your-repo>`
   - If it fails locally with relative paths, the issue is with your `.gitmodules` configuration

4. **Review Deployment Logs:**
   - Check the Coolify deployment logs for specific error messages
   - Look for authentication or permission-related errors

##### Example Configuration

Here's a complete example of a properly configured `.gitmodules` file for an organization with multiple submodules:

```ini
[submodule "backend"]
    path = backend
    url = ../backend.git
[submodule "shared-components"]
    path = packages/shared
    url = ../shared-components.git
[submodule "config"]
    path = config
    url = ../config.git
```

::: tip Pro Tip
After updating your `.gitmodules` file, commit and push the changes to your repository. Coolify will use the updated configuration on the next deployment.
:::

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