---
title: "Integration"
description: "Deploy public and private Bitbucket repositories with Coolify using deploy keys, SSH authentication, and automated webhook deployments for commits and merge requests."
---

# Bitbucket Integration
This guide will show you how to use Bitbucket based repositories with Coolify.

## Public Repositories

You can use public repositories without any additional setup.

1. Select the `Public repository` option in the Coolify when you create a new resource.
2. Add your repository URL to the input field, for example: `https://bitbucket.com/coolify-test2/coolify-examples`

::: warning Caution
You can only use the https URL.
:::

1. That's it! Coolify will automatically pull the latest version of your repository and deploy it.

## Private Repositories

Private repositories require a few more steps to setup.

1. Add a private key (aka `Deploy Keys`) to Coolify and to your Bitbucket repository in the `Repository Settings` / `Access Keys` menu.

::: warning Caution
  - You can generate a new key pair with the following command: 
  
  ```bash
  ssh-keygen -t rsa -b 4096 -C "deploy_key" 
  ```

  - Or you can also use Coolify to generate a new key for you in the `Keys & Tokens` menu.
:::

2. Create a new resource and select the `Private Repository (with deploy key)`
3. Add your repository URL to the input field, for example: `git@bitbucket.org:coolify-test2/coolify-examples.git`

::: warning Caution
You need to use the SSH URL, so the one that starts with `git@`.
:::

4. That's it! Coolify will automatically pull the latest version of your repository and deploy it.

## Automatic commit deployments with webhooks (Optional)

You can add a custom webhook URL to your Bitbucket repository to trigger a new deployment when you push to your repository.

::: warning Caution
This can be set on either public or private repositories.
:::

In your resource, there is a `Webhooks` menu. In the `Manual Git Webhooks` section, you can find the URL what you need to set in your Bitbucket repository.

1. Set a secret key in the `Bitbucket Webhook Secret` input field.
2. Go to your repository in Bitbucket and open the `Repository Settings` / `Webhooks` menu as `Repository hooks`.
3. Add the URL from Coolify to the `URL` input field and the secret token.
4. Select the `Push` option.
5. That's it! Now when you push to your repository, Bitbucket will send a webhook request to Coolify and it will trigger a new deployment.

## Merge request deployments with webhooks (Optional)

You can add a custom webhook URL to your Bitbucket repository to trigger a new deployment when you create a new merge request.

::: warning Caution
This can be set on either public or private repositories.
:::

The process is the same as the previous one. In the `Repository Settings` / `Webhooks` menu, you need to select the following events in the `Pull Request` option:

- `Created`
- `Updated`
- `Merged`
- `Declined`