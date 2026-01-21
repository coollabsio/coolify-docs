---
title: "Access Single Resource via Cloudflare Tunnels"
description: "Securely access individual Coolify applications through Cloudflare Tunnels with port mapping, domain configuration, and multi-resource tunneling support."
---

# Access Single Resource via Cloudflare Tunnels

Accessing an Resource deployed on Coolify using a Cloudflare Tunnel allows you to securely reach your app without exposing your server’s IP address or without having a Public IP address for the server.

## Who this is for?

This setup is ideal for people who:

- Don't have a public IP for their server (could be a laptop, raspberry pi etc..).
- Are unable to port forward (e.g., using home internet or on a private network).
- Want to keep their server’s IP address private and avoid exposing it to the public internet.
- Have an app already deployed on Coolify and need an external method to access it securely.

## Setup Requirements

To follow this guide, you'll need:

- A free [Cloudflare](https://cloudflare.com) account.
- You need a domain that has it's **DNS managed by Cloudflare**.
- Your Resource has to be deployed and managed with Coolify.

## Before We Start

- We assume you have Coolify running and an app already deployed.
- If your app requires HTTPS for functionality like cookies or login, then you need to follow the [Full TLS HTTPS guide](/knowledge-base/cloudflare/tunnels/full-tls) after following this guide. This is because in this guide, Cloudflare will manage HTTPS externally, while your app will run over HTTP within Coolify.

## How It Works?

A simple high-level overview diagram to give you a visual idea of how this works:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/high-level-diagram.webp" />

---

### Quick Links to Important Sections:

- [Setup your app for tunneling](#_1-setup-your-app-for-tunneling)
- [Create a Cloudflare Tunnel](#_2-create-a-cloudflare-tunnel)
- [Setup Cloudflare Tunnel on Coolify](#_3-setup-cloudflare-tunnel-on-coolify)
- [Expose Multiple Resource on Different Domains](#expose-multiple-resource-on-different-domains)
- [Known issues and Solutions](#known-issues-and-solutions)

---

::: warning Example Data
The following data is used as an example in this guide. Please replace it with your actual data when following the steps:

- **Domain Name:** shadowarcanist.com
- **Ports Exposes:** 80
- **Ports Mapping:** 4477:80
  :::

---

## 1. Setup your app for tunneling

To setup your app for tunneling, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/1.webp" />

1. Remove all domains from the **Domains** field.
2. Set the correct port in **Ports Exposed** (the port your app uses).
3. Set the correct ports in **Port Mappings** (left is the host port, right is the app port).
4. Deploy your app by clicking the **Deploy** button.

## 2. Create a Cloudflare Tunnel

To create a Cloudflare Tunnel, first log in to your Cloudflare account and go to the [Zero Trust](https://one.dash.cloudflare.com/) page.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/2.webp" />

1. On the Zero Trust page, go to **Networks** in the sidebar.
2. Click on **Tunnels**
3. Click on **Add a tunnel** button

You will be prompted to choose a tunnel type. Click the **Select Cloudflared** button.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/3.webp" />

You will be prompted to enter a tunnel name. Choose a name that you prefer.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/4.webp" />

Next you will see the configuration page with multiple options to install cloudflared.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/5.webp" />

Copy the install command, which contains the token for your tunnel (token starts with "eyJ"). Make sure to save only the token, removing the command part before it, and store it in a safe place, as we need it later.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/6.webp" />

Scroll down until you see the **Next** button, then click it.

Then, you will be prompted to add a hostname.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/7.webp" />

1. **Subdomain** - (Optional) You can make your app/resource accessible on any subdomain/domain. For this guide, we are not using a subdomain.
2. **Domain** - Choose the domain you want to use for the tunnel.
3. **Path** - Leave this field empty.
4. **Type** - Choose **HTTP** (this is very important).
5. **URL** - Enter **localhost:4477** The port 4477 is the one we mapped to the host system in [Step 1](#_1-setup-your-app-for-tunneling). Replace 4477 with your own port.
6. After filling in the details, click the **Save Tunnel** button.

## 3. Setup Cloudflare Tunnel on Coolify

To set up the tunnel on Coolify, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/8.webp" />

Go to your project on Coolify dashboard and click the **+ New** button to create a new resource.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/9.webp" />

You will see many options to deploy a new app. Search for Cloudflared and click on it.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/10.webp" />

Go to the **Environment Variables** page, enter your tunnel token, and deploy the Cloudflared app. This token was copied in [Step 2](#_2-create-a-cloudflare-tunnel)

**Congratulations**! You've successfully set up a resource that can be accessed by anyone on the internet your domain.

::: danger HEADS UP!
**The steps above show how to tunnel a single resource. Below are the steps for tunneling multiple resources**
:::

## Tunnel Multiple Resources

The easiest way to tunnel multiple resources is by following our [Tunnel All Resources](/knowledge-base/cloudflare/tunnels/all-resource) guide, which uses Coolify's built-in proxy. However, if you prefer not to use the proxy, there are two alternative methods:

- [Tunnel Multiple Single Resources](#tunnel-multiple-single-resources)
- [Tunnel Coolify](#tunnel-coolify)

Tunneling multiple single resources is straightforward, but tunneling Coolify itself requires additional manual setup.

## Tunnel Multiple Single Resources

If you want to expose different apps individually, you can follow our [Tunnel All Resources](/knowledge-base/cloudflare/tunnels/all-resource), or take an alternate approach:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/11.webp" />

1. Follow [Step 1](#_1-setup-your-app-for-tunneling) for your new resource.
2. Create a new public hostname on Cloudflare Tunnel as described in [Step 2](#_2-create-a-cloudflare-tunnel).

There’s no need to create a separate tunnel for each resources, simply create a new hostname and point it to the port your app is listening on.

## Tunnel Coolify

Tunneling Coolify itself to make it accessible over a domain requires a bit more manual configuration. Here's how you can set it up:

### 1. Create Public Hostnames in Cloudflare Tunnel

Follow [Step 2](#_2-create-a-cloudflare-tunnel) from the main guide to create public hostnames for each service Coolify exposes. Use the following mapping:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/14.webp" />

- **Hostnames**:

  1. `app.shadowarcanist.com/terminal/ws` → `localhost:6002` (WebSocket terminal)
  2. `realtime.shadowarcanist.com` → `localhost:6001` (Realtime server)
  3. `app.shadowarcanist.com` → `localhost:8000` (Coolify dashboard)

- **Type**: HTTP (Ensure you select HTTP for each hostname.)

::: warning HEADS UP!
The order of the hostnames matters! Be sure to match it exactly as shown above.
:::

---

### 2. Update Coolify’s `.env` File

After creating public hostnames, update the `.env` file in your Coolify instance located at `/data/coolify/source` to enable connections to the realtime server. Add the following lines:

```bash
APP_ID=<random string>
APP_KEY=<random string>
APP_NAME=Coolify
DB_PASSWORD=<random string>
PUSHER_APP_ID=<random string>
PUSHER_APP_KEY=<random string>
PUSHER_APP_SECRET=<random string>
REDIS_PASSWORD=<random string>

###########
# Add these lines
PUSHER_HOST=realtime.shadowarcanist.com
PUSHER_PORT=443
###########
```

This ensures that Coolify uses the Cloudflare Tunnel for its realtime server.

### 3. Restart Coolify

Run the following command to restart Coolify and apply the changes:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### 4. Verify the Setup

1. Access your Coolify dashboard at `https://app.shadowarcanist.com`.
2. Test the realtime functionality by visiting `https://app.shadowarcanist.com/realtime` in another browser tab. You should see a notification about a test event.
3. If you know what are you doing, you can check the network tab as well. Search for a websocket connection.

::: warning HEADS UP!
If you use a firewall, ensure that the required ports (e.g., `8000`, `6001`, `6002`) are open for internal communication but not exposed to the public internet.  
:::

## Known issues and Solutions

When you create a new public hostname in [Step 2](#_2-create-a-cloudflare-tunnel), Cloudflare will create a DNS record for the hostname.

However, if a DNS record for the hostname already exists, Cloudflare won’t create a new one.

In this case, your app won’t work. To fix this issue, follow the steps below:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/12.webp" />

First, copy your tunnel ID from the Tunnels page on the Cloudflare dashboard.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/single-resource/13.webp" />

Create a new DNS record with the following details:

1. In the Cloudflare dashboard, go to **DNS**.
2. Select **Records**.
3. Add a **CNAME** record.
4. Enter the name as `*` or the name of your subdomain (this should match the hostname you have for your app on the tunnel).
5. For the **Target**, enter the tunnel ID followed by `.cfargotunnel.com`
6. Set the proxy status to **Proxied**.

Now, visit the domain of your application, and it should be accessible there.
