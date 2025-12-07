---
title: Ruby on Rails
description: Deploy Ruby on Rails applications on Coolify with database migrations, MVC pattern support, and automated deployment workflows.
---

# Ruby on Rails

Ruby on Rails is a web-application framework that includes everything needed to create database-backed web applications according to the Model-View-Controller (MVC) pattern.

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Prerequisites

1. Set `Ports Exposes` to `3000`.
2. Set `Build Pack` to `Dockerfile`.
3. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM ruby:3.3-slim AS base
WORKDIR /rails
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev nodejs npm && \
    rm -rf /var/lib/apt/lists/*
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
RUN bundle exec rake assets:precompile

FROM base
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y libpq-dev && \
    rm -rf /var/lib/apt/lists/*
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER 1000:1000
EXPOSE 3000
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
```

> [!TIP]
> Rails 7.1+ can generate an optimized Dockerfile with `bin/rails generate dockerfile`.

### Environment Variables

Set the following environment variables in Coolify:

```bash
RAILS_ENV=production
SECRET_KEY_BASE=your-secret-key
RAILS_MASTER_KEY=your-master-key
```

If your application needs a database, create one in the Coolify dashboard and add:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
```

### Database Migrations

Add the following `Post-deployment Command` to run migrations:

```bash
bundle exec rake db:migrate
```

Or include migrations in the startup command by setting `Start Command` to:

```bash
bundle exec rake db:migrate && bundle exec bin/rails server -b 0.0.0.0 -p ${PORT:-3000}
```

## Deploy with Nixpacks

Nixpacks provides automatic detection of your Rails project.

### Requirements

If you would like to migrate the database during the deployment with `NIXPACKS` build pack, you need to set the following `Start Command`:

```bash
bundle exec rake db:migrate && bundle exec bin/rails server -b 0.0.0.0 -p ${PORT:-3000} -e $RAILS_ENV
```
