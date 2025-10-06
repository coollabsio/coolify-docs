---
title: "Server Patching"
description: "Update server packages from Coolify dashboard with APT, DNF, and Zypper support including individual or batch updates and weekly notifications."
---


# Server Patching <Badge type="warning" text="^v4.0.0-beta.419" />
The **Server Patching** feature lets you update all packages on your server directly from the Coolify dashboard.

## How to Use Server Patching
1. Go to the **Servers** section in the sidebar.
2. Select your server.
3. Click on the **Security** tab.
4. Open the **Server Patching** section.

<ZoomableImage src="/docs/images/knowledge-base/servers/patching/1.webp" alt="Screenshot of Patching" />

On this page, you'll see a list of all available package updates.

You can either:
  - Update packages **individually** by clicking the **Update** button next to each one.
  - Or, click **Update All Packages** to apply all updates at once.

::: warning Note
  Coolify **does not** automatically install updates. It only checks for available updates and displays them in the dashboard.
  
  Updates are applied only when you manually click the **Update** or **Update All Packages** button.
:::


## Server Patching Notifications
Coolify checks for updates weekly and sends notifications if any are available.

  - Notifications are **enabled by default**.
  - You can manage this setting in your **Notification Settings**.

<ZoomableImage src="/docs/images/knowledge-base/servers/patching/2.webp" alt="Screenshot of Patching" />


## Supported Package Managers
As of **v4.0.0-beta.419**, server patching is supported for the following package managers:

* **APT**
* **DNF**
* **Zypper**

Support for additional package managers will be added in future updates.

If you'd like to prioritize support for a specific package manager, feel free to start a discussion here: [Coolify Discussions on GitHub](https://github.com/coollabsio/coolify/discussions)

## FAQ

::: details 1. Can I change how frequently Coolify checks for updates?
No, the update check interval is currently fixed.

However, you can manually trigger a check by clicking the **Check now** button on the Server Patching page.

This feature was introduced in **v4.0.0-beta.419**, and we’re focusing on improving it based on user feedback. If you'd like to request customizable check intervals, feel free to start a discussion here: [Coolify Discussions on GitHub](https://github.com/coollabsio/coolify/discussions)
:::

::: details 2. Does Coolify install updates automatically?
**No**, Coolify does not install updates automatically.

Updates are only applied when you manually click the **Update** or **Update all packages** button on the dashboard.
:::
