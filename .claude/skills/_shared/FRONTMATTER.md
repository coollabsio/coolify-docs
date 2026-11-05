# Frontmatter Reference

Put YAML frontmatter at the start of every page in `content/docs/`. Use a specific title and a description that states what the reader will learn or accomplish.

```yaml
---
title: "Configure application health checks"
description: "Configure and verify application health checks in Coolify."
---
```

Keep metadata clear and concise. Service descriptions should stay short because they also appear on cards and in the categorized directory.

## Service Metadata

Individual service pages also need `category`. The filename determines the slug. Use an existing category spelling from the catalog where possible.

```yaml
---
title: "Service Name"
description: "Short description for the service card and directory."
category: "Analytics"
icon: "/docs/images/services/service-name-logo.svg"
# disabled: true
---
```

`icon` is optional if the collector can resolve a local logo. Uncomment `disabled: true` only when hiding the service from catalogs; the page remains reachable. The service collector reads top-level scalar values and does not interpret nested metadata. See [CATALOG.md](../adding-service-documentation/CATALOG.md).

## Current SEO and Social Images

The application derives page metadata from `title` and `description`, then applies `src/lib/docs/seo.ts` for title and service-description rules. `scripts/lib/content.ts` builds the page list, and `scripts/postbuild.ts` generates Open Graph PNGs from that metadata under `.output/public/og/`.

Existing pages may retain nested `og.description` or an `image` field, but those are not read as overrides by the current metadata and social-image pipeline. Do not add them expecting to change social previews. An explicit social-image override would need implementation in the application first.

## Verify

- The page starts with valid YAML frontmatter and has a useful `title` and `description`.
- A service page has a `category`, a resolver-friendly local logo or valid `icon`, and the intended availability flag.
- Required catalog fields stay at the top level; do not use nested YAML or folded values for them.
- Changes to a service page are reflected by running `bun run generate:services`, without hand-editing either generated output.
