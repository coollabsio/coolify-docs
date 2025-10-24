---
title: Usesend
description: "Send emails on Coolify with Usesend for developer-focused email API, templates, testing, and transactional email delivery service."
---

# Usesend
<br/>
<ZoomableImage src="/docs/images/services/usesend-hero-dark.webp" alt="Usesend dashboard" />

## What is Usesend

Usesend is an open-source alternative to Resend, Sendgrid, Mailgun and Postmark etc.

There are some setup to be made, please refer to the [official documentation](https://docs.usesend.com/self-hosting/overview?utm_source=coolify.io) for more information.

## SMTP Configuration

Running Usesend with SMTP support requires an additional relay component to handle incoming SMTP requests. This relay service binds to multiple ports supporting both SSL and TLS connections.

### Prerequisites

Before configuring the SMTP relay, you need to add a certificate dumper to your Traefik proxy configuration to make Coolify's SSL certificates accessible to the relay:

1. Navigate to **Server** → **Proxy** → **Configuration**
2. Add the certificate dumper configuration to expose certificates through `/data/coolify/certs/`

### Adding the SMTP Relay Service

Add the following service at the end of the compose file (by clicking on "Edit compose file" when adding the service):

Change the `###USESEND FQDN (e.g. usesend.example.com)###` with your actual domain name.
```yaml
  smtp-server:
    container_name: usesend-smtp-server
    image: 'usesend/smtp-proxy:latest'
    volumes:
      - type: bind
        source: /data/coolify/certs/###USESEND FQDN (e.g. usesend.example.com)###/key.pem
        target: /data/certs/key.pem
        read_only: true
      - type: bind
        source: /data/coolify/certs/###USESEND FQDN (e.g. usesend.example.com)###/cert.pem
        target: /data/certs/cert.pem
        read_only: true
    environment:
      - SMTP_AUTH_USERNAME=usesend
      - SERVICE_FQDN_SMTP
      - 'USESEND_BASE_URL=${SERVICE_URL_USESEND_3000}'
      - USESEND_API_KEY_PATH=/data/certs/key.pem
      - USESEND_API_CERT_PATH=/data/certs/cert.pem
    ports:
      - '25:25'
      - '587:587'
      - '2587:2587'
      - '465:465'
      - '2465:2465'
    healthcheck:
      test:
        - CMD
        - nc
        - -z
        - localhost
        - "25"
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```



## Links

- [Official Documentation](https://docs.usesend.com/self-hosting/overview?utm_source=coolify.io)
- [Official Website ↗](https://usesend.com?utm_source=coolify.io)
- [GitHub ↗](https://github.com/usesend/usesend)