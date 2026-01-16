---
title: "Managing Destinations"
description: "Manage Coolify destinations including editing, deleting, resource assignment, and connecting service stacks to predefined Docker networks."
---

# Managing Destinations

Learn how to manage your existing destinations in Coolify, and how to assign resources to them.

## Viewing Destinations

### Destinations Overview

Navigate to **Destinations** to see all your destinations across all servers.
<ZoomableImage src="/docs/images/destinations/destinations-overview.webp" alt="Destinations Overview configuration" />

### Server-Specific Destinations

Navigate to **Servers** → **[Server Name]** → **Destinations** to view destinations specific to that server.
<ZoomableImage src="/docs/images/destinations/destinations-server-overview.webp" alt="Destinations Server Overview configuration" />

## Editing & Deleting Destinations

Click on a destination to access its management page where you can either edit or delete it.

<ZoomableImage src="/docs/images/destinations/destinations-settings.webp" alt="Destinations Settings configuration" />

### Basic Information

- **Name**: Update the destination display name
- **Server IP**: View the server IP address where the destination is hosted (read-only)
- **Docker Network**: View the Docker network name (read-only)

### Before You Delete

#### Check for Active Resources

Coolify won't allow you to delete a destination that has active resources. Therefore, before deleting a destination, ensure it's not being used:

1. **Applications**: No applications deployed to this destination
2. **Databases**: No databases running in this destination
3. **Services**: No services configured for this destination

#### Resource Dependencies

Verify that no other resources depend on this destination, to avoid issues after deletion:

- **Environment Variables**: Check for hardcoded references
- **Network Dependencies**: Ensure no cross-destination communication
- **Proxies & Load Balancers**: Update load balancer and proxy configuration

## Assign Resources to a Destination

When you have more then one destination on a server, you will get prompted to select a destination when creating a new resource.

<ZoomableImage src="/docs/images/destinations/destinations-selection.webp" alt="Destinations Selection configuration" />

If your resource is already created, you can make a **Clone** of it to another destination:

<ZoomableImage src="/docs/images/destinations/destinations-clone.webp" alt="Destinations Clone configuration" />

1. Navigate to the resource's management page over the **Projects** tab.
2. Go to **Resource Operations**
3. Select the destination

::: warning
Cloning a resource to another destination will create a new instance of that resource. This will not move the resource or it's data but create a duplicate.
:::

### Service Stacks

Unlike applications or databases, service stacks are not by default connected to the assigned destination. This also includes applications using the [Docker Compose Build Pack](/applications/build-packs/docker-compose). Coolify creates an isolated network for each service stack, allowing you to run multiple instances of the same service on the same server without conflicts.

If you want to connect a service stack to a destination, enable [Connect to Predefined Networks](/knowledge-base/docker/compose#connect-to-predefined-networks) in it's settings. This allows the service stack to communicate with other resources on the same destination.

::: danger WARNING
Avoid defining network configurations directly in your service stack's `docker-compose.y[a]ml` and instead use Coolify's Destination settings to manage network connections. This could otherwise lead to undesired behavior, such as [Gateway Timeout](/troubleshoot/applications/gateway-timeout) errors.
:::

## Best Practices

1. **Naming Convention**: Use descriptive names for destinations
2. **Resource Organization**: Group related applications in the same destination
3. **Monitoring**: Regularly check destination health and resource usage
4. **Documentation**: Document purpose and configuration of each destination
5. **Cleanup**: Remove unused destinations to reduce server load
