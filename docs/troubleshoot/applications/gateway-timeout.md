---
title: Gateway Timeout Errors
description: Troubleshooting Gateway Timeout (504) errors in Coolify applications and services.
tags:
  [
    "Gateway Timeout",
    "504",
    "Troubleshooting",
    "Coolify",
    "Traefik",
    "Caddy",
    "Nginx",
  ]
---

# Gateway Timeout (504) Errors

Gateway timeout errors occur when the Coolify proxy cannot get a response from your application within the configured timeout period. This is different from [Bad Gateway (502)](troubleshoot/applications/bad-gateway) errors, which indicate the proxy cannot connect to your application at all.

## Common Causes

There are two primary scenarios that cause 504 Gateway Timeout errors in Coolify:

1. **Custom Docker Network Isolation** - The proxy cannot reach applications using custom networks
2. **Large Upload/Download Timeouts** - Default timeout settings are too short for large file transfers

## Issue 1: Custom Docker Network Isolation

### Symptoms

- Application works initially after deployment
- 504 Gateway Timeout errors appear after hours or days
- Application is reachable via direct IP and port (requires manual port mapping)
- Restarting the application temporarily fixes the issue
- Using custom Docker networks in your configuration

### Root Cause

When you define custom Docker networks in your Docker Compose file, the `coolify-proxy` container runs in Coolify's own networks while your application runs in the custom network. This network isolation prevents the proxy from reaching your application, especially when Docker's internal DNS returns different IPs based on timing and network joins.

### Diagnosis

1. **Check if your application uses custom networks:**

   ```bash
   docker inspect <your-container-name> --format='{{range $k,$v := .NetworkSettings.Networks}}Network: {{$k}}, IP: {{$v.IPAddress}}, Gateway: {{$v.Gateway}}{{println}}{{end}}'
   ```

2. **Verify proxy network connections:**

   ```bash
   docker inspect coolify-proxy --format='{{range $k,$v := .NetworkSettings.Networks}}Network: {{$k}}, IP: {{$v.IPAddress}}, Gateway: {{$v.Gateway}}{{println}}{{end}}'
   ```

### Solutions

#### Solution 1: Use Coolify Destinations (Recommended)

Let Coolify manage networks automatically by using [Destinations](/knowledge-base/destinations/) instead of custom networks:

