---
title: Cloudflare DDoS Protection
description: Learn how to set up Cloudflare DDoS protection for applications deployed with Coolify.
---

# Cloudflare DDoS Protection

Cloudflare provides a robust layer of DDoS protection for your server and applications. 

When using Cloudflare’s Proxy, CDN, and security features, all incoming traffic to your Coolify-hosted apps is shielded from malicious attacks, like DDoS, and secured through Cloudflare’s global network.

---

### Why Use Cloudflare for DDoS Protection with Coolify?

1. Blocks malicious traffic before it reaches your server, reducing risk and server load.
2. No need to scale server resources during DDoS attacks — Cloudflare absorbs the impact.
3. Minimal configuration required to enable robust protection against potentially costly attacks.
4. Hides your server’s real IP address by resolving your domain to Cloudflare’s IPs.

---

### When Not to Use Cloudflare for DDoS Protection

1. You prefer not to route all traffic through Cloudflare’s network.
2. Privacy concerns, Cloudflare terminates TLS, which means they can inspect incoming requests.
3. Cloudflare downtime, although extremely rare, could affect your service if you rely entirely on their protection.
4. You want full control over SSL/TLS certificates issued by a global Certificate Authority.
5. You need free wildcard support for deep subdomains (more than 1 level subdomains -- e.g., `*.sub.domain.com` which Cloudflare does not offer for free).

---

::: info Example Data
  The following data is used as an example in this guide. Please replace it with your actual data when following the steps:
  
  - **IPv4 Address of Origin Server:** 203.0.113.1
  - **Domain Name:** shadowarcanist.com
  - **Username:** shadowarcanist
:::


## 1. Create the Origin Certificate
Communication between your server and Cloudflare is encrypted using a custom Cloudflare Origin Certificate (required when using Cloudflare’s proxy).

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/origin-cert-illustration.webp" />


To create your Cloudflare Origin Certificate, follow these steps:

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/1.webp" />

1. In your Cloudflare dashboard, go to **SSL/TLS**.
2. Select **Origin Server**.
3. Click the **Create Certificate** button.

You’ll be asked to choose a private key type, hostnames, and certificate validity.

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/2.webp" />

1. Choose **RSA (2048)** for the key type.
2. Add the hostnames you want the certificate to cover.

::: warning HEADS UP!
  - **`shadowarcanist.com`** will cover only the main domain.
  - **`*.shadowarcanist.com`** will cover all subdomains.
  
  On Cloudflare’s free plan, wildcard certificates cover just one level of subdomains
  
  For example, it works for **`coolify.shadowarcanist.com`** but not **`www.coolify.shadowarcanist.com`**. 
  
  To cover multiple levels, you'll need to purchase the [Advanced Certificate Manager ↗](https://www.cloudflare.com/application-services/products/advanced-certificate-manager/)
:::

3. Set the certificate validity to **15 years**.

Your certificate will now be generated.

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/3.webp" />

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


## 3. Set Up DNS Records and TLS Encryption
To make the origin certificate work, configure your DNS records, enable TLS, and set up HTTP to HTTPS redirects in Cloudflare:

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/4.webp" />

1. In Cloudflare, go to **DNS**.
2. Select **Records**.
3. Add 2 A records:
4. Enter name as **`shadowarcanist.com`** and `*`
5. Use the **IP address** of your server as the content for both records.
6. Set the proxy status to **Proxied** for both records.

::: info
Enabling the "Proxied" (orange cloud) option for both A records — `shadowarcanist.com` and `*` — will proxy the root domain and all one-level subdomains via a wildcard. 

This isn't necessary if you only need to proxy (or protect against DDoS) for a specific domain. In that case, simply enable proxying for the domain you want protection for.
:::

Next, set up TLS encryption:

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/5.webp" />

1. Go to **SSL/TLS** in Cloudflare.
2. Select **Overview**.
3. Click **Configure** button

Choose **Full (Strict)** as the encryption mode.

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/6.webp" />

Finally, enable HTTP to HTTPS redirects:

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/7.webp" />

1. In Cloudflare, go to **SSL/TLS** 
2. Select **Edge Certificates**.
3. Enable **Always Use HTTPS**.


## 4. Configure Coolify proxy to Use the Origin Certificate
<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/8.webp" />

1. Go to the **Server** section in the sidebar.
2. Select **Proxy**.
3. Open the **Dynamic Configuration** page
4. Click **Add** button

You will now be prompted to enter the Dynamic Configuration.

Adding Dynamic Configuration slightly varies for Caddy and Traefik proxy so choose the correct one from the below section

:::tabs

== Traefik

<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/9.webp" />

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
<ZoomableImage src="/docs/images/integrations/cloudflare/ddos-protection/10.webp" />

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

Now you’re done! Your server is set up to use the Cloudflare Origin Certificate, and all traffic is proxied through Cloudflare network so all incoming attacks like DDoS are prevented by Cloudflare before it reaches your server.

::: danger HEADS UP!!
**All the steps below are optional. Cloudflare should already be protecting your applications. Follow the below steps if you want to prevent attackers from directly attacking your server by it's IP Address on Port 80 and 443**
:::


## 5. Configure Firewall to Allow Only Cloudflare Traffic
Configure your firewall to allow incoming traffic on port **443** only from [Cloudflare’s IP ranges ↗](https://www.cloudflare.com/en-gb/ips/).

Block all other inbound traffic, except for your SSH port.

This prevents attackers from bypassing Cloudflare and directly targeting your server with traffic on ports 80 or 443.

This step is completely optional but recommended.


## Credits
The origin-cert-illustration image is designed using icons from [Flaticon ↗](https://www.flaticon.com/). 
Links to each icon can be found below:
- [Medal icon ↗](https://www.flaticon.com/free-icon/medal_14468558) by [Vlad Szirka ↗](https://www.flaticon.com/authors/vlad-szirka)
- [Award icon ↗](https://www.flaticon.com/free-icon/award_15218157) by [explanaicon ↗](https://www.flaticon.com/authors/explanaicon)
- [Worldwide icon ↗](https://www.flaticon.com/free-icon/worldwide_870169) by [Freepik ↗](https://www.flaticon.com/authors/freepik)
- [Lock icon ↗](https://www.flaticon.com/free-icon/lock_2089784) by [Those Icons ↗](https://www.flaticon.com/authors/those-icons)
- [Browser icon ↗](https://www.flaticon.com/free-icon/browser_331190) by [Alfredo Hernandez ↗](https://www.flaticon.com/authors/alfredo-hernandez)
- [Database icon ↗](https://www.flaticon.com/free-icon/database_8028666) by [Tanah Basah ↗](https://www.flaticon.com/authors/tanah-basah)