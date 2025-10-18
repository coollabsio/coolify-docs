---
title: "Plex"
description: "Stream media on Coolify with Plex server for movies, TV shows, music, photos with transcoding, mobile apps, and live TV DVR support."
---

<ZoomableImage src="/docs/images/services/plex-logo.svg" alt="Plex dashboard" />

## What is Plex?

Available on almost any device, Plex is the first-and-only streaming platform to offer free ad-supported movies, shows, and live TV together.

## Installation

1. Create the service within Coolify.
2. BEFORE starting the service, set the `PLEX_CLAIM` variable. You can get a claim token here: https://plex.tv/claim
3. If your device supports it, enable hardware transcoding by uncommenting this section in the compose file:

```yaml
#devices:
# - "/dev/dri:/dev/dri"
```

## Screenshots

<ZoomableImage src="/docs/images/services/plex.webp" alt="Plex dashboard" />

## Links

- [The official website ›](https://www.plex.tv/)
- [GitHub ›](https://github.com/plexinc/pms-docker)
