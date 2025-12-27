---
title: Deploy Webstudio Projects to Hetzner with Coolify
description: Complete guide to deploying Webstudio projects with Coolify on Hetzner servers using Docker, GitHub integration, and automated deployment.
---

# Deploy Webstudio Projects using Coolify

Coolify makes deploying your Webstudio projects to Hetzner as simple as it is powerful.

In this guide, you’ll learn how to set up your project, deploy it on a Hetzner server, and keep your infrastructure fully under your control, all with a few straightforward steps.

::: warning HEADS UP!
In this guide, we are using servers from Hetzner.

However, if you're using a different hosting provider, you can still follow this guide with their servers as well.

If you prefer watching a video instead of reading, you can check out the [tutorial video](https://youtu.be/OnHLO2Plt2E?si=yDM77oK7Xd5UsRSP)
:::

## What You’ll Need

Before you start, make sure you have:

- A [GitHub account](https://github.com?utm_source=coolify.io) to host your code.
- A [Hetzner account](https://coolify.io/hetzner) to provision your server (or an account with any other hosting provider).
- The [Webstudio CLI](https://docs.webstudio.is/university/self-hosting/cli?utm_source=coolify.io) installed locally to manage your project exports.

## 1. Create Your GitHub Repository

Start by [creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) on GitHub where you’ll store your Webstudio project code.

Once the repository is created, [clone the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) to your local machine to start developing locally.

## 2. Export Your Webstudio Project

Using the Webstudio [CLI](https://docs.webstudio.is/university/self-hosting/cli), export your project and select the "**Docker**" option.

This prepares your project for deployment via Coolify without the need for additional dependency installations.

## 3. Push Your Code to GitHub

With your project exported locally, [push your code](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository) to the GitHub repository you created. This makes your project accessible for deployment.

## 4. Set Up Your Hetzner Server

::: warning HEADS UP!
If you already have a server, you don't need to purchase a new one.

**Webstudio recommends** that your server should have at least **1 CPU and 2GB of RAM** for smooth operation.

Skip to [Step 6](#_6-configure-your-project-on-coolify) if your server is already connected to Coolify.
:::
Follow these steps to prepare your Hetzner server:

1. **Create a New Server:** Log into [Hetzner Cloud Dashboard ↗](https://console.hetzner.cloud/) and create a new server.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/1.webp" />

1. **Choose Your Region:** Select the region that best suits your needs.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/2.webp" />

1. **Select Ubuntu:** Pick an Ubuntu image (make sure it’s a Docker-supported version, check the [Docker Ubuntu requirements](https://docs.docker.com/engine/install/ubuntu/#os-requirements)).
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/3.webp" />

1. **Configure Resources:** A shared CPU with at least 2 GB RAM is recommended.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/4.webp" />

1. **Allocate an IPv4 Address:** Make sure your server has a dedicated IPv4 address.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/5.webp" />


1. **Finalize Setup:** Click **Create and Buy Now** and wait until your server is provisioned.

1. **Save the IP:** Copy your server’s IPv4 address, it will be needed shortly.

## 5. Connect Coolify to Your Server

::: warning HEADS UP!
If your server is already connected to Coolify, skip to the [next step](#_6-configure-your-project-on-coolify).
:::

1. **Add Private Key:** Login to your Coolify account (or create one if you’re new) and Add a new private key
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/6.webp" />
  <br />
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/7.webp" />

2. **Add a Server:** Navigate to the **Servers** tab and add a new server by entering your Hetzner server’s IPv4 address.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/8.webp" />
  <br />
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/9.webp" />

3. **Validate Server:** Click **Validate Server & Install Docker Engine**. Coolify will automatically install all necessary components on your server.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/10.webp" />

4. **Check Status:** Once finished, you should see a green **Proxy Running** status indicating everything is set up.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/11.webp" />

## 6. Configure Your Project on Coolify
1. **Create a New Project:** Head to the **Projects** section and create a new project.

2. **Add a Resource:** Add a new resource, selecting your GitHub repository as the source.

3. **Connect Your Repository:** Use the GitHub app integration to grant access to your repository.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/12.webp" />

4. **Select Build Pack:** Change the Build Pack to **Dockerfile** and click on continue button.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/13.webp" />

5. **Configure Domains & Deploy:** Enter your domain in the domains field and Click **Deploy** and wait as Coolify builds and deploys your project. 
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/14.webp" />

6. **Successful Deployment:** When deployment is complete, you’ll see a “Deployment is Finished” message.

7. **Access Your Site:** Use the **links** button at the top of the project dashboard to visit your live site.
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/15.webp" />

8. **Optional – Third-Party Domains:** If your project loads images from external sources, add those domains as a comma-separated list under the environment variable `DOMAINS`. (make sure to restart the application after adding the variable)
  <ZoomableImage src="/docs/images/knowledge-base/how-tos/webstudio-with-hetzner/16.webp" />

## 7. Update Your Webstudio Site

To publish updates and keep your site up to date, follow these steps:

1. **Publish Changes:** In the Webstudio builder, click **Publish** to generate the latest build data.
2. **Sync and Build:** Run the following commands in your terminal:
   ```bash
   webstudio sync
   webstudio build --template docker
   ```
3. **Push Updates:** Commit and push your changes to GitHub. Coolify will detect the update and automatically trigger a new deployment.

Now you’re all set!
