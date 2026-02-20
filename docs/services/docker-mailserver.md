---
title: "Docker Mailserver"
description: "Deploy Docker Mailserver on Coolify to self-host a full email stack with SMTP, IMAP, and modern mail security defaults."
---

# Docker Mailserver

<ZoomableImage src="/docs/images/services/docker-mailserver.svg" alt="Docker Mailserver" />

## What is Docker Mailserver?

Docker Mailserver is a production-ready self-hosted email server stack. It bundles Postfix, Dovecot, and common mail security components in a single deployable setup.

## Deployment Notes

The Coolify one-click template configures:

- SMTP + submission ports (`25`, `465`, `587`)
- IMAP ports (`143`, `993`) and ManageSieve (`4190`)
- Persistent volumes for mail data, state, logs, and configuration
- Common mail hardening defaults (DKIM, DMARC, SPF policy support)

## Recommended Setup

- Configure `MAILSERVER_HOSTNAME` and `POSTMASTER_ADDRESS` before production use.
- Set up valid DNS records (MX, SPF, DKIM, DMARC) for deliverability.
- Provide TLS certificates and verify `SSL_TYPE` according to your setup.

## DNS and Deliverability Checklist

1. MX record points to the same host as `MAILSERVER_HOSTNAME`.
2. SPF record includes your outbound mail host.
3. DKIM key is generated/published before enabling outbound production traffic.
4. DMARC policy starts with monitoring mode (`p=none`) and is tightened after validation.
5. Reverse DNS (PTR) is aligned with your sending hostname when possible.

## Links

- [Docker Mailserver Documentation](https://docker-mailserver.github.io/docker-mailserver/latest/?utm_source=coolify.io)
- [GitHub Repository](https://github.com/docker-mailserver/docker-mailserver)
