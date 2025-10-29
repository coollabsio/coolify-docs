---
title: Server Validation Issues
description: Resolve Coolify server validation errors by verifying SSH private key format includes BEGIN and END OPENSSH PRIVATE KEY headers to fix libcrypto errors.
---

# Server Validation Issues

You cannot validate your server because of a validation error. 

## Symptoms
- During validation you receive a `error in libcrypto` error.

## Solution
Check your private key added to Coolify if it is correct, it is probably missing a few things, like `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`.
