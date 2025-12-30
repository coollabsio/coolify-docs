---
title: "OpenSSH"
description: "Configure OpenSSH server for Coolify with key-based authentication, proper permissions, and automated SSH setup across Ubuntu, Debian, CentOS, and Alpine Linux."
---

# OpenSSH
Coolify uses SSH to connect to your server and deploy your applications. This is true even when using the `localhost` server where Coolify is running.

You have to configure SSH properly for Coolify to be able to access your servers.

## Methods to setup
There are two ways to setup OpenSSH
- [Semi-automatic setup](#semi-automatic-setup)
- [Manual setup](#manual-setup)

::: danger IMPORTANT!
  The SSH key must not have a passphrase or 2FA enabled for the user used to run the Coolify installation script or the SSH connection will fail.
:::


## Semi-automatic setup
### 1. Install OpenSSH Server

::: tabs
== Debian / Ubuntu / PopOS

```bash
apt update && apt install -y openssh-server
systemctl enable --now ssh
```

== CentOS / RHEL / Rocky / Fedora

```bash
dnf install -y openssh-server
systemctl enable --now sshd
```

== SLES/openSUSE

```bash
zypper install -y openssh
systemctl enable --now sshd
```

== Arch Linux

```bash
pacman -Sy --noconfirm openssh
systemctl enable --now sshd
```

== Alpine Linux

```bash
apk add openssh
rc-update add sshd
rc-service sshd start
```
:::


### 2. Configure SSH

1. Edit SSH config:

```bash
nano /etc/ssh/sshd_config
```

2. Make these settings options:

```ssh
PubkeyAuthentication yes
PermitRootLogin prohibit-password
```

::: info Note
  The `PermitRootLogin` option can be set to `yes`, `without-password`, or `prohibit-password`. For enhanced security, we recommend using `prohibit-password`.
:::

::: danger IMPORTANT!
  Make sure to add your SSH keys to the `~/.ssh/authorized_keys` file before setting `PermitRootLogin` to `prohibit-password`, otherwise you may lock yourself out of the server.
:::

3. Restart SSH:

::: tabs
== Debian / Ubuntu / PopOS

```bash
systemctl restart ssh
````

== CentOS / RHEL / Rocky / Fedora / Arch / openSUSE

```bash
systemctl restart sshd
```

== Alpine Linux

```bash
rc-service sshd restart
```
:::



## Manual Setup

::: info Note
The following steps are handled automatically by the Coolify installation script. Manual configuration is only needed if the automatic setup fails.
:::

### 1. Install OpenSSH Server

::: tabs
== Debian / Ubuntu / PopOS

```bash
apt update && apt install -y openssh-server
systemctl enable --now ssh
```

== CentOS / RHEL / Rocky / Fedora

```bash
dnf install -y openssh-server
systemctl enable --now sshd
```

== SLES/openSUSE

```bash
zypper install -y openssh
systemctl enable --now sshd
```

== Arch Linux

```bash
pacman -Sy --noconfirm openssh
systemctl enable --now sshd
```

== Alpine Linux

```bash
apk add openssh
rc-update add sshd
rc-service sshd start
```
:::

### 2. Configure SSH

1. Edit SSH config:

```bash
nano /etc/ssh/sshd_config
```

2. Make these settings options:

```ssh
PubkeyAuthentication yes
PermitRootLogin prohibit-password
```

::: info Note
  The `PermitRootLogin` option can be set to `yes`, `without-password`, or `prohibit-password`. For enhanced security, we recommend using `prohibit-password`.
:::

::: danger IMPORTANT!
  Make sure to add your SSH keys to the `~/.ssh/authorized_keys` file before setting `PermitRootLogin` to `prohibit-password`, otherwise you may lock yourself out of the server.
:::

3. Restart SSH:

::: tabs
== Debian / Ubuntu / PopOS

```bash
systemctl restart ssh
````

== CentOS / RHEL / Rocky / Fedora / Arch / openSUSE

```bash
systemctl restart sshd
```

== Alpine Linux

```bash
rc-service sshd restart
```
:::

### 3. Generate SSH Key for Coolify

Run the following commands **on the server**:
1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -a 100 \
  -f /data/coolify/ssh/keys/id.root@host.docker.internal \
  -q -N "" -C root@coolify
```

2. Change ownership:

```bash
chown 9999 /data/coolify/ssh/keys/id.root@host.docker.internal
```

### 4. Authorize the Public Key

1. Add public key to `authorized_keys` file:
```bash
mkdir -p ~/.ssh
cat /data/coolify/ssh/keys/id.root@host.docker.internal.pub >> ~/.ssh/authorized_keys
```

2. Change permissions:
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 5. Add private key to Coolify

1. Copy the content of private key:
```bash
# This command will show you the content of the Private key, you have to copy the content manually
cat /data/coolify/ssh/keys/id.root@host.docker.internal
```

2. Login to your Coolify dashboard and Add a new private key
  <ZoomableImage src="/docs/images/knowledge-base/servers/openssh/1.webp" />
  
  On private key input field you have to paste the private key you copied on previous step:
  <ZoomableImage src="/docs/images/knowledge-base/servers/openssh/2.webp" />

3. Navigate to the **Servers** tab and click on the `localhost` server
  <ZoomableImage src="/docs/images/knowledge-base/servers/openssh/3.webp" />

4. Navigate to "Private key" page and select the Private key you added in the previous step.
  <ZoomableImage src="/docs/images/knowledge-base/servers/openssh/4.webp" />

### 6. Validate Server
Navigate to "General" page and Click **Validate Server & Install Docker Engine**.
  <ZoomableImage src="/docs/images/knowledge-base/servers/openssh/5.webp" />

Once finished, you should see a green **Proxy Running** status indicating everything is set up.
  <ZoomableImage src="/docs/images/knowledge-base/servers/openssh/6.webp" />