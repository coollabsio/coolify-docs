---
title: "Scalability"
description: "Scale Coolify applications with traditional horizontal scaling across multiple servers using load balancers or Docker Swarm for high availability deployments."
---

# Scalability

If your application needs load balancing or high availability here are the options you have in Coolify:

- [Traditional Horizontal Scaling](#traditional-horizontal-scaling)
- [Docker Swarm](#docker-swarm)

::: info Pro Tip 
 You don’t need to scale your app if you have 0 users. Start simple and scale as your user base grows!
:::

## Traditional Horizontal Scaling

With traditional horizontal scaling, you can deploy your applications on multiple servers, and then use a load balancer to distribute the traffic across them.

This is the most common type of scaling, and it is easy to understand and implement.

### Coolify requirements
1. **Add servers**
     - You need to add and validate the servers in Coolify.
2. **Set a Docker Registry** for your application
    - **Why?** As several servers will need to access the same built image, it needs to be stored in a shared location.

### Infrastructure requirements
1. **Load balancer**
2. **Firewall** - optional, but recommended

### Examples

Which one is the best?

It depends on your needs, but we recommend the `one domain across multiple servers`.

::: info Tip
We also recommend to use [Hetzner](https://coolify.io/hetzner) (referral link) for the servers.

**(The cloud version of Coolify - and all of our other services - is also using Hetzner)**
:::

#### One domain across multiple servers (Recommended)

![load-balance-one-domain](/images/loadbalancer/one-domain.webp)

- **Pros**:
    - Easy to understand and implement.
    - Easy to manage.
    - Easy to scale.
    - No proxy required on the servers.
    - Healthcheck are available for the application, not for the server - see the other option's cons.
- **Cons**:
    - You need a firewall on each server to prevent the servers from being accessed directly - most VPS providers has software firewalls.

#### Multiple domains across multiple servers (Recommended, but more complex)

![load-balance-multiple-domains](/images/loadbalancer/multiple-domains.webp)

- **Pros**:
    - Easy to understand and implement.
    - Easy to manage.
    - Easy to scale.
    - Requires a proxy on the servers - Coolify automatically configures the proxy for you, but it is +1 component that can fail.
    - "Less expensive" (as one server can host multiple applications).
- **Cons**:
    - As a plus proxy is added, there is a small performance hit as the proxy needs to be initialized on each server - not noticable for most use cases.
    - You need bigger servers to host more applications, as more applications will be running on the same server.
    - Healthcheck are not available for each application, only for the server.



## Docker Swarm

Coolify supports Docker Swarm (experimental). You can read more about it [here](/knowledge-base/docker/swarm).


## Kubernetes (planned)

It is just planned, but not in the roadmap yet, so no ETA.
Coolify will eventually support Kubernetes. This will allow you to use the full power of Kubernetes, with the added benefit of having a web interface to manage your applications.