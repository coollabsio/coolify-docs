---
title: Django
description: Deploy Django applications on Coolify with gunicorn, automatic builds, environment variables, and Python package management.
---

# Django

Django is a high-level Python Web framework that encourages rapid development and clean, pragmatic design.

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Prerequisites

1. Add `gunicorn` to your `requirements.txt` file ([official docs](https://docs.gunicorn.org/en/stable/install.html?utm_source=coolify.io)).
2. Add `localhost` and your `domain` to `ALLOWED_HOSTS` in `settings.py` ([official docs](https://docs.djangoproject.com/en/5.0/ref/settings/#allowed-hosts?utm_source=coolify.io)).

> [!NOTE]
> `localhost` is required for health checks to work properly.

3. Set `Ports Exposes` to `8000`.
4. Set `Build Pack` to `Dockerfile`.
5. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
```

> [!WARNING]
> Replace `myproject` in the CMD with your actual Django project name (the directory containing `wsgi.py`).

### Environment Variables

Set the following environment variables in Coolify:

```bash
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,your-domain.com
```

If your application needs a database, create one in the Coolify dashboard and add:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
```

### Database Migrations

Add the following `Post-deployment Command` to run migrations:

```bash
python manage.py migrate --noinput
```

## Deploy with Nixpacks

Nixpacks provides automatic detection of your Django project.

### Requirements

1. Set the base directory where your `requirements.txt` and `manage.py` files are located.
2. Add `gunicorn` to the `requirements.txt` file ([official docs](https://docs.gunicorn.org/en/stable/install.html?utm_source=coolify.io)).
3. Add `localhost` and your `domain` to `ALLOWED_HOSTS` in `settings.py` ([official docs](https://docs.djangoproject.com/en/5.0/ref/settings/#allowed-hosts?utm_source=coolify.io)).

> [!NOTE]
> `localhost` is required for health checks to work properly.
