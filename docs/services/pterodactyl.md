---
title: "Pterodactyl Panel"
description: "Host game servers on Coolify with Pterodactyl panel for Minecraft, CS:GO, ARK with web management, Docker isolation, and automation."
---

<ZoomableImage src="/docs/images/services/pterodactyl-logo.png" alt="Pterodactyl logo" />

## What is Pterodactyl?

Pterodactyl® is a free, open-source game server management panel built with PHP, React, and Go.
Designed with security in mind, Pterodactyl runs all game servers in isolated Docker containers while exposing a beautiful and intuitive UI to end users.

Pterodactyl consists of two core components that work together: the **Panel** (web interface) and **Wings** (server daemon). The Panel provides the management interface, while Wings handles the actual game server operations on each node.

## Current Features

- Multi-server management from one dashboard
- Secure daemon (Wings) with process isolation
- Docker-based containerization for each server
- Web-based dashboard
- Role-based user permissions
- Real-time CPU, RAM, and network monitoring
- Automated server updates and backups

## What is Wings?

Wings is Pterodactyl's server control daemon, written in Go. It runs on each server node and handles all game server operations including creation, management, and monitoring of server instances.

Wings communicates with the Pterodactyl Panel via its REST API, receiving commands and configuration while sending back real-time statistics, console output, and status updates. Each game server runs in an isolated Docker container managed by Wings.

Key capabilities:

- **Server lifecycle management** - Start, stop, restart, and configure game servers
- **Docker container orchestration** - Automatic provisioning and isolation
- **Real-time monitoring** - CPU, RAM, disk, and network usage tracking
- **Console streaming** - Live server console output to the Panel
- **File management** - Handle server files, backups, and scheduled tasks
- **Resource enforcement** - CPU and memory limits per container

## Installation on Coolify

Coolify offers two deployment options for Pterodactyl: a combined Panel + Wings template for single-server setups, or separate deployments for distributed architectures.

### Option 1: Pterodactyl With Wings (Combined Template)

Best for single-server deployments where the Panel and Wings run together.

1. Install the latest **Pterodactyl With Wings** template from **Coolify**.
2. Deploy the template.
3. Visit the panel URL and log in using your admin credentials.
4. Navigate to the **Admin Panel → Locations** and create a new location (e.g., `us`, `eu`, ...).
5. Create a new node and configure the following fields:

   - **FQDN** → `wings-abc1abc2abc3abc4.example.com` (Without `http://` or `https://`)
   - **Communicate Over SSL** → Enabled (Change this only if you know what you're doing)
   - **Daemon Port** → `443` (Important! Coolify automatically forwards port `443 → 8443`)

<ZoomableImage src="/docs/images/services/pterodactly-with-wings1.png" alt="Example node setup" />

6. Navigate to the configuration tab of your node and **save the configuration** to a safe location.

<ZoomableImage src="/docs/images/services/pterodactly-with-wings2.png" alt="Example configuration file" />

7. In Coolify, go to **Persistent Storages** and locate `config.yml`.
   Replace the following values with those from your saved configuration:

   - `uuid`
   - `token_id`
   - `token`
   - `api > ssl > cert`
   - `api > ssl > key`

8. Update your panel domain under `allowed_origins` to match your actual panel domain.

9. Wait approximately 3–5 minutes for Wings to restart.
   If the configuration was successful, the **About** section of your node should display your Daemon Version and other information.

10. Your panel is now ready for use.

### Option 2: Separate Panel and Wings Installation

Best for distributed setups where Wings nodes run on different servers than the Panel.

When installing **Wings** separately in Coolify with a reverse proxy, you cannot have it listen directly on port `443` inside the container.
Instead, configure it to use port `8443` internally, while Coolify forwards `443` to `8443`.
The **Pterodactyl Panel** should still be configured to use port `443` externally.

**Steps:**

1. **Generate the Wings config in the Panel**
   - In the Pterodactyl Panel, create a node and download the `config.yml`.
   - Configure the node with:
     - **Hostname** (e.g., `host.example.com`, without `https://`) — not an IP address
     - **Port**: `443`
     - **Proxy setting enabled**

2. **Update the config in Coolify**
   - In your Coolify Wings service, open the **Persistent Storages** tab.
   - You'll see `/etc/pterodactyl/config.yml` already present with a default template.
   - Edit it directly, replacing the placeholders with values from the Panel-generated file.
   - Change the `api.port` to `8443`:
     ```yaml
     api:
       host: 0.0.0.0
       port: 8443
     ```

3. **Restart Wings**
   - Once the changes are saved, restart the Wings container to apply the new settings.

## Common Issues

**Node not connecting**
- Ensure your node is configured to use port `443` in the Panel.
- Verify that Wings is configured to use port `8443` internally when using Coolify's reverse proxy.

**Cannot access the server on the node**
- Confirm that you added your panel domain under `allowed_origins` in the Wings configuration.

## Screenshots

### Panel Interface

<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-1.webp" alt="Pterodactyl interface screenshot" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-2.webp" alt="Pterodactyl interface screenshot" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-3.webp" alt="Pterodactyl interface screenshot" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-4.webp" alt="Pterodactyl interface screenshot" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-5.webp" alt="Pterodactyl interface screenshot" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-6.webp" alt="Pterodactyl interface screenshot" />

### Wings Node Management

<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-7.webp" alt="Wings node management in Panel" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-8.webp" alt="Wings node configuration" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-9.webp" alt="Wings node status" />

## Links

- [The official website](https://pterodactyl.io)
- [GitHub Panel](https://github.com/pterodactyl/panel)
- [GitHub Wings](https://github.com/pterodactyl/wings)
- [Documentation](https://pterodactyl.io/project/introduction.html)
- [Community Discord](https://discord.gg/pterodactyl)
