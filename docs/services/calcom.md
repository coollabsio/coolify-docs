---
title: Calcom
description: "Host Cal.com scheduling platform on Coolify with calendar integration, team booking, payment processing, and customizable appointment workflows."
---

# Calcom

<ZoomableImage src="/docs/images/services/calcom.png" alt="Calcom dashboard" />

## What is Calcom

Scheduling infrastructure for everyone.

## Deploying on x86 (amd64)

You need to change default docker compose to the following to make cal.com work on x86 (amd64):

```yaml
services:
  calcom:
    image: 'calcom/cal.com:<VERSION compatible with amd64>
    platform: linux/amd64
    (... same ...)
```

You can check the latest amd64 compatible version [here](https://hub.docker.com/r/calcom/cal.com/tags).

Example:

```yaml
services:
  calcom:
    image: 'calcom/cal.com:v5.9.0
    platform: linux/amd64
    (... same ...)
```

## Links

- [Official Documentation](https://cal.com/docs/developing/introduction?utm_source=coolify.io)
