---
title: "Firewall"
description: "Configure firewall ports for Coolify including SSH, HTTP/HTTPS, dashboard access, and terminal with ufw-docker setup for self-hosted and cloud instances."
---

# Firewall
Coolify requires specific network ports to be open in order to function properly across various environments. These ports enable web access, SSH connections, terminal sessions, and real-time communication. 

The required ports may vary slightly depending on whether you're using a self-hosted setup or the managed version ([Coolify Cloud](https://coolify.io/pricing/)).


## Coolify Self-hosted
To ensure proper functionality when self-hosting Coolify, the following ports should be opened:

* **8000** – HTTP access to the Coolify dashboard
* **6001** – Real-time communications
* **6002** – Terminal access (Required for Coolify version 4.0.0-beta.336 and above)
* **22** – SSH access (or your custom SSH port)
* **80** – SSL certificate generation via reverse proxy (Traefik or Caddy)
* **443** – HTTPS traffic

These ports are required if you're accessing Coolify directly using your server’s IP address (e.g., `http://<SERVER_IP>:8000`).

::: success Tip
If you're using a custom domain with Coolify’s integrated reverse proxy (Traefik or Caddy), you can safely close ports **8000**, **6001**, and **6002** after accessing the dashboard from your custom domain.
:::

::: warning Caution
  If you are using `Oracle Cloud Free ARM Server`, you need to allow these ports
  inside Oracle's Dashboard, otherwise you cannot reach your instance from the
  internet after installation.
:::


## Coolify Cloud
For Servers connected to Coolify Cloud, the following ports must be open:

* **22** – SSH access (or your custom SSH port)
* **80** – SSL certificate generation via reverse proxy (Traefik or Caddy)
* **443** – HTTPS traffic

These are the only required ports, as all other services are managed for you by Coolify Cloud.



## Closing Ports Using a Firewall
Coolify runs on Docker, which uses NAT-based iptables rules that can bypass traditional Linux firewalls like UFW. As a result, blocking ports using UFW alone will not be effective.

### Recommended Approach
Most cloud providers offer integrated firewalls through their dashboards. If your provider supports this, **it is highly recommended to use their firewall settings** to manage open ports instead of relying on local tools like UFW.

If your provider does not offer firewall functionality, you can use one of the following advanced methods:

### Coolify Self-hosted
::: danger CAUTION!!
  Modifying firewall settings incorrectly may lead to access issues that are difficult to recover from. 
  
  Proceed with the following steps **only if necessary**, and if you fully understand the implications.
:::


#### Use `ufw-docker`
[ufw-docker](https://github.com/chaifeng/ufw-docker) is a community-maintained tool that helps bridge UFW and Docker by allowing you to block specific ports effectively. Refer to the [GitHub repository](https://github.com/chaifeng/ufw-docker) for complete setup instructions

---

### Coolify Cloud
For servers connected to Coolify Cloud, only the SSH port (typically **22**) needs to be open for remote management.

If you wish to restrict access based on IP address, we have a list of public IPs used by Coolify Cloud:

* [IPv4 addresses](https://coolify.io/ipv4.txt)
* [IPv6 addresses](https://coolify.io/ipv6.txt)

Coolify Cloud’s IPs rarely change, but users will be notified by email if updates occur.


### GitHub Integration
GitHub uses webhooks to communicate with Coolify. For this to work correctly:
* Ensure **TCP ports 80 and 443** are open.
* (Optional) To restrict webhook access by IP, you can get the current list of GitHub’s outbound IPs from: https://api.github.com/meta (Check the `hooks` section)

For more details, refer to their [documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses)
