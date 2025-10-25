---
title: Pocket ID
description: "Deploy Pocket ID on Coolify for simple OIDC provider with passwordless passkey authentication across your self-hosted services."
---

# Pocket ID

<ZoomableImage src="/docs/images/services/pocket-id_screenshot.webp" alt="Pocket ID Banner" />

## What is Pocket ID?

Pocket ID is a simple OIDC provider for passwordless authentication using [passkeys](https://www.passkeys.io/). It's designed to be straightforward and easy-to-use. It exclusively supports passkey authentication, allowing you to use hardware security keys like Yubikey for secure sign-ins across your self-hosted services.

## Features

- **Passwordless Authentication**: Uses passkeys instead of passwords for better security
- **OIDC Provider**: Integrates with applications that support OpenID Connect
- **Simple Setup**: Easy to install and configure compared to complex alternatives
- **Wide Compatibility**: Works with [various services](https://pocket-id.org/docs/client-examples?utm_source=coolify.io) like Nextcloud, GitLab, and more
- **Passkey Support**: Full support for hardware security keys like Yubikey
- **Self-Hosted**: Maintain complete control over your authentication infrastructure

## Getting Started

Once deployed, you can sign in with the admin account at:

```
https://<your-app-url>/setup
```

Follow the Pocket ID setup wizard to configure your instance and create your first passkey.

## Demo

To see Pocket ID in action, visit the [live demo](https://demo.pocket-id.org/).

:::info
This demo is not affiliated with Coolify.
:::

## Links

- [Official Website](https://pocket-id.org?utm_source=coolify.io)
- [Documentation](https://pocket-id.org/docs/introduction?utm_source=coolify.io)
- [Installation Guide](https://pocket-id.org/docs/setup/installation?utm_source=coolify.io)
- [GitHub](https://github.com/pocket-id/pocket-id?utm_source=coolify.io)

## Additional Resources

- [Proxy Services Guide](https://pocket-id.org/docs/guides/proxy-services?utm_source=coolify.io)
- [Client Examples](https://pocket-id.org/docs/client-examples?utm_source=coolify.io)