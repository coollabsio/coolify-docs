---
title: "macOS using Colima Setup Guide"
description: "Install Coolify on macOS using a Colima virtual machine with Docker, covering VM creation, networking, and SSH configuration."
---

# macOS using Colima Setup Guide

This guide walks you through setting up Coolify on macOS using [Colima](https://github.com/abiosoft/colima?utm_source=coolify.io), a lightweight container runtime for macOS.

## Prerequisites

- A Mac (Intel or Apple Silicon)
- [Homebrew](https://brew.sh/?utm_source=coolify.io) installed
- Remote Login enabled on your Mac — see [Apple's guide to allow remote access](https://support.apple.com/guide/mac-help/mchlp1066/mac?utm_source=coolify.io) to enable SSH in **System Settings > General > Sharing > Remote Login**
- An SSH key without a passphrase

::: warning Caution
The SSH key used for Coolify must not have a passphrase or 2FA enabled, otherwise you will not be able to complete the onboarding process.
:::

## Install Colima

1. Install Colima and Docker using Homebrew:

   ```bash
   brew install colima docker
   ```

2. Verify the installation:

   ```bash
   colima version
   ```

## Create the Virtual Machine

1. Start a new Colima VM with the minimum resources:

   ```bash
   colima start -c 2 -m 2 -d 30 --ssh-port 2222 --network-address --network-mode bridged --save-config
   ```

   This creates a VM with:
   - **2 CPU cores** (`-c 2`)
   - **2 GB of memory** (`-m 2`)
   - **30 GB of disk space** (`-d 30`)
   - **SSH on port 2222** (`--ssh-port 2222`)
   - **Bridged networking** (`--network-address --network-mode bridged`) — the VM gets its own IP from your router
   - **Save configuration** (`--save-config`) — persists these settings so future `colima start` commands use the same configuration

   ::: info Note
   You can adjust these values based on your needs. These are recommended minimums for running Coolify along with a few services.
   :::

2. Verify the VM is running:

   ```bash
   colima status
   ```

## Networking

Colima supports two network modes: **bridged** (recommended) and **shared**.

### Bridged Mode (Default in This Guide)

The command above uses `--network-address --network-mode bridged`, which assigns the VM an IP address directly from your router's DHCP server. This makes the VM behave like a separate device on your network, allowing other devices on your LAN to reach Coolify.

::: tip
By default, bridged mode uses the `en0` interface. If your Mac uses a different network interface, specify it with `--network-interface <name>`.
:::

You can find the VM's IP address with:

```bash
colima list
```

### Shared Mode

If you don't need Coolify to be accessible from other devices on your network — for example, if you plan to use [Tailscale](https://tailscale.com/?utm_source=coolify.io) or only need to access Coolify from your Mac — you can omit the network flags:

```bash
colima start -c 2 -m 2 -d 30 --ssh-port 2222 --save-config
```

In shared mode, the VM gets an IP on a private subnet that is only reachable from the host Mac.

## SSH Configuration

Coolify connects to servers via SSH. Since we specified `--ssh-port 2222` when creating the VM, the SSH port is fixed and won't change between restarts.

You can verify the SSH configuration at any time with:

```bash
colima ssh-config
```

This outputs the full SSH config, including the **hostname**, **port**, **user**, and **identity file** the VM is configured with.

Use the hostname and port from the output when adding the server in Coolify's onboarding or server settings.

::: info Note
If you omit `--ssh-port` when creating the VM, Colima assigns a random free port that may change on restart. Use `colima ssh-config` to check the current port.
:::

## Install Coolify

1. SSH into the Colima VM:

   ```bash
   colima ssh
   ```

2. Inside the VM, proceed with the [Coolify installation](/get-started/installation#quick-installation-recommended).

3. Once the installation completes, access the Coolify web interface depending on your network mode:

   - **Bridged mode**: Open `http://<vm-ip>:8000` from any device on your network.
   - **Shared mode**: Open `http://<vm-ip>:8000` from your Mac only (the VM is not reachable from other devices).

   Find the VM's IP address with `colima list`.

4. In the Coolify web interface, go to your server settings and set the **SSH port** to the port you specified when creating the VM (e.g., `2222`). Coolify uses this port to manage the server via SSH.

## Starting Fresh

If something goes wrong and you want to start over, you can delete the VM and recreate it.

- Delete the VM but keep its disk data:

  ```bash
  colima delete
  ```

- Delete the VM and all its data:

  ```bash
  colima delete --data
  ```

After deleting, go back to [Create the Virtual Machine](#create-the-virtual-machine) to set up a new VM.

## Post-Install Steps

### Start Colima Automatically on Boot

To have Colima start automatically when your Mac boots:

```bash
brew services start colima
```