---
title: "MinIO"
description: "Host MinIO object storage on Coolify as S3-compatible high-performance storage for backups, data lakes, and cloud-native application storage."
---

# MinIO Community Edition
![MinIO](/images/services/minio-logo.svg)

::: info NOTE 
MinIO team stopped providing pre-built Docker images for new releases, [this repository](https://github.com/coollabsio/minio) by Coolify team automatically builds and publishes them to both GitHub Container Registry and Docker Hub based on MinIO official codebase on [GitHub](https://github.com/minio/minio?utm_source=coolify.io)

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
