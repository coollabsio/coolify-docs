---
title: "Authelia"
description: "Documentation for installing and hosting Authelia with Coolify."
---

# Authelia

<ZoomableImage src="/docs/images/services/authelia.svg" height="100px" />

## What is Authelia?
Authelia is an open-source authentication and authorization server and portal fulfilling the identity and access management (IAM) role of information security in providing multi-factor authentication and single sign-on (SSO) for your applications via a web portal.

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
1. Back in the service page, go to **Persistent Storages** to edit the [configuration files](https://www.authelia.com/configuration/prologue/introduction/). At a minimum, you'll need to make the following changes:
    - In the **configuration file**, under `session.cookies`, change the **domain** to the root/wildcard domain you've setup in Coolify (e.g. `mydomain.com`). Click **Save**.
    - In the **user database file**, change the default user, password, and other info. The password(s) [should be hashed](https://www.authelia.com/reference/guides/passwords/). Click **Save**.
1. In the Coolify UI, head over to **Servers** - `<your server>` - **Proxy** - **Dynamic Configurations**, and add the following file to set up the Authelia middleware:
    ::: code-group
    ```yaml [authelia.yaml]
    http:
      middlewares:
        authelia:
          forwardAuth:
            address: 'http://authelia:9091/api/authz/forward-auth'
            trustForwardHeader: true
            authResponseHeaders:
              - Remote-User
              - Remote-Groups
              - Remote-Name
              - Remote-Email
    ```
    :::
1. Go back to the service page and and click **Deploy** in the top right.
1. Under **Links** at the top, click on the Authelia URL and test that you can log in.
1. Under **Links** again, click on the test app URL (`https://authtest...`). You should see the forwarded headers corresponding to your user (`Remote-User`, `Remote-Email`, etc.). If so, this means that Authelia is setup correctly 🎉!
1. You can now start protecting your Coolify apps and services with Authelia:
    - For authentication via **proxy & forwarded headers**, add the Authelia middleware to each app or service you want to protect, as described below. Make sure to also consult the app's documentation for setting up header / proxy auth.
        - For **applications**: Scroll down to **Container Labels**, and uncheck *Readonly labels* at the bottom. Then, find the **https** middlewares and append `,authelia@file`:
          ```yaml
          traefik.http.routers.https-0-<abcdef>.middlewares=gzip # [!code --]
          traefik.http.routers.https-0-<abcdef>.middlewares=gzip,authelia@file # [!code ++]
          ```
        - For **services**: open the Docker Compose file and add the following label to the service(s) that should be protected:
          ```yaml
          labels:
            - traefik.http.middlewares.authelia@file # [!code ++]
          ```
    - For authentication via **OIDC/OAuth**, you'll need further configuration - consult the [Authelia docs](https://www.authelia.com/configuration/identity-providers/openid-connect/provider/).

## Important Notes
- In order for Authelia to receive the correct `X-Forwarded-*` headers, it is important to setup [Trusted Proxies](https://www.authelia.com/integration/proxies/traefik/#trusted-proxies) in your Traefik configuration.
- Make sure to adjust the [Access Control](https://www.authelia.com/configuration/security/access-control/) in the configuration file to your specific needs. For example, you may want to change the **default_policy** to `two_factor` to require 2FA for all protected apps, and/or add rules to allow certain routes in an app to bypass authentication.

## Links
- [Official website ›](https://www.authelia.com/?utm_source=coolify.io)
- [GitHub ›](https://github.com/authelia/authelia?utm_source=coolify.io)
