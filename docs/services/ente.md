---
title: "Ente"
description: "Here you can find the documentation for hosting Ente with Coolify."
---

# Ente

![Ente](/images/services/ente-logo.webp)

## What is Ente?

Ente is a service that provides a fully open-source, end-to-end encrypted platform for you to store your data in the cloud without needing to trust the service provider. On top of the platform, Ente has built two apps so far: Ente Photos (an alternative to Apple and Google Photos) and Ente Auth (a 2FA alternative to the deprecated Authy).

Learn more at [help.ente.io](https://help.ente.io/).

## Configuring Object Store

- Once you have selected your service. You will need to set up of some environment variables for your S3 bucket or substitute like MinIO.

### 1. Remote S3 bucket

- For AWS S3 you can create a bucket and allow access via IAM Roles/User Permissions. Which will generate an access key and secrect key for your S3 Bucket.

- For the S3 bucket, apply the following CORS policy for proper access control from the museum service.

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
    "MaxAgeSeconds": 3000,
    "ExposeHeaders": ["Etag"]
  }
]
```

- Fill the credentials like `endpoint`, `region`, `bucket`, `access key`, `secret key`.

- Deploy the Service and you are good to go.

### 2. Coolify minio bucket.

- Minio is expected to be exposed over HTTPS and needs SSL/TLS, so make sure your proxies are setup properly. Here is a useful [link](https://selfhostschool.com/minio-self-hosted-s3-storage-guide/) for set up and configuration.

- Once you have deployed the Minio service from Coolify you can login to the service from the console URL and use the same username and password as set in the environment variables user the API URL for backend or shell based usecases.

```bash
# Set Alias
mc alias set <alias> <API_ENDPOINT> <ACCESS_KEY> <SECRET_KEY>

# List buckets (same us used in coolify to validate S3)
minio/mc ls myminio
```

- Once logged in, create a bucket for your use in Ente.

- The default region for Minio is `us-east-1`, so you can use the same.

- Use the API endpoint as bucket endpoint for Ente config.

**Note**: Additional details are available [here](https://help.ente.io/self-hosting/administration/object-storage).

## Environment Variables

| Variable Name                         | Service  | Description                                                                                 | Default Value      | Required | Prefilled |
| ------------------------------------- | -------- | ------------------------------------------------------------------------------------------- | ------------------ | -------- | --------- |
| `SERVICE_URL_MUSEUM_8080`             | museum   | URL for the museum service on port 8080                                                     | -                  | Yes      | Yes       |
| `ENTE_HTTP_USE_TLS`                   | museum   | Enable/disable TLS for HTTP connections                                                     | `false`            | No       | Yes       |
| `SERVICE_URL_WEB_3002`                | museum   | URL for the web albums service                                                              | -                  | Yes      | Yes       |
| `SERVICE_URL_WEB_3004`                | museum   | URL for the web cast service                                                                | -                  | Yes      | Yes       |
| `SERVICE_URL_WEB_3001`                | museum   | URL for the web accounts service                                                            | -                  | Yes      | Yes       |
| `ENTE_DB_HOST`                        | museum   | PostgreSQL database host                                                                    | `postgres`         | No       | Yes       |
| `ENTE_DB_PORT`                        | museum   | PostgreSQL database port                                                                    | `5432`             | No       | Yes       |
| `ENTE_DB_NAME`                        | museum   | PostgreSQL database name                                                                    | `ente_db`          | No       | Yes       |
| `SERVICE_USER_POSTGRES`               | museum   | PostgreSQL database username                                                                | `pguser`           | No       | Yes       |
| `SERVICE_PASSWORD_POSTGRES`           | museum   | PostgreSQL database password                                                                | -                  | Yes      | Yes       |
| `SERVICE_REALBASE64_ENCRYPTION`       | museum   | Base64 encoded encryption key                                                               | -                  | Yes      | Yes       |
| `SERVICE_REALBASE64_64_HASH`          | museum   | Base64 encoded hash key                                                                     | -                  | Yes      | Yes       |
| `SERVICE_REALBASE64_JWT`              | museum   | Base64 encoded JWT secret                                                                   | -                  | Yes      | Yes       |
| `ENTE_INTERNAL_ADMIN`                 | museum   | Internal admin user ID                                                                      | `1580559962386438` | No       | Yes       |
| `ENTE_INTERNAL_DISABLE_REGISTRATION`  | museum   | Disable user registration                                                                   | `false`            | No       | Yes       |
| `PRIMARY_STORAGE_ARE_LOCAL_BUCKETS`   | museum   | Use local buckets for primary storage (false unless you are connecting to bucket over http) | `false`            | No       | Yes       |
| `PRIMARY_STORAGE_USE_PATH_STYLE_URLS` | museum   | Use path-style URLs for storage                                                             | `true`             | No       | Yes       |
| `S3_STORAGE_KEY`                      | museum   | S3 storage access key                                                                       | -                  | Yes      | No        |
| `S3_STORAGE_SECRET`                   | museum   | S3 storage secret key                                                                       | -                  | Yes      | No        |
| `S3_STORAGE_ENDPOINT`                 | museum   | S3 storage endpoint URL                                                                     | -                  | Yes      | No        |
| `S3_STORAGE_REGION`                   | museum   | S3 storage region                                                                           | `us-east-1`        | No       | Yes       |
| `S3_STORAGE_BUCKET`                   | museum   | S3 storage bucket name                                                                      | -                  | Yes      | No        |
| `SERVICE_URL_WEB_3000`                | web      | URL for the main web service                                                                | -                  | Yes      | Yes       |
| `SERVICE_URL_MUSEUM`                  | web      | URL for the museum service                                                                  | -                  | Yes      | Yes       |
| `SERVICE_URL_WEB_3002`                | web      | URL for the albums service                                                                  | -                  | Yes      | Yes       |
| `SERVICE_USER_POSTGRES`               | postgres | PostgreSQL username                                                                         | `pguser`           | No       | Yes       |
| `SERVICE_PASSWORD_POSTGRES`           | postgres | PostgreSQL password                                                                         | -                  | Yes      | Yes       |
| `SERVICE_DB_NAME`                     | postgres | PostgreSQL database name                                                                    | `ente_db`          | No       | Yes       |

## Links

- [The official website ›](https://ente.io?utm_source=coolify.io)
- [Documentation ›](https://help.ente.io?utm_source=coolify.io)
- [GitHub ›](https://github.com/ente-io/ente?utm_source=coolify.io)
