---
title: "Full HTTPS/TLS Setup for All Resources"
description: "Configure end-to-end HTTPS for Coolify resources through Cloudflare Tunnels with Origin Certificates, strict TLS encryption, and proper domain setup."
---

# Full HTTPS/TLS Setup for All Resources

When tunneling resources with Coolify through Cloudflare, Cloudflare typically handles HTTPS and TLS termination, while Coolify runs your resources over HTTP.

This setup works for most users, but some may face issues with URL mismatches, especially for apps that require HTTPS on Coolify to issue JWT tokens or handle callback URLs.

This guide solves that issue by configuring your resources to run fully on HTTPS, bypassing Cloudflare's HTTPS handling and ensuring your app functions correctly with secure connections.

## Who this is for?

This guide is ideal for users who:

- Have followed our [Tunnel All Resources Using Cloudflare Tunnel](/knowledge-base/cloudflare/tunnels/all-resource) or [Tunnel Specific Resources Using Cloudflare Tunnel](/knowledge-base/cloudflare/tunnels/single-resource) guide.
- Need their resources deployed with Coolify to run on HTTPS for applications requiring HTTPS for JWT issuance, callback functions, or similar features.

## Setup Requirements

To follow this guide, you'll need:

- A working Cloudflare tunnel setup as described in the previous guides.
- A domain configured in Cloudflare to handle HTTP traffic and redirect to HTTPS.

## Before We Start

- If your Coolify instance is on the same tunnel as the domain you want to configure, make sure you can access the Coolify Dashboard using the server IP and port (e.g., **203.0.113.1:8000**) before starting these steps.
- The default port is **8000**, but if you’ve changed or disabled it, ensure you can access the Coolify Dashboard through the new port or that port **8000** is re-enabled on the server.

---

### Quick Links to Important Sections:

