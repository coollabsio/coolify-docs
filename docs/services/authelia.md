---
title: "Authelia"
description: "Documentation for installing and hosting Authelia with Coolify."
---

# Authelia

<ZoomableImage src="/docs/images/services/authelia.svg" height="100px" />

## What is Authelia?
Authelia is an open-source authentication and authorization server and portal fulfilling the identity and access management (IAM) role of information security in providing multi-factor authentication and single sign-on (SSO) for your applications via a web portal.

Authelia can help you quickly protect your Coolify applications and services in a variety of ways, including via two-factor authentication (2FA) as well as OpenID Connect (OIDC).

## Setup
1. Add the **Authelia** resource to get started.
1. Under **Services**, click **Settings** on the right of the Authelia service.
    - Under **Domains**, you can change the Authelia URL as desired (make sure to keep the port number there). For example, `https://auth.mydomain.com:9091`
    - Under **Image**, pin the image version by replacing *latest* with a [recent minor version](https://github.com/authelia/authelia/releases) of Authelia (e.g. `authelia/authelia:4.39`).
    - Click **Save**
1. In the service sidebar, go to **Persistent Storages** to edit the configuration files. At a minimum, you'll need to make the following changes:
    - In the Authelia configuration file, under `session.cookies`, change the **domain** to the root/wildcard domain you've setup in Coolify (e.g. `mydomain.com`). Click **Save**.
    - In the user database file, change the default user and password. The password(s) [should be hashed](https://www.authelia.com/reference/guides/passwords/). Click **Save**.
    - See the [Authelia docs](https://www.authelia.com/configuration/prologue/introduction/) for more configuration info. For example, you may want to setup SMTP notifications, rather than the default file notification.
1. Add this [dynamic configuration](https://coolify.io/docs/knowledge-base/proxy/traefik/dynamic-config) to Traefik to setup the Authelia middleware:
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
1. **Deploy** the service and wait for the containers to start up.
1. Under **Links** at the top, click on your chosen Authelia URL and try logging in.
1. Under **Links** again, click on the test app URL (`https://authtest...`). You should see the forwarded headers corresponding to your user (`Remote-User`, `Remote-Email`, etc.). If you log out of Authelia and try to access this link again, you should be prompted to sign in.
1. You're all set! You can now start protecting your Coolify apps and services with Authelia.
    - For authentication via SSO and forwarded headers, go to the app or service in the Coolify UI and add the `traefik.http.middlewares.authelia@file` label. Authelia & Traefik will then automatically handle login and redirect. If your app supports Proxy / Header SSO, you may need to configure the app to read the [specific headers](https://www.authelia.com/integration/trusted-header-sso/introduction/) forwarded by Authelia.
    - For authentication via OIDC/OAuth, see [the docs](https://www.authelia.com/configuration/identity-providers/openid-connect/provider/) for setting that up.

## Important Notes
- In order for Authelia to receive the correct `X-Forwarded-*` headers, it is important to setup [Trusted Proxies](https://www.authelia.com/integration/proxies/traefik/#trusted-proxies) in your Traefik configuration.
- Make sure to adjust the [Access Control](https://www.authelia.com/configuration/security/access-control/) in the configuration file to your specific needs. For example, you may want to change the **default_policy** to `two_factor` to require 2FA for all protected apps, and/or add rules to allow certain routes in an app to bypass authentication.

## Links
- [Official website ›](https://www.authelia.com/?utm_source=coolify.io)
- [GitHub ›](https://github.com/authelia/authelia?utm_source=coolify.io)
