---
title: Cloudflare Origin Certificate
description: "Secure Coolify deployments with 15-year Cloudflare Origin Certificates for TLS encryption without HTTP challenges or port 80 exposure requirements."
---

# Cloudflare Origin Certificate

<br />
<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/header.webp" alt="Coolify header" />

The Cloudflare Origin Certificate ensures secure communication between your server and Cloudflare when using Cloudflare’s Proxy, CDN, and security features.

It encrypts the data exchanged between your server and Cloudflare, keeping it safe.

### Why Use Cloudflare Origin Certificate with Coolify?

1. No need for HTTP or DNS challenges to create certificates.
2. Keep port 80 closed — everything happens securely over TLS.
3. Longer certificate validity (15 years) — once set up, you don’t need to worry about renewing every few months.

### When to Avoid Using Cloudflare Origin Certificate

1. If you need a free certificate for subdomains with multiple levels (e.g., app.sub.domain.com).
2. The certificate is only trusted by Cloudflare, meaning if Cloudflare is down, nobody can access your apps and websites (via your domain).

---

::: info Example Data
The following data is used as an example in this guide. Please replace it with your actual data when following the steps:

- **IPv4 Address of Origin Server:** 203.0.113.1
- **Domain Name:** shadowarcanist.com
- **Username:** shadowarcanist
  :::

## 1. Create the Origin Certificate

To create your Cloudflare Origin Certificate, follow these steps:

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/1.webp" alt="Screenshot of Origin Cert" />

1. In your Cloudflare dashboard, go to **SSL/TLS**.
2. Select **Origin Server**.
3. Click the **Create Certificate** button.

You’ll be asked to choose a private key type, hostnames, and certificate validity.

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/2.webp" alt="Screenshot of Origin Cert" />

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

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/3.webp" alt="Screenshot of Origin Cert" />

1. Choose **PEM** as the key format.
2. Copy your **Certificate**.
3. Copy your **Private Key**.

Next, you'll add these to your server running Coolify and configure Coolify to use this certificate.

## 2. Add Certificate to Your Server

SSH into your server or use Coolify's terminal feature. For this guide, I’m using SSH:

```sh
ssh shadowarcanist@203.0.113.1
```

Once logged in, navigate to the Coolify proxy directory:

```sh
$ cd /data/coolify/proxy
```

Check if you have a **certs** folder:

```sh
$ ls
> acme.json  docker-compose.yml  dynamic
```

If there’s no **certs** folder, create it:

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

Now the origin certificate is installed on your server.

## 3. Set Up DNS Records and TLS Encryption

To make the origin certificate work, configure your DNS records, enable TLS, and set up HTTP to HTTPS redirects in Cloudflare:

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/4.webp" alt="Screenshot of Origin Cert" />

1. In Cloudflare, go to **DNS**.
2. Select **Records**.
3. Add 2 A records:
4. Enter name as **`shadowarcanist.com`** and `*`
5. Use the **IP address** of your server as the content for both records.
6. Set the proxy status to **Proxied** for better security.

Next, set up TLS encryption:

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/5.webp" alt="Screenshot of Origin Cert" />

1. Go to **SSL/TLS** in Cloudflare.
2. Select **Overview**.
3. Click **Configure** button

Choose **Full (Strict)** as the encryption mode.

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/6.webp" alt="Screenshot of Origin Cert" />

Finally, enable HTTP to HTTPS redirects:

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/7.webp" alt="Screenshot of Origin Cert" />

1. In Cloudflare, go to **SSL/TLS**
2. Select **Edge Certificates**.
3. Enable **Always Use HTTPS**.

## 4. Configure Coolify to Use the Origin Certificate

Now, in your Coolify dashboard:

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/8.webp" alt="Screenshot of Origin Cert" />

1. Go to the **Server** section in the sidebar.
2. Select **Proxy**.
3. Open the **Dynamic Configuration** page
4. Click **Add** button

You will now be prompted to enter the Dynamic Configuration.

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/9.webp" alt="Screenshot of Origin Cert" />

1. Choose a name for your configuration.
2. Enter the following details in the configuration field:

```sh
tls:
  certificates:
    -
      certFile: /traefik/certs/shadowarcanist.cert
      keyFile: /traefik/certs/shadowarcanist.key
```

Adding Multiple Certificates (click to view)

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

3. Save the configuration

From now on, Coolify will use the origin certificate for requests matching the hostname.

::: danger HEADS UP!
**All the steps below are optional. Coolify should already be using the origin certificate. Follow these steps only if you know what you're doing and want to simplify the configuration**
:::

## 5. Optional: Configure Traefik

This step is optional but recommended for cleaning up unnecessary settings while self-hosting.

Since you’re using an Origin Certificate, you no longer need HTTP challenges or port 80 open.

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/10.webp" alt="Screenshot of Origin Cert" />

