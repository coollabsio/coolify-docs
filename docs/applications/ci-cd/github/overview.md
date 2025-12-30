---
title: "Overview"
description: "Integrate GitHub with Coolify to deploy applications from repositories, enable automatic deployments, and manage pull requests seamlessly."
---

# GitHub Integration
Coolify simplifies deploying applications from your GitHub repositories or Docker images hosted on GitHub Container Registry.

GitHub integration with Coolify supports deploying from both private and public repositories, automatic deployments on new commits, and pull request deployments.


## Ways to Use GitHub with Coolify

You can integrate GitHub with Coolify in several ways, depending on your needs. Below are the available options, each linked to a detailed guide for easy setup:

| Method | Description |
|--------|-------------|
| [Public Repository](/applications/ci-cd/github/public-repository) | Deploy applications directly using the URL of a public repository. |
| [Private Repository using GitHub App](/applications/ci-cd/github/setup-app) | Install the GitHub App on your personal account or organization to deploy both private and public repositories. |
| [Private Repository using Deploy Key](/applications/ci-cd/github/deploy-key) | Deploy applications from private repositories using a deploy key. |
| [Automatic Deployments](/applications/ci-cd/github/auto-deploy) | Automatically deploy new versions of your application when commits are pushed to a specific branch in your GitHub repository. |
| [Build and Deploy Using GitHub Actions](/applications/ci-cd/github/actions) | Build your application on GitHub using GitHub Actions as part of your CI/CD pipeline, push it to any Docker registry (such as GHCR or Docker Hub), and automatically deploy on Coolify. |
| [Preview Deployments](/applications/ci-cd/github/preview-deploy) | Automatically deploy new versions of your application based on pull requests. |