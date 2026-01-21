---
title: "Access All Resource via Cloudflare Tunnels"
description: "Expose all Coolify resources securely through Cloudflare Tunnels without public IPs or port forwarding using wildcard domains and HTTP proxy routing."
---

# Access All Resource via Cloudflare Tunnels

Accessing All Resource deployed on Coolify using a Cloudflare Tunnel allows you to securely reach your app without exposing your server’s IP address or without having a Public IP address for the server.

## Who this is for?

This setup is ideal for people who:

- Don't have a public IP for their server (could be a laptop, raspberry pi etc..).
- Are unable to port forward (e.g., using home internet or on a private network).
- Want to keep their server’s IP address private and avoid exposing it to the public internet.
- Have an resource already deployed on Coolify and need an external method to access it securely.

## Setup Requirements

To follow this guide, you'll need:

- A free [Cloudflare](https://cloudflare.com) account.
- You need a domain that has it's **DNS managed by Cloudflare**.

## Before We Start

- We assume you have Coolify running on your server.
- If your app requires HTTPS for functionality like cookies or login, then you need to follow the [Full TLS HTTPS guide](/knowledge-base/cloudflare/tunnels/full-tls) after following this guide. This is because in this guide, Cloudflare will manage HTTPS externally, while your app will run over HTTP within Coolify.

## How It Works?

A simple high-level overview diagram to give you a visual idea of how this works:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/high-level-diagram.webp" />

---

### Quick Links to Important Sections:

- [Create a Cloudflare Tunnel](#_1-create-a-cloudflare-tunnel)
- [Setup Encryption mode on Cloudflare](#_2-setup-encryption-mode-on-cloudflare)
- [Setup Cloudflare Tunnel on Coolify](#_3-setup-cloudflare-tunnel-on-coolify)
- [Start Coolify Proxy](#_4-start-coolify-proxy)
- [Configure Your Resource to Use the Tunnel Domain](#_5-configure-your-resource-to-use-the-tunnel-domain)
- [How to use Multiple Different Domains](#how-to-use-multiple-different-domains)
- [Known issues and Solutions](#known-issues-and-solutions)

---

::: warning Example Data
The following data is used as an example in this guide. Please replace it with your actual data when following the steps:

- **Domain Name:** shadowarcanist.com
  :::

---

## 1. Create a Cloudflare Tunnel

To create a Cloudflare Tunnel, first log in to your Cloudflare account and go to the [Zero Trust](https://one.dash.cloudflare.com/) page.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/1.webp" />

1. On the Zero Trust page, go to **Networks** in the sidebar.
2. Click on **Tunnels**
3. Click on **Add a tunnel** button

You will be prompted to choose a tunnel type. Click the **Select Cloudflared** button.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/2.webp" />

You will be prompted to enter a tunnel name. Choose a name that you prefer.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/3.webp" />

Next you will see the configuration page with multiple options to install cloudflared.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/4.webp" />

Copy the install command, which contains the token for your tunnel (token starts with "eyJ"). Make sure to save only the token, removing the command part before it, and store it in a safe place, as we need it later.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/5.webp" />

Scroll down until you see the **Next** button, then click it.

Then, you will be prompted to add a hostname.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/6.webp" />

1. **Subdomain** - (Optional) You can make your all of your resource accessible on any subdomain/domain. For this guide, we are using a wildcard subdomain.
2. **Domain** - Choose the domain you want to use for the tunnel.
3. **Path** - Leave this field empty.
4. **Type** - Choose **HTTP** (this is very important).
5. **URL** - Enter **localhost:80** (this is very important).
6. After filling in the details, click the **Save Tunnel** button.

## 2. Setup Encryption mode on Cloudflare

To set up encryption on Cloudflare, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/15.webp" />

1. Go to **SSL/TLS** in Cloudflare.
2. Select **Overview**.
3. Click **Configure** button

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/16.webp" />

Choose **Full** as the encryption mode.

## 3. Setup Cloudflare Tunnel on Coolify

To set up the tunnel on Coolify, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/7.webp" />

Go to your project on Coolify dashboard and click the **+ New** button to create a new resource.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/8.webp" />

You will see many options to deploy a new app. Search for Cloudflared and click on it.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/9.webp" />

Go to the **Environment Variables** page, enter your tunnel token, and deploy the Cloudflared app. This token was copied in [Step 1](#_1-create-a-cloudflare-tunnel)

## 4. Start Coolify Proxy

To start the Coolify proxy, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/10.webp" />

1. In the Coolify dashboard, go to the **Servers** page from the sidebar.
2. Select the server where coolify is running, then Click on the **Proxy** tab.
3. Open the **General** tab.
4. Click the **Start Proxy** button.

::: success Tip  
 The Coolify proxy is used to route traffic to apps running on your server. This eliminates the need to create new hostnames on the Cloudflare tunnel every time you deploy a new app.  
:::

## 5. Configure Your Resource to Use the Tunnel Domain

Enter the domain you want to use for your resource/app and deploy your resource.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/11.webp" />

::: warning HEADS UP!  
 You should enter the domain as **HTTP** because Cloudflare handles **HTTPS** and TLS terminations. If you use **HTTPS** for your resource, you may encounter a **TOO_MANY_REDIRECTS** error.

If your app requires **HTTPS** for features like cookies or login, follow the [Full TLS HTTPS Guide](/knowledge-base/cloudflare/tunnels/full-tls) after completing this guide.  
:::

**Congratulations**! You've successfully set up a resource that can be accessed by anyone on the internet your domain.

## How to use Multiple Different Domains?

You don't need to create new tunnels for each domain, just create a new hostname with the new domain and point it to the `localhost:80`.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/12.webp" />

## Known issues and Solutions

When you create a new public hostname in [Step 1](#_1-create-a-cloudflare-tunnel), Cloudflare will create a DNS record for the hostname.

However, if a DNS record for the hostname already exists, Cloudflare won’t create a new one.

In this case, your app won’t work. To fix this issue, follow the steps below:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/13.webp" />

First, copy your tunnel ID from the Tunnels page on the Cloudflare dashboard.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/all-resource/14.webp" />

Create a new DNS record with the following details:

1. In the Cloudflare dashboard, go to **DNS**.
2. Select **Records**.
3. Add a **CNAME** record.
4. Enter the name as `*` or the name of your subdomain (this should match the hostname you have for your app on the tunnel).
5. For the **Target**, enter the tunnel ID followed by `.cfargotunnel.com`
6. Set the proxy status to **Proxied**.

Now, visit the domain of your application, and it should be accessible there.
