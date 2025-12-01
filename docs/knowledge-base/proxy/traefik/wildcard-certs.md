---
title: "Wildcard SSL Certificates"
description: "Configure Let's Encrypt wildcard SSL certificates with Traefik DNS challenge using Cloudflare, Hetzner, or other providers for automatic subdomain coverage."
---

# Setup Wildcard SSL Certificates with Traefik

## Prerequisites

- You need to have a domain name and a DNS provider that supports wildcard subdomains.
- You need to use [dnsChallenge](https://doc.traefik.io/traefik/https/acme/#dnschallenge) in Traefik to get wildcard certificates from Let's Encrypt.
- You need to use one of the supported DNS [providers](https://doc.traefik.io/traefik/https/acme/#providers).

::: tip Tip
Each provider needs environment variables to be set in the Traefik configuration. You can find the required variables in the [official documentation](https://doc.traefik.io/traefik/https/acme/#providers).

If you need fine-grained token, like with [Cloudflare](https://go-acme.github.io/lego/dns/cloudflare/), check the provider configurations.
:::

## Configuration

1. Setup your wildcard subdomain DNS records, `*.coolify.io`.
2. Go to your Proxy settings (Servers / Proxy menu) and add the following configuration based on your [providers](https://doc.traefik.io/traefik/https/acme/#providers). The example will use `Hetzner` as a provider.

```bash
version: '3.8'
networks:
  coolify:
    external: true
services:
  traefik:
    container_name: coolify-proxy
    image: 'traefik:v2.10'
    restart: unless-stopped
    environment:
      - HETZNER_API_KEY=<API Key>
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    networks:
      - coolify
    ports:
      - '80:80'
      - '443:443'
      - '8080:8080'
    healthcheck:
      test: 'wget -qO- http://localhost:80/ping || exit 1'
      interval: 4s
      timeout: 2s
      retries: 5
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
      - '/data/coolify/proxy:/traefik'
    command:
      - '--ping=true'
      - '--ping.entrypoint=http'
      - '--api.dashboard=true'
      - '--api.insecure=false'
      - '--entrypoints.http.address=:80'
      - '--entrypoints.https.address=:443'
      - '--entrypoints.http.http.encodequerysemicolons=true'
      - '--entrypoints.https.http.encodequerysemicolons=true'
      - '--providers.docker.exposedbydefault=false'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      # use dnschallenge instead of httpchallenge
      # - '--certificatesresolvers.letsencrypt.acme.httpchallenge=true'
      # - '--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=http'
      - '--certificatesresolvers.letsencrypt.acme.dnschallenge.provider=hetzner'
      - '--certificatesresolvers.letsencrypt.acme.dnschallenge.delaybeforecheck=0'
      - '--certificatesresolvers.letsencrypt.acme.storage=/traefik/acme.json'
      - '--providers.docker=true'
    labels:
      - traefik.enable=true
      - traefik.http.routers.traefik.entrypoints=http
      - traefik.http.routers.traefik.middlewares=traefik-basic-auth@file
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.routers.traefik.tls.certresolver=letsencrypt
      - traefik.http.routers.traefik.tls.domains[0].main=coolify.io
      - traefik.http.routers.traefik.tls.domains[0].sans=*.coolify.io
      - traefik.http.services.traefik.loadbalancer.server.port=8080
      - traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
      - traefik.http.middlewares.gzip.compress=true
```

> You can also set `env_file` instead of `environment` in the example above, but then you need to create a `.env` file with the `HETZNER_API_KEY` variable on the server.

> Change `--certificatesresolvers.letsencrypt.acme.dnschallenge.provider=hetzner` to your provider.

Now you have two options to configure your wildcard subdomain for your resources.

### Normal

If you would like to use one (wildcard) certificate for all of your resources, you can use this option.

It is useful, because Traefik do not need to generate a new certificate for every resource, so new deployments will be available immediately without waiting for the certificate generation.

- In your application, set your FQDN to a subdomain you would like to use: `https://example.coolify.io`.

```bash
traefik.enable=true
traefik.http.routers.<unique_router_name_https>.rule=Host(`example.coolify.io`) && PathPrefix(`/`)
traefik.http.routers.<unique_router_name_https>.entryPoints=https
traefik.http.routers.<unique_router_name_https>.middlewares=gzip
traefik.http.routers.<unique_router_name_https>.service=<unique_service_name>
traefik.http.routers.<unique_router_name_https>.tls=true
traefik.http.services.<unique_service_name>.loadbalancer.server.port=80
traefik.http.routers.<unique_router_name_https>.tls.certresolver=letsencrypt

traefik.http.routers.<unique_router_name_http>.rule=Host(`example.coolify.io`) && PathPrefix(`/`)
traefik.http.routers.<unique_router_name_http>.entryPoints=http
traefik.http.routers.<unique_router_name_http>.middlewares=redirect-to-https
```

### SaaS

Redirect all subdomains to one application. You can use this option if you want to use Coolify as a SaaS provider.

- In your application, leave the FQDN configuration `empty`.
- Add the following custom label configuration:

:::tabs key:saas
== Traefik v3

```bash
traefik.enable=true
traefik.http.routers.<unique_router_name_https>.rule=HostRegexp(`^.+\.coolify\.io$`)
traefik.http.routers.<unique_router_name_https>.entryPoints=https
traefik.http.routers.<unique_router_name_https>.middlewares=gzip
traefik.http.routers.<unique_router_name_https>.service=<unique_service_name>
traefik.http.routers.<unique_router_name_https>.tls.certresolver=letsencrypt
traefik.http.services.<unique_service_name>.loadbalancer.server.port=80
traefik.http.routers.<unique_router_name_https>.tls=true

traefik.http.routers.<unique_router_name_http>.rule=HostRegexp(`^.+\.coolify\.io$`)
traefik.http.routers.<unique_router_name_http>.entryPoints=http
traefik.http.routers.<unique_router_name_http>.middlewares=redirect-to-https
```

== Traefik v2

```bash
traefik.enable=true
traefik.http.routers.<unique_router_name_https>.rule=HostRegexp(`{subdomain:[a-zA-Z0-9-]+}.coolify.io`)
traefik.http.routers.<unique_router_name_https>.entryPoints=https
traefik.http.routers.<unique_router_name_https>.middlewares=gzip
traefik.http.routers.<unique_router_name_https>.service=<unique_service_name>
traefik.http.routers.<unique_router_name_https>.tls.certresolver=letsencrypt
traefik.http.services.<unique_service_name>.loadbalancer.server.port=80
traefik.http.routers.<unique_router_name_https>.tls=true

traefik.http.routers.<unique_router_name_http>.rule=HostRegexp(`{subdomain:[a-zA-Z0-9-]+}.coolify.io`)
traefik.http.routers.<unique_router_name_http>.entryPoints=http
traefik.http.routers.<unique_router_name_http>.middlewares=redirect-to-https
```

:::

> `traefik.http.routers.<unique_router_name_https>.tls.certresolver` should be the same as your `certresolver` name in Traefik proxy configuration, by default `letsencrypt`.

> `traefik.http.services.<unique_service_name>.loadbalancer.server.port` should be the same as your application listens on. Port 80 if you use a static deployment.

::: warning Caution
You cannot use both configurations (Normal & SaaS) at the same time on one
server.
:::
