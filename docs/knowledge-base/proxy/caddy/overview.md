---
title: "Caddy Overview"
description: "Use Caddy reverse proxy with Coolify for automatic SSL certificates, simple configuration, and HTTP/2 support as an alternative to Traefik."
---

# Caddy Proxy

[Caddy](https://caddyserver.com/) is an easy-to-use, open-source web server and reverse proxy that automatically manages SSL/TLS certificates. It's known for its simplicity and automation, especially when it comes to securing your websites.

While [Traefik](https://traefik.io/) is the default reverse proxy used in Coolify, Caddy is another option you can explore if you prefer its simplicity or unique features.

## Why Use Caddy?

- Caddy automatically generates and renews SSL certificates for your sites, making it extremely easy to secure your applications.
- Caddy uses a simple, declarative configuration file (Caddyfile), making it beginner-friendly.
- Caddy comes with features like reverse proxying, load balancing, HTTP/2, and more out of the box without needing extra plugins.
- If you’re looking for a proxy that “just works” with minimal configuration, Caddy can be a great choice.

## When Not to Use Caddy?

- If you need advanced proxying features like dynamic routing, middleware, or complex load balancing, Traefik might be a better choice.
- Since Coolify primarily uses Traefik, certain configurations in Caddy might require additional manual setup.

## A Note from the Coolify Team

While Caddy is a fantastic tool for certain use cases, **we highly recommend** using **Traefik** over Caddy for most Coolify setups.

The [Core team](/get-started/team) primarily uses Traefik, and it is the default reverse proxy configured within Coolify.

Only consider using Caddy if you're familiar with it or need specific features that Traefik cannot provide.

At the moment, we do not have detailed guides for Caddy because it is not our primary reverse proxy, and using it may require more manual configuration.

If you choose to use Caddy, please make sure you are comfortable with configuring it yourself.
