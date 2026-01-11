---
title: "Matrix"
description: "Run Matrix Synapse server on Coolify for decentralized chat, end-to-end encryption, federation, and secure real-time communication platform."
---

# Matrix

<ZoomableImage src="/docs/images/services/matrix-logo.svg" alt="Matrix dashboard" />

## What is Matrix?

Matrix is an open-source, decentralized communication protocol that enables secure, real-time communication. It provides end-to-end encrypted messaging, voice and video calls, file sharing, and room-based conversations. Matrix serves as an excellent alternative to proprietary platforms like Slack or Discord, offering federation capabilities that allow different Matrix servers to communicate with each other.

### Traefik Configuration

To avoid any routing errors when using Matrix together with [Traefik](/knowledge-base/proxy/traefik/overview), make sure to edit the proxy config on the Server where you've Matrix installed and add this under the `command:` section:

```yml
- "--entrypoints.http.http.encodedcharacters.allowencodedhash=true"
- "--entrypoints.https.http.encodedcharacters.allowencodedhash=true"
- "--entrypoints.http.http.encodedcharacters.allowencodedpercent=true"
- "--entrypoints.https.http.encodedcharacters.allowencodedpercent=true"
```

## Links

- [The official website](https://matrix.org?utm_source=coolify.io)
- [GitHub](https://github.com/matrix-org/synapse?utm_source=coolify.io)