- [Create a Cloudflare Origin Certificate](#_1-create-a-cloudflare-origin-certificate)
- [Add Origin Certificate to Your Server](#_2-add-origin-certificate-to-your-server)
- [Configure Coolify to Use the Origin Certificate](#_3-configure-coolify-to-use-the-origin-certificate)
- [Setup Encryption mode on Cloudflare](#_4-setup-encryption-mode-on-cloudflare)
- [Configure Tunnel to Use HTTPS](#_5-configure-tunnel-to-use-https)
- [Configure Cloudflare to Always Use HTTPS](#_6-configure-cloudflare-to-always-use-https)
- [Update URLs from HTTP to HTTPS](#_7-update-urls-from-http-to-https)

---

::: warning Example Data
The following data is used as an example in this guide. Please replace it with your actual data when following the steps:

- **IPv4 Address of Origin Server:** 203.0.113.1
- **Domain Name:** shadowarcanist.com
- **Username:** shadowarcanist
  :::

## 1. Create a Cloudflare Origin Certificate

To create your Cloudflare Origin Certificate, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/1.webp" />

1. In your Cloudflare dashboard, go to **SSL/TLS**.
2. Select **Origin Server**.
3. Click the **Create Certificate** button.

You’ll be asked to choose a private key type, hostnames, and certificate validity.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/2.webp" />

1. Choose **RSA (2048)** for the key type.
2. Add the hostnames you want the certificate to cover.

::: warning HEADS UP!

- **`shadowarcanist.com`** will cover only the main domain.
- **`*.shadowarcanist.com`** will cover all subdomains.

On Cloudflare’s free plan, wildcard certificates cover just one level of subdomains

For example, it works for **`coolify.shadowarcanist.com`** but not **`www.coolify.shadowarcanist.com`**.

To cover multiple levels, you'll need to purchase the [Advanced Certificate Manager](https://www.cloudflare.com/application-services/products/advanced-certificate-manager/)
:::

3. Set the certificate validity to **15 years**.

Your certificate will now be generated.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/3.webp" />

1. Choose **PEM** as the key format.
2. Copy your **Certificate**.
3. Copy your **Private Key**.

Next, you'll add these to your server running Coolify and configure Coolify to use this certificate.

## 2. Add Origin Certificate to Your Server
SSH into your server or use Coolify's terminal feature. For this guide, I’m using SSH:
```sh
ssh shadowarcanist@203.0.113.1
```

Once logged in, navigate to the Coolify proxy directory:
```sh
$ cd /data/coolify/proxy
```

Adding certificates slightly varies for Caddy and Traefik proxy so choose the correct one from the below section

:::tabs

== Traefik
Create the `certs` directory:
```sh
$ mkdir certs
```

Verify it was created:
```sh
$ ls
> acme.json  certs docker-compose.yml  dynamic
```

Now, navigate into the **certs** directory:
```sh
$ cd certs
```

Create two new files for the certificate and private key:
```sh
$ touch shadowarcanist.cert shadowarcanist.key
```

Verify the files were created:
```sh
$ ls
> shadowarcanist.cert shadowarcanist.key
```

Open the **shadowarcanist.cert** file and paste the certificate from the Cloudflare dashboard:
```sh
$ nano shadowarcanist.cert 
```
Save and exit after pasting the certificate.

Do the same for the **shadowarcanist.key** file and paste the private key:
```sh
$ nano shadowarcanist.key 
```
Save and exit.

== Caddy
Create the `caddy/data/certs` directory:
```sh
$ mkdir -p caddy/data/certs
```

Verify it was created:
```sh
$ ls caddy/data
> certs
```

Now, navigate into the **certs** directory:
```sh
$ cd caddy/data/certs
```

Create two new files for the certificate and private key:
```sh
$ touch shadowarcanist.cert shadowarcanist.key
```

Verify the files were created:
```sh
$ ls
> shadowarcanist.cert shadowarcanist.key
```

Open the **shadowarcanist.cert** file and paste the certificate from the Cloudflare dashboard:
```sh
$ nano shadowarcanist.cert 
```
Save and exit after pasting the certificate.

Do the same for the **shadowarcanist.key** file and paste the private key:
```sh
$ nano shadowarcanist.key 
```
Save and exit.

:::

Now the origin certificate is installed on your server.


## 3. Configure Coolify to Use the Origin Certificate
<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/14.webp" />

1. Go to the **Server** section in the sidebar.
2. Select **Proxy**.
3. Open the **Dynamic Configuration** page
4. Click **Add** button

You will now be prompted to enter the Dynamic Configuration.

Adding Dynamic Configuration slightly varies for Caddy and Traefik proxy so choose the correct one from the below section

:::tabs

== Traefik

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/15.webp" />

1. Choose a name for your configuration (must end with `.yaml`).
2. Enter the following details in the configuration field:
```sh
tls:
  certificates:
    -
      certFile: /traefik/certs/shadowarcanist.cert
      keyFile: /traefik/certs/shadowarcanist.key
```

3. Save the configuration
---
If you want to add multiple certificates and keys, you can do it like this:
```sh
tls:
  certificates:
    -
      certFile: /traefik/certs/shadowarcanist.cert
      keyFile: /traefik/certs/shadowarcanist.key
    -
      certFile: /traefik/certs/name2.cert
      keyFile: /traefik/certs/name2.key
    -
      certFile: /traefik/certs/name3.cert
      keyFile: /traefik/certs/name3.key
```

== Caddy
<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/16.webp" />

1. Choose a name for your configuration (must end with `.caddy`).
2. Enter the following details in the configuration field:
```sh
*.shadowarcanist.com, shadowarcanist.com {
    tls /data/certs/shadowarcanist.cert /data/certs/shadowarcanist.key
}
```

> Note: The wildcard `*.shadowarcanist.com` provides coverage for all subdomains, exclude it if you’re only securing a single domain (i.e, `shadowarcanist.com`).

3. Save the configuration

---

If you want to add multiple certificates and keys, you can do it like this:
```sh
*.shadowarcanist.com, shadowarcanist.com {
    tls /data/certs/shadowarcanist.cert /data/certs/shadowarcanist.key
}

*.name2.com, name2.com {
    tls /data/certs/name2.cert /data/certs/name2.key
}

*.name3.com, name3.com {
    tls /data/certs/name3.cert /data/certs/name3.key
}
```
:::


From now on, Coolify will use the origin certificate for requests matching the hostname.

## 4. Setup Encryption mode on Cloudflare

To set up encryption on Cloudflare, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/4.webp" />

1. Go to **SSL/TLS** in Cloudflare.
2. Select **Overview**.
3. Click **Configure** button

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/5.webp" />

Choose **Full (Strict)** as the encryption mode.

## 5. Configure Tunnel to Use HTTPS

To configure the tunnel for HTTPS, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/6.webp" />

1. Click the three dots icon to open the settings menu.
2. Select **Edit** to allow hostname modifications.

Next, update the hostnames as follows:

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/7.webp" />

1. Change the type from **HTTP** to **HTTPS**.
2. Change the port from **80** to **443**.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/8.webp" />

3. Click on **Additional Application Settings**.
4. Select **TLS**.
5. Enter your root domain in the **Origin Server Name** field.
6. Scroll down and click the **Save Hostname** button.

## 6. Configure Cloudflare to Always Use HTTPS

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/9.webp" />

1. In the Cloudflare dashboard, go to **SSL/TLS**.
2. Select **Edge Certificates**.
3. Enable **Always Use HTTPS**.

## 7. Update URLs from HTTP to HTTPS

Now, update all URLs from **HTTP** to **HTTPS** in Coolify, including resources and the instance domain on the settings page.

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/10.webp" />

<br />

<ZoomableImage src="/docs/images/integrations/cloudflare/tunnels/full-tls/11.webp" />

**Congratulations!** All your resources are now running on HTTPS at all times.
