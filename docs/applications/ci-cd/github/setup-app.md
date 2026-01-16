---
title: "Setup GitHub App"
description: "Set up a GitHub App in Coolify to access and deploy from private GitHub repositories using automated or manual installation methods."
---

# GitHub App
Github app allows you to grant access to a single or mulitple private repositories from your either personal github account or your organization on github.


### Why use github app with Coolify?
Scoped Access: The GitHub app lets you grant Coolify access to a specific repository, a selected group of repositories, or even all of your repositories. This gives you flexibility and better control over what Coolify can access.

### When Not to Use github app with Coolify?
Lack of Permission: If you don't have the necessary permissions to install the GitHub app, or if you prefer not to install it, then it’s best not to use it with Coolify.

## Installation Methods
There are two ways to install Github App on Coolify:
- [Automated Installation](/applications/ci-cd/github/setup-app#automated-installation) (Recommended)
- [Manual Installation](/applications/ci-cd/github/setup-app#manual-installation)
We highly recommend the Automated Installation method as it automates the process and reduces the chance of errors.


::: info Example Data
The following data is used as an example in this guide. Please replace it with your actual data when following the steps:

- **GitHub App Name on Coolify:** `Github App Tutorial`
- **GitHub App Name on Github:** `coolify-github-app-tutorial`
- **Webhook Endpoint:** `https://coolboxy.shadowarcanist.internal`
:::


## Automated Installation
### 1. Create a Github App on Coolify
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/1.webp" />
1. In your Coolify dashboard, click on Sources from the sidebar.
2. Click the + Add button to create a new github app.

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/2.webp" />
3. Enter a Name for your App
4. Enter your github organization name (if you are adding the github app to your github account then leave this field empty) and click continue

::: info 
1. If you are using Selfhost or Enterprise version of Github then you can enter your github details on the Selhost/Enterprise github section.
2. The "System wide" option allows all teams you have on your coolify instance to use this specific github app, if you only want the current team to use the github app then leave this option unchecked.
  ::: warning
  Coolify cloud users won't see the option "System wide" because this option will enable your github app to all Cloud users so this option is disabled on Coolify Cloud
  :::
  
### 2. Set Webhook Endpoint
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/3.webp" />

1. Select the endpoint for github to send Webhook when a event (commit, pr) happens on github. If this endpoint is not reachable then automatic deployments won't work so if you decide to close port 8000 on your server you have to set the webhook endpoint as your Coolify dashboard domain

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/4.webp" />
2. Preview deployments are enabled by default and you can disable them if you dont want them
3. Click on Register now button (this will take you to github)


### 3. Create Github App on Github
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/5.webp" />
1. Give your github app a name (this will be shown on your github app list and you can always change it later)
2. Click on Create app button (this will take you back to your coolify dashboard)

### 4. Allow Github app access to repositories
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/6.webp" />
1. Click on "Install repositories on Github" button

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/7.webp" />
2. Select the repositories that you want this app to have access to (you can give access to all repositories or specific repositories)
3. Click on "Install" button (this will take you back to your Coolify dashboard)

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/8.webp" />

### 5. Create a New Resource on Coolify
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/9.webp" />

1. Select your project from the Coolify dashboard.
2. Click the **+ New** button to create a new resource.


### 6. Select Private Repository (with Github App) as Resource Type
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/10.webp" />
Select **Private Repository (with Github App)** from the available resource types.


### 6. Choose Your Server
::: warning HEADS UP!
Coolify automatically selects the `localhost` server if you don't have any remote servers connected. In such cases, skip to the next step.
:::

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/11.webp" />

Choose the server where you want to deploy the application.


### 7. Choose Your Github App
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/12.webp" />

Select the Github App you created in Coolify from the list of available Apps.


### 8. Configure the Application and Deploy
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/13.webp" />

1. Choose Repository and click on "Load Repository" button.

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/14.webp" />
2. After selecting the repository, configure the buildpack, ports, and other settings. (Refer to our dedicated guide on [builds](/applications/build-packs/overview) for more details.)

Once configured, deploy your application.

That's it! 

---

::: danger HEADS UP!
**The Automated installation guide ends here. If you’ve followed the steps above, you can start using Github Apps now. The guide below is for those who want to manually install and set up Github App.**
:::

## Manual Installation
### 1. Create a Github App on Coolify
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/15.webp" />
1. In your Coolify dashboard, click on Sources from the sidebar.
2. Click the + Add button to create a new github app.

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/16.webp" />
3. Enter a Name for your App
4. Enter your github organization name (if you are adding the github app to your github account then leave this field empty) and click continue

::: info 
1. If you are using Selfhost or Enterprise version of Github then you can enter your github details on the Selhost/Enterprise github section.
2. The "System wide" option allows all teams you have on your coolify instance to use this specific github app, if you only want the current team to use the github app then leave this option unchecked.
  ::: warning
  Coolify cloud users won't see the option "System wide" because this option will enable your github app to all Cloud users so this option is disabled on Coolify Cloud
  :::
  
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/17.webp" />
5. Click on Continue button
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/18.webp" />
6. Save the Source ID of github app somewhere safe (source id is the UUID you see on your url bar after `/github/`)

We will need the following data to setup the github app:
- App ID
- Installation ID
- Client ID
- Client Secret
- Webhook Secret
- SSH Key

We will get these data in the next few steps.

### 2. Create a App on Github
Creating apps on github slightly varies for personal accounts and organizations so choose the correct one from the below section

:::tabs
== Personal Account
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/19.webp" />

1. Go to your github account settings
2. On the sidebar scroll down till you see "developer settings" and click on it

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/20.webp" />
3. Click the "New github app" button


== Organization
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/21.webp" />

1. Go to your github Organization settings
2. On the sidebar scroll down till you see "**developer settings**" and click on it
3. Click on "Github Apps"
4. Click the "New github app" button

:::

### 3. Setup the Github App on Github
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/22.webp" />
1. Give your app a name
2. Enter homepage url for your app (this can be anything)

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/23.webp" />
3. Scrol down till you see the "**Post Installation**" section
4. Enter Setup URL: `https://coolboxy.shadowarcanist.internal/webhooks/source/github/install?source=a8000cg0g0ogcc0ggkk8ow4k`

5. Enable the option `Redirect on Update`
6. Enter Webhook URL: `https://coolboxy.shadowarcanist.internal/source/github/events`

::: info
  You have to replace `https://coolboxy.shadowarcanist.internal` with your Coolify dashboard url and replace `a8000cg0g0ogcc0ggkk8ow4k` with the Source ID [Step 1](#_1-create-a-github-app-on-coolify-1)
:::

7. Enter Webhook Secret (this has to be a random string, you can use tools like [Random String Generator](https://getrandomgenerator.com/string))
8. Enable the option `Enable SSL verification`

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/24.webp" />
9. Scrol down till you see the "**Permissions**" section
10. Set Access to `Read-only` for `Contents`
11. Set Access to `Read and write` for `Pull Requests` (Only needed if you plan to use Preview deployments feature)
12. Set Access to `Read-only` for `Email addresses`

::: warning HEADS Up!
On the screenshot above for permissions section we have hidden lot of Permission and only shown the Permission needed to setup Github app for Coolify.
:::

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/25.webp" />
13. Scrol down till you see the "**Subscribe to events**" section
14. Enable the option `Push`
15. Enable the option `Pull requests` (Only needed if you plan to use Preview deployments feature)
16. Select the option `Only on this account` (Prevents others from installing our Github app to their github accounts)
17. Click the button "**Create Github App**"

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/26.webp" />
18. Save the `App ID` and `Client ID` somewhere safe (we have to enter this on Coolify later)

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/27.webp" />
19. Click the `Generate a new client secret` button
20. Save the `client secret` somewhere safe (we have to enter this on Coolify later)

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/28.webp" />
21. Scrol down till you see the "**Private keys**" section
22. Click the `Generate a private key` button (this will automatically download the private key as a `.pem` file)

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/29.webp" />
23. Click "Install App" from the sidebar
24. Click the "**Install**" button

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/30.webp" />
25. Select the repositories you want the app to have access to.
26. Click the "**Install**" button

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/31.webp" />
27. Click the Settings icon (this will take you to your account or organization applications page)

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/32.webp" />
28. Save the `Installation ID` somewhere safe (Installation ID is the number you see on your url bar after `/installations/`)


### 4. Add Private keys on Coolify

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/33.webp" />
1. In your Coolify dashboard, click on **Keys & Tokens** from the sidebar.
2. Click on **Private keys** tab.
3. Click the **+ Add** button to add a new private key.

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/34.webp" />
4. Give your Private key a name
5. Paste the content of the `.pem` file which github automatically downloaded to your machine when you setup the Github App on Github
6. Click on "**Continue**" button

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/35.webp" />
7. In your Coolify dashboard, click on **Sources** from the sidebar and select your Github app from the list
8. Enter the details (App ID, Installation ID etc..) you saved on previous steps
9. On "Private key" select the key you just added to Coolify
10. Click on "**Sync Name**" button, if you see a success message then you have done everything correctly and you can start using the Github app!


### 5. Create a New Resource on Coolify
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/36.webp" />

1. Select your project from the Coolify dashboard.
2. Click the **+ New** button to create a new resource.


### 6. Select Private Repository (with Github App) as Resource Type
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/37.webp" />
Select **Private Repository (with Github App)** from the available resource types.


### 6. Choose Your Server
::: warning HEADS UP!
Coolify automatically selects the `localhost` server if you don't have any remote servers connected. In such cases, skip to the next step.
:::

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/38.webp" />

Choose the server where you want to deploy the application.


### 7. Choose Your Github App
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/39.webp" />

Select the Github App you created in Coolify from the list of available Apps.


### 8. Configure the Application and Deploy
<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/40.webp" />

1. Choose Repository and click on "Load Repository" button.

<ZoomableImage src="/docs/images/applications/ci-cd/github/setup-app/41.webp" />
2. After selecting the repository, configure the buildpack, ports, and other settings. (Refer to our dedicated guide on [builds](/applications/build-packs/overview) for more details.)

Once configured, deploy your application.

That's it! 