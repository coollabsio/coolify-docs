---
title: "Certificate Resolver Not Found on Coolify Proxy"
---


# Certificate Resolver Not Found on Coolify Proxy
If you see the error message `Cert resolver doesn't exist letsencrypt` in the Coolify proxy logs, it typically means that your domain is missing an SSL certificate. This issue often occurs when Coolify is using a non-root user account.


## Symptoms
- The Coolify proxy doesn't generate an SSL certificate for your domain.
- The error `Cert resolver doesn't exist letsencrypt` appears in the Coolify proxy logs.


## Diagnosis
To troubleshoot, check the permissions of the `acme.json` file in the `/data/coolify/proxy` directory by running the following command:

```sh
ls /data/coolify/proxy
```

The output should look something like this:

```sh
-rwxr-x--- 1 shadowarcanist shadowarcanist 32757 Sep  3 15:39 acme.json
-rwxr-x--- 1 shadowarcanist shadowarcanist  1762 Sep  3 18:36 docker-compose.yml
drwxr-x--- 2 shadowarcanist shadowarcanist  4096 Sep  3 15:06 dynamic
```

## Root Cause
When using Coolify with a non-root user account, permissions on the `/data/coolify` directory may not be set correctly. 

If the permissions on the `acme.json` file are **too relaxed** (too open), traefik will refuse to use the file. This prevents Traefik from accessing the file and generating SSL certificates.

On the other hand, if permissions are **too strict**, Traefik won’t be able to read or write to the file either. 

Traefik requires the `acme.json` file to have the right level of permission to work properly.


## Solution
To fix this, run the following command to set the correct permissions:

```sh
sudo chmod 600 /data/coolify/proxy/acme.json
```

### What Does `sudo chmod 600` Do?
The `chmod 600` command changes the file permissions of `/data/coolify/proxy/acme.json` so that only the owner of the file (the user account used by Coolify) can read and write to it. This prevents anyone else from accessing or modifying the file while still allowing Traefik to use it.