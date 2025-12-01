---
title: "Supabase"
description: "Deploy Supabase on Coolify as open-source Firebase alternative with Postgres database, authentication, storage, and real-time subscriptions."
---

![Supabase](https://user-images.githubusercontent.com/8291514/213727225-56186826-bee8-43b5-9b15-86e839d89393.png#gh-dark-mode-only)

## What is Supabase?

The open source Firebase alternative.

## Screenshots

<ZoomableImage src="/docs/images/services/supabase-selfhost.webp" alt="Supabase dashboard" />

## Notes

You can find your anonymous key in the **Environment Variables** area under **SERVICE_SUPABASEANON_KEY**.

## Public Port Access

::: warning NOTE:
There is a bug with making database publicly accessible. This bug will be fixed soon. In the meantime, you can use the following workaround:
:::

Set **Supabase Db** to public

<ZoomableImage src="/docs/images/services/supabase-db-fix.webp" alt="Supabase dashboard" />

Then

Go to the **General** tab then **Edit Compose File**

Then add this line
`ports:
      - ${POSTGRES_PORT:-5432}:${POSTGRES_PORT:-5432}`

To

```yaml
supabase-db:
  image: "supabase/postgres:15.6.1.146"
  healthcheck:
    test: "pg_isready -U postgres -h 127.0.0.1"
    interval: 5s
    timeout: 5s
    retries: 10
  depends_on:
    supabase-vector:
      condition: service_healthy
  ports:
    - ${POSTGRES_PORT:-5432}:${POSTGRES_PORT:-5432}
```

And Restart

> NOTE if you are changing the port to a different port altogether to update the POSTGRES_PORT in the Environment Variables

## Opening ports with ufw-docker

Finally, to allow external access to the PostgreSQL port in a Docker setup, you need to open the port in the firewall using the command:

```bash
ufw route allow proto tcp from any to any port 5432
```

This rule ensures traffic can reach your PostgreSQL database through the Docker network. For more information, read the docs from [ufw-docker](https://github.com/chaifeng/ufw-docker).

### Using Hetzner's firewall UI

If your server is hosted on Hetzner, you may not need ufw-docker. Instead, you can open the relevant database port (e.g., 5432) directly using [Hetzner's firewall UI](https://docs.hetzner.com/cloud/firewalls/overview).

## Links

- [Official Website](https://supabase.io)
- [GitHub](https://github.com/supabase/supabase)
