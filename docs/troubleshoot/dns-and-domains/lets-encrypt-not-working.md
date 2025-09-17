---
title: Let's Encrypt Not Generating SSL Certificates on Coolify
---


# Let's Encrypt Not Generating SSL Certificates
If you are using the default settings for the Coolify proxy and your website suddenly shows a warning about an insecure connection, it is most likely that your website is using a self-signed certificate from the Coolify proxy. This guide will help you fix the issue.


## 1. Understand the Domain Ownership Challenges

Coolify uses [Let's Encrypt ↗](https://letsencrypt.org?utm_source=coolify.io) to generate SSL certificates for your domains. 

By default, Let's Encrypt uses the **HTTP challenge** for domain validation, but some users might use the **TLS-ALPN-01 challenge**. Here's a breakdown:

- **HTTP Challenge**: 
  - Let's Encrypt sends an HTTP request to your server on port 80 with a unique token. If your server responds with the correct token, it confirms domain ownership, and the certificate is issued.
  
- **TLS-ALPN-01 Challenge**:
  - Let's Encrypt validates your domain over port 443 (HTTPS), during the TLS handshake, Let's Encrypt expects your server to provide a special response. If the server provides the correct response, the domain is verified, and the certificate is issued. 
  - If this step fails, you’ll get an SSL handshake error.


## 2. Check Port Accessibility

Ensure the appropriate ports are open for the respective challenge methods:

- **For the HTTP Challenge**: Port 80 (HTTP) needs to be open and accessible from the internet. If port 80 is closed or blocked by a firewall, Let's Encrypt cannot verify your domain and generate the SSL certificate.

- **For the TLS-ALPN-01 Challenge**: Port 443 (HTTPS) needs to be open and accessible from the internet. If port 443 is closed or blocked by a firewall, Let's Encrypt cannot verify your domain and generate the SSL certificate.


## 3. Usage of Third-Party Proxy
If you are proxying your website through a third-party service like [Cloudflare ↗](https://www.cloudflare.com?utm_source=coolify.io), Let's Encrypt might fail to validate your domain due to the proxy interfering with the **HTTP** or **TLS-ALPN-01** challenge. In that case, you must either use a DNS challenge or stop proxying your domain through the third-party service.


## 4. Check Let's Encrypt Service Status
Sometimes, Let's Encrypt might be having issues on their end. Check the Let's Encrypt status from [here ↗](https://letsencrypt.status.io?utm_source=coolify.io). If there is an issue, wait for them to fix it and try again once the issue is fixed.


## 5. Note on Certificate Validity
Let's Encrypt certificates are valid for 90 days. If your certificate is still valid, your domain mayo work fine even if requied port 80 is closed or your domain is being proxied. This is because Coolify will continue using the existing valid certificate until it expires. 

However, if your domain has been working fine over HTTPS for several months and suddenly fails to generate a new SSL certificate, it’s likely that the existing certificate has expired. At this point, Coolify won’t be able to generate a new certificate due to the issues mentioned earlier (like port 80 being closed or proxy interference).


## 6. Force Regenerate Certificates
If the certificates stored on your server are corrupted or outdated, you can delete them and force Coolify generate new ones.  
- Open your server terminal and run:  
  ```bash
  rm /data/coolify/proxy/acme.json
  ```  
- Then, restart the Coolify proxy from the dashboard by clicking the Restart Proxy button.
  ::: details Guide: How to Restart Proxy from Dashboard?

  1. Select your server on the Coolify Dashboard
  <ZoomableImage src="/docs/images/troubleshoot/dns-and-domains/lets-encrypt-not-working/1.webp" />

  2. Click on Restart Proxy button
  <ZoomableImage src="/docs/images/troubleshoot/dns-and-domains/lets-encrypt-not-working/2.webp" />
  :::


## 7. Check Your WAF Settings
If you are using a Web Application Firewall (WAF) like [Cloudflare WAF ↗](https://www.cloudflare.com/en-gb/application-services/products/waf/?utm_source=coolify.io), make sure it is not blocking Let's Encrypt requests.


## 8. Check Coolify Proxy logs
On the Coolify proxy logs check for error messages.

- If you see an error message with a 429 status code, it means that Let's Encrypt has rate-limited your server's IP address. 
  - In this case, wait for a while and check your domain again. Most users won't encounter this, but it can happen if you are using a shared IP address.

- If you see an error message with a 403 status code, it means that requests from Let's Encrypt are blocked by something like a Web Application Firewall (WAF). 
  ::: details Guide: How to check Coolify proxy logs?

  1. Select your server on the Coolify Dashboard
  <ZoomableImage src="/docs/images/troubleshoot/dns-and-domains/lets-encrypt-not-working/1.webp" />

  2. Go to the proxy section and click the refresh button
  <ZoomableImage src="/docs/images/troubleshoot/dns-and-domains/lets-encrypt-not-working/3.webp" />
  :::


## 9. Verify DNS Records

Let's Encrypt performs a DNS lookup to resolve the IP address of your server. If you have both **IPv4 (A record)** and **IPv6 (AAAA record)** configured to point to your server, Let's Encrypt will verify both records during the domain ownership challenge.

- **If both IPv4 and IPv6 are present**, Let's Encrypt may prefer to use **IPv6** for the challenge, but **both IPv4 and IPv6 should be able to complete the challenge**.

### Why This Matters:

If either the **IPv4** or **IPv6** address is misconfigured, the challenge may fail. For example:

- If your domain resolves to both **IPv4** and **IPv6**, but the **IPv6 (AAAA) record** has **port 80 closed**, the HTTP challenge will fail. Similarly, if **port 443** is closed for IPv6, the TLS-ALPN challenge will fail, even if **IPv4** passes the challenge.

To ensure successful validation:
- Both **IPv4 (A record)** and **IPv6 (AAAA record)** must be able to serve the challenge file correctly.

If you don’t need IPv6, you can remove the **AAAA record** from your DNS configuration. This will make Let's Encrypt use **IPv4** for the challenge.

## Support
If none of the above steps work, try these additional options:
- **Community Help:** Join our [Discord community ↗](https://coolify.io/discord) and post in the support forum channel.
- **What to Share:** Include a description of your issue, any error messages, and the steps you have already tried.