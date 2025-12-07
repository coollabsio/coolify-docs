---
title: Jekyll
description: Deploy Jekyll static sites on Coolify using Nixpacks or Dockerfile with Ruby, Nginx, and automated build processes.
---

# Jekyll

Jekyll is a simple, blog-aware, static site generator for personal, project, or organization sites.

## Deploy with Dockerfile

Using a Dockerfile gives you full control over the build process and is recommended for production deployments.

### Prerequisites

1. Set `Ports Exposes` to `80`.
2. Set `Build Pack` to `Dockerfile`.
3. Make sure you have a `Gemfile` and `Gemfile.lock` in the root of your project.
4. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM ruby:3.3 AS builder
RUN apt-get update -qq && apt-get install -y build-essential nodejs
WORKDIR /srv/jekyll
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
RUN chown 1000:1000 -R /srv/jekyll
RUN bundle exec jekyll build -d /srv/jekyll/_site

FROM nginx
COPY --from=builder /srv/jekyll/_site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> [!TIP]
> This multi-stage build compiles your Jekyll site with Ruby, then serves the static files with nginx for optimal performance.

## Deploy with Nixpacks

Nixpacks provides automatic detection of your Jekyll project.

Nixpacks needs a few prerequisites in your source code to deploy your Jekyll application. More info [here](https://nixpacks.com/docs/providers/ruby?utm_source=coolify.io).
