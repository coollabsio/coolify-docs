---
title: "MinIO"
description: "Host MinIO object storage on Coolify as S3-compatible high-performance storage for backups, data lakes, and cloud-native application storage."
---

# MinIO Community Edition

![MinIO](/images/services/minio-logo.svg)

::: danger SERVICE REMOVED FROM COOLIFY
This service has been removed from Coolify’s one-click service catalog because it no longer receives official Docker images and is currently in maintenance mode by the original author. You can find more information about the project’s maintenance status [here](https://github.com/minio/minio?tab=readme-ov-file#maintenance-mode)

The last Docker image published by the original author does not include a fix for the following security vulnerability: https://github.com/minio/minio/security/advisories/GHSA-jjjj-jwhf-8rgr

We recommend using the **Community-maintained MinIO service on Coolify**, which provides automated Docker builds based on the official MinIO codebase. You can learn more about using the Community version [here](/services/minio-community-edition)
:::

## What is MinIO?

MinIO is a high-performance, distributed object storage system compatible with Amazon S3 APIs. It is software-defined, runs on industry-standard hardware, and is 100% open source under the AGPL v3.0 license. MinIO delivers high-performance, Kubernetes-native object storage that is designed for large scale AI/ML, data lake and database workloads.

## Links

- [The official website](https://min.io?utm_source=coolify.io)
- [Documentation](https://min.io/docs/minio/linux/index.html?utm_source=coolify.io)
- [GitHub](https://github.com/minio/minio?utm_source=coolify.io)
- [Community Edition Info](https://github.com/coollabsio/minio?utm_source=coolify.io)

## FAQ

### Invalid login credentials

You need to run MinIO on `https` (not self-signed) to avoid this issue. MinIO doesn't support http based authentication.