1. Remove custom network definitions from your Docker Compose file
2. [Configure the network destination](/knowledge-base/destinations/create) in Coolify's UI under **Destinations**
3. [Move your application / service to the desired destination](/knowledge-base/destinations/manage#assign-resources-to-a-destination)
4. Redeploy

**Before (problematic):**

```yaml
services:
  app:
    image: myapp:latest
    networks:
      - custom-network

networks:
  custom-network:
    driver: bridge
```

**After (recommended):**

```yaml
services:
  app:
    image: myapp:latest
    # Let Coolify handle networking
```

#### Solution 2: Manual Network Connection (Temporary)

If you must use custom networks, manually connect the proxy:

```bash
docker network connect <your-network-name> coolify-proxy
```

**Note:** This is a temporary fix that may need to be reapplied after proxy restarts.

## Issue 2: Large Upload/Download Timeouts

### Symptoms

- 504 errors when uploading large files (>100MB)
- 504 errors when pushing large Docker images to a registry
- 504 errors during long-running requests (>60 seconds for Traefik/Nginx)
- Small files and quick requests work fine

### Root Cause

The default timeout behavior depends on your proxy:

- **Traefik**: Default read timeout is 60 seconds
- **Caddy**: No default timeout (requests can run indefinitely)
- **Nginx** (one-click databases): Default timeout is 60 seconds

Any request exceeding the configured timeout will result in a 504 Gateway Timeout error, even if the backend application is still processing the request.

### Diagnosis

1. **Check which proxy you're using:**

   - Navigate to **Servers > [YourServer] > Proxy** in the Coolify UI
   - The proxy type (Traefik, Caddy, etc.) will be displayed

2. **Check current proxy configuration:**

   - Navigate to **Servers > [YourServer] > Proxy** and look for any timeout settings
   - Check your applications / services for custom labels that might override defaults

3. **Monitor request duration in application logs:**

   - Navigate to your application / service logs in Coolify
   - Look for long-running requests that exceed 60 seconds

4. **Test with a smaller file to confirm it's size-related**

### Solutions

#### Solution 1: Increase Proxy Timeout

The configuration method depends on your proxy type:

##### For Traefik (Default Proxy)

Add custom Traefik configuration to increase the timeout. You have various options depending on your needs to achieve this:

Navigate to your server's proxy settings and add the new timeouts under the command section:

```yaml
command:
  - "--entrypoints.https.transport.respondingTimeouts.readTimeout=5m"
  - "--entrypoints.https.transport.respondingTimeouts.writeTimeout=5m"
  - "--entrypoints.https.transport.respondingTimeouts.idleTimeout=5m"
```

Read more about Traefik timeouts in the [official documentation ↗](https://doc.traefik.io/traefik/reference/install-configuration/entrypoints/#timeout).

##### For Caddy

Since Caddy has no default timeout, you typically won't experience timeout issues. However, if you need to SET a timeout (for security or resource management):

1. Add the following to your **Container Labels** in Coolify:

```yaml
# Set a 5-minute timeout (300 seconds)
caddy.servers.timeouts.read_body=300s
caddy.servers.timeouts.read_header=300s
caddy.servers.timeouts.write=300s
caddy.servers.timeouts.idle=5m
```

Read more about Caddy timeouts in the [official documentation ↗](https://caddyserver.com/docs/caddyfile/options#timeouts).

##### For Nginx (One-Click Databases)

Nginx configuration cannot be directly modified for one-click databases in Coolify. Instead, **bypass Nginx entirely** to avoid timeout issues:

1. Navigate to your database settings in Coolify
2. **Disable** "Make it publicly available?" option
3. Use **Port Mappings** instead to expose the database port directly and restart the database
4. This maps the port directly from the container, bypassing Nginx and its timeout limitations

**Example:** For a PostgreSQL database, map port `5432:5432` to access it directly without any proxy timeouts.

Read more about public database access here: [One-Click Databases](/databases/#ports-mapping-vs-public-port).

#### Solution 2: Implement Chunked Uploads

For very large files, consider implementing chunked uploads in your application:

1. Split large files into smaller chunks on the client side
2. Upload chunks individually (each under the timeout limit)
3. Reassemble on the server side

#### Solution 3: Use Background Processing

For long-running operations:

1. Accept the request and return immediately with a job ID
2. Process the request in the background
3. Provide an endpoint to check job status

## Quick Diagnosis Checklist

Run through these steps to identify your specific issue:

1. **Check the error code:**

   - 504 = Gateway Timeout (this guide)
   - 502 = Bad Gateway (see [Bad Gateway troubleshooting](/troubleshoot/applications/bad-gateway))

2. **Check timing:**

   - Immediate = likely network/configuration issue
   - After ~60 seconds = likely timeout issue
   - Random after hours/days = likely network isolation issue

3. **Check network configuration:**

   ```bash
   # List all Docker networks
   docker network ls

   # Check which networks your containers are using
   docker ps --format "table {{.Names}}\t{{.Networks}}"
   ```

## Prevention Tips

1. **Avoid custom Docker networks** unless absolutely necessary
2. **Set appropriate timeouts** for your application's needs during initial setup
3. **Implement health checks** to maintain connectivity
4. **Monitor proxy logs** regularly for timeout patterns
5. **Use progress indicators** for long-running operations to prevent client-side timeouts

## Support

If these solutions don't resolve your gateway timeout issues:

1. Collect diagnostic information:

   ```bash
   # Save this output
   docker ps --format "table {{.Names}}\t{{.Networks}}\t{{.Status}}"
   docker logs coolify-proxy --tail 200 > proxy-logs.txt
   docker logs <your-container-name> --tail 200 > app-logs.txt
   ```

2. Join our [Discord Community ↗](https://coolify.io/discord)
3. Share your configuration, logs, and the specific steps you've tried
