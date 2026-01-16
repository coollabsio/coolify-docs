---
title: GitHub Auto Deploy
description: Automatically deploy applications from GitHub repositories in Coolify using GitHub Apps, Actions, or webhooks.
---

# GitHub Auto Deploy
Coolify can automatically deploy new versions of your application whenever you push changes to your GitHub repository.

There are three methods to set up automatic deployments on Coolify:
- [GitHub App](#github-app)
- [GitHub Actions](#github-actions)
- [Webhooks](#webhooks)

## GitHub App
We have a dedicated guide for setting up a GitHub App, which you can follow here: [/github/setup-app](/applications/ci-cd/github/setup-app).

Coolify automatically enables "Auto Deploy" after you set up your GitHub App. If it doesn't, enable it on your application by following these steps:

<ZoomableImage src="/docs/images/applications/ci-cd/github/auto-deploy/github-app/1.webp" />

1. Open your application configuration page.
2. Go to the "Advanced" page.
3. Enable "Auto Deploy" under the general section.

## GitHub Actions
We have a dedicated guide for setting up GitHub Actions, which you can follow here: [/github/setup-app](/applications/ci-cd/github/setup-app).

## Webhooks

### 1. Enable Auto Deploy
<ZoomableImage src="/docs/images/applications/ci-cd/github/auto-deploy/webhooks/1.webp" />

1. Open your application configuration page.
2. Go to the "Advanced" page.
3. Enable "Auto Deploy" under the general section.

### 2. Set Up GitHub Webhook Secret
<ZoomableImage src="/docs/images/applications/ci-cd/github/auto-deploy/webhooks/2.webp" />

1. Enter a GitHub webhook secret (this must be a random string; you can use tools like [Random String Generator](https://getrandomgenerator.com/string)).
2. Save the webhook URL somewhere safe, we'll need it later.

::: warning IMPORTANT
A webhook secret acts like a password. Coolify only accepts the webhook if the secret matches.
:::

### 3. Set Up Webhook on GitHub
<ZoomableImage src="/docs/images/applications/ci-cd/github/auto-deploy/webhooks/3.webp" />

1. Go to your repository settings page.
2. Click on "Webhooks" from the sidebar.
3. Click the "Add webhook" button.

<ZoomableImage src="/docs/images/applications/ci-cd/github/auto-deploy/webhooks/4.webp" />

4. Enter the previously copied webhook URL from Coolify in the "Payload URL" field.
5. Enter the webhook secret from Coolify in the "Secret" field.
6. Enable "Enable SSL verification".
7. Select "Just the `push` event".
8. Enable "Active".
9. Click the "Add webhook" button.

After clicking "Add webhook", you'll see a page like the one shown below:

<ZoomableImage src="/docs/images/applications/ci-cd/github/auto-deploy/webhooks/5.webp" />

That's it! Coolify will automatically redeploy your application whenever you push changes to your repository.