---
name: adding-documentation-pages
description: Creates documentation pages for guides, tutorials, knowledge base articles, and troubleshooting content in docs/. Use when adding how-to guides, writing KB articles, creating troubleshooting docs, adding pages to get-started/, applications/, databases/, knowledge-base/, or integrations/. NOT for service pages - use adding-service-documentation for docs/services/.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Add Documentation Page

Create new documentation pages for the Coolify docs (guides, tutorials, KB articles, troubleshooting).

## When NOT to Use This Skill

**Use `adding-service-documentation` instead for:**
- Service pages in `docs/services/`
- One-click services from Coolify's catalog

Services require List.vue registration and logo handling covered by that skill.

## Quick Start

1. **Create file** in the appropriate section directory
2. **Add frontmatter** with `title` and `description`
3. **Write content** with clear headings
4. **Update sidebar** in `docs/.vitepress/config.mts` (if needed)
5. **Add images** using `<ZoomableImage>` component

## Documentation Sections

| Section | Path | Content Type |
|---------|------|--------------|
| Get Started | `docs/get-started/` | Introduction, installation, basics |
| Applications | `docs/applications/` | Framework deployment guides |
| Databases | `docs/databases/` | Database deployment docs |
| Knowledge Base | `docs/knowledge-base/` | How-tos, concepts, guides |
| Troubleshoot | `docs/troubleshoot/` | Problem-solution articles |
| Integrations | `docs/integrations/` | Third-party integration guides |

## Required Frontmatter

```yaml
---
title: "Page Title"
description: "SEO-friendly description (used in meta tags)."
---
```

## File Naming

- Use lowercase kebab-case: `my-guide.md`
- Be descriptive but concise

## Detailed References

**Page-specific:**
- [TEMPLATES.md](./TEMPLATES.md) - Ready-to-use page templates
- [SIDEBAR.md](./SIDEBAR.md) - How to update sidebar configuration

**Shared guidelines:**
- [FRONTMATTER.md](../_shared/FRONTMATTER.md) - Title, description, Open Graph
- [IMAGES.md](../_shared/IMAGES.md) - Image syntax and optimization
- [LINKS.md](../_shared/LINKS.md) - Internal and external link formatting
- [CONTAINERS.md](../_shared/CONTAINERS.md) - VitePress callout containers

## Key Rules

1. **Images**:
   - Small images/icons: use standard markdown `![alt](path)`
   - Screenshots/large images: use `<ZoomableImage>` component
   - Format: `.webp` preferred, absolute paths (`/docs/images/...`)
2. **Links**: Internal use absolute paths; external add `?utm_source=coolify.io`
3. **Sidebar**: Update `docs/.vitepress/config.mts` (starts ~line 130)

## Verification

- [ ] Frontmatter has `title` and `description`
- [ ] Screenshots use `<ZoomableImage>`
- [ ] External links have UTM parameters
- [ ] Page added to sidebar (if applicable)
- [ ] Renders at http://localhost:5173/docs/[path]

## Related Skills

- `adding-service-documentation` - For `docs/services/` pages
- `renaming-services` - Renaming service docs
- `disabling-services` - Deprecating services
