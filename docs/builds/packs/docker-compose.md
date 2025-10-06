---
title: Docker Compose Build Packs
---

<ZoomableImage src="/docs/images/builds/packs/compose/banner.webp" alt="Coolify banner" />
<br />

Docker Compose lets you deploy multiple Docker containers and configure them easily.

With the Docker Compose build pack, you can use your own Docker Compose file (i.e. `docker-compose.y[a]ml`) as the single source of truth, giving you full control over how your application is built and deployed on Coolify.

## How to use Docker Compose?

### 1. Create a New Resource in Coolify

On the Coolify dashboard, open your project and click the **Create New Resource** button.

<ZoomableImage src="/docs/images/builds/packs/compose/1.webp" alt="Coolify dashboard screenshot" />

### 2. Choose Your Deployment Option

<ZoomableImage src="/docs/images/builds/packs/compose/2.webp" alt="Coolify dashboard screenshot" />

**A.** If your Git repository is public, choose the **Public Repository** option.

**B.** If your repository is private, you can select **Github App** or **Deploy Key**. (These methods require extra configuration. You can check the guides on setting up a [Github App ↗](/knowledge-base/git/github/integration#with-github-app-recommended) or [Deploy Key ↗](/knowledge-base/git/github/integration#with-deploy-keys) if needed.)

### 3. Select Your Git Repository

If you are using a public repository, paste the URL of your GitHub repository when prompted. The steps are very similar for all other options.

<ZoomableImage src="/docs/images/builds/packs/compose/3.webp" alt="Coolify dashboard screenshot" />

### 4. Choose the Build Pack

Coolify defaults to using Nixpacks. Click the Nixpacks option and select **Docker Compose** as your build pack from the dropdown menu.

<ZoomableImage src="/docs/images/builds/packs/compose/4.webp" alt="Coolify dashboard screenshot" />

### 5. Configure the Build Pack

<ZoomableImage src="/docs/images/builds/packs/compose/5.webp" alt="Coolify dashboard screenshot" />

- **Branch:** Coolify will automatically detect the branch in your repository.
- **Base Directory:** Enter the directory that Coolify should use as the root. Use `/` if your files are at the root or specify a subfolder (like `/backend` for a monorepo).
- **Docker Compose Location:** Enter the path to your Docker Compose file, this path is combined with the Base Directory. Make sure the file extension matches exactly, if it doesn’t then Coolify won’t be able to load it.

Click on **Continue** button once you have set all the above settings to correct details.

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


## Advanced Configuration

### Defining Environment Variables

Coolify automatically detects environment variables mentioned in your compose file and displays them in the UI. For example:

```yaml
services:
  myservice:
    environment:
      - SOME_HARDCODED_VALUE=hello # Passed to the container, but not visible in Coolify's UI.
      - SOME_VARIABLE=${SOME_VARIABLE_IN_COOLIFY_UI} # Creates an editable, uninitialized variable in the UI.
      - SOME_DEFAULT_VARIABLE=${OTHER_NAME_IN_COOLIFY:-hello} # Sets a default value "hello" that can be edited.
```

<ZoomableImage src="/docs/images/builds/packs/compose/6.webp" alt="Coolify dashboard screenshot" />

### Required Environment Variables

You can mark environment variables as required using the `:?` syntax. Required variables must be set before deployment and will be highlighted in Coolify's UI with a red border if empty.

```yaml
services:
  myapp:
    environment:
      # Required variables - deployment will fail if not set
      - DATABASE_URL=${DATABASE_URL:?}
      - API_KEY=${API_KEY:?}

      # Required variables with default values - prefilled in UI but can be changed
      - PORT=${PORT:?3000}
      - LOG_LEVEL=${LOG_LEVEL:?info}

      # Optional variables - standard behavior
      - DEBUG=${DEBUG:-false}
      - CACHE_TTL=${CACHE_TTL:-3600}
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

### Coolify's Magic Environment Variables

Coolify can generate dynamic environment variables for you using the following syntax: `SERVICE_<TYPE>_<IDENTIFIER>`.

::: warning HEADS UP!
Support for Magic Environment Variables in Compose files based on Git sources has been added in Coolify v4.0.0-beta.411
:::

The types include:

| **Variables**                          | **Generated Value Type**                           |
| -------------------------------------- | -------------------------------------------------- |
| **PASSWORD**                           | Random Password (No Symbols)                       |
| **PASSWORD\_64**                       | Random Password (No Symbols, 64 characters)        |
| **PASSWORDWITHSYMBOLS**                | Random Password (With Symbols)                     |
| **PASSWORDWITHSYMBOLS\_64**            | Random Password (With Symbols, 64 characters)      |
| **BASE64\_64**                         | Random String (Not Base64-encoded, 64 characters)  |
| **BASE64\_128**                        | Random String (Not Base64-encoded, 128 characters) |
| **BASE64** or **BASE64\_32**           | Random String (Not Base64-encoded, 32 characters)  |
| **REALBASE64\_64**                     | Random String (Base64-encoded, 64 characters)      |
| **REALBASE64\_128**                    | Random String (Base64-encoded, 128 characters)     |
| **REALBASE64** or **REALBASE64\_32**   | Random String (Base64-encoded, 32 characters)      |
| **HEX\_32**                            | Random String (Hexadecimal, 32 characters)         |
| **HEX\_64**                            | Random String (Hexadecimal, 64 characters)         |
| **HEX\_128**                           | Random String (Hexadecimal, 128 characters)        |
| **USER**                               | Random String (16 characters)                      |
| **FQDN**                               | Fully Qualified Domain Name (FQDN)                 |
| **URL**                                | URL based on the defined FQDN                      |

Example:
```yaml
services:
  appwrite:
    environment:
      - $SERVICE_PASSWORD: sjdkfhsd43f
      - $SERVICE_PASSWORD_64: kdlfghsdiof43r3rweos93fofi39fjeowfkdj84fh3dksfjsw43r5
      - $SERVICE_PASSWORDWITHSYMBOLS: sjdk@fhsd!43#f
      - $SERVICE_PASSWORDWITHSYMBOLS_64: kdlfghsdiof43!@#r3rweos93fofi39fjeowfkdj84fh3dksfjsw43r5!
      - $SERVICE_PASSWORD_BASE64_64: jkhf4r5g4dh7sd85sd85fh7sgd5fhdfgsd9g7sd
      - $SERVICE_PASSWORD_BASE64_128: sd98fhsd7g8d98sd7f9sdg7fd87sd98f7sdg78f7d98g7d89
      - $SERVICE_PASSWORD_BASE64: sd98fh3g2k3h2gs78d93dgh
      - $SERVICE_PASSWORD_BASE64_32: sd98fh3g2k3h2gs78d93dgh
      - $SERVICE_PASSWORD_REALBASE64_64: c2Q5OGZoc2Q3Z2g4Yzg1M2c5ZGM3MG5k8as==
      - $SERVICE_PASSWORD_REALBASE64_128: c2Q5OGZoc2Q3Z2g4Yzg1M2c5ZGM3MG5k8aY9sdg==
      - $SERVICE_PASSWORD_REALBASE64: c2Q5OGZoc2Q3Z2g4Yzg1M2c5ZGM3MG5k8a==
      - $SERVICE_PASSWORD_REALBASE64_32: c2Q5OGZoc2Q3Z2g4Yzg1M2c5ZGM3MG5k8a==
      - $SERVICE_PASSWORD_HEX_32: a6b9f34e43c112d79f9a3d5c7983344f
      - $SERVICE_PASSWORD_HEX_64: db8c8a1a3b9df5a9fb8fd3f87df62f4b6a34cf4310f5cdb8c098b4f0e9af3b2
      - $SERVICE_PASSWORD_HEX_128: 7f8c98a98db56b0c6c8768b1db6d24f5f39493433d8d8f1846598c9830202089
      - $SERVICE_USER: jsd98fhg2j3skl8j
      - $SERVICE_FQDN: api.example.com
      - $SERVICE_URL: https://api.example.com
```

Every generated variable is consistent across all services in your stack and appears in Coolify's UI (except FQDN and URL, which are fixed).

For example, if your application UUID is `vgsco4o` and you deploy Appwrite on the wildcard domain `http://example.com`, you might include:

```yaml
services:
  appwrite:
    environment:
      # Generates FQDN: http://appwrite-vgsco4o.example.com/v1/realtime
      - SERVICE_FQDN_APPWRITE=/v1/realtime

      # Uses the FQDN for _APP_URL.
      - _APP_URL=$SERVICE_FQDN_APPWRITE

      # Proxies to port 3000.
      - SERVICE_FQDN_APPWRITE_3000

      # Proxies API requests to port 2000.
      - SERVICE_FQDN_API_2000=/api

      # Generates and injects a password.
      - SERVICE_SPECIFIC_PASSWORD=${SERVICE_PASSWORD_APPWRITE}
  not-appwrite:
    environment:
      # Reuses the password from the Appwrite service.
      - APPWRITE_PASSWORD=${SERVICE_PASSWORD_APPWRITE}
      # Generates a new FQDN for this service.
      - SERVICE_FQDN_API=/api
```

### Storage

You can set up storage in your compose file, with some extra options for Coolify.

#### Create an Empty Directory

Define directories with host binding and inform Coolify to create them:

```yaml
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    volumes:
      - type: bind
        source: ./srv
        target: /srv
        is_directory: true # Instructs Coolify to create the directory.
```

#### Create a File with Content

Specify a file with predefined content and even include a dynamic value from an environment variable:

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
          -- NOTE: Change these passwords for production!
           \set pgpass `echo "$POSTGRES_PASSWORD"`

           ALTER USER authenticator WITH PASSWORD :'pgpass';
           ALTER USER pgbouncer WITH PASSWORD :'pgpass';
```

### Exclude from Healthchecks

If a service should not be part of the overall healthchecks (for example, a one-time migration service), set the `exclude_from_hc` option to `true`:

```yaml
services:
  some-service:
    exclude_from_hc: true
    ...
```

### Connect to Predefined Networks

By default, each compose stack is deployed to a separate network named after your resource UUID. This setup allows each service in the stack to communicate with one another.

If you want to connect services across different stacks (for example, linking an application to a separate database), enable the **Connect to Predefined Network** option on your Service Stack page.

<ZoomableImage src="/docs/images/builds/packs/compose/7.webp" alt="Coolify dashboard screenshot" />

Note that you must use the full name (like `postgres-<uuid>`) when referencing a service in another stack.

### Raw Docker Compose Deployment

For advanced users, Coolify offers a "Raw Compose Deployment" mode. This option lets you deploy your Docker Compose file directly without many of Coolify's additional configurations.

<ZoomableImage src="/docs/images/builds/packs/compose/8.webp" alt="Coolify dashboard screenshot" />

::: danger CAUTION
This mode is intended for advanced users familiar with Docker Compose.
:::

### Labels

Coolify automatically adds these labels to your application (if not already set):

```yaml
labels:
  - coolify.managed=true
  - coolify.applicationId=5
  - coolify.type=application
```

To enable Coolify's Proxy (Traefik), also include these labels:

```yaml
labels:
  - traefik.enable=true
  - "traefik.http.routers.<unique_router_name>.rule=Host(`shadowarcanist.com`) && PathPrefix(`/`)"
  - traefik.http.routers.<unique_router_name>.entryPoints=http
```

## Known Issues and Solutions

::: details 1. Visiting the Application Domain Shows "No Available Server"
If you see a "No Available Server" error when visiting your website, it is likely due to the health check for your container.

Run `docker ps` on your server terminal to check if your container is unhealthy or still starting.

To resolve this, fix the issue causing the container to be unhealthy or remove the health checks.
:::
