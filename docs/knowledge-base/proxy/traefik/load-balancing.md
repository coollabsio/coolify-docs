---
title: "Load-balancing"
description: "Configure Traefik load balancing in Coolify across multiple servers or containers with dynamic configuration, HTTPS support, and health monitoring."
---

# Load-balancing
You can easily use Traefik to loadbalance an application between:

- 2+ servers
- 2+ containers in one server

## 2+ servers

### Prerequisites

1. Make sure you set the right DNS record for your domain. Your loadbalanced domain should point to the server's IP address where you are setting up the loadbalancer.
2. You must deploy your application to more than one servers: read more [here](/knowledge-base/server/multiple-servers).
3. Make sure Traefik is running on all servers.
4. Set your `fqdn` to the fqdn you would like to use to reach your application.
5. After your application are deployed on all servers, you need to make a dynamic configuration for Traefik to loadbalance between your servers in the `/data/coolify/proxy/dynamic` directory.

### Dynamic Configuration

On your Coolify's UI, you can go the your Server settings / Proxy tab where you can add the dynamic configuration.

The following configuration is valid if you would like to use https.

```yaml {16,26,32,33}
http:
  middlewares:
    redirect-to-https:
      redirectscheme:
        scheme: https
    gzip:
      compress: true
  routers:
    lb-http:
      middlewares:
        - redirect-to-https
      entryPoints:
        - http
      service: noop
      # Change <CHANGE_THIS_TO_YOUR_DOMAIN> to your domain, like `example.com` without `https://`
      rule: Host(`<CHANGE_THIS_TO_YOUR_DOMAIN>`)
    lb-https:
      middlewares:
        - gzip
      entryPoints:
        - https
      service: lb-https
      tls:
        certResolver: letsencrypt
      # Change <CHANGE_THIS_TO_YOUR_DOMAIN> to your domain, like `example.com` without `https://`
      rule: Host(`<CHANGE_THIS_TO_YOUR_DOMAIN>`)
  services:
    lb-https:
      loadBalancer:
        servers:
          # Change <CHANGE_THIS_TO_YOUR_IP_ADDRESS> to your servers IP addresses
          - url: 'http://<CHANGE_THIS_TO_YOUR_IP_ADDRESS>'
          - url: 'http://<CHANGE_THIS_TO_YOUR_IP_ADDRESS>'
          # Add any number of servers you want to loadbalance between
    noop:
      loadBalancer:
        servers:
          - url: ''
```

The following configuration is valid if you would like to use http.

```yaml {13,19,20}
http:
  middlewares:
    gzip:
      compress: true
  routers:
    lb-http:
      middlewares:
        - gzip
      entryPoints:
        - http
      service: lb-http
      # Change <CHANGE_THIS_TO_YOUR_DOMAIN> to your domain, like `example.com` without `http://`
      rule: Host(`<CHANGE_THIS_TO_YOUR_DOMAIN>`)
  services:
    lb-http:
      loadBalancer:
        servers:
          # Change <CHANGE_THIS_TO_YOUR_IP_ADDRESS> to your servers IP addresses
          - url: 'http://<CHANGE_THIS_TO_YOUR_IP_ADDRESS>'
          - url: 'http://<CHANGE_THIS_TO_YOUR_IP_ADDRESS>'
          # Add any number of servers you want to loadbalance between
```

## 2+ containers in one server

### Prerequisites

1. Make sure you set the right DNS record for your domain. Your loadbalanced domain should point to the server's IP address where you are setting up the loadbalancer.
2. You must deploy your application to more than one containers in one server.
3. Make sure Traefik is running on the server.

### Dynamic Configuration

The following configuration is valid if you would like to use https.

```yaml {18,26,34,35}
http:
  middlewares:
    redirect-to-https:
      redirectscheme:
        scheme: https
    gzip:
      compress: true
  routers:
    lb-https:
      tls:
        certResolver: letsencrypt
      middlewares:
        - gzip
      entryPoints:
        - https
      service: lb-https
      # Change <CHANGE_THIS_TO_YOUR_DOMAIN> to your domain, like `example.com` without `http://`
      rule: Host(`<CHANGE_THIS_TO_YOUR_DOMAIN>`)
    lb-http:
      middlewares:
        - redirect-to-https
      entryPoints:
        - http
      service: noop
      # Change <CHANGE_THIS_TO_YOUR_DOMAIN> to your domain, like `example.com` without `http://`
      rule: Host(`<CHANGE_THIS_TO_YOUR_DOMAIN>`)
  services:
    lb-https:
      loadBalancer:
        servers:
          # Change <UUID_OR_HOST.DOCKER.INTERNAL>:<PORT> to your containers UUID or host.docker.internal and port
          # UUID is when you mapped a port to the host system
          # host.docker.internal is when you are not exposed any port to the host system
          - url: 'http://<UUID_OR_HOST.DOCKER.INTERNAL>:<PORT>'
          - url: 'http://<UUID_OR_HOST.DOCKER.INTERNAL>:<PORT>'
          # Add any number of containers you want to loadbalance between
    noop:
      loadBalancer:
        servers:
          - url: ''
```

The following configuration is valid if you would like to use http.

```yaml {13,21,22}
http:
  middlewares:
    gzip:
      compress: true
  routers:
    lb-http:
      middlewares:
        - gzip
      entryPoints:
        - http
      service: lb-http
      # Change <CHANGE_THIS_TO_YOUR_DOMAIN> to your domain, like `example.com` without `http://`
      rule: Host(`<CHANGE_THIS_TO_YOUR_DOMAIN>`)
  services:
    lb-http:
      loadBalancer:
        servers:
          # Change <UUID_OR_HOST.DOCKER.INTERNAL>:<PORT> to your containers UUID or host.docker.internal and port
          # UUID is when you mapped a port to the host system
          # host.docker.internal is when you are not exposed any port to the host system
          - url: 'http://<UUID_OR_HOST.DOCKER.INTERNAL>:<PORT>'
          - url: 'http://<UUID_OR_HOST.DOCKER.INTERNAL>:<PORT>'
          # Add any number of containers you want to loadbalance between
```
