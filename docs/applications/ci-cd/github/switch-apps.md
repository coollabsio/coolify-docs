---
title: Switch GitHub Apps
description: Learn how to switch your application from one GitHub App to another in Coolify, such as when moving repositories to a new organization.
---

# Switch GitHub Apps
Switching GitHub Apps allows you to change the GitHub App associated with your deployed applications, for example, when moving repositories to a new organization or account.


### Why Switch GitHub Apps?
1. **Organization Changes**: You've moved repositories to a new GitHub organization that requires a different GitHub App.
2. **Access Management**: You want to use a GitHub App with different permissions or repository access.


::: warning IMPORTANT
This feature is introduced in **Coolify v4.0.0-beta.408**. To follow this guide, you **must** be using Coolify v4.0.0-beta.408 or a higher version.
:::

## 1. Move Repositories (Optional)
If your goal is to move a repository to a different account or organization, go ahead and transfer it on GitHub.

If you just want to use a different GitHub App without changing repositories, you can skip this step.

## 2. Add New GitHub App to Coolify
We have a dedicated guide for setting up a GitHub App, which you can follow here: [/applications/ci-cd/github/setup-app](/applications/ci-cd/github/setup-app). Follow that guide and come back here.

## 3. Set Up Repository Access
After adding the new GitHub App, verify that it has access to the correct repositories by following these steps:

<ZoomableImage src="/docs/images/applications/ci-cd/github/switch-apps/1.webp" />
1. In your Coolify dashboard, click on **Sources** from the sidebar, then select your new GitHub App.
2. Click the **Update Repositories** button (this will redirect you to GitHub).

<ZoomableImage src="/docs/images/applications/ci-cd/github/switch-apps/2.webp" />
3. Under the Repository access section, check if you can see the repositories that you want to use.

## 4. Switch Git Source on Coolify
<ZoomableImage src="/docs/images/applications/ci-cd/github/switch-apps/3.webp" />
1. Open your application configuration page.
2. Go to the "Git Source" page.
3. Select your new GitHub App.

## 5. Update Repository Name (If Applicable)
<ZoomableImage src="/docs/images/applications/ci-cd/github/switch-apps/4.webp" />
If you have moved your repository to a new organization or account, update the repository name accordingly (e.g., from `shadowarcanist/switch-apps-guide` to `airoflare/switch-apps-guide`).

You can skip this step if you didn't move your repository.

## 6. Redeploy the Application
To apply the new GitHub App to your application, redeploy it by clicking the **Redeploy** button.

That's it!