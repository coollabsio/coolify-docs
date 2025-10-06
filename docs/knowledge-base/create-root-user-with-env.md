---
title: "Create Root User with Environment Variables"
description: "Create Coolify root user during installation with environment variables including email validation, username requirements, and strong password policies."
---

# Create Root User with Environment Variables

Creating the root user during installation is optional but recommended as it prevents the registration page from ever being exposed.

## Validation Requirements

The following requirements must be met for the root user credentials in a production environment.

### Email
- Must be a valid email address
- Must have a valid DNS record
- Maximum length: 255 characters

### Username
- Minimum length: 3 characters
- Maximum length: 255 characters
- Can only contain letters, numbers, spaces, underscores, and hyphens

### Password
- Minimum length: 8 characters
- Must contain both uppercase and lowercase letters
- Must contain at least one number
- Must contain at least one special symbol
- Must not be a commonly used or compromised password

## Automated Installation Method


1. **Prepare Your Credentials**

   Create your root user credentials according to the validation requirements above.

2. **Run Installation Command**

   Execute the automated installation script with your prepared credentials:

   ```bash
   env ROOT_USERNAME=RootUser ROOT_USER_EMAIL=example@example.com ROOT_USER_PASSWORD=Password bash -c 'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
   ```
    > View the [Scripts Source Code](https://github.com/coollabsio/coolify/blob/main/scripts/install.sh)

::: info
  The installation script must be run as `root`. If you're not logged in as `root`, the script will use `sudo` to elevate privileges.
  ```bash
  sudo -E env ROOT_USERNAME=RootUser ROOT_USER_EMAIL=example@example.com ROOT_USER_PASSWORD=Password bash -c 'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
  ```
:::

::: warning
  If any of the environment variables values contain a space, wrap the values in double quotes, for example `ROOT_USERNAME="Root User"`.
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
   ROOT_USERNAME=RootUser
   ROOT_USER_EMAIL=example@example.com
   ROOT_USER_PASSWORD=Password
   ```

::: warning
  If any of the environment variables values contain a space, wrap the values in double quotes, for example `ROOT_USERNAME="Root User"`
:::

3. **Complete Setup**
   After configuring the root user credentials, continue with the [installation steps](/get-started/installation#quick-installation-recommended) to complete your Coolify setup.

