# Pterodactyl With Wings

Pterodactyl® is a free, open-source game server management panel that makes managing and deploying game servers easy and secure.

---

## What is Pterodactyl?

Pterodactyl® lets you host, manage, and monitor game servers from a single intuitive web interface.  
It runs on Wings, a lightweight daemon designed for security and efficiency — used by individuals and large hosting providers alike.

---

## Current Features

- Multi-server management from one dashboard  
- Secure daemon (Wings) with process isolation  
- Docker-based containerization for each server  
- Web-based dashboard  
- Role-based user permissions  
- Real-time CPU, RAM, and network monitoring  
- Automated server updates and backups  

---

## Installation

1. Install the latest **Pterodactyl With Wings** template from **Coolify**.  
2. Deploy the template.  
3. Visit the panel URL and log in using your admin credentials.  
4. Navigate to the **Admin Panel → Locations** and create a new location (e.g., `us`, `eu`, ...).  
5. Create a new node and configure the following fields:

   - **FQDN** → `wings-abc1abc2abc3abc4.example.com` (Without `http://` or `https://`)  
   - **Communicate Over SSL** → Enabled (Change this only if you know what your doing)
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

---

## Common Issues

**Node not connecting**  
- Ensure your node API is configured to use port `443`.  

**Cannot access the server on the node**  
- Confirm that you added your panel domain under `allowed_origins`.  

---

## Support

- [Discord](https://discord.com/invite/pterodactyl)

---

## Links

- [GitHub Panel](https://github.com/pterodactyl/panel)  
- [GitHub Wings](https://github.com/pterodactyl/wings)  
- [Documentation](https://pterodactyl.io/)
