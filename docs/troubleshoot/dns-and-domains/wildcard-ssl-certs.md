---
title: Coolify not using Wildcard SSL Certificates
description: Fix wildcard SSL certificate issues in Coolify by verifying installation, checking proxy configuration, and clearing browser cache.
---

# Coolify not using Wildcard SSL Certificates

If your wildcard SSL certificate isn't working with your domain, it may be due to configuration problems. Here's how you can check and fix it.

## 1. Check the SSL Certificate Validity

- **Verify the Certificate:** Make sure the SSL certificate is valid for the domain.
  - Confirm the Common Name (CN) matches your domain.
  - Double-check that your wildcard certificate is not expired.

## 2. Verify Certificate Installation

- **File Extensions:** Make sure the SSL certificate file ends with `.cert` and the key file ends with `.key`.
  - Some providers give files in `.pem` format, which must be converted to `.cert` and `.key` before adding them to your server (simply rename the files to `.cert` for the certificate and `.key` for the key)
- **File Location:** Make sure your `.cert` and `.key` files are located in the `/data/coolify/proxy/certs` directory.

## 3. Check the Coolify Proxy Configuration

- **Add Certificate in Dashboard:** Make sure you have added the SSL certificate configuration in the Coolify proxy via the dashboard. More details can be found [here](/knowledge-base/proxy/traefik/custom-ssl-certs).
- **Check File Mounts:** If you have modified the proxy configuration, verify that the `/data/coolify/proxy` directory is mounted correctly.

## 4. Remove Old Certificates

- **Old Certificate Issue:** The Coolify proxy may be using an old certificate stored in the `acme.json` file.
- **Action:** Delete the `acme.json` file from the `/data/coolify/proxy` directory and restart the Coolify proxy from the dashboard by clicking the restart proxy button.

## 5. Clear Your Browser Cache

- **Cache Issue:** Your browser might be caching an old SSL certificate.
- **Action:** Check your website using a different browser or network.
  - You can also use sandbox tools like [Browserling](https://www.browserling.com?utm_source=coolify.io) to test your site.

## 6. Verify DNS Challenge Configuration

- **DNS Challenge Check:** If you are using a DNS challenge, confirm that it is set up correctly.
- **Action:** Verify that you have selected the correct DNS provider, API Keys and check the challenge settings are properly configured.

## Support

If none of the above steps work, try these additional options:

- **Community Help:** Join our [Discord community](https://coolify.io/discord) and post in the support forum channel.
- **What to Share:** Include a description of your issue, screenshots of your configuration, any error messages, and the steps you have already tried.
