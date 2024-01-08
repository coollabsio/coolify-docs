---
head:
  - - meta
    - name: description
      content: Coolify Documentation
  - - meta
    - name: keywords
      content: coolify self-hosting docker kubernetes vercel netlify heroku render digitalocean aws gcp azure
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: '@coolifyio'
  - - meta
    - name: twitter:title
      content: Coolify Documentation
  - - meta
    - name: twitter:description
      content: Self-hosting with superpowers.
  - - meta
    - name: twitter:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://coolify.io
  - - meta
    - property: og:title
      content: Coolify
  - - meta
    - property: og:description
      content: Self-hosting with superpowers.
  - - meta
    - property: og:site_name
      content: Coolify
  - - meta
    - property: og:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
---
# Building Blocks

## Server

Servers are where all your resources are deployed to.

### Types

- **Localhost:** the server where Coolify is installed.
- **Remote Server:** could be any server, reachable through SSH.

[More details.](/servers.md)

## Proxy

A server could have a proxy that is used to route traffic to the right resource. It is not mandatory, but it is highly recommended to use a proxy.

Coolify uses Traefik at the moment. Configuration done automatically by Coolify in case you deploy a resource that requires this proxy.

Like if you add a domain to your application, Coolify detects it and starts a proxy automatically.

:::info
Free SSL certificates included, thanks to Let's Encrypt.
:::

[More details.](/servers.md#proxy)

## Project

Resources are grouped together into a project, a tree structure. A project could have infinite number of resources.

## Environment

Each project, by default have a `production` environment, that is not deletable, but renameable.
Environments consists of resources, like [application](#application), [database](#database) or a [service](#service), etc.

## Application

An application could be a web application, a static website, a backend API, etc. It is a container that runs a process deployed to a defined [server](#server).

[More details.](/applications)
:::tip
To have full integration with GitHub, like fully automated commit or pull request based deployments, you need a GitHub App (created automatically by Coolify).
:::

## Database

All supported databases could have scheduled, automatic backups, that is saved to your server or to an S3 compatible storage.

## Service

A service is a more complex type of resource, that consists of several other resources, like an [application](#application) and a [database](#database), etc.

Imagine you would like to deploy a Wordpress application, you would need a database, a web server and a PHP runtime. You could create a service that consists of these resources, grouped together and created automatically for you.

## Destination

Destination defines the type of the containerization technology you would like to use. It could be Docker, Docker Swarm or Kubernetes.

It also defines the network which you would like to add your resource. This helps you to separate your resources on the network layer.

:::info
Currently only standalone Docker engine is supported.
:::

## Source

Source defines the type of the source code repository you would like to use, like Github, Gitlab, Bitbucket, etc.

Github & GitLab public source is defined by default, but unseen by the users.

To use private repositories, you need to make a GitHub or GitLab App to have all kinds of integrations available.

## Automations & Monitoring

Coolify will automate a few maintenance tasks on the operating system, so you do not need to do them manually.

Coolify monitors your server & your deployed resources and immediately notifies you if something good or bad happens. You will always know what is going on in your self-hosted environment.

All you need to do is to setup your preferred notification system. Currently available:

- Email
- Discord Webhooks
- Telegram Bot