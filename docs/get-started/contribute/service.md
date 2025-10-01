---
title: "Add a new service template to Coolify"
---

# Adding a new service template to Coolify

Services in Coolify are templates made from normal [docker-compose](https://docs.docker.com/reference/compose-file/) files with some added Coolify magic.

::: info
See [Coolify's docker-compose specs](/knowledge-base/docker/compose#coolify-s-magic-environment-variables) to learn more about Coolify's magic and how to benefit from generated variables and storage handling. Please use this magic when submitting your PR to make the merging process smoother.
:::

1. Add metadata

   At the top of your `docker-compose` file, add the following metadata:

   ```yaml
   # documentation: https://docs.example.com/
   # slogan: A brief description of your service.
   # tags: tag1,tag2,tag3
   # logo: svgs/your-service.svg
   # port: 1234
   ```

   - `documentation`: Link to the service's official documentation
   - `slogan`: A short description of the service
   - `tags`: Comma-separated list for better searchability
   - `logo`: Path to the service's logo (see step 3)
   - `port`: The main entrypoint port of the service

::: warning Caution
Always specify a port, as Caddy Proxy cannot automatically determine the service's port.
:::

2. Create the docker-compose file

   Below the metadata, add your docker-compose configuration. Use Coolify's environment variable magic [here](/knowledge-base/docker/compose#coolifys-magic-environment-variables).

   Example:

   ```yaml
   services:
     app:
       image: your-service-image:tag
       environment:
         - DATABASE_URL=${COOLIFY_DATABASE_URL}
       volumes:
         - ${COOLIFY_VOLUME_APP}:/data
   ```

   **Using Required Environment Variables:**
   When creating service templates, mark critical configuration as required to improve user experience:

   ```yaml
   services:
     app:
       image: your-service:latest
       environment:
         # Required - critical configuration that must be set by the user
         - DATABASE_URL=${DATABASE_URL:?}
         - API_KEY=${API_KEY:?}

         # Required with sensible defaults - improves usability
         - PORT=${PORT:?8080}
         - LOG_LEVEL=${LOG_LEVEL:?info}

         # Optional - features that can be left empty
         - DEBUG=${DEBUG:-false}
         - CACHE_TTL=${CACHE_TTL:-3600}
   ```

   This helps users understand which configuration is essential and prevents deployment failures.

3. Add a logo

   - Create or obtain an SVG logo for your service (strongly preferred format)
   - If SVG is unavailable, use a high-quality.webp or JPG as a last resort
   - Add the logo file to the `svgs` folder in the Coolify repository
   - The logo filename should match the docker-compose service name exactly
     - For example, if your service name is `wordpress`, your logo should be `wordpress.svg` and the final path then is `svgs/wordpress.svg` use this path in the `logo` metadata.

4. Test your template

   Use the `Docker Compose Empty` deployment option in Coolify to test your template. This process mimics the one-click service deployment.

5. Submit a Pull Request

   Once your template works correctly:

   - Open a [PR](https://github.com/coollabsio/coolify/compare)
   - Add your new `<service>.yaml` compose file under `/templates/compose`
   - Include the logo file in the `svgs` folder

   ::: info
   Coolify uses a [parsed version](https://github.com/coollabsio/coolify/blob/main/templates/service-templates.json) of the templates for deployment.
   :::

## Adding a new service template to the Coolify Documentation

Once your service template is merged into Coolify, it will be important to also add documentation for it in the Coolify docs.
In the [Coolify Docs Contribute section](/get-started/contribute/documentation) we explain how to contribute and run the documentation on your own PC.
As soon as you have your local setup ready, follow these steps to add your new service:

1. Add service logo under `/docs/public/images/services/`

2. Create documentation file

   Create `/docs/services/<service-name>.md` with frontmatter:

   ```yaml
   ---
   title: "Service Name"
   description: "Here you can find the documentation for hosting Service Name with Coolify."
   ---
   ```

3. Write documentation

   Start writing your documentation under the frontmatter. Use the following template as a starting point:

   ```markdown
   # [Service Name]

   <ZoomableImage src="/docs/images/services/service.svg" />

   ## What is [Service Name]?

   Brief description and use cases.

   ## Links

   - [Official website ↗](https://example.com?utm_source=coolify.io)
   - [GitHub ↗](https://github.com/example/repo?utm_source=coolify.io)
   ```

4. Add Service to the Services Overview

   - Add the new service to the service list under `docs\.vitepress\theme\components\Services\List.vue` following the existing format:

   ```js
    {
        name: 'Service Name',
        slug: 'service-name', # Match the filename of your documentation file
        icon: '/docs/images/services/service.svg', # Path to your logo
        description: 'Brief description of the service.',
        category: 'Analytics' # Choose an appropriate category
    },
   ```

5. Submit Pull Request

   - Target the `next` branch
   - Test documentation renders correctly with `bun run dev`

# Request a new service

If there's a service template you'd like to see in Coolify:

1. Search [GitHub discussions](https://github.com/coollabsio/coolify/discussions/categories/service-template-requests) for existing requests.
2. If the service has been requested, upvote it. If not, create a new request.
