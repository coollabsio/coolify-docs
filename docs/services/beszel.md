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
- Copy the key from the modal in the `KEY` environnement variable in Beszel's docker-compose env section (Edit Docker Compose button of Beszel service in Coolify UI)

<ZoomableImage src="/docs/images/services/beszel_doc_1.webp" alt="Beszel dashboard" />
<ZoomableImage src="/docs/images/services/beszel_doc_2.webp" alt="Beszel dashboard" />

## Links

- [GitHub](https://github.com/henrygd/beszel)
