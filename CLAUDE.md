# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

This is the official documentation repository for Coolify, an open-source self-hosting platform. The documentation is built with Fumadocs MDX, TanStack Start, React, Vite, and Bun, and is deployed at https://coolify.io/docs.

The Coolify application source can be found at https://github.com/coollabsio/coolify for reference and testing.

## Branch Strategy

- **main**: Production branch, deployed to https://coolify.io/docs/ by `.github/workflows/production-build.yml`
- **next**: Development branch, deployed to https://next.coolify.io/docs/ by `.github/workflows/staging-build.yml`
- Pull requests must target `next`, not `main`. `enforce-pr-standards.yml` retargets non-maintainer PRs to `next` automatically.
- Weekly release cycle merges `next` into `main`.

## Technology Stack

- **Fumadocs MDX/UI/Core** - Documentation content, layout, search, and MDX pipeline
- **Fumadocs OpenAPI** - API reference rendered from `config/openapi.json`
- **TanStack Start / React 19** - Application runtime and prerendering
- **Vite** - Development server and production build
- **Tailwind CSS 4** - Styling
- **TypeScript** - Type checking
- **Bun** - Package manager and script runner
- **Plausible** - Analytics

## Common Commands

```bash
# Install dependencies
bun install

# Regenerate the service catalog (src/generated/services.json + content/docs/services/all.mdx)
bun run generate:services

# Regenerate the CLI command reference from github.com/coollabsio/coolify-cli
bun run generate:cli-reference

# Refresh config/openapi.json from the Coolify repository
bun run generate:openapi

# Run development server
bun run dev

# Build static production output
bun run build

# Type-check the Fumadocs source and app
bun run types:check

# Preview production build
bun run preview
```

`bun run dev` and `bun run build` run `generate:cli-reference`, `generate:openapi`, and `generate:services` before starting Vite. `bun run types:check` runs `generate:services`, `fumadocs-mdx`, and `tsc --noEmit`.

`generate:openapi` rewrites `config/openapi.json` on every dev or build run. Only commit that file when you intend to update the API reference.

Do not run `bun run generate:content`. `scripts/generate-fumadocs-content.mjs` is the one-time migration script from the old VitePress `docs/` folder, which no longer exists.

## Directory Structure

```text
content/docs/               # Documentation source: MDX pages and meta.json sidebar files
content/docs/services/      # One-click service pages; all.mdx is generated
content/docs/cli/command-reference/commands/  # Generated CLI reference
public/                     # Public assets served under the /docs base path
public/images/              # Documentation images, grouped by section
templates/                  # Page templates (blank, guide, service, troubleshooting)
src/                        # React/TanStack Start application
src/components/docs/        # MDX components (registered in mdx.tsx)
src/routes/                 # App routes, including llms.txt, llms-full.txt and search
src/generated/services.json # Generated service directory data
config/site.shared.ts       # Shared site metadata and docs base path
config/openapi.json         # Coolify OpenAPI spec for the API reference
scripts/                    # Generators, link checker, and postbuild script
nginx/                      # Nginx config and redirects
atlas.json                  # Atlas devkit config (bun run dev:atlas)
```

`content/docs/` is the source of truth for documentation. Edit MDX files there directly.

## Content Guidelines

### Pages and Navigation

- Pages are `.mdx` files in `content/docs/`. Start new pages from the matching file in `templates/`.
- Sidebar order and section separators come from the `meta.json` file in each folder. Add new pages to the relevant `meta.json`.

### Images

- Store images in `public/images/[section]/`.
- Reference them as `/docs/images/...` in content.
- Use the `ZoomImage` MDX component for screenshots and logos. `ZoomableImage` is a legacy alias for the same component.
- Keep meaningful alt text for screenshots and diagrams.

### Markdown and MDX

- Frontmatter should include `title` and usually `description`.
- Use the `<Callout type="...">` component for callouts. Supported types are `info`, `warning`, `error`, `success`, and `idea`. VitePress `:::` containers are no longer supported.
- Other available components include `Steps`/`Step`, `Tabs`/`Tab`, `ScreenshotTabs`, `Cards`, `Accordions`, and the `Cool*` components in `src/components/docs/`.
- Internal links should point to stable docs paths without the base path, for example `/applications` or `/services/postgresql`.
- Avoid raw HTML unless it is already supported by the MDX runtime.

## Service Documentation

Service pages live in `content/docs/services/`. `scripts/generate-service-list.mjs` reads their frontmatter into `src/generated/services.json`, and `scripts/generate-services-page.mjs` writes `content/docs/services/all.mdx`. Both files are generated: run `bun run generate:services` and commit the result instead of editing them by hand.

Service frontmatter:

```yaml
---
title: "Buzz"
description: "Short description shown in the service catalog."
og:
  description: "Longer description for social previews."
category: "Messaging"
icon: "/docs/images/services/buzz-logo.svg"
# disabled: true   # hide from the catalog but keep the page
---
```

When adding, renaming, or disabling services, update:

| File | Purpose |
|------|---------|
| `content/docs/services/{slug}.mdx` | Service documentation |
| `public/images/services/` | Service logo and screenshots |
| `nginx/redirects.conf` | Redirects for renamed or removed paths |

Service filenames should use kebab-case lowercase and match the service slug. Use a category that already exists in `all.mdx` so the catalog doesn't get duplicate headings.

## Environment Variables

```bash
VITE_SITE_URL=https://coolify.io/docs/
VITE_ANALYTICS_DOMAIN=coolify.io/docs
VITE_PLAUSIBLE_SCRIPT_URL=https://analytics.coollabs.io/js/script.tagged-events.js
```

Optional: `VITE_PLAUSIBLE_DOMAIN` and `VITE_PLAUSIBLE_API_HOST` override the Plausible domain and API host, and `COOLIFY_OPENAPI_URL` changes the source of `generate:openapi`.

## Build and Deployment

The Dockerfile builds the Fumadocs/TanStack app with Bun and copies `.output/public` into the Nginx image. Nginx serves the static site from `/usr/share/nginx/html`, preserving `/docs/...` URLs.

Build output includes:

- `.output/public/docs-manifest.json`, `sitemap.xml`, and `robots.txt` (written by `scripts/postbuild.ts`)
- `.output/public/docs/llms.txt` and `llms-full.txt` (prerendered from `src/routes/`)
- `.output/public/docs/images/`, `docs/brand/`, and `docs/site.webmanifest` (copied by `scripts/postbuild.ts`)
- Open Graph images for every page (rendered by `scripts/postbuild.ts`)

Custom Nginx config lives in [nginx/nginx.conf](nginx/nginx.conf) and redirect rules live in [nginx/redirects.conf](nginx/redirects.conf).

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails in MDX | Open the `content/docs/` file named in the error and check its frontmatter and component syntax |
| Service not listed | Check the page's frontmatter in `content/docs/services/`, then run `bun run generate:services` |
| Image missing | Check the asset in `public/images/` and the `/docs/images/...` path in the page |
| Broken renamed page | Update `nginx/redirects.conf` and any links in `content/docs/`. Run `node scripts/check-links.js <docs-url>` against a running site to find broken links |

## Important Notes

- The documentation can lag behind Coolify releases; check the Coolify source for behavior-sensitive claims.
- `src/generated/services.json`, `content/docs/services/all.mdx`, and the CLI command reference are generated. Regenerate them rather than editing them by hand.
- Keep redirects stable because existing docs URLs are indexed and linked externally.
