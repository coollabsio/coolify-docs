---
title: "Authelia"
description: "Documentation for installing and hosting Authelia with Coolify."
---

# Authelia

<ZoomableImage src="/docs/images/services/authelia.svg" height="100px" />

## What is Authelia?
Authelia is an open-source authentication and authorization server fulfilling the identity and access management (IAM) role of information security in providing multi-factor authentication and single sign-on (SSO) for your applications via a web portal.

Authelia can help you protect your Coolify applications and services in a variety of ways, including via two-factor authentication (2FA) as well as OpenID Connect (OIDC).

## Setup
::: tip
This setup guide assumes you are using the default proxy service, Traefik, and
have already setup a [wildcard domain](https://coolify.io/docs/knowledge-base/server/introduction#wildcard-domain) in Coolify's server settings.
:::
1. Add the **Authelia** resource to get started.
1. Under **Services**, click **Settings** on the right side of the Authelia service.
    - Under **Domains**, you can change the Authelia URL as desired (make sure to keep the port number). For example, `https://auth.mydomain.com:9091`
    - Under **Image**, pin the image version by replacing *latest* with a [recent minor version](https://github.com/authelia/authelia/releases) of Authelia (e.g. `authelia/authelia:4.39`).
    - Click **Save**
    <ZoomableImage src="/docs/images/services/authelia_doc_1.webp" />
1. Back in the service page, go to **Environment Variables**. Update the `BASE_DOMAIN` variable to the root/wildcard domain that you've set up with Coolify. Click **Update**.
    <ZoomableImage src="/docs/images/services/authelia_doc_2.webp" />
1. Go to **Persistent Storages**. Here you can quickly edit the Authelia configuration file, the user database file, and view notifications from Authelia in the notification file.
    - Scroll down to the **user database file**, and adjust the default user. Make sure to update the password field with a [hashed password](https://www.authelia.com/reference/guides/passwords/#passwords). Click **Save**.
    <ZoomableImage src="/docs/images/services/authelia_doc_3.webp" />
1. Click **Deploy** in the top right. Wait for all the containers to start up.
1. Under **Links** at the top, click on the Authelia URL and test that you can log in.
1. Under **Links** again, click on the whoami URL (`https://whoami...`). You should see the forwarded headers corresponding to your user (`Remote-User`, `Remote-Email`, etc.). If so, this means that Authelia is setup correctly 🎉!
1. You can now start protecting your Coolify apps and services with Authelia:
    - For authentication via **proxy & forwarded headers**, add the Authelia middleware to each app or service you want to protect, as described below. Make sure to also consult the app's documentation for setting up header / proxy auth.
        - For **applications**: Scroll down to **Container Labels**, and uncheck *Readonly labels* at the bottom. Then, find the **https** middlewares and append `,authelia@docker`:
          ```yaml
          traefik.http.routers.https-0-<abcdef>.middlewares=gzip                  # [!code --]
          traefik.http.routers.https-0-<abcdef>.middlewares=gzip,authelia@docker  # [!code ++]
          ```
        - For **services**: Open the Docker Compose file, and add the following label to the service(s) that should be protected: `traefik.http.middlewares.authelia@docker`
          ```yaml
          services:
            ...
            protected-service:
              ...
              labels:                                       # [!code ++]
                - traefik.http.middlewares.authelia@docker  # [!code ++]
          ```
    - For authentication via **OIDC/OAuth**, you'll need further configuration - consult the [Authelia OIDC docs](https://www.authelia.com/configuration/identity-providers/openid-connect/provider/).

## Important Notes
- Adjust the [Access Control](https://www.authelia.com/overview/authorization/access-control/) in the configuration file to your specific needs. For example, you may want to change the **default_policy** to `two_factor` to require 2FA for all protected apps, and/or add rules for specific apps and routes.
- In production systems, it is recommended to switch the [notification provider](https://www.authelia.com/configuration/notifications/introduction/) to SMTP in the configuration file.
- In order for Authelia to receive the correct `X-Forwarded-*` headers, you may need to adjust the [Trusted IPs](https://doc.traefik.io/traefik/routing/entrypoints/#forwarded-headers) in your Coolify proxy configuration.

## Links
- [Official website ›](https://www.authelia.com/?utm_source=coolify.io)
- [GitHub ›](https://github.com/authelia/authelia?utm_source=coolify.io)
