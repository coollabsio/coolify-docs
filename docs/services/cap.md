---
title: "Cap"
description: "Here you can find the documentation for hosting Cap with Coolify."
---

<ZoomableImage src="/docs/images/services/cap.svg" />

## What is Cap

Cap is the open source alternative to Loom. Lightweight, powerful, and cross-platform. Record and share in seconds.

## How to self-host

There are two storage options: you can store the video data on a remote storage service like S3 or R2, or you can choose the less recommended option of storing it directly on the local VPS (or another VPS) via a MinIO service.

### Option 1: Remote S3-compatible storage (AWS S3, Cloudflare R2, etc.)

Set these environment variables:

- `CAP_AWS_ACCESS_KEY`: Your S3/R2 access key
- `CAP_AWS_SECRET_KEY`: Your S3/R2 secret key  
- `CAP_AWS_BUCKET`: Your S3/R2 bucket name
- `CAP_AWS_REGION`: Your S3/R2 region (e.g., us-east-1, auto for R2)
- `CAP_AWS_ENDPOINT`: Your S3/R2 endpoint URL
- `S3_PUBLIC_ENDPOINT`: Public endpoint for your bucket (same as CAP_AWS_ENDPOINT for most cases)
- `S3_INTERNAL_ENDPOINT`: Internal endpoint (same as CAP_AWS_ENDPOINT for most cases)
- `S3_PATH_STYLE`: true for R2/most S3-compatible, false for AWS S3 virtual-hosted style

### Option 2: Local MinIO storage

Deploy MinIO as a separate service in the same network and set:

- `CAP_AWS_ACCESS_KEY`: MinIO root user
- `CAP_AWS_SECRET_KEY`: MinIO root password
- `CAP_AWS_BUCKET`: Your bucket name (e.g., capso)
- `CAP_AWS_REGION`: us-east-1 (or any region)
- `CAP_AWS_ENDPOINT`: http://minio:9000 (internal MinIO endpoint)
- `S3_PUBLIC_ENDPOINT`: http://your-minio-domain:9000 (public MinIO endpoint)
- `S3_INTERNAL_ENDPOINT`: http://minio:9000 (internal MinIO endpoint)
- `S3_PATH_STYLE`: true

## Screenshots

<ZoomableImage src="/docs/images/services/cap-app.webp" />

## Links

- [The official website ›](https://cap.so/)
- [GitHub ›](https://github.com/CapSoftware/Cap)
