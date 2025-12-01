---
title: "Introduction"
description: "Configure S3-compatible storage for Coolify backups including AWS, DigitalOcean Spaces, MinIO, Cloudflare R2, Backblaze B2, and Scaleway Object Storage."
---

# S3 Introduction
Currently supported S3 compatible storages are:

- AWS (see [the AWS guide](/knowledge-base/s3/aws) for a detailed walkthrough)
- DigitalOcean Spaces
- MinIO
- Cloudflare's R2
- Backblaze B2
- Scaleway Object Storage
- Hetzner S3 Storage (beta)
- Wasabi hot cloud storage
- Vultr
- CloudPe Object Storage

Other's could work, but not tested yet. If you test it, please let us know.

## S3 Client

Coolify uses MinIO's client, called [`mc`](https://min.io/docs/minio/linux/reference/minio-mc.html), to copy the backup files to your S3 compatible storage.

## Verification

To be able to use your S3 compatible storage, you need to verify it first. Verification done with `ListObjectsV2` request to your specified bucket.

So you need to create a bucket first, and then you can verify it.
