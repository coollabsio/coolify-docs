---
title: Managing Service Applications via API
description: Automate service application management with Coolify's REST API endpoints for listing and updating service applications programmatically.
---

# Managing Service Applications via API

Coolify provides REST API endpoints to programmatically manage service applications, enabling automation and integration with your existing workflows.

## Overview

Two API endpoints allow you to manage service applications:

1. **List Service Applications** - Retrieve all applications within a service
2. **Update Service Application** - Modify application configuration, domains, and proxy settings

These endpoints enable you to automate tasks like domain updates, proxy configuration changes, and service management without using the web interface.

## Prerequisites

Before using these endpoints, you need:

- **API Token**: Generate from `Keys & Tokens` → `API tokens` in the Coolify UI
- **Permissions**:
  - `read` permission for listing applications
  - `write` permission for updating applications
- **Service UUID**: Found in your service URL or via the services API
- **Application UUID**: Obtained from the list applications endpoint

::: tip
Learn more about API authentication and permissions in the [Authorization](/api-reference/authorization) guide.
:::

## List Service Applications

Retrieve all applications within a specific service.

### Endpoint

```
GET /api/v1/services/{service_uuid}/applications
```

### Authentication

Requires a Bearer token with `read` permission.

### Example Request

```bash
curl -X GET "https://coolify.app/api/v1/services/{service-uuid}/applications" \
  -H "Authorization: Bearer {your-token}"
```

### Example Response

```json
[
  {
    "uuid": "app-uuid-123",
    "name": "n8n",
    "human_name": "N8N Workflow Automation",
    "description": "Production workflow automation server",
    "fqdn": "n8n.example.com:5678",
    "image": "docker.n8n.io/n8nio/n8n:latest",
    "status": "running",
    "exclude_from_status": false,
    "is_log_drain_enabled": false,
    "is_gzip_enabled": true,
    "is_stripprefix_enabled": true
  }
]
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the application |
| `name` | string | Application name (internal) |
| `human_name` | string | Human-readable display name |
| `description` | string | Application description |
| `fqdn` | string | Fully qualified domain name(s) with optional port |
| `image` | string | Docker image used by the application |
| `status` | string | Current application status |
| `exclude_from_status` | boolean | Whether to exclude from service status monitoring |
| `is_log_drain_enabled` | boolean | Whether log drain is enabled |
| `is_gzip_enabled` | boolean | Whether gzip compression is enabled in proxy |
| `is_stripprefix_enabled` | boolean | Whether path prefix stripping is enabled in proxy |

## Update Service Application

Modify an application's configuration, including domains, display name, and proxy settings.

### Endpoint

```
PATCH /api/v1/services/{service_uuid}/applications/{app_uuid}
```

### Authentication

Requires a Bearer token with `write` permission.

### Updatable Fields

| Field | Type | Description |
|-------|------|-------------|
| `fqdn` | string | Domain(s) with optional port. Multiple domains comma-separated. |
| `human_name` | string | Human-readable display name |
| `description` | string | Application description |
| `image` | string | Docker image (⚠️ WARNING: may corrupt data) |
| `exclude_from_status` | boolean | Exclude from service status monitoring |
| `is_log_drain_enabled` | boolean | Enable log drain (requires server support) |
| `is_gzip_enabled` | boolean | Enable gzip compression in proxy |
| `is_stripprefix_enabled` | boolean | Enable path prefix stripping in proxy |

::: warning
Only the fields listed above can be updated. Any additional or unknown fields will result in a `422 Validation Error`.
:::

### Update Single Domain

```bash
curl -X PATCH "https://coolify.app/api/v1/services/{service-uuid}/applications/{app-uuid}" \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{"fqdn": "newdomain.example.com:8080"}'
```

### Update Multiple Domains

```bash
curl -X PATCH "https://coolify.app/api/v1/services/{service-uuid}/applications/{app-uuid}" \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{"fqdn": "app1.example.com:8080,app2.example.com:9090"}'
```

### Update Display Name and Proxy Settings

```bash
curl -X PATCH "https://coolify.app/api/v1/services/{service-uuid}/applications/{app-uuid}" \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "human_name": "Production API Server",
    "is_gzip_enabled": false,
    "is_stripprefix_enabled": false
  }'
