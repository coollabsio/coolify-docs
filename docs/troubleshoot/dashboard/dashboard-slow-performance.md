---
title: Slow Coolify Dashboard Performance
description: Resolve slow Coolify dashboard loading by disabling Cloudflare Rocket Loader, checking server location, and optimizing proxy settings for faster performance.
---


# Slow Coolify Dashboard Performance
If your Coolify dashboard loads very slow or some pages don't load at all, this might be the guide for you.


## 1. Determine Your Domain Setup
First, ask yourself: **Are you using a domain whose DNS is managed by Cloudflare?**
- **Yes:** The issue is likely due to Cloudflare's [Rocket Loader ↗](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) feature.
- **No:** The slowdown might be caused by your server or another factor.


## 2. Test with Your Server's IP Address

### A. Open Your Firewall Port
- **Step:** Ensure that port **8000** is open on your firewall.
- **Why:** This lets you access the Coolify dashboard directly without proxy interference.

### B. Access the Dashboard Directly
- **Step:** Open your web browser and navigate to:  
  `http://203.0.113.1:8000` *(Replace `203.0.113.1` with your actual server IP address)*
- **Observation:**  
  - If the dashboard feels fast and all pages load correctly, the issue is most likely with Cloudflare [Rocket Loader ↗](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/).  
  - If performance doesn't improve, the problem could be related to your server's location or your internet speed.


## 3. Addressing Cloudflare Rocket Loader
If the dashboard is fast via your server IP but slow through your custom domain, try this:
- **Step:** Log into your [Cloudflare dashboard ↗](https://dash.cloudflare.com/).
 
    <ZoomableImage src="/docs/images/troubleshoot/dashboard/dashboard-slow-performance/rocket-loader.webp" alt="Rocket Loader error example" />
- **Action:** 
  - Go to **Speed** on the sidebar.
  - Then navigate to **Optimization** and click on **Content Optimization**.
  - Switch the toggle for **Rocket Loader** to **Off**.
- **Wait:** Allow a few minutes for the changes to take effect, then visit your Coolify dashboard using your domain.


## 4. Getting Further Assistance
If none of these steps work:
- **Community Help:** Join our [Discord community ↗](https://coolify.io/discord) and post in the support forum channel.
- **What to Share:** Provide a screen recording of the issue you're experiencing and a description of the steps you’ve already tried.


## Summary of Common Issues
- **Cloudflare Rocket Loader:** Most of the time, Rocket Loader causes issues when using a Cloudflare-managed domain
- **Server or Internet Issues:** Unstable internet connections between the server and user can lead to performance problems.
