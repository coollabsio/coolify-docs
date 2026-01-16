---
title: Downgrading Coolify
description: Downgrade self-hosted Coolify to previous versions by disabling auto-update, using SSH terminal commands, and handling database compatibility risks.
---

<ZoomableImage src="/docs/images/get-started/downgrade-banner.webp" alt="Coolify downgrade banner" />

<br />

If you're using [Coolify Cloud](https://coolify.io/pricing/), the Coolify team handles all updates so you **cannot** downgrade the version of Coolify. If you are facing any issues, please contact [support](/get-started/support).

For those who **self-host** Coolify, you can easily downgrade to the previous version. Follow the steps below to perform a downgrade on to a previous version.

::: danger Backup First!

- Always back up your Coolify data before performing an downgrade.
- Downgrading can introduce issues that can be difficult to fix.
:::

The Downgrade process involves the following three steps:

- [Disable Auto Update](#_1-disable-auto-update)
- [Login to Your Server via SSH](#_2-login-to-your-server-via-ssh)
- [Execute the Downgrade Command](#_3-execute-the-downgrade-command)

## 1. Disable Auto Update

Before downgrading, it's important to disable the Auto Update feature to prevent Coolify from automatically upgrading again after you perform the downgrade.

1. Log in as the root user (or any user who has access to the root or initial team).

2. Navigate to the Settings menu in your Coolify dashboard.

3. In the Settings menu, disable the **Auto Update** feature.

<ZoomableImage src="/docs/images/get-started/upgrade/disable-auto-update.webp" alt="Disable Auto Update" />

::: warning Important!
Disabling auto-update is essential, as it ensures that Coolify doesn’t override your downgrade with a newer version.
:::

## 2. Login to Your Server via SSH

Next, you need to SSH into your server to execute the downgrade command.

## 3. Execute the Downgrade Command

To downgrade Coolify to the desired version, run the following command in your terminal:

```sh
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash -s 4.0.0-beta.369
```

Replace `4.0.0-beta.369` with the version number you want to downgrade to.

For example, you can downgrade to `4.0.0-beta.333` or any previous version.

::: warning Note
Double-check the version number you are specifying to ensure you are downgrading to the correct version. You can check the Coolify [release notes](https://github.com/coollabsio/coolify/releases) for version details.
:::

## Potential Issues with Downgrading

While downgrading is possible, be aware of the following risks:

- [Database Schema Compatibility](#database-schema-compatibility)
- [Feature Incompatibility](#feature-incompatibility)

---

#### Database Schema Compatibility:

Downgrading can cause issues since the database schema may not be backward compatible. Some features may not work as expected due to changes in the database structure between versions.

#### Feature Incompatibility:

Some features might not function properly after downgrading, as certain features in the newer version may rely on changes that are not present in the older version.
