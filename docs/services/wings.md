---
title: "Pterodactyl Wings"
description: "Host Pterodactyl Wings on Coolify for game server daemon, Docker container management, and distributed server node functionality."
---

<ZoomableImage src="/docs/images/services/pterodactyl_logo_transparent.png" alt="Pterodactyl_Logo_Transparent logo" />

## What is Wings?

Wings is the server-side component of the Pterodactyl® ecosystem, written in Go. It runs on each physical or virtual machine (node)
and handles the creation, management, and monitoring of game server instances.

It communicates securely with the Pterodactyl Panel via its API, pulling server configurations and sending back live statistics, logs, and event updates.
Each server runs in an isolated Docker container to ensure security and stability.

Key features include:

- **Lightweight and efficient** Go-based daemon
- **Automatic server provisioning** from panel settings
- **Docker-based isolation** for security
- **Real-time console streaming**
- **Resource usage tracking** (CPU, RAM, disk, network)
- **Support for scheduled tasks and backups**

## Installation on Coolify

When installing **Wings** in Coolify with a reverse proxy, you cannot have it listen directly on port `443` inside the container.
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
   - You’ll see `/etc/pterodactyl/config.yml` already present with a default template.
   - Edit it directly, replacing the placeholders with values from the Panel-generated file.
   - Change the `api.port` to `8443`:
     ```yaml
     api:
       host: 0.0.0.0
       port: 8443
     ```

3. **Restart Wings**
   - Once the changes are saved, restart the Wings container to apply the new settings.

## Screenshots

_(Wings itself runs in the background and doesn't have a UI, so these are typically viewed via the Panel.)_

<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-7.webp" alt="Wings interface screenshot" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-8.webp" alt="Wings interface screenshot" />
<ZoomableImage src="/docs/images/services/pterodactyl-screenshot-9.webp" alt="Wings interface screenshot" />
