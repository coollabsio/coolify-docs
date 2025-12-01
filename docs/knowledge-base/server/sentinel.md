---
title: "Sentinel and Metrics"
description: "Monitor server and container CPU and RAM usage with Coolify's lightweight Sentinel container providing Linux API and resource metrics collection."
---

# Sentinel and Metrics

::: danger CAUTION
**This is an experimental feature.**
:::

# Sentinel Overview

[Sentinel](https://github.com/coollabsio/sentinel) is an open-source lightweight container that provides:
- Linux system API
- Server resource monitoring (CPU, RAM usage for now)
- Container resource monitoring (CPU, RAM usage for now)

## Screenshot

<ZoomableImage src="/docs/images/screenshots/sentinel.webp" alt="Sentinel configuration" />

## Configuration

### Enable Sentinel

1. Navigate to `Servers` > `<YOUR_SERVER>` > `Configurations` > `General`
2. Find the `Sentinel` section
3. Toggle `Enable Sentinel`
4. Wait a few moments for the container to be downloaded and start.

### Enable Metrics (Optional)

In the same section, you can enable metrics. Once enabled, you will be able to view the following metrics:
- CPU usage
- Memory consumption (RAM Usage)

::: info Note
Metrics collection is currently NOT available for Docker Compose and Service Template based deployments.
:::

## Viewing Metrics

### Server Metrics
Access server-wide metrics at:

`Servers` > `<YOUR_SERVER>` > `Configurations` > `Metrics`

### Container Metrics
View individual container metrics:
1. Navigate to the specific resource
2. Go to the `Configurations` tab
3. Select the `Metrics` tab

