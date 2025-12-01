---
title: "Integration"
description: "Deploy public and private GitHub repositories with Coolify using GitHub App integration, deploy keys, or automated webhooks for commits and pull requests."
---

# Github Integration
This guide will show you how to use GitHub based repositories with Coolify.

## Public Repositories

You can use public repositories without any additional setup.

1. Select the `Public repository` option in the Coolify when you create a new resource.
2. Add your repository URL to the input field, for example: `https://github.com/coollabsio/coolify-examples`

::: warning Caution
You can only use the https URL.
:::

3. That's it! Coolify will automatically pull the latest version of your repository and deploy it.

## Private Repositories

### With GitHub App (Recommended)

You can use private repositories with the GitHub App integration. You will get full integration with GitHub, like automatic commit deployments and pull request deployments.

1. Create a new GitHub App in the `Sources` view.
2. Create a new resource and select the `Private Repository (with GitHub App)`.
3. Choose your repository from the list.
4. That's it!

:::warning Note for Coolify Cloud Users
You can make the GitHub App available to all teams on your Coolify instance by enabling the `System Wide` option. 

However, this feature is only available for self-hosted instances, as Coolify Cloud users cannot use the `System Wide` option due to how Coolify Cloud is set up.
:::

### With Deploy Keys

1. Add a private key (aka `Deploy Keys`) to Coolify and to your GitHub repository in the `Settings` / `Deploy Keys` menu.

::: warning Caution
  - You can generate a new key pair with the following command: 
  
  ```bash
  ssh-keygen -t rsa -b 4096 -C "deploy_key" 
  ```

  - Or you can also use Coolify to generate a new key for you in the `Keys & Tokens` menu.
:::

2. Create a new resource and select the `Private Repository (with deploy key)`
3. Add your repository URL to the input field, for example: `git@github.com:coollabsio/coolify-examples.git`

::: warning Caution
You need to use the SSH URL, so the one that starts with `git@`.
:::

4. That's it!

## Automatic commit deployments with webhooks (Optional)

You can add a custom webhook URL to your GitHub repository to trigger a new deployment when you push to your repository.

::: warning Caution
This can be set on either public or private repositories.

Not required if you use GitHub App integration.
:::

In your resource, there is a `Webhooks` menu. In the `Manual Git Webhooks` section, you can find the URL what you need to set in your GitHub repository.
<ZoomableImage src="/docs/images/applications/ci-cd/github/manual-git-webhooks.webp" alt="Manual Git Webhooks configuration" />


1. Set a secret key in the `GitHub Webhook Secret` input field.
<ZoomableImage src="/docs/images/applications/ci-cd/github/github-webhook-secret.webp" alt="Github Webhook Secret configuration" />

2. Go to your repository on GitHub and open the `Settings` / `Webhooks` menu.
<ZoomableImage src="/docs/images/applications/ci-cd/github/github-settings-webhook.webp" alt="Github Settings Webhook configuration" />

3. Add the URL from Coolify to the `URL` input field and the secret token.
4. Select the `Push events` option.
<ZoomableImage src="/docs/images/applications/ci-cd/github/event-push.webp" alt="Event Push configuration" />

5. That's it! Now when you push to your repository, GitHub will send a webhook request to Coolify and it will trigger a new deployment.

## Pull request deployments with webhooks (Optional)

You can add a custom webhook URL to your GitHub repository to trigger a new deployment when you create a new merge request.

::: warning Caution
This can be set on either public or private repositories.

Not required if you use GitHub App integration.
:::

The process is the same as the previous one, but you need to select the `Pull Request` events option in the `Settings` / `Webhooks` menu.