```

### Clear FQDN

```bash
curl -X PATCH "https://coolify.app/api/v1/services/{service-uuid}/applications/{app-uuid}" \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{"fqdn": ""}'
```

### Example Response

```json
{
  "uuid": "app-uuid-123",
  "name": "n8n",
  "human_name": "Production API Server",
  "description": "Production web application",
  "fqdn": "app.example.com:8080",
  "image": "nginx:latest",
  "exclude_from_status": false,
  "is_log_drain_enabled": false,
  "is_gzip_enabled": false,
  "is_stripprefix_enabled": false,
  "message": "Application updated successfully. Restart the service to apply changes."
}
```

## Features

### FQDN Validation

The API automatically validates and normalizes domain names:

- Validates domain format (supports ports)
- Converts to lowercase
- Removes duplicate domains
- Trims whitespace and commas

**Supported Formats:**
- Single domain: `app.example.com`
- With port: `app.example.com:8080`
- Multiple domains: `app1.example.com,app2.example.com`
- Mixed ports: `app1.example.com:8080,app2.example.com:9090`

### Domain Conflict Detection

Before updating a domain, Coolify checks if it's already in use by another resource. If a conflict is detected, you'll receive a `409 Conflict` response with details about the existing resource.

### Auto-Regeneration

When certain fields are modified, Coolify automatically regenerates the docker-compose configuration:

- `fqdn`
- `human_name`
- `image`
- `is_gzip_enabled`
- `is_stripprefix_enabled`

::: danger Service Restart Required
Configuration changes do not take effect immediately. You **must restart the service** for changes to apply.

Use the service restart endpoint:
```bash
POST /api/v1/services/{service_uuid}/restart
```
:::

## Error Responses

### 401 Unauthorized

Invalid or missing API token.

```json
{
  "message": "Unauthenticated."
}
```

### 404 Not Found

Service or application not found.

```json
{
  "message": "Service not found."
}
```

or

```json
{
  "message": "Application not found."
}
```

### 409 Conflict

Domain already in use by another resource.

```json
{
  "message": "Domain conflict detected. The domain is already in use by another resource.",
  "conflicts": [
    {
      "fqdn": "app.example.com:8080",
      "resource_type": "application",
      "resource_uuid": "other-app-uuid"
    }
  ]
}
```

### 422 Validation Error

Invalid field values or unknown fields.

```json
{
  "message": "Validation failed.",
  "errors": {
    "fqdn": ["The provided domain format is invalid."],
    "invalid_field": ["This field is not allowed."]
  }
}
```

**Log Drain Error:**

```json
{
  "message": "Log drain is not enabled on the server.",
  "errors": {
    "is_log_drain_enabled": [
      "Log drain must be enabled on the server before enabling it on the application."
    ]
  }
}
```

## Best Practices

### 1. Always Restart After Updates

Changes to service applications require a service restart to take effect. Plan your updates accordingly and restart the service after making changes.

### 2. Check for Domain Conflicts

Before updating domains, verify they're not already in use. The API will reject conflicting domains with a `409` error.

### 3. Use Log Drain Carefully

Log drain requires server-level support. Ensure your server has log drain enabled before enabling it on individual applications.

### 4. Be Cautious with Image Updates

⚠️ Changing the Docker image can corrupt application data if the new image is incompatible. Only update images if you understand the implications and have backups.

### 5. Test in Development First

Always test configuration changes in a development environment before applying them to production services.

### 6. Field Whitelisting

Only the 8 documented fields can be updated. Attempting to modify other fields will result in a validation error. This is a security feature to prevent unintended changes.

## Use Cases

### Automated Domain Management

Script domain updates across multiple services when migrating infrastructure or reorganizing your deployment structure.

### CI/CD Integration

Integrate service application management into your deployment pipelines, automatically updating configurations as part of your release process.

### Monitoring Integration

Exclude specific applications from status monitoring during maintenance windows or for applications with known issues.

### Proxy Configuration Management

Centrally manage proxy settings like gzip compression and path prefix stripping across all your service applications.

## Example Workflow

Here's a complete workflow for updating a service application:

```bash
# 1. List all applications in a service
APPS=$(curl -s -X GET "https://coolify.app/api/v1/services/{service-uuid}/applications" \
  -H "Authorization: Bearer {your-token}")

echo "$APPS" | jq '.'

# 2. Extract the application UUID you want to update
APP_UUID=$(echo "$APPS" | jq -r '.[0].uuid')

# 3. Update the application
curl -X PATCH "https://coolify.app/api/v1/services/{service-uuid}/applications/${APP_UUID}" \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "fqdn": "new-domain.example.com",
    "human_name": "Updated Application Name",
    "is_gzip_enabled": true
  }'

# 4. Restart the service to apply changes
curl -X POST "https://coolify.app/api/v1/services/{service-uuid}/restart" \
  -H "Authorization: Bearer {your-token}"
```

## Additional Resources

- [API Authorization Guide](/api-reference/authorization)
- [Complete API Reference](/api-reference/api)
- [Services Overview](/services/introduction)
