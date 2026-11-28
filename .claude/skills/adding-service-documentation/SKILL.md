---
name: adding-service-documentation
description: Add or update Coolify one-click service documentation in content/docs/services/, store logos in public/images/services/, and regenerate the service catalog. Use for service pages and catalog updates; use adding-documentation-pages for other guides.
allowed-tools: Read, Grep, Glob, Write, Bash
---

# Add Service Documentation

Create service pages in the current Fumadocs content tree. Read `CLAUDE.md` for repository commands and conventions.

## Content Pipeline

| Source or output | Purpose |
|---|---|
| `content/docs/services/{slug}.mdx` | Authored service page; the filename determines the slug |
| `public/images/services/` | Local service logos and screenshots |
| `src/generated/services.json` | Generated catalog data consumed by `src/components/data/services-list.tsx` |
| `content/docs/services/all.mdx` | Generated categorized directory |

Both generators use `scripts/services-data.mjs`. It reads the top-level `.mdx` files in `content/docs/services/`, resolves local icons, and derives availability from frontmatter and recognized warning titles. It excludes `all.mdx`, `index.mdx`, `overview.mdx`, `how-services-work.mdx`, and `what-is-a-service.mdx`.

**Do not hand-edit either generated output.** Run `bun run generate:services`. Generation also runs before `bun run dev`, `bun run build`, and `bun run types:check`. `bun run preview` serves the existing build without regenerating content.

## Workflow

1. Check the relevant Coolify revision's `templates/compose/` YAML for the service, deployment variants, metadata, and availability. Skip new catalog entries marked `# ignore: true`; use [disabling-services](../disabling-services/SKILL.md) when updating an existing unavailable service.
2. Download the upstream logo to `public/images/services/{slug}-logo.svg` (or its actual image extension). See [METADATA.md](./METADATA.md) and [IMAGES.md](./IMAGES.md).
3. Create `content/docs/services/{slug}.mdx`, starting from `templates/service.mdx` or [TEMPLATES.md](./TEMPLATES.md). Replace template placeholders and add the required catalog frontmatter.
4. Write the service description, verified setup details, and official links. Follow [DOCUMENTATION.md](./DOCUMENTATION.md).
5. Run `bun run generate:services`. Check that the slug appears in `src/generated/services.json` and, for an enabled service, in `content/docs/services/all.mdx` under the right category.
6. Verify the page at `http://localhost:3000/docs/services/{slug}` and its card in `/docs/services/overview`. When committing, include the authored page, any new assets, and both generated outputs.

Individual service pages are discovered by the catalog generator. Do not add every service to `content/docs/services/meta.json`; that file organizes the section's guides and catalog entry points.

## Service Frontmatter

```yaml
---
title: "Service Name"
description: "Short description for the service card and directory."
category: "Analytics"
icon: "/docs/images/services/service-name-logo.svg"
---
```

Use an existing category where possible. `icon` is optional when the logo resolver finds a matching local file. Set `disabled: true` to hide a service from both catalogs while keeping its page reachable. See [CATALOG.md](./CATALOG.md) for resolution order and availability rules.

The collector reads only top-level scalar fields. Nested `og` metadata is not used for the service card; see [FRONTMATTER.md](../_shared/FRONTMATTER.md) for the current SEO behavior.

## Related References

- [IMAGES.md](../_shared/IMAGES.md): public asset paths and supported image components.
- [LINKS.md](../_shared/LINKS.md): internal routes and external links.
- [CONTAINERS.md](../_shared/CONTAINERS.md): MDX callouts and other registered components.
- [TESTING.md](../TESTING.md): isolated generator checks and page verification.

## Troubleshooting

- **Missing service:** confirm the file is `content/docs/services/{slug}.mdx`, has frontmatter, and is not one of the excluded filenames. Check `disabled` and recognized warning titles before regenerating.
- **Missing icon:** check the actual file under `public/images/services/`, use a resolver-friendly filename, or set `icon` to an existing `/docs/images/services/...` URL. The generator warns about invalid icons.
- **Wrong grouping:** `category` is used verbatim. Inspect current categories in the generated JSON rather than creating a near-duplicate spelling.
