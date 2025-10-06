---
title: Coolify Concepts
---

<ZoomableImage src="/docs/images/get-started/concepts-banner.webp" alt="Coolify concepts banner" />

<br />

Many people start their self-hosting journey after discovering Coolify. If you’re one of them, here’s a list of a few concepts that could make your experience smoother.


## Servers
A server is a computer designed to run applications or services, providing the necessary computing power for your projects. 

It can be either physical such as a machine you have at home, like a Raspberry Pi, or one rented from a hosting provider like Hetzner.


## Resources 
In Coolify, a resource refers to an application or service you set up on your server—like a website, database, or API. 

Each resource comes with its own configuration, like domains, backups, health checks, and so on. 

Coolify offers a handy list of pre-set resources, called one-click services, that you can deploy instantly. But if you prefer, you can also deploy your own application easily.


## Environments
In Coolify, a  environment is a tailored setup on your server that determines how your resources operate. 

For instance, you could have a development environment for testing and debugging your code, alongside a production environment where your finished application goes live. 

With Coolify, you can set up multiple environments on a single server, letting you switch between them effortlessly.


## Projects
A project in Coolify is a group of environments and resources you’ve deployed on your server. 

It serves as the highest-level structure in Coolify, organizing your deployment setup. 

You can manage multiple projects on the same server, each with its own unique set of environments and resources. 

For example, you might create one project for all your hobby-related resources and another for work-related ones.


## Containers
In Coolify, everything you deploy runs as a Docker container, making it easy to manage and isolate your application. 

You can use pre-built Docker images from public registries like Docker Hub or GitHub Container Registry to deploy without building them yourself. 

To deploy, you need a Docker image, either one you’ve built or one from someone else. 

If you’re coding your own app, Coolify can auto-build the image from a Dockerfile or Docker Compose file, though this resource-heavy process requires a capable server. 

Alternatively, you can build the image elsewhere, push it to a registry, and let Coolify deploy it as a container.


## Reverse Proxy
A reverse proxy is a server or app that sits between your application and users, forwarding requests to the right place. 

Coolify includes two proxy options, Caddy and Traefik, which handle requests to your website by directing them to the container running your app. 

This setup lets you run multiple applications on one server without tweaking configs or ports. 

Plus, Coolify supports unlimited domains, so you could deploy 20 different apps, each with its own unique domain.


## Security
Coolify doesn’t manage your server’s security or updates, that’s your responsibility to keep everything secure and up to date. 

It’s built to simplify deployment management for you. While the Coolify core team plans to introduce more security features eventually, for now, securing your server is entirely up to you.

## Teams
Coolify supports multiple users and teams, allowing each team to have its own projects and environments. 

You can assign roles like admin to users, simplifying project management and collaboration on a single server. 

Currently, the teams feature isn’t fully polished for production use, but the Coolify core team plans to enhance it down the line.
