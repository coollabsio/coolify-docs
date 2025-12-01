---
title: "Docuseal"
description: "Host DocuSeal on Coolify for PDF form filling, e-signatures, document workflows, and digital signature collection for business process automation."
---

## What is Docuseal?

Document Signing for Everyone free forever for individuals, extensible for businesses and developers. Open Source Alternative to DocuSign, PandaDoc and more.

## Deployment Variants

DocuSeal is available in two deployment configurations in Coolify:

### DocuSeal (Default)
- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, testing, or low-volume document signing
- **Components:** Single DocuSeal container with built-in SQLite database

### DocuSeal with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring better performance, scalability, and concurrent access
- **Components:**
  - DocuSeal container
  - PostgreSQL container
  - Automatic database configuration and health checks

## Screenshots

<ZoomableImage src="/docs/images/services/docuseal.webp" alt="Docuseal dashboard" />

## Links

- [The official website](https://www.docuseal.co?utm_source=coolify.io)
- [GitHub](https://github.com/docusealco/docuseal?utm_source=coolify.io)
