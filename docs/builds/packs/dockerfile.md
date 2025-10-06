---
title: Dockerfile Build Pack
---

<ZoomableImage src="/docs/images/builds/packs/dockerfile/banner.webp" alt="Coolify banner" />

<br />

Dockerfile includes step-by-step instructions to build a Docker image that Coolify uses to deploy your application or website. 

The Dockerfile build pack allows you to use your own Dockerfile to deploy your application, you have complete control over how your application is built and deployed on Coolify.


## How to use Dockerfile?
### 1. Create a New Resource in Coolify
On the Coolify dashboard, open your project and click the **Create New Resource** button.

<ZoomableImage src="/docs/images/builds/packs/dockerfile/1.webp" alt="Coolify dashboard screenshot" />


### 2. Choose Your Deployment Option

<ZoomableImage src="/docs/images/builds/packs/dockerfile/2.webp" alt="Coolify dashboard screenshot" />

**A.** If your Git repository is public, choose the **Public Repository** option.

**B.** If your repository is private, you can select **Github App** or **Deploy Key**. (These methods require extra configuration. You can check the guides on setting up a [Github App ↗](/knowledge-base/git/github/integration#with-github-app-recommended) or [Deploy Key ↗](/knowledge-base/git/github/integration#with-deploy-keys) if needed.)


### 3. Select Your Git Repository
If you are using a public repository, paste the URL of your GitHub repository when prompted. The steps are very similar for all other options.

<ZoomableImage src="/docs/images/builds/packs/dockerfile/3.webp" alt="Coolify dashboard screenshot" />


### 4. Choose the Build Pack
Coolify defaults to using Nixpacks. Click the Nixpacks option and select **Dockerfile** as your build pack from the dropdown menu.

<ZoomableImage src="/docs/images/builds/packs/dockerfile/4.webp" alt="Coolify dashboard screenshot" />


### 5. Configure the Build Pack
<ZoomableImage src="/docs/images/builds/packs/dockerfile/5.webp" alt="Coolify dashboard screenshot" />

- **Branch:** Coolify will automatically detect the branch in your repository.
- **Base Directory:** Enter the directory that Coolify should use as the root. Use `/` if your files are at the root or specify a subfolder (like `/backend` for a monorepo).

Click on **Continue** button once you have set all the above settings to correct details.


### 6. Configure Network Settings
After clicking **Continue**, update settings like your domain and environment variables (if needed). 

The important option is the port where your application runs.
Coolify sets the default port to 3000, so if your application listens on a different port, update the port number on the network section.

<ZoomableImage src="/docs/images/builds/packs/dockerfile/6.webp" alt="Coolify dashboard screenshot" />


## Advanced Configuration
### Environment Variables
You can manage your environment variables from the Coolify UI. 

Click on the **Environment Variables** tab to add or update them.

<ZoomableImage src="/docs/images/builds/packs/dockerfile/7.webp" alt="Coolify dashboard screenshot" />

### Pre/Post Deployment Commands
<ZoomableImage src="/docs/images/builds/packs/dockerfile/8.webp" alt="Coolify dashboard screenshot" />
- **Pre-deployment:** Optionally, specify a script or command to execute in the existing container before deployment begins. This command is run with `sh -c`, so you do not need to add it manually.
- **Post-deployment:** Optionally, specify a script or command to execute in the newly built container after deployment completes. This command is also executed with `sh -c`.


## Known Issues and Solutions
::: details 1. Visiting the Application Domain Shows "No Available Server"
If you see a "No Available Server" error when visiting your website, it is likely due to the health check for your container. 

Run `docker ps` on your server terminal to check if your container is unhealthy or still starting.  

To resolve this, fix the issue causing the container to be unhealthy or remove the health checks.
:::

::: details 2. App only works inside the Container
If your app works when you check it with a `curl localhost` inside the container but you receive a 404 or "No Available Server" error when accessing your domain, verify the port settings.  

Make sure that the port in the network settings matches the port where your application is listening. Also, check the startup log to ensure the application is not only listening on localhost. 

<ZoomableImage src="/docs/images/builds/packs/dockerfile/9.webp" alt="Coolify dashboard screenshot" />

If needed, change it to listen on all interfaces (for example, `0.0.0.0`).
:::
