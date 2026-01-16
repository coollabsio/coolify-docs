---
title: "WordPress"
description: "Run WordPress on Coolify for blogging, CMS, e-commerce with plugins, themes, and world's most popular website building platform."
---

![WordPress](https://raw.githubusercontent.com/logo/wordpress/caefc9aa315eafcf8687804564a11a9c5a77a561/images/logo.svg)

## What is WordPress?

WordPress is a free and open-source content management system written in PHP and paired with a MySQL/MariaDB database.
It is used for creating websites, blogs, and applications.

## Deployment Variants

WordPress is available in two deployment configurations in Coolify:

### WordPress with MariaDB
- **Database:** MariaDB
- **Use case:** Production deployments with MariaDB preference (recommended for most users)
- **Components:**
  - WordPress container
  - MariaDB container
  - Automatic database configuration and health checks

### WordPress with MySQL
- **Database:** MySQL
- **Use case:** Production deployments with MySQL preference
- **Components:**
  - WordPress container
  - MySQL container
  - Automatic database configuration and health checks

Both variants provide equivalent functionality - choose based on your database preference or existing infrastructure.

## Links

- [The official website](https://wordpress.org)
- [GitHub](https://github.com/WordPress/WordPress)

## FAQ

### How to increase the upload size limit?

You can increase the upload size limit by following these steps:

1. Open the `.htaccess` file through Coolify's Terminal (or through SSH, and docker exec -ti `container_id` /bin/sh)
2. Add the following lines to the end of the file with `vi` or `nano`:

```php
# END WordPress - this line already exists in the file

php_value upload_max_filesize 256M
php_value post_max_size 256M
php_value max_execution_time 300
php_value max_input_time 300
```

3. Save and close the file.
4. Reload the website in your browser. The changes should be applied automatically.

### How to Fix a Redirection Loop in WordPress?

If your WordPress site is stuck in a redirection loop, follow these steps to resolve the issue:

Access the .htaccess file:

1. Open the `.htaccess` file through Coolify's Terminal (or through SSH, and docker exec -ti `container_id` /bin/sh)
2. Navigate to the WordPress root directory and locate the .htaccess file. Edit the .htaccess file:

```
<IfModule mod_setenvif.c>
  SetEnvIf X-Forwarded-Proto "^https$" HTTPS
</IfModule>
```

3. Save and close the file.
4. Reload the website in your browser. The changes should be applied automatically.
