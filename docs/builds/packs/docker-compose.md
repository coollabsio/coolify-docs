---
title: Docker Compose Build Packs
---

<ZoomableImage src="/docs/images/builds/packs/compose/banner.webp" />
<br />

Docker Compose lets you deploy multiple Docker containers and configure them easily. 

With the Docker Compose build pack, you can use your own Docker Compose file (i.e. `docker-compose.y[a]ml`) as the single source of truth, giving you full control over how your application is built and deployed on Coolify.

## How to use Docker Compose?
### 1. Create a New Resource in Coolify
On the Coolify dashboard, open your project and click the **Create New Resource** button.

<ZoomableImage src="/docs/images/builds/packs/compose/1.webp" />


### 2. Choose Your Deployment Option

<ZoomableImage src="/docs/images/builds/packs/compose/2.webp" />

**A.** If your Git repository is public, choose the **Public Repository** option.

**B.** If your repository is private, you can select **Github App** or **Deploy Key**. (These methods require extra configuration. You can check the guides on setting up a [Github App ↗](/knowledge-base/git/github/integration#with-github-app-recommended) or [Deploy Key ↗](/knowledge-base/git/github/integration#with-deploy-keys) if needed.)


### 3. Select Your Git Repository
If you are using a public repository, paste the URL of your GitHub repository when prompted. The steps are very similar for all other options.

<ZoomableImage src="/docs/images/builds/packs/compose/3.webp" />


### 4. Choose the Build Pack
Coolify defaults to using Nixpacks. Click the Nixpacks option and select **Docker Compose** as your build pack from the dropdown menu.

<ZoomableImage src="/docs/images/builds/packs/compose/4.webp" />


### 5. Configure the Build Pack
<ZoomableImage src="/docs/images/builds/packs/compose/5.webp" />

- **Branch:** Coolify will automatically detect the branch in your repository.
- **Base Directory:** Enter the directory that Coolify should use as the root. Use `/` if your files are at the root or specify a subfolder (like `/backend` for a monorepo).
- **Docker Compose Location:** Enter the path to your Docker Compose file, this path is combined with the Base Directory. Make sure the file extension matches exactly, if it doesn’t then Coolify won’t be able to load it.

Click on **Continue** button once you have set all the above settings to correct details.


## Advanced Configuration
### Defining Environment Variables
Coolify automatically detects environment variables mentioned in your compose file and displays them in the UI. For example:

```yaml
services:
  myservice:
    environment:
      - SOME_HARDCODED_VALUE=hello    # Passed to the container, but not visible in Coolify's UI.
      - SOME_VARIABLE=${SOME_VARIABLE_IN_COOLIFY_UI}  # Creates an editable, uninitialized variable in the UI.
      - SOME_DEFAULT_VARIABLE=${OTHER_NAME_IN_COOLIFY:-hello}  # Sets a default value "hello" that can be edited.
```

<ZoomableImage src="/docs/images/builds/packs/compose/6.webp" />

### Coolify's Magic Environment Variables

Coolify can generate dynamic environment variables for you using the following syntax: `SERVICE_<TYPE>_<IDENTIFIER>`. 

The types include:
- **FQDN:** Generates a fully qualified domain name for the service.
- **URL:** Generates a URL based on the defined FQDN.
- **USER:** Creates a random username.
- **PASSWORD:** Creates a password (use `PASSWORD_64` for a 64-bit long password).
- **BASE64:** Generates a random string (use `BASE64_64` or `BASE64_128` for longer strings).
- **REALBASE64:** Generates a base64-encoded random string (use `REALBASE64_64` or `REALBASE64_128` for longer strings).

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
        is_directory: true   # Instructs Coolify to create the directory.
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

<ZoomableImage src="/docs/images/builds/packs/compose/7.webp" />

Note that you must use the full name (like `postgres-<uuid>`) when referencing a service in another stack.


### Raw Docker Compose Deployment
For advanced users, Coolify offers a "Raw Compose Deployment" mode. This option lets you deploy your Docker Compose file directly without many of Coolify's additional configurations.

<ZoomableImage src="/docs/images/builds/packs/compose/8.webp" />

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
