---
title: "Define Custom Docker Network with Environment Variables"
description: "Configure custom Docker network CIDR blocks and address pools using environment variables during Coolify installation for advanced network setups"
---

# Define Custom Docker Network with Environment Variables

## Validation Requirements

The following requirements must be met for the custom docker network in a production environment.

### Network Name (`DOCKER_ADDRESS_POOL_BASE`)
- Must be a valid CIDR block, like `10.0.0.0/8`.

### Address Pool Size (`DOCKER_ADDRESS_POOL_SIZE`)
- Must be a valid number, like `10`.

### Force Override (`DOCKER_POOL_FORCE_OVERRIDE`)
- This only needed if you already have a docker address pool on the host and you want to override it.

## Automated Installation Method

1. **Prepare Your Credentials**

   Create your root user credentials according to the validation requirements above.

2. **Run Installation Command**

   Execute the automated installation script with your prepared credentials:

   ```bash
   env DOCKER_ADDRESS_POOL_BASE=10.0.0.0/8 DOCKER_ADDRESS_POOL_SIZE=10 bash -c 'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
   ```
    > View the [Scripts Source Code](https://github.com/coollabsio/coolify/blob/main/scripts/install.sh)

::: info
  The installation script must be run as `root`. If you're not logged in as `root`, the script will use `sudo` to elevate privileges.
  ```bash
  sudo -E env DOCKER_ADDRESS_POOL_BASE=10.0.0.0/8 DOCKER_ADDRESS_POOL_SIZE=10 bash -c 'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
  ```
:::


3. **Complete Setup**
   After configuring the root user credentials, continue with the [installation steps](/get-started/installation#quick-installation-recommended) to complete your Coolify setup.


## Manual Installation Method


1. **Prepare Your Credentials**

   Create your root user credentials according to the validation requirements above.

2. **Configure Environment Variables**

   Edit the environment variables file:

   ```bash
   nano /data/coolify/source/.env
   ```

   Add the following variables with your prepared credentials:
   ```bash
   DOCKER_ADDRESS_POOL_BASE=10.0.0.0/8
   DOCKER_ADDRESS_POOL_SIZE=10
   DOCKER_POOL_FORCE_OVERRIDE=false
   ```

3. **Complete Setup**
   After configuring the root user credentials, continue with the [installation steps](/get-started/installation#manual-installation) to complete your Coolify setup.

