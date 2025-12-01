---
title: "Destinations"
description: "Manage Docker network destinations in Coolify for isolated deployment environments supporting standalone Docker and Swarm cluster configurations."
---

# Destinations

Destinations in Coolify are **Docker network endpoints** where your applications, databases, and services are deployed. They represent isolated network environments on your servers that provide containerized isolation and networking for your resources.

## What are Destinations?

A destination is essentially a [Docker network](https://docs.docker.com/engine/network/) that acts as a deployment target for your resources. When you deploy an application or database, it gets deployed to a specific destination (Docker network) on a server, providing network isolation and organization for your containerized workloads.

## Types of Destinations

Coolify differentiates destinations between two types based on the server configuration:

### 1. Standalone Docker

- **Purpose**: For single-server deployments
- **Use Case**: Most common setup for individual servers
- **Network Type**: [Docker bridge](https://docs.docker.com/engine/network/drivers/bridge/) or custom networks

### 2. Docker Swarm

- **Purpose**: For [Docker Swarm](https://docs.docker.com/engine/swarm/) cluster deployments
- **Use Case**: Multi-node cluster environments
- **Network Type**: [Docker overlay networks](https://docs.docker.com/engine/network/drivers/overlay/)

## Key Concepts

### Network Isolation

Each destination provides network isolation between different deployments. Applications deployed to different destinations cannot communicate with each other unless explicitly configured.

### Server Relationship

- Each destination belongs to exactly one server
- A server can have multiple destinations
- Destinations are tied to the server's Docker daemon

### Resource Assignment

Destinations can host multiple types of resources:

- **Applications** (web apps, APIs, microservices)
- **Databases** (PostgreSQL, MySQL, Redis, MongoDB, etc.)
- **Services** (one-click deployments like WordPress, Ghost, etc.)

## Benefits

1. **Isolation**: Network-level separation between different projects or environments
2. **Organization**: Logical grouping of related applications and databases
3. **Security**: Prevents unauthorized network access between different deployments
4. **Flexibility**: Ability to deploy the same application to multiple destinations/servers
5. **Scalability**: Support for multi-server deployments through additional destinations

## Related Topics

- [Creating Destinations](./create.md)
- [Managing Destinations](./manage.md)
