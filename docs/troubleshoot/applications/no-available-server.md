---
title: No Available Server Error
description: Troubleshooting "No Available Server" (503) errors in Coolify applications and services.
tags: ["No Available Server", "503"]
---

# No Available Server (503) Error

If your deployed application or service shows a **"No Available Server"** error, this indicates that [Traefik](/knowledge-base/proxy/traefik/overview) (the reverse proxy) cannot find any (healthy) containers to route traffic to under the provided secured URL (`https`).

## What Causes This Error?

The "No Available Server" error occurs when:

1. **Failed Health Checks** (Most common) - Traefik considers your container unhealthy
2. **Domain Configuration Issues** - Incorrect domain setup or missing www/non-www variants
3. **Port Mismatches** - Exposed ports don't match your application's actual listening port
4. **Deployment Downtime** - Brief downtime during container updates

## Quick Diagnosis Steps

### 1. Check Container Health Status

First, verify if your containers are healthy:

```bash
# SSH into your server and check container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Look for containers showing `(unhealthy)` status - this is your primary culprit.

### 2. Check Health Check Configuration

#### Applications

<ZoomableImage src="/docs/images/knowledge-base/resources/healthcheck.webp" />

Navigate to your application's configuration and check:

- Is a health check enabled?
- What path is being checked?
- What port is the health check using?

#### Service Stacks

Look in your `docker-compose.yml` for the `healthcheck` section and check:

- What command is being run?
- What path is being checked?
- What port is the health check using?

You can find this either in the Coolify UI by clicking on the `Edit Compose File` button or in the `Docker Compose` section under `Docker Compose Content (raw)`.

## Common Solutions

### Solution 1: Fix Failed Health Checks (Most Common)

**Symptoms:**

- Container shows as `(unhealthy)` in Docker
- Health check path returns errors
- Missing dependencies (e.g. `curl`/`wget`) in container

**Steps:**

1. **Disable Health Check Temporarily:**

   - Go to your application configuration
   - Disable the health check
   - Restart your application

   If this fixes the issue, then the problem is in your health check.

2. **Fix Health Check Issues:**

   ::: info
   These are some common solutions to fix a health check. Adjust based on your specific application and health check command.
   :::

   **Missing dependencies in container:**

   Ensure that all necessary tools are installed in your Docker image for the health check to work. [Applications](/applications/index) will need either `curl` or `wget` installed.

   ```dockerfile
   # Add curl to your Dockerfile
   RUN apt-get update && apt-get install -y curl
   # OR for Alpine images
   RUN apk add --no-cache curl
   ```

   **Wrong health check path / hostname:**

   Make sure that your app is actually serving the health check endpoint and does not return an error. In most cases, the hostname will be `localhost` or `127.0.0.1`.

   **Port mismatch:**

   - Ensure health check port matches your app's listening port
   - If the app runs on port `3000`, health check should use port `3000`

3. **Test Health Check Manually:**

   If the above hasn't resolved the issue, manually test the health check command inside the container and evaluate the output.

   You can do this by either navigating to your container's `Terminal` tab in Coolify or by SSHing into your server and running:

   ```bash
   # SSH into your server and test a health check which uses curl
   docker exec -it <container-name> curl -f http://localhost:3000/health
   ```

### Solution 2: Fix Domain Configuration

#### Redirect Issues

**Symptoms:**

- Works with auto-generated domain (e.g. `sslip.io`) but not custom domain
- Redirect is set to either `Redirect to www` or `Redirect to non-www`
- Works for root domain but not www (or vice versa)

**Steps:**

1. **Add Both www and non-www Domains:**

   Make sure both, the www and non-www versions of your domain are added in the `Domains` field like so: `https://example.com,https://www.example.com`

2. **Configure Domain Redirection:**

   - Set the `Direction` to `Allow www & non-www` if you want both to work

3. **Restart Application:**
   - Always restart after domain changes

#### HTTPS Issues

If your site is only accessible via HTTP but not HTTPS, check your domain configuration:

- **For HTTPS with SSL**: Use `https://` prefix in the domain field: `https://example.com`
- **For HTTP only**: Use `http://` prefix in the domain field: `http://example.com` (no SSL certificate will be generated)

Make sure the protocol in your domain configuration matches how you want to access your site, then restart your application.

### Solution 3: Fix Port Configuration

**Symptoms:**

- Application / Service works via `http://IP:port` but not via domain (manual port mapping required)
- [Traefik](/knowledge-base/proxy/traefik/overview) can't reach the application

**Steps:**

1. **Check exposed Port:**

   The proxy needs to know which port your application is listening on. Check that the port is configured correctly.

   <ZoomableImage src="/docs/images/troubleshoot/applications/bad-gateway/1.webp" />

   In [Applications](/applications/index), this is defined in the `Ports Exposes` field.

      <ZoomableImage src="/docs/images/troubleshoot/applications/bad-gateway/4.webp" />

   In **Service Stacks**, this is defined by either adding the port at the end of the URL in the `Domains` field (e.g. `https://example.com:3000`) or by defining the `EXPOSE` directive in your `Dockerfile`.

2. **Verify Application Listening Address:**

   <ZoomableImage src="/docs/images/troubleshoot/applications/bad-gateway/3.webp" />

   Your Application / Service might be binding to only `localhost` or `127.0.0.1`, which makes it unreachable from outside the container. Ensure your app listens on all interfaces (`0.0.0.0`).

### Solution 4: Handle Deployment Downtime

**Symptoms:**

- Brief "No Available Server" during deployments
- Happens only during container updates

**Solution: Configure Rolling Updates**

Ensure that `Rolling Updates` are correctly configured. See [Rolling Updates documentation](/knowledge-base/rolling-updates)

## Advanced Debugging

### Check Traefik Configuration

```bash
# View Traefik dynamic configuration
cat /data/coolify/proxy/dynamic/*.yml

# Check Traefik logs
docker logs coolify-proxy -f

# Inspect container labels to verify Traefik routing configuration
docker inspect <your-container-name> --format='{{json .Config.Labels}}' | jq
```

### Check Application Logs

```bash
# Check your application's logs for errors
docker logs <your-container-name> -f
```

### Test Health Check from Inside Container

```bash
# Execute health check command manually
docker exec -it <container-name> /bin/sh
curl -f http://localhost:3000/health
```

## Prevention Tips

1. **Always Use Health Checks:**

   - Implement a `/health` endpoint in your application
   - Ensure all dependencies (e.g. `curl`/`wget`) are available in your container

2. **Test Locally First:**

   - Test your health check endpoint before deploying
   - Verify port configuration matches your app

3. **Monitor Container Status:**

   - Regularly check `docker ps` for unhealthy containers
   - Set up monitoring for health check failures

4. **Use Staging Environment:**
   - Test domain configurations in staging first

## When to Seek Help

If none of these solutions work, join our [Discord community ↗](https://coolify.io/discord) and provide:

- Application logs
- Coolify proxy logs
- Container health status (`docker ps`)
- Domain configuration screenshots
- Health check configuration
- Steps you've already tried

This will help the community diagnose more complex issues specific to your setup.
