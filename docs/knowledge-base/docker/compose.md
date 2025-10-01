---
title: "Docker Compose"
description: "A guide on how to use Docker Compose deployments with Coolify."
---

# Docker Compose

If you are using `Docker Compose` based deployments, you need to understand how Docker Compose works with Coolify.

In all cases the Docker Compose (`docker-compose.y[a]ml`) file is the single source of truth.

## Making services available to the outside world

When Coolify deploys via Docker Compose, it creates a network for the services in the deployment. In addition, it adds the proxy service so that it can make services available from within the new network.

That means that there are a few ways to make your services available:

### Domains

Once Coolify loads your compose file, it finds a list of services and allows you to assign a domain. If your services listen on port 80, assigning a domain is enough for the proxy to find and route traffic to them. If they're listening on other ports, add that port to the domain.

For example, if your app is listening on (container) port 80, and you want to run it on `example.com`, enter `http://example.com` (or `https://`) for the domain.

If your app is listening on (container) port 3000, however, you'll enter `http://example.com:3000` in the relevant service. The port here only tells Coolify where to send traffic within the container; the proxy will make this service available on the normal port (`http://example.com` port 80, in this case.)

If you want to customize this domain-based routing further, see [Coolify's magic environment variables](#coolify-s-magic-environment-variables) below.

### Service Ports

If you want to do something custom, add a `ports` definition in your compose file. For example, to expose container port `3000` directly to the external network of the server:

```yaml
services:
  backend:
    image: your-backend:latest
    ports:
      - "3000:3000"
```

Be aware that if you do this, **your service will be available on your server at port 3000, outside the control of any proxy configuration.** This may not be what you want! If you use the same Docker Compose file for development and deployment, this may expose the ports of private services that you did not intend.

Refer to [the Docker Compose docs on using multiple compose files](https://docs.docker.com/compose/how-tos/multiple-compose-files/) for ways around this. Essentially, you may want to create a compose file that does not expose any ports by default for use with Coolify along with a separate file for use in development.

### Private or Internal Services

If you don't map a service port or assign a domain, Coolify will not expose your service outside the private network. At that point, you can refer to it as normal for Docker Compose.

For example, if you have two services with these names:

```yaml
services:
  backend:
    image: your-backend:latest
  auth:
    image: your-auth:latest
```

Then you can connect from `backend` to `auth` by referring to it as `http://auth:1234` (or whatever port.) Likewise, `auth` can connect to `backend` by referring to `http://backend:3000` (or whatever port.)

For further details, please refer to the [Docker Networking in Compose](https://docs.docker.com/compose/how-tos/networking/) docs.

## Defining environment variables

Coolify will notice the environment variables you mention in your compose file and will display it in its UI.

```yaml
services:
  myservice:
    environment:
      - SOME_HARDCODED_VALUE=hello # Gets passed to the container but will not be visible in Coolify's UI
      - SOME_VARIABLE=${SOME_VARIABLE_IN_COOLIFY_UI} # Creates an uninitialized environment variable editable in Coolify's UI
      - SOME_DEFAULT_VARIABLE=${OTHER_NAME_IN_COOLIFY:-hello} # Creates an environment variable of value "hello" editable in Coolify's UI
```

<ZoomableImage src="/docs/images/screenshots/Docker-compose-environment-variables-UI.webp" />

## Required environment variables

Coolify supports marking environment variables as required using Docker Compose's built-in syntax. This feature improves the deployment experience by validating critical configuration before starting services.

### Syntax

Use the `:?` syntax to mark variables as required:

```yaml
services:
  webapp:
    environment:
      # Required variable - must be set, no default
      - DATABASE_URL=${DATABASE_URL:?}

      # Required variable with default value - prefilled but editable
      - PORT=${PORT:?3000}

      # Optional variable with default - standard Docker Compose behavior
      - DEBUG=${DEBUG:-false}
```

**Key behaviors:**

- **Required variables** (`${VAR:?}`) appear first in the environment variables list and show a red border when empty
- **Required with defaults** (`${VAR:?default}`) are prefilled with the default value but remain editable
- **Optional variables** (`${VAR:-default}`) use standard Docker Compose behavior

If a required variable is not set during deployment:

- Coolify will highlight the missing variable in the UI
- The deployment will be prevented until all required variables are provided
- Clear error messages guide users to fix the configuration

This validation happens before container creation, preventing partial deployments and runtime failures.

## Coolify's magic environment variables

Additionally, Coolify can generate some dynamic environment variables for you.
The syntax is `SERVICE_<TYPE>_<IDENTIFIER>`.
Type may be one of:

- **FQDN**: This will [generate](/knowledge-base/server/introduction#wildcard-domain) an FQDN for the service. The example below shows how you can add paths and ports.
- **URL**: Generates an URL based on the FQDN you have defined.
- **USER**: Generates a random string using `Str::random(16)`. You might want to use it as a username in your service.
- **PASSWORD**: Generates a password using `Str::password(symbols: false)`. Use `PASSWORD_64` to generate a 64 bit long password with `Str::password(length: 64, symbols: false)`.
- **BASE64**: Generates a random string using `Str::random(32)`. For longer strings, use `BASE64_64` or `BASE64_128`.
- **REALBASE64**: Encodes a randomly generated string using `base64_encode(Str::random(32))`. For longer strings, use `REALBASE64_64` or `REALBASE64_128`.

Every generated variable can be reused and will always have the same value for every service.
All generated variables are displayed in Coolify's UI for environment variables and can be edited there (except FQDN and URl).

As an example, imagine an application with UUID `vgsco4o` (generated by Coolify on creation).
It uses a compose file deploying Appwrite on the [wildcard](/knowledge-base/server/introduction#wildcard-domain) domain `http://example.com` .

```yaml
services:
  appwrite:
    environment:
      # http://appwrite-vgsco4o.example.com/v1/realtime
      - SERVICE_FQDN_APPWRITE=/v1/realtime
      # _APP_URL will have the FQDN because SERVICE_FQDN_APPWRITE is just a simple environment variable
      - _APP_URL=$SERVICE_FQDN_APPWRITE
      # http://appwrite-vgsco4o.example.com/ will be proxied to port 3000
      - SERVICE_FQDN_APPWRITE_3000
      # http://api-vgsco4o.example.com/api will be proxied to port 2000
      - SERVICE_FQDN_API_2000=/api
      # Coolify generates password and injects it as SERVICE_SPECIFIC_PASSWORD into the container
      - SERVICE_SPECIFIC_PASSWORD=${SERVICE_PASSWORD_APPWRITE}
  not-appwrite:
    environment:
      # Same value as in Appwrite service
      - APPWRITE_PASSWORD=${SERVICE_PASSWORD_APPWRITE}
      # As SERVICE_FQDN_API is not the same as SERVICE_FQDN_APPWRITE
      # Coolify will generate a new FQDN
      # http://not-appwrite-vgsco4o.example.com/api
      - SERVICE_FQDN_API=/api
```

---

## Storage

You can predefine storage normally in your compose file, but there are a few extra options that you can set to tell Coolify what to do with the storage.

### Create an empty directory

```yaml
# Predefine directories with host binding
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    volumes:
      - type: bind
        source: ./srv
        target: /srv
        is_directory: true # This will tell Coolify to create the directory (this is not available in a normal docker-compose)
```

### Create a file with content

Here you can see how to add a file with content and a dynamic value that is coming from an environment variable.

```yaml
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - type: bind
        source: ./srv/99-roles.sql
        target: /docker-entrypoint-initdb.d/init-scripts/99-roles.sql
        content: |
          -- NOTE: change to your own passwords for production environments
           \set pgpass `echo "$POSTGRES_PASSWORD"`

           ALTER USER authenticator WITH PASSWORD :'pgpass';
           ALTER USER pgbouncer WITH PASSWORD :'pgpass';
```

## Exclude from healthchecks

If you have a service that you do not want to be part of your overall healthchecks, you can exclude it from the healthchecks by setting the `exclude_from_hc` option to `true`.

::: success Tip
This is useful for example if you have a migration service that runs only once and then the container stops.
:::

```yaml
services:
  some-service:
    exclude_from_hc: true
    ...
```

## Connect to Predefined Networks

By default, each compose stack is deployed to a separate network, with the name of your resource uuid. This will allow to each service in your stack to communicate with each other.

But in some cases, you would like to communicate with other resources in your account. For example, you would like to connect your application to a database, which is deployed in another stack.

To do this you need to enable `Connect to Predefined Network` option on your `Service Stack` page, but this will make the internal Docker DNS not work as expected.

Here is an example. You have a stack with a `postgres` database and a `laravel` application. Coolify will rename your `postgres` stack to `postgres-<uuid>` and your `laravel` stack to `laravel-<uuid>` to prevent name collisions.

If you set `Connect to Predefined Network` option on your `laravel` stack, your `laravel` application will be able to connect to your `postgres` database, but you need to use the `postgres-<uuid>` as your database host.

## Raw Docker Compose Deployment

You can set up your project to use docker compose build pack to deploy your compose file directly without most of Coolify's magic. It is called `Raw Compose Deployment`.

::: warning Caution
This is for advanced users. If you are not familiar with Docker Compose, we do not recommend this method.
:::

### Labels

Coolify will still add the following labels (if they are not set) to your application:

```yaml
labels:
  - coolify.managed=true
  - coolify.applicationId=5
  - coolify.type=application
```

To use Coolify's Proxy (Traefik), you need to set the following labels to your application:

```yaml
labels:
  - traefik.enable=true
  - "traefik.http.routers.<unique_router_name>.rule=Host(`coolify.io`) && PathPrefix(`/`)"
  - traefik.http.routers.<unique_router_name>.entryPoints=http
```
