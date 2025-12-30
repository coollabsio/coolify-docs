---
title: "Other Git Providers"
description: "Connect any Git provider to Coolify using deploy keys and webhooks for automatic deployments. Works with Gogs, Forgejo, and custom Git servers."
---

# Other Git Providers

This guide will show you how to use other Git provider with Coolify, such as Gogs, Forgejo, and any other Git-compatible platform.

## Public Repositories

You can use public repositories from any Git provider without any additional setup.

1. Select the `Public repository` option in Coolify when you create a new resource.
2. Add your repository URL to the input field, for example: `https://git.example.com/username/repository`

::: warning Caution
You can only use the HTTPS URL.
:::

3. That's it! Coolify will automatically pull the latest version of your repository and deploy it.

## Private Repositories

Private repositories require deploy keys for authentication.

### With Deploy Keys

1. Add a private key (aka `Deploy Keys`) to Coolify and to your Git repository in the repository settings (usually under `Settings` / `Deploy Keys` or `SSH Keys`).

::: warning Caution

- You can generate a new key pair with the following command:

```bash
ssh-keygen -t ed25519 -C "coolify_deploy_key"
```

- Or you can also use Coolify to generate a new key for you in the `Keys & Tokens` menu.
  :::

2. Create a new resource and select the `Private Repository (with deploy key)`
3. Add your repository URL to the input field, for example: `git@git.example.com:username/repository.git`

::: warning Caution
You need to use the SSH URL, so the one that starts with `git@`.
:::

4. That's it! Coolify will automatically pull the latest version of your repository and deploy it.

## Automatic commit deployments (Optional)

For Git providers without direct integration, automatic deployments require triggering the deployment via the Deploy Webhook endpoint.

::: warning Caution
This requires your Git provider to support workflow automation or webhook actions (similar to GitHub Actions).

If your provider doesn't support this, you'll need to trigger deployments manually through the Coolify dashboard.
:::

### Prerequisites

1. Create a [Coolify API Token](/api-reference/authorization) in your Coolify dashboard
2. Get the Deploy Webhook URL from your resource (Your resource → `Webhooks` menu → `Deploy Webhook`)

### Setup with Workflow/CI System

If your Git provider supports workflow automation (like GitHub Actions, GitLab CI, Forgejo Actions, etc.), you can trigger deployments automatically:

1. Add your Coolify API token to your repository secrets (e.g., `COOLIFY_TOKEN`)
2. Add the Deploy Webhook URL to your repository secrets (e.g., `COOLIFY_WEBHOOK`)
3. Create a workflow file that triggers on push events:

```yaml
# Example workflow (syntax varies by provider)
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coolify Deployment
        run: |
          curl --request GET "${{ secrets.COOLIFY_WEBHOOK }}" \
            --header "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}"
```

4. That's it! Now when you push to your repository, the workflow will trigger and send a request to Coolify to start a new deployment.

::: tip Alternative: Direct Webhooks
Some Git providers allow webhooks to send custom headers. If supported, you can configure a webhook to send a GET request with the `Authorization: Bearer YOUR_TOKEN` header directly to the Deploy Webhook URL, without needing a workflow file.
:::

## Supported Git Providers

This method works with any Git provider that supports standard Git protocols, including:

- Gogs
- Forgejo
- Self-hosted GitLab CE/EE instances
- Custom Git servers (gitolite, etc.)
- Any Git-over-SSH compatible platform

## Comparison with App Integration

| Feature               | Other Providers            | GitHub, GitLab, Bitbucket, Gitea |
| --------------------- | -------------------------- | -------------------------------- |
| Repository access     | ✅ Yes                     | ✅ Yes                           |
| Manual deployments    | ✅ Yes                     | ✅ Yes                           |
| Auto-deploy           | ⚠️ Requires workflow setup | ✅ Automatic                     |
| Pull request previews | ❌ No                      | ✅ Yes                           |
