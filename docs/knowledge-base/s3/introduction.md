---
title: "Introduction"
description: "A guide how to configure S3 compatible storage for Coolify."
---

# S3 Introduction
Currently supported S3 compatible storages are:

- AWS (see [the AWS guide](/knowledge-base/s3/aws) for a detailed walkthrough)
- DigitalOcean Spaces
- MinIO
- Cloudflare's R2
- Backblaze B2
- Scaleway Object Storage
- Hetzner Object Storage (beta)
- Wasabi hot cloud storage
- Vultr

Other's could work, but not tested yet. If you test it, please let us know.

## S3 Client

Coolify uses MinIO's client, called [`mc`](https://min.io/docs/minio/linux/reference/minio-mc.html), to copy the backup files to your S3 compatible storage.

## Verification

To be able to use your S3 compatible storage, you need to verify it first. Verification done with `ListObjectsV2` request to your specified bucket.

So you need to create a bucket first, and then you can verify it.

## Detailed configurations

### Hetzner Object Storage

<img width="1771" height="338" alt="brave_rzc7S6G24B" src="https://github.com/user-attachments/assets/576b07b1-6daa-48e7-a777-452bb6413f81" />

#### Endpoint
In my example; the endpoint is: `nbg1.your-objectstorage.com`. To make it work in Coolify; I simply specified the protocol (*https://*) and the port (*:443*):
- `**https://nbg1.your-objectstorage.com:**443`

#### Region
In my example; the region is:
- `eu-central`  
**NB**: no -1