1. Go **Server** in the Coolify dashboard.
2. Select **Proxy**.
3. Open **Configuration**.
4. Replace the configuration with this:

```sh
# Define external networks
networks:
  coolify:
    external: true  # External network.

services:
  # Traefik reverse proxy
  traefik:
    container_name: coolify-proxy  # Container name.
    image: 'traefik:v3.1'  # Traefik image version.
    restart: unless-stopped  # Auto-restart policy.
    extra_hosts:
      - 'host.docker.internal:host-gateway'  # Host communication.
    networks:
      - coolify  # Network connection.
    ports:
      - '443:443'  # Expose HTTPS port.
    healthcheck:  # Health check configuration.
      test: 'wget -qO- http://localhost:80/ping || exit 1'  # Ping endpoint for health check.
      interval: 4s  # Health check interval.
      timeout: 2s  # Health check timeout.
      retries: 5  # Retry attempts.
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock:ro'  # Docker socket access.
      - '/data/coolify/proxy:/traefik'  # Traefik config volume.
    command:
      # Traefik configuration options
      - '--ping=true'  # Enable ping for health check.
      - '--ping.entrypoint=http'  # Use HTTP entrypoint for ping.
      - '--entrypoints.http.address=:80'  # HTTP entry point for health checks.
      - '--entrypoints.https.address=:443'  # HTTPS entry point.
      - '--entrypoints.http.http.encodequerysemicolons=true'  # Enable query semicolon encoding.
      - '--entryPoints.http.http2.maxConcurrentStreams=50'  # HTTP/2 max streams.
      - '--entrypoints.https.http.encodequerysemicolons=true'  # Enable HTTPS query encoding.
      - '--entryPoints.https.http2.maxConcurrentStreams=50'  # HTTPS/2 max streams.
      - '--entrypoints.https.http3'  # Enable HTTP/3.
      - '--providers.docker.exposedbydefault=false'  # Disable default exposure.
      - '--providers.file.directory=/traefik/dynamic/'  # Dynamic config directory.
      - '--certificatesresolvers.letsencrypt.acme.httpchallenge=false'  # Disable HTTP challenge for Let's Encrypt.
      - '--providers.file.watch=true'  # Enable config file watching.
      - '--providers.docker=true'  # Enable Docker provider.
    labels:
      - coolify.managed=true  # Managed by Coolify.
      - coolify.proxy=true  # Proxy service.
```

::: info Note
The comments in this configuration explain each line. You can remove the comments when copying it into your configuration.
:::

Next, you'll need to remove a few labels from your Dockerfile-based deployments. Below is an **example** of how I set this up for my website.

<ZoomableImage src="/docs/images/knowledge-base/cf-origin-cert/11.webp" alt="Screenshot of Origin Cert" />

1. Go to **Projects** and select your project.
2. Open **Configuration**
3. Go to **General**
4. Check **Readonly labels** option
5. Replace the labels with the following:

```sh
# Enable Traefik for this configuration
traefik.enable=true

# Define the entry point for the router (HTTPS)
traefik.http.routers.shadowarcanist.entryPoints=https

# Set the routing rule for this router to match the domain "shadowarcanist.com" and any path starting with "/"
traefik.http.routers.shadowarcanist.rule=Host(`shadowarcanist.com`) && PathPrefix(`/`)

# Assign the service 'shadowarcanist' to this router
traefik.http.routers.shadowarcanist.service=shadowarcanist

# Enable TLS (HTTPS) for this router
traefik.http.routers.shadowarcanist.tls=true

# Specify the backend service and its port (port 80)
traefik.http.services.shadowarcanist.loadbalancer.server.port=80
```

Now you’re done! Your server is set up to use the Cloudflare Origin Certificate, and all traffic is secured via TLS.

---

::: warning Note
Keep in mind that the above labels are provided as an example. These may or may not work for your specific use case, so use them as a reference.
:::

## Credits

The header image is designed using icons from [Flaticon](https://www.flaticon.com/).
Links to each icon can be found below:

- [Medal icon](https://www.flaticon.com/free-icon/medal_14468558) by [Vlad Szirka](https://www.flaticon.com/authors/vlad-szirka)
- [Award icon](https://www.flaticon.com/free-icon/award_15218157) by [explanaicon](https://www.flaticon.com/authors/explanaicon)
- [Worldwide icon](https://www.flaticon.com/free-icon/worldwide_870169) by [Freepik](https://www.flaticon.com/authors/freepik)
- [Lock icon](https://www.flaticon.com/free-icon/lock_2089784) by [Those Icons](https://www.flaticon.com/authors/those-icons)
- [Browser icon](https://www.flaticon.com/free-icon/browser_331190) by [Alfredo Hernandez](https://www.flaticon.com/authors/alfredo-hernandez)
- [Database icon](https://www.flaticon.com/free-icon/database_8028666) by [Tanah Basah](https://www.flaticon.com/authors/tanah-basah)
