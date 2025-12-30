---
title: "Sonatype Nexus"
description: "Run Nexus Repository on Coolify for artifact management, Docker registry, npm, Maven, PyPI package hosting, and DevOps dependency storage."
---

<ZoomableImage src="/docs/images/services/nexus0.webp" alt="Nexus dashboard" />

## What is Sonatype Nexus

Sonatype Nexus is a repository manager that allows you to store, manage, and distribute your software artifacts. It supports multiple package formats including Maven, npm, Docker, PyPI, and more.

## Versions Available

Coolify offers two versions of Nexus:

- **Nexus (Standard)**: The official x86_64 architecture version
- **Nexus ARM**: Community Edition for ARM64 architecture, maintained and synced with the official repository

## Setup

- The setup relies on starting as default user "admin" with password "admin123".
- Once the service is running, login with the default credentials and change the password.
- After that, delete `NEXUS_SECURITY_RANDOMPASSWORD=false` line from the compose file and restart the service to apply the changes.

Minimum requirements:

- 4 vCPU
- 3 GB RAM

## Screenshots

<ZoomableImage src="/docs/images/services/nexus1.webp" alt="Nexus dashboard" />
<ZoomableImage src="/docs/images/services/nexus2.webp" alt="Nexus dashboard" />

## Links

- [The official website](https://help.sonatype.com/en/sonatype-nexus-repository.html?utm_source=coolify.io)
- [GitHub](https://github.com/sonatype/docker-nexus3?utm_source=coolify.io)
