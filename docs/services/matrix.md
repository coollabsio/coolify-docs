---
title: "Matrix"
description: "Run Matrix Synapse server on Coolify for decentralized chat, end-to-end encryption, federation, and secure real-time communication platform."
---

# Matrix (Synapse)

<ZoomableImage src="/docs/images/services/matrix-logo.svg" alt="Matrix dashboard" />

## What is Matrix?

Matrix is an open-source, decentralized communication protocol that enables secure, real-time communication. It provides end-to-end encrypted messaging, voice and video calls, file sharing, and room-based conversations. Matrix serves as an excellent alternative to proprietary platforms like Slack or Discord, offering federation capabilities that allow different Matrix servers to communicate with each other.

## What is Synapse?

Synapse is a [Matrix homeserver](https://matrix.org/ecosystem/servers/) written in Python/Twisted, [developed and maintained](https://github.com/element-hq/synapse) by the team [Element](https://element.io/), creators of Matrix.

## Deployment Variants

Synapse Matrix server is available in two deployment configurations in Coolify:

### Synapse with SQlite

- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, testing, or personal Matrix hosting
- **Components:** Single Synapse container with built-in SQLite database

### Synapse with PostgreSQL (recommended)

- **Database:** PostgreSQL
- **Use case:** Production deployments requiring better performance and scalability
- **Components:**
  - Synapse container
  - PostgreSQL container
  - Automatic database configuration and health checks

## Installation Steps

For all deployment variants the installation steps are the same.

### Matrix domain setup (important)

Matrix uses a value called the **server name** to generate user IDs and room
aliases.

- Server name `example.org` results in:
  - `@user:example.org`
  - `#room:example.org`

The Matrix server itself can run on a different domain, for example
`matrix.example.org`.

### Recommended setup

- Matrix server name: `example.org`
- Matrix Synapse server service domain: `matrix.example.org`

This allows users and rooms to use `:example.org` while hosting Synapse on a
subdomain.

### Coolify configuration

#### Domains

In the service configuration, set the domain to `matrix.example.org:8008`

#### Environment variables

Set the following environment variable:

- `SYNAPSE_SERVER_NAME=example.org`

### Delegation (required)

Because Synapse runs on `matrix.example.org` but identifies as `example.org`,
[delegation](https://element-hq.github.io/synapse/latest/delegate.html) is required.

On `https://example.org`, serve the following files:

- `/.well-known/matrix/client` for server delegation

```json
{
  "m.homeserver": {
    "base_url": "https://matrix.example.org"
  }
}
```

- `/.well-known/matrix/server` for Federation discovery

```json
{
  "m.server": "matrix.example.org:443"
}
```

## Links

- [The official website](https://matrix.org?utm_source=coolify.io)
- [GitHub](https://github.com/matrix-org/synapse?utm_source=coolify.io)
- [Docker image](https://hub.docker.com/r/matrixdotorg/synapse?utm_source=coolify.io)
- [Matrix Federation Tester](https://federationtester.matrix.org?utm_source=coolify.io)
