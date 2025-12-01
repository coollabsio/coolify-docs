---
title: Authorization
layout: doc
description: "Learn how to authorize API requests in Coolify with Bearer tokens, scoped permissions, and secure access control."
---

# Authorization
API request requires a `Bearer` token in `Authorization` header, which could be generated from the UI.

## Access

The API can be accesed through `http://<ip>:8000/api`.

With the exception of `/health` and `/feedback`, all routes are additionally prefixed with `/v1` resulting in the base rouce `http://<ip>:8000/api/v1`.

## Generate

1. Go to `Keys & Tokens` / `API tokens`.
2. Define a name for your token and click `Create New Token`.

::: success Tip
  You will see the token once, so make sure to copy it and store it in a safe place.
:::

## Scope

The token will only be able to access resources that are owned by the team that the token is scoped to.

```php
# Sample token
3|WaobqX9tJQshKPuQFHsyApxuOOggg4wOfvGc9xa233c376d7
```

## Permissions

::: warning HEADS UP!
Some API data won't get returned if the API token doesn't have correct permissions
:::

Currently there are three types of permissions:

- read-only `(default)`
- read:sensitive
- view:sensitive
- `*` (all permissions)

### `read-only`

With this permission, you can only read data from the API, but you can't create, update, or delete any resources. Also you can't see sensitive data.

### `read:sensitive`

With this permission, you can only read data from the API and see sensitive information that is normally redacted. You cannot create, update, or delete any resources.

### `view:sensitive`

Without this permission, passwords, api keys, and other sensitive data will be redacted from the API response.

### `*`

Full access to all resources and sensitive data.
