---
title: Dashboard Inaccessible via Instance Domain
description: Fix Coolify dashboard access issues by diagnosing proxy problems, checking container health, verifying firewall ports, and resolving domain configuration errors.
---

# Coolify Dashboard Inaccessible
Having trouble accessing your Coolify dashboard? follow these steps to diagnose and resolve the issue.


## 1. Determine Your Access Method

First, ask yourself: **How are you trying to access the dashboard?**

- **Custom Domain:** If you’re using the domain you set up for your Coolify dashboard, the problem might be with the Coolify proxy.
- **Direct Server IP:** If you’re using your server’s IP address, the issue could be related to your server or container status.


## 2. Test with Your Server’s IP Address

### A. Open Your Firewall Port
- **Step:** Make sure that port `8000` is open on your firewall.
- **Why:** This allows direct access to the Coolify dashboard without any proxy interference.

### B. Access the Dashboard Directly
- **Step:** Open your web browser and go to: `http://203.0.113.1:8000`  *(Replace `203.0.113.1` with your actual server IP address)*
- **Observation:**  
  - If you see the login page, the dashboard is working fine without proxy (skip to [step 4](#_4-addressing-proxy-related-issues)). 
  - If you don't see the login page, the issue might be with your server or coolify docker containers.


## 3. Check the Coolify Container
If the dashboard isn’t accessible via the IP address, then follow these steps:

### A. Verify the Container Status
- **Step:** SSH into your server.
- **Command:**
   ```bash
   docker ps --format "table {{.Names}}\t{{.Status}}"
- **What to Look For:**  
  - Make sure the coolify containers are running and its status is healthy.
  
    <ZoomableImage src="/docs/images/troubleshoot/dashboard/dashbord-inaccessible/1.webp" alt="Screenshot showing Dashboard Inaccessible" />

### B. Restart the Container (if necessary)
- **Step:** If the container appears to be running but you’re still having issues, try restarting it.
- **Commands:**  
    ```bash
    docker restart NAME
    ```
    *(Replace `NAME` with your actual container name)*
- **Test:** After restarting, try accessing `http://203.0.113.1:8000`  *(Replace `203.0.113.1` with your actual server IP address)* again. If this doesn't work, skip to [step 5](#_5-getting-further-assistance)


## 4. Addressing Proxy-Related Issues
If the dashboard is accessible via the server IP but not through your custom domain, then follow these steps:

### A. Start the Proxy
- **Step:** Go to the **Proxy** page in your Coolify dashboard.
- **Action:** Click the **Start Proxy** button.
  
    <ZoomableImage src="/docs/images/troubleshoot/dashboard/dashbord-inaccessible/2.webp" alt="Screenshot showing Dashboard Inaccessible" />
- **Wait:** Give it about two minutes, then try accessing your dashboard using your custom domain.

### B. Review Recent Changes
- **Question:** Did you change any proxy configurations before the issue started?
  - **If Yes:** Reset the proxy configuration to its default settings and restart the proxy.
  
    <ZoomableImage src="/docs/images/troubleshoot/dashboard/dashbord-inaccessible/3.webp" alt="Screenshot showing Dashboard Inaccessible" />
  - **Wait:** Give it about two minutes, then try accessing your dashboard using your custom domain.

### C. Check Proxy Logs
- **Step:** Look at the proxy logs for any error or warning messages.
  
    <ZoomableImage src="/docs/images/troubleshoot/dashboard/dashbord-inaccessible/4.webp" alt="Screenshot showing Dashboard Inaccessible" />
- **Next:** If you see errors, they may hint at what needs to be fixed (skip to next step).


## 5. Getting Further Assistance

If none of the above steps work, then follow this:

- **Community Help:** Join our [Discord community ↗](https://coolify.io/discord) and create a post in the support forum channel.
- **What to Share:** Include the exact error messages you’re seeing and a description of the steps you’ve already tried.


## Summary of Common Issues
- **Proxy Not Running:** Most issues are often due to the Coolify proxy not running.
- **Proxy Misconfiguration:** Incorrect settings in your proxy configuration can block access.
- **Container Health:** An unhealthy Coolify container may be the problem.
