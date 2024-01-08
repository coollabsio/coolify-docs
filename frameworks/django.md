---
head:
  - - meta
    - name: description
      content: Coolify Documentation for Django deployment
  - - meta
    - name: keywords
      content: coolify self-hosting django docker kubernetes vercel netlify heroku render digitalocean aws gcp azure nixpacks
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: "@coolifyio"
  - - meta
    - name: twitter:title
      content: Coolify Documentation for Django deployment
  - - meta
    - name: twitter:description
      content: Self-hosting with superpowers.
  - - meta
    - name: twitter:image
      content: https://coolcdn.b-cdn.net/assets/coolify/django-og-image.jpg
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://coolify.io
  - - meta
    - property: og:title
      content: Coolify
  - - meta
    - property: og:description
      content: Self-hosting with superpowers.
  - - meta
    - property: og:site_name
      content: Coolify
  - - meta
    - property: og:image
      content: https://coolcdn.b-cdn.net/assets/coolify/django-og-image.jpg
---

# Django

Django is a high-level Python Web framework that encourages rapid development and clean, pragmatic design.

Example repository [here](https://github.com/coollabsio/coolify-examples/tree/django).

## Requirements
1. Set the base directory where your `requirements.txt` and `manage.py` files are located.

> In the example repository, it is `/coolify`.

2. Add `gunicorn` to the `requirements.txt` file, [official docs](https://docs.gunicorn.org/en/stable/install.html).
3. Add `localhost` and your `domain` to `ALLOWED_HOSTS` in `settings.py` file, [ official docs](https://docs.djangoproject.com/en/4.2/ref/settings/#allowed-hosts).

> `Localhost` is required for health checks to work properly.