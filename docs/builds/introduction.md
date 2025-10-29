---
title: Introduction to Builds
description: Deploy applications as Docker containers with Coolify using build packs like Nixpacks, Dockerfile, Docker Compose, or pre-built registry images.
---

<ZoomableImage src="/docs/images/builds/introduction/builds-banner.webp" alt="Coolify builds banner" />

<br />

Coolify deploys all applications as Docker containers. This means your app, database, or website runs inside a container.

No matter what you deploy or which build pack you use, it is always run as a Docker container.

## How Docker Containers Work

- **Docker Image:** To run a container, you need a Docker image.
- **Dockerfile:** The image is built using a Dockerfile, just a file with step-by-step instructions to build the docker image.
- **Build Process:** If you're building your own application, you'll need to create your docker image using a Dockerfile.
  - Coolify helps with this build process by letting you use different build packs. A commonly used build pack is [Nixpacks](https://nixpacks.com?utm_source=coolify.io), which automatically prepares a Dockerfile and builds the docker image for you.

## Build Packs in Coolify

Coolify offers build packs like [Nixpack](https://nixpacks.com?utm_source=coolify.io) and **Static Build Pack** that automatically create your Docker image.

If you need more control over the process, you can write your own Dockerfile and Docker Compose file. In that case, Coolify will use your file to build the image on the server and deploy it as a container.

## Using Pre-built Images

If you already have a Docker image stored in a registry (for example, [Docker Hub](https://hub.docker.com/?utm_source=coolify.io) or [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry?utm_source=coolify.io)), you can use that image directly in Coolify. This means you do not have to rebuild the image on your server.

## Managing Build Resources

Building Docker images can consume a lot of resources on your server, potentially causing it to crash.

To reduce the load on your main server, Coolify allows you to connect additional servers to manage the build process.

You can set up a separate [build server](/builds/servers) to handle the builds, or use external tools like [GitHub Actions](https://github.com/features/actions?utm_source=coolify.io) to build your images and push them to any container registry.

Once the images are pushed, you can easily use them on Coolify.

## What's Next?

Check the pages in the sidebar to learn more about build packs, build commands, and build servers.
