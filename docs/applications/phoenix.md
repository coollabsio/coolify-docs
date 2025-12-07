---
title: Phoenix
description: Deploy Phoenix framework applications on Coolify with Elixir/Erlang, Nixpacks, environment variables, and database integration.
---

# Phoenix

Phoenix is a productive web framework that does not compromise speed and maintainability written in Elixir/Erlang.

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Prerequisites

1. Set `Ports Exposes` to `4000`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM elixir:1.17 AS build
RUN apt-get update && apt-get install -y build-essential git nodejs npm && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV MIX_ENV=prod
RUN mix local.hex --force && mix local.rebar --force
COPY mix.exs mix.lock ./
COPY config config
RUN mix deps.get --only prod && mix deps.compile
COPY lib lib
COPY priv priv
COPY assets assets
RUN mix assets.deploy && mix compile && mix release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y libstdc++6 openssl libncurses6 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/_build/prod/rel/my_app ./
ENV PHX_HOST=localhost
EXPOSE 4000
CMD ["bin/my_app", "start"]
```

> [!WARNING]
> Replace `my_app` with your actual application name (found in `mix.exs` under `:app`).

> [!TIP]
> Phoenix 1.6+ can generate an optimized Dockerfile with `mix phx.gen.release --docker`.

### Environment Variables

Set the following environment variables in Coolify (all should be `Build time` variables):

```bash
MIX_ENV=prod
SECRET_KEY_BASE=your-secret-key
PHX_HOST=your-domain.com
```

If your application needs a database, create one in the Coolify dashboard and add:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
```

> [!TIP]
> Generate a secret key with: `mix phx.gen.secret`

### Database Migrations

Add the following `Post-deployment Command` to run migrations:

```bash
bin/my_app eval "MyApp.Release.migrate"
```

Or use the built-in migrate script if available:

```bash
bin/migrate
```

## Deploy with Nixpacks

Nixpacks provides automatic detection of your Phoenix project.

### Requirements

- Set `Build Pack` to `nixpacks`.
- Set `MIX_ENV` to `prod` (Build time environment variable).
- Set `SECRET_KEY_BASE` to a random string ([docs](https://hexdocs.pm/phoenix/deployment.html#handling-of-your-application-secrets?utm_source=coolify.io)) (Build time environment variable).
- Set `DATABASE_URL` to your database connection string (Build time environment variable).
- Set `Ports Exposes` to `4000` (default).
