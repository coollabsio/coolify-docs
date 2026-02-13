---
title: "OpenLiteSpeed"
description: "OpenLiteSpeed is a high-performance, lightweight, open-source HTTP server with a built-in WebAdmin GUI."
---

![OpenLiteSpeed](https://openlitespeed.org/wp-content/uploads/2019/07/openlitespeed-logo.svg)

## What is OpenLiteSpeed?

OpenLiteSpeed is the open-source edition of LiteSpeed Web Server Enterprise. It features an event-driven architecture, low resource usage, and high performance. It includes a user-friendly WebAdmin GUI for configuration and management.

## Deployment

OpenLiteSpeed can be deployed as a standalone service in Coolify.

### Configuration

- **WebAdmin Console:** Accessible on port `7080`.
- **HTTP Port:** The main web server listens on port `8088` (proxied by Coolify).
- **Volumes:**
  - `ols-conf`: Configuration files.
  - `ols-logs`: Server logs.
  - `webroot`: Default document root (`/var/www/vhosts/localhost/html`).

### Post-Installation

After deploying, it is recommended to change the WebAdmin password:

1. Open the terminal for the service in Coolify.
2. Run the password reset script:
   ```bash
   /usr/local/lsws/admin/misc/admpass.sh
   ```
3. Follow the prompts to set a new username and password.

You can then access the WebAdmin console at `http://<your-server-ip>:7080`.

## Links

- [Official Website](https://openlitespeed.org/)
- [Documentation](https://openlitespeed.org/kb/)
- [GitHub](https://github.com/litespeedtech/openlitespeed)
