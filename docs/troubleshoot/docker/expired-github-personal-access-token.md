---
title: "Expired GitHub Personal Access Token (PAT)"
description: "Fix GitHub Container Registry authentication errors by logging out of ghcr.io or renewing expired GitHub Personal Access Tokens for Docker deployments."
---
# Expired GitHub Personal Access Token (PAT)

If you encounter the following errors, it means Docker cannot authenticate with the GitHub Container Registry (ghcr.io):

## Error

```sh
  Error response from daemon: Head "https://ghcr.io/v2/coollabsio/coolify-helper/manifests/1.0.1": unauthorized: authentication required
```
> or

```sh
  Unable to find image 'ghcr.io/coollabsio/coolify-helper:latest' locally
  docker: Error response from daemon: Head "https://ghcr.io/v2/coollabsio/coolify-helper/manifests/latest": denied: denied
```

## Solution
You have two options:
- Log out of GitHub Container Registry (ghcr.io) by running:
  ```sh
    docker logout ghcr.io
  ```
- Renew your GitHub Personal Access Token (PAT) if you need to maintain authenticated access for deployments.
