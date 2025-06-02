---

title: "Introduction"
description: "A guide on how to configure S3-compatible storage for Coolify."

---

# S3 Introduction

Currently supported S3-compatible storage providers are:

* AWS (see [the AWS guide](/knowledge-base/s3/aws) for a detailed walkthrough)
* DigitalOcean Spaces
* MinIO
* Cloudflare R2
* Backblaze B2
* Scaleway Object Storage
* Hetzner S3 Storage (beta)
* Wasabi Hot Cloud Storage
* IDrive e2 *(Offers a free plan. Great if you don't want to spend money, but be cautious — the security of your data is uncertain.)*

Other providers may work, but they haven't been tested yet. If you try one, please let us know.

## S3 Client

Coolify uses MinIO's client, called [`mc`](https://min.io/docs/minio/linux/reference/minio-mc.html), to copy backup files to your S3-compatible storage.

## Verification

To use your S3-compatible storage, you need to verify it first.
Verification is done using a `ListObjectsV2` request to your specified bucket.

So, you need to create a bucket first — then you can proceed with verification.
