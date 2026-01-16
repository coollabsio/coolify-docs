---
title: Coolify Install Script Failed
description: Debug and fix Coolify installation script failures with step-by-step troubleshooting for logs, Docker issues, port conflicts, and container problems.
---

# Coolify Installation Script Failed

If the Coolify installation script completes but you cannot access Coolify, or if containers are missing, this guide will help you debug and fix the issue.

## Common Symptoms

- Installation script finishes but **no access URL is displayed**
- Script shows success but **Coolify web interface is not accessible** on port 8000
- **Docker containers are missing** or not running
- Installation appears to complete but **something doesn't work**

::: warning Important
Before following this guide, make sure you read the [Installation Prerequisites](/get-started/installation#before-you-begin) to ensure your system meets all requirements.
:::

## Enable Verbose Mode for Debugging

If you're experiencing installation issues, you can run the installation script in **verbose mode** to see exactly what commands are being executed:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh -o install.sh
bash -x install.sh 2>&1 | tee installation-debug.log
```

This will:

- Show every command as it executes (`bash -x`)
- Display both stdout and stderr (`2>&1`)
- Save all output to `installation-debug.log` for later review (`tee`)

::: tip
Verbose mode is extremely helpful for identifying exactly where the installation fails. Include the verbose log when asking for help in Discord.
:::

## Step 1: Check Installation Logs

The installation script creates log files that contain valuable information about what happened during installation.

### Finding Your Logs

The installation process creates two log files in `/data/coolify/source/`:

1. **Installation log**: `installation-YYYYMMDD-HHMMSS.log`
2. **Upgrade log**: `upgrade-YYYY-MM-DD-HH-MM-SS.log`

::: tip
The installation script calls the upgrade script internally, so both logs are created during initial installation.
:::

### View Your Logs

Find your most recent log files:

```bash
# List all log files sorted by date (most recent first)
ls -lt /data/coolify/source/*.log | head -5
```

View the installation log:

```bash
# Replace the date/time with your actual log file
tail -100 /data/coolify/source/installation-YYYYMMDD-HHMMSS.log

# Or view the entire log
cat /data/coolify/source/installation-YYYYMMDD-HHMMSS.log
```

View the upgrade log:

```bash
# Replace the date/time with your actual log file
tail -100 /data/coolify/source/upgrade-YYYY-MM-DD-HH-MM-SS.log

# Or view the entire log
cat /data/coolify/source/upgrade-YYYY-MM-DD-HH-MM-SS.log
```

### What to Look For

Look for error messages containing:

- `ERROR:`
- `Failed to`
- `could not`
- `Connection refused`
- `Permission denied`
- `No such file or directory`

## Step 2: Verify Docker Installation

Check if Docker is properly installed and running:

```bash
# Check Docker version
docker --version

# Check Docker Compose plugin
docker compose version

# Check if Docker daemon is running
sudo systemctl status docker
```

**Expected output** for `docker --version`:

```
Docker version 27.0.x, build xxxxx
```

If Docker is not installed or not running:

```bash
# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker
```

::: warning Docker via Snap Not Supported
If you installed Docker via snap, you must remove it and reinstall Docker properly. The installation script will detect and block snap-based Docker installations.

```bash
# Remove Docker snap
sudo snap remove docker

# Then re-run the Coolify installation script
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

:::

## Step 3: Check Port Availability

Coolify requires specific ports to be available. The most critical port for initial installation is **port 8000**.

### Check Port 8000 (Coolify Web Interface)

::: danger Critical Port
Port 8000 must be available for Coolify's web interface. If something else is using this port, installation will fail silently.
:::

**On Linux with `ss` (recommended):**

```bash
sudo ss -tulpn | grep :8000
```

**On Linux with `lsof`:**

```bash
sudo lsof -i :8000
```

**On Linux with `netstat`:**

```bash
sudo netstat -tulpn | grep :8000
```

If these commands return **no output**, the port is free ✓

If they show output, **something is using port 8000**. Example:

```
tcp   LISTEN  0  4096  *:8000  *:*  users:(("some-app",pid=1234,fd=3))
```

### Check Other Coolify Ports

```bash
# Port 6001 (Soketi/Real-time)
sudo ss -tulpn | grep :6001

# Port 5432 (PostgreSQL - usually internal only)
sudo ss -tulpn | grep :5432

# Port 6379 (Redis - usually internal only)
sudo ss -tulpn | grep :6379
```

### Fix Port Conflicts

If port 8000 is in use, you have two options:

**Option 1: Stop the conflicting service**

```bash
# Find the process ID (PID) from the ss/lsof output
sudo kill <PID>

# Or stop the service if you know what it is
sudo systemctl stop <service-name>
```

**Option 2: Change Coolify's port** (Advanced)

Modify `/data/coolify/source/.env` and change the `APP_PORT` variable, then re-run the installation script.

## Step 4: Validate Docker Containers

Check if all Coolify containers are running:

```bash
# List all containers (running and stopped)
docker ps -a

# Filter for Coolify containers only
docker ps -a --filter "name=coolify"
```

### Expected Containers

You should see these containers:

| Container Name     | Status | Purpose                    |
| ------------------ | ------ | -------------------------- |
| `coolify`          | Up     | Main Coolify application   |
| `coolify-realtime` | Up     | Real-time updates (Soketi) |
| `coolify-db`       | Up     | PostgreSQL database        |
| `coolify-redis`    | Up     | Redis cache                |

::: info Note
The `coolify-proxy` container is NOT created during installation. It's created later when you deploy your first application or enable a proxy.
:::

### Check Container Status

If containers are **stopped** or **exited**, check their logs:

```bash
# View logs for specific container
docker logs coolify
docker logs coolify-realtime
docker logs coolify-db
docker logs coolify-redis

# Follow logs in real-time
docker logs -f coolify
```

### Restart Stopped Containers

If containers are stopped, try starting them:

```bash
# Start all Coolify containers
cd /data/coolify/source
docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Step 5: Verify Docker Images

Check if all required Docker images were pulled successfully:

```bash
# List Coolify-related images
docker images | grep coolify
docker images | grep ghcr.io/coollabsio
```

### Expected Images

You should see at least:

- `ghcr.io/coollabsio/coolify` (or your custom registry)
- `ghcr.io/coollabsio/coolify-helper`
- `ghcr.io/coollabsio/coolify-realtime`

### Missing Images

If images are missing, there may have been a network issue during installation. Try pulling them manually:

```bash
# Pull the latest Coolify images
docker pull ghcr.io/coollabsio/coolify:latest
docker pull ghcr.io/coollabsio/coolify-helper:latest
docker pull ghcr.io/coollabsio/coolify-realtime:latest

# Then restart Coolify
cd /data/coolify/source
docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate
```

::: tip Registry Authentication
If you're using a custom Docker registry that requires authentication, you may need to run `docker login` first.
:::

## Step 6: Check Docker Networks

Verify that the Coolify Docker network exists:

```bash
# List Docker networks
docker network ls | grep coolify
```

**Expected output:**

```
<network-id>   coolify   bridge   local
```

If the network doesn't exist, create it:

```bash
# Try creating with IPv6 support first
docker network create --attachable --ipv6 coolify

# If that fails, create without IPv6
docker network create --attachable coolify
```

## Step 7: Verify Disk Space

Check available disk space:

```bash
df -h /
```

Coolify requires:

- **Minimum 30GB total disk space**
- **Minimum 20GB available space**

::: warning Low Disk Space
If you have less than the required space, the installation may complete but fail during operation. Consider:

- Cleaning up unused Docker resources: `docker system prune -a`
- Expanding your disk/volume
- Using a larger server
  :::

## Common Issues & Solutions

### Issue: Script Completes But No Access URL Shown

**Symptoms:**

- Installation script finishes
- No error messages
- But no URL like `http://your-ip:8000` is displayed

**Possible causes:**

1. Container creation failed silently
2. Network issues prevented fetching public IP
3. Docker images failed to pull

**Solution:**

```bash
# Check if containers are running
docker ps --filter "name=coolify"

# If containers are missing, check upgrade log
cat /data/coolify/source/upgrade-*.log

# Look for errors in the log, then re-run upgrade
cd /data/coolify/source
bash upgrade.sh latest latest ghcr.io false
```

### Issue: Port 8000 Already in Use

**Symptoms:**

- Installation completes
- Containers appear to be running
- But Coolify web interface is not accessible

**Solution:**

See [Step 3: Check Port Availability](#step-3-check-port-availability) above.

### Issue: Docker Image Pull Failures

**Symptoms:**

- Installation takes very long time
- Errors like "failed to pull image" or "manifest unknown"
- Some Docker images are missing

**Possible causes:**

1. Network connectivity issues
2. DNS resolution problems
3. Registry rate limiting
4. Custom registry authentication issues

**Solution:**

```bash
# Test network connectivity to GitHub Container Registry
curl -I https://ghcr.io

# Check DNS resolution
nslookup ghcr.io

# Try pulling images manually
docker pull ghcr.io/coollabsio/coolify:latest

# If using custom registry, login first
docker login your-registry.com
```

### Issue: Insufficient Permissions

**Symptoms:**

- "Permission denied" errors in logs
- Cannot create directories
- Cannot modify files in `/data/coolify/`

**Solution:**

The installation script must be run as **root** or with **sudo**:

```bash
# Re-run with sudo
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

### Issue: SSH Configuration Problems

**Symptoms:**

- Installation completes
- Coolify accessible but cannot connect to localhost server
- SSH-related errors in Coolify interface

**Possible cause:**

- SSH `PermitRootLogin` is disabled
- SSH keys not properly configured

**Solution:**

Check SSH configuration:

```bash
# Check PermitRootLogin setting
sudo sshd -T | grep permitrootlogin
```

Should show:

- `permitrootlogin yes`, or
- `permitrootlogin prohibit-password`, or
- `permitrootlogin without-password`

If it shows `permitrootlogin no`, see the [OpenSSH Configuration Guide](/knowledge-base/server/openssh).

## Manual Verification Checklist

Run these commands to get a complete diagnostic report:

```bash
echo "=== COOLIFY INSTALLATION DIAGNOSTICS ==="
echo ""

echo "1. Installation Logs:"
ls -lt /data/coolify/source/*.log 2>/dev/null | head -5 || echo "No logs found"
echo ""

echo "2. Docker Version:"
docker --version
docker compose version
echo ""

echo "3. Docker Service Status:"
sudo systemctl status docker --no-pager -l
echo ""

echo "4. Coolify Containers:"
docker ps -a --filter "name=coolify" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "5. Docker Images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep -E "REPOSITORY|coolify"
echo ""

echo "6. Docker Networks:"
docker network ls | grep -E "NETWORK|coolify"
echo ""

echo "7. Port 8000 Status:"
sudo ss -tulpn | grep :8000 || echo "Port 8000 is free"
echo ""

echo "8. Disk Space:"
df -h /
echo ""

echo "9. Environment File:"
ls -lh /data/coolify/source/.env 2>/dev/null || echo ".env file not found"
echo ""
```

Copy the output of this diagnostic script when asking for help.

## Recovery Steps

### Clean Re-installation

If you want to completely uninstall and start fresh:

::: danger Warning
This will remove all Coolify data including applications, databases, and settings!
:::

Follow the [Uninstallation Guide](/get-started/uninstallation) to properly remove Coolify, then re-run the installation script:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

### Retry Installation Without Full Reset

If you just want to retry without losing data:

```bash
# Re-run the installation script
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

The script is designed to be **idempotent** (safe to run multiple times).

### Use Manual Installation

If the automated script continues to fail, try the [Manual Installation](/get-started/installation#manual-installation) method.

## Getting Help

If you've followed all the steps above and still have issues, please ask for help in our [Discord community](https://coolify.io/discord).

### Information to Provide

When asking for help, include:

1. **Your system information:**

   ```bash
   cat /etc/os-release
   uname -m
   ```

2. **Installation logs:** (last 100 lines)

   ```bash
   tail -100 /data/coolify/source/installation-*.log
   tail -100 /data/coolify/source/upgrade-*.log
   ```

3. **Docker status:**

   ```bash
   docker ps -a --filter "name=coolify"
   docker images | grep coolify
   ```

4. **Any error messages** you see in logs or on screen

5. **What you've already tried** to fix the issue

This information will help the community diagnose your problem much faster!

## Related Documentation

- [Installation Guide](/get-started/installation)
- [Manual Installation](/get-started/installation#manual-installation)
- [Firewall Configuration](/knowledge-base/server/firewall)
- [OpenSSH Configuration](/knowledge-base/server/openssh)
- [Raspberry Pi OS Setup](/knowledge-base/how-to/raspberry-pi-os)
- [Docker Installation Failed](/troubleshoot/installation/docker-install-failed)
