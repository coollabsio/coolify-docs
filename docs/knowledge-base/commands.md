---
title: Commands
description: "Essential Coolify CLI commands for root password reset, email changes, and deleting stuck services via Docker exec and Artisan commands."
---

# Commands
## Root password reset without SMTP
You can use the following method to reset the root user's password, in case you forgot and do not have an SMTP server set, so you cannot request a forgot password.

Login to your server through SSH and execute the following command:

```bash
docker exec -ti coolify sh -c "php artisan root:reset-password"
```

## Root email change
You can change root user's email.

Login to your server through SSH and execute the following command:

```bash
docker exec -ti coolify sh -c "php artisan root:change-email"
```

## Delete a stuck service
 You can easily delete a stuck service.
 
  Login to your server through SSH and execute the following command:

```bash
docker exec -ti coolify sh -c "php artisan services:delete"
```

