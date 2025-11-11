---
title: "Beszel"
description: "Deploy Beszel lightweight server monitoring on Coolify with real-time metrics, Docker stats, and minimal resource usage for infrastructure tracking."
---

<ZoomableImage src="/docs/images/services/beszel.svg" alt="Beszel dashboard" />

## What is Beszel?

Lightweight server monitoring hub with historical data, docker stats, and alerts.

## Setup

- Deploy Beszel using Coolify template
- In the UI, `Add a new System`
- Enter `beszel-agent` in Host/IP
- Copy the public Key to `KEY` env variable and token to `TOKEN` variable in Beszel's project environment variables (These are obtained from Beszel UI when adding a new system)

## Links

- [GitHub](https://github.com/henrygd/beszel)
