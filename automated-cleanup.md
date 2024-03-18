---
head:
  - - meta
    - name: description
      content: Coolify Documentation
  - - meta
    - name: keywords
      content: coolify self-hosting docker kubernetes vercel netlify heroku render digitalocean aws gcp azure
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: '@coolifyio'
  - - meta
    - name: twitter:title
      content: Coolify Documentation
  - - meta
    - name: twitter:description
      content: Self-hosting with superpowers.
  - - meta
    - name: twitter:image
      content: https://coolcdn.b-cdn.net/assets/coolify/cleanup-og-image.png
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
      content: https://coolcdn.b-cdn.net/assets/coolify/cleanup-og-image.png
---
# Automated Cleanup

Coolify automatically cleans up your servers to prevent them from running out of disk space. It will remove all the unused Docker images, containers, and volumes.

## How it works
- Coolify will run the cleanup script every 10 minutes.
- If there is an ongoing deployment, the cleanup script will be skipped - to prevent any issues, like deleting the image that is currently being used.
- The cleanup script will remove all the unused Docker images, containers, and volumes with the following commands:

```bash
# This will remove all unused Docker images
docker image prune -af
# This will remove all coolify.managed containers that are not running
docker container prune -f --filter "label=coolify.managed=true"
# This will remove all unused Docker build caches
docker builder prune -af
```

If something goes wrong, you can always run these commands manually.
