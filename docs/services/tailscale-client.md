---
title: "Tailscale Client"
description: "Connect services securely with Tailscale on Coolify featuring WireGuard VPN, mesh networking, zero-config setup, and encrypted peer-to-peer connections."
---

# Tailscale Client

<ZoomableImage src="/docs/images/services/tailscale-logo.svg" alt="Tailscale Client Logo logo" />

## What is Tailscale Client?

Tailscale securely connects your devices over the internet using WireGuard. It creates a secure mesh network between your devices, servers, and services with zero-configuration required. This client service allows your Coolify deployment to join your Tailscale network.

## Features

- Zero-config WireGuard VPN
- Secure mesh networking
- Encrypted peer-to-peer connections
- Cross-platform support
- Easy device management
- Access control lists
- MagicDNS for easy service discovery

## Links

- [Official Website](https://tailscale.com?utm_source=coolify.io)
- [Documentation](https://tailscale.com/kb?utm_source=coolify.io)
- [GitHub](https://github.com/tailscale/tailscale?utm_source=coolify.io)


## Firewall Considerations

When using Tailscale together with Coolify, special attention must be paid to firewall rules — especially if you restrict SSH (port 22).

Coolify relies on SSH (port 22) to manage deployments, even when communicating with the same host. Blocking port 22 without proper exceptions will break internal functionality.

### Local Firewall (Host Machine)

If you deny incoming traffic on port 22 (`deny all`), you must explicitly allow **internal traffic** from your local Docker or system networks.

Example:

- Allow port 22 from local subnets (Docker / internal interfaces)
- Typical ranges include:

  - `172.16.0.0/12`
  - `192.168.0.0/16`
  - `10.0.0.0/8`

Example rule (conceptual):

```
ALLOW TCP 22 FROM 172.16.0.0/12
ALLOW TCP 22 FROM 192.168.0.0/16
ALLOW TCP 22 FROM 10.0.0.0/8
DENY  TCP 22 FROM ANY
```

Reason:

- Coolify connects to itself via internal networking (Docker bridge or host interfaces)
- Without these rules, self-SSH connections fail


### Remote Server Firewall (Managed Servers)

If Coolify deploys to external servers, similar logic applies:

- You must allow SSH **only from the Coolify host**
  
- Example:
  
```
ALLOW TCP 22 FROM <COOLIFY_SERVER_IP>
DENY  TCP 22 FROM ANY
```

Notes:

- Replace `<COOLIFY_SERVER_IP>` with the public or Tailscale IP of your Coolify instance
- This ensures:

  - Secure restricted SSH access
  - Coolify can still deploy and manage services


### Tailscale Integration Notes

When using Tailscale:

- You can allow SSH via Tailscale IPs instead of public IPs
- Example:

```
ALLOW TCP 22 FROM 100.x.x.x/10
```

Advantages:

- No public exposure of SSH
- Encrypted peer-to-peer communication
- Simplified access control via Tailscale ACLs





