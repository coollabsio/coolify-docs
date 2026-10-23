---
name: adding-documentation-pages
description: Create or update Coolify MDX guides, tutorials, knowledge-base articles, and troubleshooting pages in content/docs/, with section meta.json navigation. Use adding-service-documentation for individual one-click service pages.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Add Documentation Page

Author pages directly in `content/docs/`. `source.config.ts` selects this tree for Fumadocs. Read `CLAUDE.md` for repository conventions; do not use the removed VitePress tree or run the one-time `generate:content` migration script.

## Workflow

1. Choose the current section and a lowercase kebab-case `.mdx` filename. Inspect nearby pages before choosing a location.
2. Start from `templates/blank.mdx`, `templates/guide.mdx`, or `templates/troubleshooting.mdx`, replacing placeholders. See [TEMPLATES.md](./TEMPLATES.md) for examples.
3. Add a specific `title` and descriptive `description` in frontmatter. Write clear headings and verified instructions.
4. Add the extensionless page name to the containing folder's `meta.json` when the page should appear in navigation. See [SIDEBAR.md](./SIDEBAR.md).
5. Save images in `public/images/{section}/` and reference them as `/docs/images/...`. Use `<ZoomImage>`; `<ZoomableImage>` is a supported alias.
6. Check the page and navigation at `http://localhost:3000/docs/{path}`. Use the relevant checks in [TESTING.md](../TESTING.md).

## Current Sections

| Content | Location |
|---|---|
| Getting started | Root pages such as `content/docs/choose-your-path.mdx` and `content/docs/start-with-self-hosted.mdx` |
| Platform and infrastructure | `content/docs/core/` |
| Applications | `content/docs/applications/` |
| Databases | `content/docs/databases/` |
| Knowledge base | `content/docs/knowledge-base/` |
| Troubleshooting | `content/docs/troubleshoot/` |
| Integrations | `content/docs/integrations/` |
| CLI and MCP guides | `content/docs/cli/` and `content/docs/mcp/` |

Individual one-click service pages use [adding-service-documentation](../adding-service-documentation/SKILL.md). The CLI command-reference pages and OpenAPI endpoints have separate generators; do not hand-edit generated reference output.

## MDX Conventions

```yaml
---
title: "Page Title"
description: "What the reader will learn or accomplish."
---
```

Use `<Callout type="info" title="Note">` for callouts, with blank lines around Markdown children. VitePress `:::` containers are unsupported. Escape literal JSX characters and braces in prose or put commands and configuration in code fences.

Internal links use extensionless paths without the `/docs` base, such as `/core/infrastructure/servers/ssh-keys`. Asset URLs retain the base: `/docs/images/...`.

## References

- [FRONTMATTER.md](../_shared/FRONTMATTER.md): metadata read by the current application.
- [IMAGES.md](../_shared/IMAGES.md): asset locations, formats, and components.
- [LINKS.md](../_shared/LINKS.md): routes, anchors, and external links.
- [CONTAINERS.md](../_shared/CONTAINERS.md): MDX callouts, tabs, and steps.

Before committing, check the chosen content path, the relevant `meta.json`, component syntax, image URLs, and the rendered page. For renamed paths, preserve redirects and run the redirect checker as described in `CLAUDE.md`.
