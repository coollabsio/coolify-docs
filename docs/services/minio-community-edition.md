---
title: "MinIO"
description: "Host MinIO object storage on Coolify as S3-compatible high-performance storage for backups, data lakes, and cloud-native application storage."
---

# MinIO Community Edition
![MinIO](/images/services/minio-logo.svg)

::: danger SERVICE REMOVED FROM COOLIFY
This service has been removed from Coolify’s one-click service catalog because it is no longer maintained by its original author.

The community-maintained MinIO service on Coolify was an effort by the Coolify team to automatically build Docker images and publish them to both GitHub Container Registry and Docker Hub, using the official MinIO codebase on GitHub as the source.

However, since the original upstream repository is no longer actively maintained, this community service will not receive any further updates.
:::

## What is MinIO?
MinIO is a high-performance, distributed object storage system compatible with Amazon S3 APIs. It is software-defined, runs on industry-standard hardware, and is 100% open source under the AGPL v3.0 license. MinIO delivers high-performance, Kubernetes-native object storage that is designed for large scale AI/ML, data lake and database workloads.

## Links

- [The official website](https://min.io?utm_source=coolify.io)
- [MinIO GitHub](https://github.com/minio/minio?utm_source=coolify.io)
- [Community Edition Github](https://github.com/coollabsio/minio?utm_source=coolify.io)

## FAQ

### Invalid login credentials

You need to run MinIO on `https` (not self-signed) to avoid this issue. MinIO doesn't support http based authentication.
