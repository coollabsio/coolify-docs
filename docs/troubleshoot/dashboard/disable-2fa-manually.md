---
title: Disable 2FA Manually
description: Manually disable two-factor authentication in Coolify using SSH, Docker exec, and Laravel Tinker commands when you've lost your 2FA device or codes.
---

# Disable 2FA Manually

If you have lost your 2FA device or have any other issues, you can disable 2FA manually if you have access to your server.

## 1. Login to your server through SSH

```bash
ssh your-server-ip
```

## 2. Run the following command to go into coolify container

```bash
docker exec -it coolify sh
```

## 3. Go into Tinker

```bash
php artisan tinker
```

## 4. Find your user id

> In case of `root` user, you must use `0` as user id.


> So `$user_id = 0`;


> For every other user, use the below command to get the user id.

```php
$user_id = User::whereEmail('your-email')->first()->id;
```

## 5. Disable 2FA

```php
User::find($user_id)->update([
  'two_factor_secret' => null,
  'two_factor_recovery_codes' => null,
  'two_factor_confirmed_at' => null
]);
```