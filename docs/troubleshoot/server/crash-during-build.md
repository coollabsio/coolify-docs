---
title: Server Crash During Build
description: Fix server crashes during Coolify builds by offloading to external build servers, using GitHub Actions, or upgrading server resources for Docker image builds.
---

# Server Unresponsive or crashes during Build

Coolify supports two deployment methods: deploying with a **pre-built** Docker image and building from **source**. Knowing which method you're using can help you fix performance problems better.

## 1. Understanding Your Deployment Method

### A. Pre-built Docker Image Deployment

- Coolify starts a new container from an existing Docker image that you or someone else have already built.

### B. Building from Source Deployment

- Coolify builds a Docker image on your server using your application’s source code, and then starts a container from this newly created docker image.

## 2. Troubleshooting Performance Issues

If your server becomes very slow or crashes during deployment, consider the following steps based on your deployment method:

- **For Pre-built Image Deployments:**

  - Since the container is started directly from the docker image, high resource usage is most likely due to the running application.
  - **Solution:** Consider upgrading your server to better accommodate the application’s resource needs.

- **For Building from Source Deployments:**

  - The docker image build process can overload your server.
  - **Solution:** Offload the build process to an external [Build Server](/knowledge-base/server/build-server), or use an alternative method such as [GitHub Actions](https://docs.github.com/en/actions) to handle the build externally. Alternatively, consider upgrading your server’s capacity.

- **General Tip:**  
  SSH into your server and run `htop` to monitor processes. Identify any process consuming excessive resources, and kill it if necessary.

## 3. Offloading Builds with GitHub Actions

To reduce the load on your server during deployments, follow this process:

- **Process:**
  - Use [GitHub Actions](https://docs.github.com/en/actions) to build your Docker image externally.
  - Push the built image to a container registry (e.g., [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)).
  - Once the build is complete, configure coolify to deploy the new version automatically.
- **Benefit:** This method minimizes the workload on your server, resulting in smoother deployments.

- **Learn More:** [View our GitHub Actions workflow file](https://github.com/coollabsio/documentation-coolify/blob/main/.github/workflows/production-build.yml).

## Summary

- **Deployment Methods:**
  - **Pre-built Image:** Directly starts a container from an existing image.
  - **Building from Source:** Builds an image on your server before starting a container.
- **Troubleshooting:**
  - Identify if the issue is due to the application’s resource needs or the image build process.
  - Upgrade your server or offload builds as needed.
- **Optimization:**
  - Using GitHub Actions to build Docker images externally can significantly reduce local resource usage.

## Support

If none of the above steps work, then follow this:

- **Community Help:** Join our [Discord community](https://coolify.io/discord) and create a post in the support forum channel.
- **What to Share:** The issue you are facing, your server specifications (e.g., operating system, CPU, RAM), and a description of the steps you’ve already tried.
