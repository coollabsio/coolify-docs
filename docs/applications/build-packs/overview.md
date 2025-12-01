---
title: Build Packs
description: Choose from Nixpacks, Static, Dockerfile, or Docker Compose build packs to create optimized Docker images for your application deployments.
---

<ZoomableImage src="/docs/images/builds/packs/packs-banner.webp" alt="Coolify packs banner" />

<br />

Coolify deploys every application as a Docker container. This means your application runs in its own isolated container. 

To run a container, you need a Docker image built from your source code. 

Build packs helps to create this Docker image and manage the build and deployment process.


## Why Use Build Packs?
- **Simplifies the Build Process:** Some Build packs automatically create the Docker image needed for deployment, so you don’t have to spend time on learning how to write Dockerfiles on your own.

- **Flexibility for Different Projects:** Since every application is different, you can choose a build pack that suits your specific needs, whether you prefer an automated solution or a custom configuration.


## How Build Packs Work
Each build pack offers a different approach to building your Docker image:

- **Automated Dockerfile Creation:** Build packs like Nixpacks & Static Build Pack automatically generate a Dockerfile based on your codebase and builds the docker image. 
  - This allows you to deploy your application quickly without having to write the Dockerfile yourself.

- **Custom Dockerfile or Docker Compose:** Build packs like Dockerfile & Docker Compose let you use a Dockerfile or Docker Compose file that you have already have on your codebase. 
  - This gives you full control over how your Docker image is built and how multiple services work together.


## Choose the Right Build Pack
Coolify have four build packs to meet different requirements:
- **Nixpacks:** Good for quick and automated Docker image creation with minimal configuration.

- **Static Build Pack:** Perfect for static sites and simple applications that don’t need server-side processing.

- **Dockerfile:** Use your own Dockerfile, if you want full control over the docker image build process.

- **Docker Compose:** Perfect to Deploy complex, multi-service applications using your custom Docker Compose file.


## How to use a Build Pack
Each build pack has its own step-by-step guide to help you use them in Coolify. Click the links below to learn more about each build pack.

- [Static Build Pack](/builds/packs/static)
- [Nixpack](/builds/packs/nixpacks)
- [Dockerfile](/builds/packs/dockerfile)
- [Docker Compose](/builds/packs/docker-compose)