---
title: "Terminal Access"
description: "Enable or disable terminal access for servers and containers in Coolify with admin-level controls and security permissions management."
---

# Terminal Access <Badge type="warning" text="^v4.0.0-beta.419" />
The **Terminal Access** feature allows you to enable or disable terminal access for your server and all containers running on it — directly from the Coolify dashboard.


## How to Use Terminal Access
1. Go to the **Servers** section in the sidebar.
2. Select your server.
3. Go to the **Configuration** tab.
4. Open the **Advanced** section.
5. Use the toggle button to enable or disable terminal access for the server.

<ZoomableImage src="/docs/images/knowledge-base/servers/terminal-access/1.webp" alt="Screenshot of Terminal Access" />

::: warning Note:
Disabling Terminal Access affects **all terminals** on the server, including access to all containers running on that server.
:::


## Terminal Access Control
As of **v4.0.0-beta.419**, only the **root user** and **admin users** have permission to use the Terminal Access feature.

When terminal access is disabled, no one can access the terminal including root and admin users for the server or any of its containers.
