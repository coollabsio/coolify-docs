---
title: "Webhook Payloads"
description: "Reference for all Coolify webhook notification payloads, including application deployments, database backups, scheduled tasks, Docker cleanup, server events, and container events."
---

# Webhook Payloads

This page documents the JSON payload structure for every event Coolify sends to your [webhook notification endpoint](/knowledge-base/notifications#webhook).

All events are delivered as `HTTP POST` requests with a `Content-Type: application/json` header. Every payload includes at minimum:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | `true` for success events, `false` for failure/alert events |
| `event` | string | Machine-readable event identifier |
| `message` | string | Human-readable description of the event |

---

## Application

### `deployment_success`

Sent when an application deployment completes successfully.

```json
{
  "success": true,
  "event": "deployment_success",
  "message": "New version successfully deployed",
  "application_name": "my-app",
  "application_uuid": "...",
  "deployment_uuid": "...",
  "deployment_url": "...",
  "project": "...",
  "environment": "...",
  "fqdn": "..."
}
```

::: info Pull Request Previews
For PR preview deployments, `fqdn` is omitted and the following fields are included instead:

```json
{
  "pull_request_id": 123,
  "preview_fqdn": "..."
}
```
:::

### `deployment_failed`

Sent when an application deployment fails.

```json
{
  "success": false,
  "event": "deployment_failed",
  "message": "Deployment failed",
  "application_name": "my-app",
  "application_uuid": "...",
  "deployment_uuid": "...",
  "deployment_url": "...",
  "project": "...",
  "environment": "...",
  "fqdn": "..."
}
```

Same structure as `deployment_success`, with `"success": false`. PR preview fields apply in the same way.

### `status_changed`

Sent when an application stops unexpectedly (not via a manual stop).

```json
{
  "success": false,
  "event": "status_changed",
  "message": "Application stopped",
  "application_name": "my-app",
  "application_uuid": "...",
  "project": "...",
  "environment": "...",
  "fqdn": "...",
  "url": "..."
}
```

---

## Database Backups

### `backup_success`

Sent when a database backup completes successfully.

```json
{
  "success": true,
  "event": "backup_success",
  "message": "Database backup successful",
  "database_name": "...",
  "database_uuid": "...",
  "database_type": "...",
  "frequency": "...",
  "url": "..."
}
```

### `backup_failed`

Sent when a database backup fails.

```json
{
  "success": false,
  "event": "backup_failed",
  "message": "Database backup failed",
  "database_name": "...",
  "database_uuid": "...",
  "database_type": "...",
  "frequency": "...",
  "error_output": "...",
  "url": "..."
}
```

### `backup_success_with_s3_warning`

Sent when the local backup succeeds but uploading to S3 fails.

```json
{
  "success": true,
  "event": "backup_success_with_s3_warning",
  "message": "Database backup succeeded locally, S3 upload failed",
  "database_name": "...",
  "database_uuid": "...",
  "database_type": "...",
  "frequency": "...",
  "s3_error": "...",
  "s3_storage_url": "...",
  "url": "..."
}
```

::: info
`s3_storage_url` is only present when the S3 storage URL is available.
:::

---

## Scheduled Tasks

### `task_success`

Sent when a scheduled task completes successfully.

```json
{
  "success": true,
  "event": "task_success",
  "message": "Scheduled task succeeded",
  "task_name": "...",
  "task_uuid": "...",
  "output": "...",
  "application_uuid": "...",
  "url": "..."
}
```

### `task_failed`

Sent when a scheduled task fails.

```json
{
  "success": false,
  "event": "task_failed",
  "message": "Scheduled task failed",
  "task_name": "...",
  "task_uuid": "...",
  "output": "...",
  "application_uuid": "...",
  "url": "..."
}
```

::: info
`application_uuid` is included for application-level tasks. For service-level tasks, `service_uuid` is included instead. `url` is only present when available.
:::

---

## Docker Cleanup

### `docker_cleanup_success`

Sent when a Docker cleanup job completes successfully.

```json
{
  "success": true,
  "event": "docker_cleanup_success",
  "message": "Docker cleanup job succeeded",
  "server_name": "...",
  "server_uuid": "...",
  "cleanup_message": "...",
  "url": "..."
}
```

### `docker_cleanup_failed`

Sent when a Docker cleanup job fails.

```json
{
  "success": false,
  "event": "docker_cleanup_failed",
  "message": "Docker cleanup job failed",
  "server_name": "...",
  "server_uuid": "...",
  "error_message": "...",
  "url": "..."
}
```

---

## Server

### `server_reachable`

Sent when a previously unreachable server becomes reachable again.

```json
{
  "success": true,
  "event": "server_reachable",
  "message": "Server revived",
  "server_name": "...",
  "server_uuid": "...",
  "url": "..."
}
```

### `server_unreachable`

Sent when Coolify cannot reach a server.

```json
{
  "success": false,
  "event": "server_unreachable",
  "message": "Server unreachable",
  "server_name": "...",
  "server_uuid": "...",
  "url": "..."
}
```

### `high_disk_usage`

Sent when disk usage on a server exceeds the configured threshold.

```json
{
  "success": false,
  "event": "high_disk_usage",
  "message": "High disk usage detected",
  "server_name": "...",
  "server_uuid": "...",
  "disk_usage": 85,
  "threshold": 80,
  "url": "..."
}
```

`disk_usage` and `threshold` are integer percentages.

### `server_patch_check`

Sent when available OS patches are detected on a server.

```json
{
  "success": false,
  "event": "server_patch_check",
  "message": "Server patches available",
  "server_name": "...",
  "server_uuid": "...",
  "total_updates": 12,
  "os_id": "ubuntu",
  "package_manager": "apt",
  "updates": [...],
  "critical_packages_count": 2,
  "url": "..."
}
```

::: info Error variant
If the patch check itself fails, the event is `server_patch_check_error` and an `"error": "..."` field is included instead of the update fields.
:::

### `traefik_version_outdated`

Sent when one or more servers are running an outdated version of the Traefik proxy.

```json
{
  "success": false,
  "event": "traefik_version_outdated",
  "message": "Traefik proxy outdated",
  "affected_servers_count": 1,
  "servers": [
    {
      "name": "...",
      "uuid": "...",
      "current_version": "v3.1.0",
      "latest_version": "v3.1.4",
      "update_type": "patch_update",
      "upgrade_target": "v3.2",
      "newer_branch_target": "...",
      "newer_branch_latest": "..."
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `update_type` | `patch_update` or `minor_upgrade` |
| `upgrade_target` | Target minor version — only present for `minor_upgrade` |
| `newer_branch_target` / `newer_branch_latest` | Present when a newer major/minor branch is available |

---

## Container

### `container_stopped`

Sent when a container stops unexpectedly (not via a manual stop action).

```json
{
  "success": false,
  "event": "container_stopped",
  "message": "Resource stopped unexpectedly",
  "container_name": "...",
  "server_name": "...",
  "server_uuid": "...",
  "url": "..."
}
```

### `container_restarted`

Sent when a container is automatically restarted by Coolify.

```json
{
  "success": true,
  "event": "container_restarted",
  "message": "Resource restarted automatically",
  "container_name": "...",
  "server_name": "...",
  "server_uuid": "...",
  "url": "..."
}
```

::: info
`url` is only present when available.
:::

---

## Test

### `test`

Sent when you click **Send Test Notification** in the Coolify dashboard.

```json
{
  "success": true,
  "event": "test",
  "message": "This is a test webhook notification from Coolify.",
  "url": "..."
}
```
