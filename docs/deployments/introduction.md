---
title: Introduction to Deployments
---

<ZoomableImage src="/docs/images/deployments/introduction/banner.webp" />

<br />

A deployment is the process of releasing a specific version of your application (packaged as a Docker container) to one or more environments. Coolify makes it easy to push updates, preview changes before they go live, and ensure your users never experience downtime.

## How Deployments Work
- **Container Registry:** Every deployment pulls a Docker image—either built by Coolify or pre–built and pushed to a registry (e.g., Docker Hub, GitHub Container Registry).
- **Deployment Configuration:** You define which image tag to deploy and any runtime settings (environment variables, ports, volumes, secrets).
- **Release Strategy:** Coolify supports multiple deployment strategies to match your needs:
  - **Rolling Updates:** Gradually replace old containers with new ones to maintain availability.
  - **Instant Rollback:** If something goes wrong, revert to the previous version with a single click.


## Preview Deployments
- **On‑Demand Previews:** Spin up a temporary environment for each pull request or branch, complete with its own URL.
- **Automatic Cleanup:** Preview deployments are automatically torn down when the branch is closed or merged.


## Zero‑Downtime Deployments
- **Health Checks & Readiness Probes:** Coolify waits for new containers to pass health checks before routing traffic.
- **Graceful Shutdown:** Old containers are drained of active connections before being terminated.

## What’s Next?
Explore the pages in the sidebar to learn more about:
- [Preview Deployments ↗](/deployments/previews)
- [Rollbacks ↗](/deployments/rollbacks)
