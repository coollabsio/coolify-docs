---
title: "N8N"
description: "Build workflows on Coolify with n8n automation platform connecting 400+ apps, APIs, databases for no-code/low-code task automation and integration."
---

![N8N](https://user-images.githubusercontent.com/65276001/173571060-9f2f6d7b-bac0-43b6-bdb2-001da9694058.png)

## What is N8N?

N8N is an open-source workflow automation tool that allows you to connect different applications and services together. It is an open-source alternative to tools like Zapier or Make.

## Screenshots

![N8N Preview](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-screenshot.png)

### Extending n8n with custom dependencies

To extend n8n with custom dependencies, you can add them following the example below to your Dockerfile:

```dockerfile
...
RUN apk add --no-cache ffmpeg
...
```

### Example Dockerfile

```dockerfile
FROM n8nio/n8n:latest

# Switch to root user to install packages and modify system directories
USER root

# Install necessary system packages using apk
# build-base, python3-dev, geoip-dev are needed for potential native dependencies
# wget for downloading, git for source control (might be needed by Go), bash (useful shell)
RUN apk update && \
    apk add --no-cache \
        wget \
        ffmpeg


ENV N8N_HOST=${SUBDOMAIN}.${DOMAIN_NAME}
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV NODE_ENV=production
ENV WEBHOOK_URL=https://${SUBDOMAIN}.${DOMAIN_NAME}/

# Switch back to the non-root user that n8n runs as (typically 'node')
USER node
```

## Links

- [The official website](https://n8n.io/)
- [GitHub](https://github.com/n8n-io/n8n)
