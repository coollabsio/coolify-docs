---
title: Coolify Cloud
description: Coolify Cloud is a fully managed PaaS service with zero maintenance, automatic scaling, daily backups, and email notifications.
---

<ZoomableImage src="/docs/images/get-started/cloud-banner.webp" alt="Coolify cloud banner" />

<br />

[Coolify Cloud](https://coolify.io/pricing/) is our managed, paid service (maintained by [Andras](https://x.com/heyandras), Coolify’s Founder) that runs the Coolify on our infrastructure, so you don’t need to allocate CPU, RAM, or disk for Coolify itself.

You still bring your own servers (VPS, Raspberry Pi, EC2, etc.) and connect them via SSH, then deploy apps, databases, and services exactly as you would with a self-hosted instance.

Coolify Cloud uses the same open-source codebase, so there are no locked-behind-paywall features.

## Benefits of Coolify Cloud

| Features                     | Explanation                                                                                                         |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Zero Maintenance Coolify** | No need to upgrade, or monitor Coolify, our team does it for you.                                                   |
| **Daily Backups**            | The Coolify Cloud database is backed up every 24 hours.                                                             |
| **Preconfigured Email**      | Receive build, deployment, and server status notifications via email without any setup on your end.                 |
| **Automatic Scaling**        | As you connect more servers, our infrastructure scales CPU, RAM, and disk usage for Coolify.                        |
| **Staged Updates**           | New updates are first rolled out to self-hosted users. Once stability is confirmed, they’re rolled out to Cloud.    |
| **Founder-Tested Releases**  | Andras personally tests every update before it’s deployed to the Cloud, ensuring maximum stability and reliability. |

## Getting Started with Coolify Cloud

1. **Create Your Account:**

   - Visit the [Coolify Cloud Registration](https://app.coolify.io/register) page and sign up.

2. **Choose Your Plan:**

   - Base fee: **$5/month** (includes up to two connected servers).
   - **$3/month** per additional server.

3. **Complete Payment**

   - Use any major credit/debit card to finish the subscription process.

4. **Connect Your Servers**

   - ::: details Detailed Server Connection Guide
     1. **Add Private Key:** Login to your Coolify account (or create one if you’re new) and Add a new private key
        <ZoomableImage src="/docs/images/resources/integrations/6.webp" alt="Coolify dashboard screenshot" />
        <br />
        <ZoomableImage src="/docs/images/resources/integrations/7.webp" alt="Coolify dashboard screenshot" />
     ***
     2. **Add a Server:** Navigate to the **Servers** tab and add a new server by entering your Hetzner server’s IPv4 address.
        <ZoomableImage src="/docs/images/resources/integrations/8.webp" alt="Coolify dashboard screenshot" />
        <br />
        <ZoomableImage src="/docs/images/resources/integrations/9.webp" alt="Coolify dashboard screenshot" />
     ***
     3. **Validate Server:** Click **Validate Server & Install Docker Engine**. Coolify will automatically install all necessary components on your server.
        <ZoomableImage src="/docs/images/resources/integrations/10.webp" alt="Coolify dashboard screenshot" />
     ***
     4. **Check Status:** Once finished, you should see a green **Proxy Running** status indicating everything is set up.
        <ZoomableImage src="/docs/images/resources/integrations/11.webp" alt="Coolify dashboard screenshot" />
        :::

5. **Deploy Your Applications**

## How Coolify Cloud Pricing works?

We charge a base fee of **\$5/month**, which covers up to **two servers**. Each additional server you connect is an **add-on of \$3/month**.

Charging per server allows us to scale our infrastructure responsibly, since each connected server increases resource usage (CPU, RAM, storage) on our end.

If you only need one server, you still pay the $5 base fee (with capacity for a second server if you add it later).

If you plan to connect more than two, simply multiply $3 by the extra servers.

## Why Coolify Cloud Exists

You might wonder why Coolify Cloud is a paid service when there are no exclusive, locked-down features.

The idea came to Andras (Coolify's Founder) as a way to offer a “**paid option without paywall**” — a model where the open-source project stays completely free, but those who prefer a managed experience can contribute financially.

- **Experiment Turned Success:**
  - Initially launched as an experiment, Coolify Cloud quickly attracted over 2,100 active users.

* **Sustainable Funding:**

  - While the revenue from Cloud is modest, it provides a steady income stream that helps keep Coolify free and under active development for everyone.

* **Community-First Approach**
  - By not restricting any features, we maintain transparency and trust.
  - Cloud subscribers simply pay for convenience and reliability, not to unlock core functionality.

## Frequently Asked Questions

::: details 1. Do I get any Cloud-only features?
No. Coolify Cloud and self-hosted Coolify share the same feature set.

Cloud’s value lies in automatic backups, email notifications, scaling, and update testing handled for you.
:::
::: details 2. Does Coolify Cloud back up my application data?
No, Coolify Cloud only backs up the Coolify database (e.g., dashboard settings).

You are responsible for backing up any databases or storage volumes on your servers.
:::
::: details 3. Can I import my self-hosted Coolify configurations to Coolify Cloud?
No.

To transfer configurations, you'll need to back up the database from your self-hosted instance and restore it to a new Coolify instance.

However, since you don’t have access to the database in Coolify Cloud, it’s not possible to migrate data or settings directly to the cloud version.
:::
::: details 4. How often Coolify Cloud is backed up?
Every 24 hours
:::
::: details 5. Is Coolify Cloud really based on the open-source version of Coolify?
Yes, Coolify Cloud uses the same open-source codebase as the self-hosted version. There are no paywall features, and the Cloud service is simply a managed experience for convenience.
:::
::: details 6. What happens if I cancel my Coolify Cloud subscription?
If you cancel your subscription, you will stop being billed, and your access to Coolify Cloud will be suspended at the end of your current billing cycle.

However, your servers will remain unaffected, and all of your applications will continue running as normal.

Since your server will still be hosting your applications with a reverse proxy handling incoming requests, there will be no interruptions.
:::
::: details 7. What happens if I forget to pay an invoice?
If a payment fails or an invoice is missed, your subscription and access to Coolify Cloud will be temporarily paused until the payment is successfully processed.

You will receive an email notification about the failed payment.

Once the payment is made, your Coolify Cloud access will be restored, and all your settings will remain intact—there’s no data loss.

Your servers will also stay up and running, and your applications will continue to function normally, as everything is still hosted on your own server with a reverse proxy.
:::

::: details 8. Are there any IP addresses I need to whitelist for Coolify Cloud?
Yes, Coolify Cloud uses specific IP addresses.

You can find the list of IPs [here](https://coolify.io/docs/knowledge-base/faq#coolify-cloud-public-ips).

The main requirement is that Coolify Cloud needs to access your server's SSH port.
:::
::: details 9. Do I need to bring my own servers to Coolify Cloud?
Yes, when using Coolify Cloud, you must provide your own servers (e.g., VPS, Raspberry Pi, EC2, etc.).

Coolify Cloud manages Coolify on our infrastructure, but we don’t provide the servers themselves.

This approach allows you to choose the hardware that best fits your needs.
:::
::: details 10. Why do I have to pay for Coolify Cloud if I’m bringing my own servers?
While you bring your own servers, the subscription fee for Coolify Cloud covers the managed service aspect.

This includes infrastructure management, maintenance, support, updates, and scaling, so you don’t have to worry about technical aspects like monitoring, patching, or backups for Coolify.

We take care of the heavy lifting to ensure everything runs smoothly.
:::
::: details 11. What happens if I exceed the number of connected servers?
You won’t be able to add extra servers to Coolify cloud unless your subscription is upgraded.
:::
::: details 12. Is there a trial period for Coolify Cloud?
Currently, Coolify Cloud doesn’t offer a free trial. However, the subscription is affordable—just **$5 per month** for up to two connected servers.

If you want to explore all the features, you can run Coolify on a small Linux server or a VM on your PC by following the [self-hosted installation guide](https://coolify.io/docs/get-started/installation).

Since both cloud and self-hosted versions use the same codebase, you’ll be able to test all the features without any limitations.
:::
::: details 13. Can I get any discounts?
The current **$5/month** subscription rate is already quite affordable, so discounts are not available at the moment.
:::
::: details 14. I have to pay to use Coolify Cloud, so doesn't that mean I'm locked into a vendor?
**Not really.**

You're paying for the managed Coolify instance, but stopping the use of Coolify Cloud won't affect your applications.

You can connect your own server, so you retain full control. Everything runs as a Docker container, and Coolify will install a reverse proxy on your server to ensure everything works smoothly without needing Coolify Cloud.

In a true vendor lock-in, your apps would stop if you stop paying, but that’s not the case with Coolify Cloud.
:::
::: details 15. Can I access the Coolify Cloud dashboard on my own domain?
No.

The Coolify Cloud dashboard is only available at https://app.coolify.io.

If you’d like to access the dashboard on your own domain, you’ll need to self-host Coolify.
:::
