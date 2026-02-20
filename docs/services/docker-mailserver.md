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

## Links

- [Docker Mailserver Documentation](https://docker-mailserver.github.io/docker-mailserver/latest/?utm_source=coolify.io)
- [GitHub Repository](https://github.com/docker-mailserver/docker-mailserver)
