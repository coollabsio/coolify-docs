---
title: "Supabase Storage"
description: "Configure Supabase Storage as an S3-compatible backup destination for Coolify using your project endpoint, bucket, region, and access keys."
---

# Supabase Storage

Supabase Storage exposes an S3-compatible endpoint that you can use with Coolify backups.

::: info Note
This guide is for using a Supabase project as a remote S3 storage endpoint for Coolify backups. It is different from self-hosting the [Supabase service](/services/supabase) on Coolify.
:::

## Configuration

1. In Supabase, create the bucket you want to use for backups.
2. Open your project and go to **Storage** -> **S3 Configuration**.
3. Create a new access key pair.
   ::: success Tip
   Save the `Access Key ID` and `Secret Access Key` somewhere safe.
   :::
4. Copy your S3 endpoint.
   - Preferred: `https://<project-ref>.storage.supabase.co/storage/v1/s3`
   - Fallback: `https://<project-ref>.supabase.co/storage/v1/s3`
5. Note your project region from the Supabase dashboard.
6. In Coolify, go to **Storage** and click **Add**.
7. Fill in the fields with the values from Supabase:
   - **Endpoint**: your Supabase S3 endpoint
   - **Bucket**: the bucket you created in Supabase
   - **Region**: your Supabase project region
   - **Access Key**: your `Access Key ID`
   - **Secret Key**: your `Secret Access Key`
8. Click **Validate Connection & Continue**.

::: warning Important
Use the endpoint exactly as provided by Supabase and keep the `/storage/v1/s3` suffix. Do not append the bucket name to the endpoint.
:::

## Verification

Coolify verifies the connection with a `ListObjectsV2` request, so the bucket must already exist before you validate it.

Supabase Storage is S3-compatible, but it does not support every AWS S3 feature. For Coolify backups, the endpoint, bucket, region, and access keys above are the important values.
