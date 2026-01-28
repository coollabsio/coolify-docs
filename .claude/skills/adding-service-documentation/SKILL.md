---
name: adding-service-documentation
description: Documents new Coolify one-click services by creating markdown pages in docs/services/, downloading logos to docs/public/images/services/, and updating List.vue catalog. Use when adding service documentation, creating service pages, onboarding services from templates/compose/, or updating the services catalog with new entries.
allowed-tools: Read, Grep, Glob, Write, Bash
---

# Add Service Documentation

This skill guides you through documenting a new service in the Coolify documentation repository.

## When to Use This Skill

- Adding documentation for a new service from the Coolify repository
- Creating service pages with proper formatting and images
- Updating the services list component
- Following documentation standards for service pages

## Quick Start Workflow

1. **Identify the service** from Coolify's GitHub repository (`templates/compose/`)
2. **Extract metadata** from the YAML template header
3. **Download the logo** from GitHub and save to `docs/public/images/services/`
4. **Create documentation** at `docs/services/{service-slug}.md`
5. **Update services list** in `docs/.vitepress/theme/components/Services/List.vue`
6. **Test locally** with `bun run dev`

## File Structure

```
Coolify Repository (GitHub):
├── templates/compose/
│   └── service-name.yaml        # Service template with metadata
└── public/svgs/
    └── service-logo.svg          # Service logo

https://github.com/coollabsio/coolify/tree/main/templates/compose
https://github.com/coollabsio/coolify/tree/main/public/svgs

Documentation Repository:
├── docs/
│   ├── services/
│   │   └── service-name.md       # Service documentation page
│   ├── public/images/services/
│   │   └── service-logo.svg      # Copied logo
│   └── .vitepress/theme/components/Services/
│       └── List.vue               # Services catalog (line ~261)
```

## Required Files

Every service requires these 3 files:

1. **Service documentation** (`docs/services/{slug}.md`)
2. **Service logo** (`docs/public/images/services/{name}-logo.{ext}`)
3. **List entry** (in `docs/.vitepress/theme/components/Services/List.vue`)

## Detailed Instructions

**Service-specific:**
- [METADATA.md](./METADATA.md) - Extracting service info from YAML
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Writing service docs
- [IMAGES.md](./IMAGES.md) - Service logo guidelines
- [CATALOG.md](./CATALOG.md) - Updating the services list
- [TEMPLATES.md](./TEMPLATES.md) - Documentation templates

**Shared guidelines:**
- [FRONTMATTER.md](../_shared/FRONTMATTER.md) - Title, description, Open Graph
- [IMAGES.md](../_shared/IMAGES.md) - General image syntax
- [LINKS.md](../_shared/LINKS.md) - Internal and external link formatting
- [CONTAINERS.md](../_shared/CONTAINERS.md) - VitePress callout containers

## Important Rules

1. **Download logos locally**: NEVER use external image URLs - always download to `docs/public/images/services/`
2. **Skip ignored services**: If YAML has `# ignore: true`, don't document it
3. **Images**: Use `![alt](path)` for logos; use `<ZoomableImage>` only for screenshots
4. **Add UTM parameters**: Append `?utm_source=coolify.io` to all external links
5. **Follow naming**: Use lowercase, hyphenated slugs (e.g., `my-service.md`)
6. **Alphabetical order**: Insert services alphabetically in List.vue

## Testing

```bash
# Start dev server
bun run dev

# Verify:
# - Service appears in list at http://localhost:5173/docs/services/
# - Logo displays correctly
# - Service page loads at /docs/services/{slug}
# - All links work
# - Category filter includes service

# Build for production
bun run build
```

## Troubleshooting

**Image not showing:**

- Check path starts with `/docs/images/services/` (not `/public/`)
- Verify file exists in `docs/public/images/services/`
- Confirm file extension matches

**Service not in list:**

- Verify entry added to `services` array in List.vue
- Check `ignore: true` is not set
- Ensure valid JavaScript syntax

**Category missing:**

- Check category name matches existing categories (case-sensitive)
- See [CATALOG.md](./CATALOG.md) for full category list

## Related Commands

- `/new-services` - Automated service documentation generator
- Check existing services for examples in `docs/services/`
