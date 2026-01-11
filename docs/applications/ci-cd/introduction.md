---
title: "CI/CD with Git Providers"
description: "Learn how Coolify applications integrate with Git providers for continuous deployment. Understand the difference between Git-based applications and Docker Compose services."
---

# CI/CD with Git Providers

Applications in Coolify are designed to be deployed directly from **Git repositories**, enabling continuous integration and continuous deployment (CI/CD) workflows. This means your applications automatically update when you push code changes to your repository.

## How Git Integration Works

When you deploy an application in Coolify, you connect it to a Git repository from **any Git provider**. Coolify works with all Git platforms, including:

- **[GitHub](/applications/ci-cd/github/integration)** - Full GitHub App integration or deploy keys
- **[GitLab](/applications/ci-cd/gitlab/integration)** - GitLab integration with webhooks
- **[Bitbucket](/applications/ci-cd/bitbucket/integration)** - Bitbucket integration with webhooks
- **[Gitea](/applications/ci-cd/gitea/integration)** - Self-hosted Git platform
- **Any other Git provider** - Works with any Git-compatible platform with publicly accessible repositories or using deploy keys

Once connected, Coolify:

1. **Pulls your source code** from the repository
2. **Builds a Docker image** using your chosen [build pack](/applications/build-packs/overview)
3. **Deploys the container** to your server
4. **Watches for changes** and automatically redeploys when you push new commits (if auto-deploy is enabled)

## Key Benefits of Git-Based Deployments

### Automatic Deployments

Push code to your repository and Coolify automatically builds and deploys your application. No manual intervention needed.

### Preview Deployments

Test pull requests in isolated environments before merging to production. Each PR gets its own unique URL.

### Version Control Integration

- Track deployment history alongside your code commits
- Roll back to previous versions easily
- See exactly what code is running in production

### CI/CD Workflows

- Integrate with GitHub Actions, GitLab CI, and other CI tools
- Run tests before deployment
- Automate complex deployment pipelines

::: tip Alternative: Deploy Without Git
If you want to deploy your own application **without connecting to a Git provider**, you can deploy it as a [Service](/services/introduction) instead. Services allow you to:

- Upload a Docker Compose file directly to Coolify
- Deploy from Docker images without source code
- Manage the application manually without Git integration

This is useful for scenarios where you build your Docker images elsewhere or prefer manual control over deployments.
:::

## Repository Access Methods

Coolify supports multiple ways to access your Git repositories:

### Public Repositories

Simply provide the HTTPS URL of your public repository. No authentication needed. Works with any Git provider.

### Private Repositories

Choose from authentication methods based on your Git provider:

1. **Git Provider App Integration (Recommended for supported providers)**

   - Available for GitHub
   - Full integration with automatic webhooks
   - Pull request deployments
   - Commit status updates
   - No SSH key management

2. **Deploy Keys (Works with any Git provider)**
   - SSH-based authentication
   - Universal support - works with any Git platform
   - More manual webhook setup required
   - Better for air-gapped or restricted environments
   - Ideal for custom or self-hosted Git servers

## Supported Git Providers

While we provide detailed integration guides for popular platforms, **Coolify works with any Git provider** that supports standard Git protocols:

- **Public Repositories**: Any Git provider (no authentication required)
- **With App Integration**: GitHub
- **With Deploy Keys**: Any Git provider (GitHub, GitLab, Bitbucket, Gitea, Gogs, Forgejo, self-hosted solutions, and more)

## Next Steps

Ready to connect your Git provider? Choose your platform for detailed setup guides:

- **[GitHub Integration](/applications/ci-cd/github/integration)** - Connect GitHub repositories
- **[GitLab Integration](/applications/ci-cd/gitlab/integration)** - Connect GitLab repositories
- **[Bitbucket Integration](/applications/ci-cd/bitbucket/integration)** - Connect Bitbucket repositories
- **[Gitea Integration](/applications/ci-cd/gitea/integration)** - Connect self-hosted Gitea
- **[Other Git Providers](/applications/ci-cd/other-providers)** - Connect Gogs, Forgejo, or any custom Git server

Or learn about [Build Packs](/applications/build-packs/overview) to understand how Coolify transforms your code into running containers.
