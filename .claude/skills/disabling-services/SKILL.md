---
name: disabling-services
description: Hide an unavailable Coolify service from generated catalogs while keeping its content/docs/services/ page reachable. Use for temporary disablement, deprecation, removal notices, and re-enabling service documentation.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Disable Service Documentation

Keep the service page for existing deployments, search results, and bookmarks. Update its availability in `content/docs/services/{slug}.mdx`; do not delete it merely to hide a catalog entry.

## Workflow

1. Verify which service templates are unavailable and why. When only some deployment variants are disabled, describe that scope accurately rather than hiding an otherwise deployable service.
2. Add the explicit frontmatter flag `disabled: true` when the whole service should be hidden.
3. Add a visible MDX callout immediately after frontmatter, before the rest of the body. Explain the reason and, when known, link to verified updates, an advisory, or a replacement.
4. Preserve any existing redirects in `nginx/redirects.conf`.
5. Run `bun run generate:services` and inspect both generated outputs. Include them with the page when committing.

```mdx
---
title: "Service Name"
description: "Short service description."
category: "Utilities"
icon: "/docs/images/services/service-name-logo.svg"
disabled: true
---

<Callout type="warning" title="SERVICE TEMPORARILY DISABLED">

This service's one-click templates are temporarily unavailable in Coolify. Explain the verified reason and any action existing users need to take.

</Callout>

# Service Name

![Service Name](/docs/images/services/service-name-logo.svg)

## What is Service Name?

Keep the existing service documentation here.
```

Use `<Callout type="error">` for a security or removal warning when appropriate. Supported callout types and other examples are in [CONTAINERS.md](../_shared/CONTAINERS.md). Do not use VitePress `:::` syntax.

## How Availability Is Detected

`scripts/services-data.mjs` sets `disabled: true` if the frontmatter flag is true or the page contains one of these case-insensitive phrases:

- `SERVICE HIDDEN`
- `SERVICE NOT AVAILABLE`
- `SERVICE REMOVED FROM COOLIFY`
- `SERVICE TEMPORARILY DISABLED`

Use the frontmatter flag even when the callout has a recognized title. A title such as `SERVICE DEPRECATED` alone does not trigger detection.

`src/generated/services.json` retains the service with `disabled: true`. `src/components/data/services-list.tsx` filters it out of the searchable catalog, and the directory generator omits it from `content/docs/services/all.mdx`. The page remains reachable at `/docs/services/{slug}`.

## Verification

- The original `.mdx` page and its historical redirects still exist.
- The callout states the verified reason, scope, and any action for existing deployments.
- `src/generated/services.json` contains the slug with `disabled: true`.
- `content/docs/services/all.mdx` no longer links to the service.
- At `http://localhost:3000/docs/services/overview`, the service is absent; its direct page still loads and displays the warning.

See [TESTING.md](../TESTING.md) for isolated generator validation and [CATALOG.md](../adding-service-documentation/CATALOG.md) for the catalog contract. Neither generated file should be edited by hand.

## Re-enable a Service

Once availability is verified, remove `disabled: true` and remove or retitle any notice matching the recognized phrases. Regenerate both catalogs and confirm that the service appears with the right category and logo. Keep any still-relevant guidance for existing deployments.

## Related Skills

- [adding-service-documentation](../adding-service-documentation/SKILL.md): create or update a service page.
- [renaming-services](../renaming-services/SKILL.md): change a service slug and preserve old URLs.
