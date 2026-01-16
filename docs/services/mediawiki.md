---
title: "Mediawiki"
description: "Run MediaWiki on Coolify for Wikipedia-style documentation, knowledge bases, collaborative editing, and structured wiki content management."
---

![Mediawiki](https://www.mediawiki.org/static/images/icons/mediawikiwiki.svg)

## What is Mediawiki?

Free and open source collaborative space for managing and sharing knowledge.

## Installation Steps

1. Comment out the shared volume for LocalSettings in your configuration.
2. Start the container.
3. Go to `http(s)://your-domain` to access the MediaWiki installation wizard.
4. Configure MediaWiki according to your needs through the wizard.
5. Download the generated `LocalSettings.php` file.
6. Stop the container.
7. Move the downloaded `LocalSettings.php` file to the specified file mount path on your server.
8. Uncomment the shared volume configuration to mount the `LocalSettings.php` file to the specified file mount path on your server.
9. Restart the container.

## Links

- [The official website](https://www.mediawiki.org/wiki/MediaWiki)
- [GitHub](https://github.com/wikimedia/mediawiki)
