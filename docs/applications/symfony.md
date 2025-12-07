---
title: Symfony
description: Deploy Symfony PHP applications on Coolify with Nixpacks, Doctrine migrations, database connections, and trusted proxy configuration.
---

# Symfony

Symfony is the leading PHP framework to create websites and web applications. Built on top of the Symfony Components.

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### With FrankenPHP (Recommended)

FrankenPHP is a modern PHP application server built on top of Caddy, providing excellent performance and easy configuration.

#### Prerequisites

1. Set `Ports Exposes` to `80` (and optionally `443` for HTTPS).
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM dunglas/frankenphp:1-php8.4 AS base

WORKDIR /app

RUN install-php-extensions \
    apcu \
    intl \
    opcache \
    zip \
    pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV APP_ENV=prod

COPY composer.json composer.lock ./
RUN composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts

COPY . .

RUN composer dump-autoload --classmap-authoritative && \
    php bin/console cache:clear

EXPOSE 80 443

CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
```

> [!TIP]
> For more advanced Symfony Docker setups, check out the official [Symfony Docker](https://github.com/dunglas/symfony-docker?utm_source=coolify.io) project.

### With PHP-FPM and Nginx

A more traditional setup using PHP-FPM and Nginx.

#### Prerequisites

1. Set `Ports Exposes` to `80`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM php:8.4-fpm AS base

RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql intl opcache zip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV APP_ENV=prod

COPY composer.json composer.lock ./
RUN composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts

COPY . .

RUN composer dump-autoload --classmap-authoritative && \
    php bin/console cache:clear && \
    chown -R www-data:www-data var

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
```

4. Create `docker/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /app/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        internal;
    }

    location ~ \.php$ {
        return 404;
    }
}
```

5. Create `docker/supervisord.conf`:

```ini
[supervisord]
nodaemon=true
logfile=/dev/null
logfile_maxbytes=0

[program:php-fpm]
command=php-fpm -F
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=nginx -g 'daemon off;'
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

### Environment Variables

Set the following environment variables in Coolify:

```bash
APP_ENV=prod
APP_SECRET=your-app-secret
```

If your application needs a database, create one in the Coolify dashboard and add:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname?serverVersion=16&charset=utf8
```

### Database Migrations

Add the following `Post-deployment Command` to run Doctrine migrations:

```bash
php bin/console doctrine:migrations:migrate --all-or-nothing --no-interaction
```

### Trusted Proxy

You might need to configure the [trusted proxy](https://symfony.com/doc/current/deployment/proxies.html?utm_source=coolify.io):

1. Set the environment variable `TRUSTED_PROXIES` with the IP of your server.
2. Add the following Symfony configuration:

```yaml
# config/packages/framework.yaml
framework:
    trusted_proxies: "%env(TRUSTED_PROXIES)%"
    trusted_headers: ['x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port', 'x-forwarded-prefix']
```

## Deploy with Nixpacks

Nixpacks provides automatic detection of your Symfony project.

### Requirements

- Set `Build Pack` to `nixpacks`.
- Set `APP_ENV` to `prod`.
- Set `APP_SECRET` to a random string.
- Set `NIXPACKS_PHP_FALLBACK_PATH` to `/index.php`.
- Set `NIXPACKS_PHP_ROOT_DIR` to `/app/public`.
- Set `Ports Exposes` to `80`.

### Database Migrations

If you use Doctrine, you can add the following `Post-deployment Command`:

```bash
php bin/console doctrine:migrations:migrate --all-or-nothing --no-interaction
```

### Other Components

If your application needs a database or Redis, you can simply create them beforehand in the Coolify dashboard.

You will receive the connection strings which you can use in your application and set them as environment variables:

```bash
DATABASE_URL=postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8

REDIS_HOST=<REDIS_HOST>
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Trusted Proxy

You might need to configure the [trusted proxy](https://symfony.com/doc/current/deployment/proxies.html?utm_source=coolify.io):

- Set the environment variable `TRUSTED_PROXIES` with the IP of your server.
- Add the following Symfony configuration:

```yaml
# config/packages/framework.yaml
framework:
    trusted_proxies: "%env(TRUSTED_PROXIES)%"
    trusted_headers: ['x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port', 'x-forwarded-prefix']
```

### Persistent php.ini Customizations

If you want to customize settings from your php.ini file, you can easily do so by using the `php_admin_value` directive and appending them to your `php-fpm.conf` file like this:

```toml
"php-fpm.conf" = '''
[www]
listen = 127.0.0.1:9000
user = www-data
group = www-data
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 50
pm.min_spare_servers = 4
pm.max_spare_servers = 32
pm.start_servers = 18
clear_env = no

php_admin_value[memory_limit] = 512M
php_admin_value[max_execution_time] = 60
php_admin_value[max_input_time] = 60
php_admin_value[post_max_size] = 256M
'''
```
