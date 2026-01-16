# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

This is the official documentation repository for Coolify, an open-source self-hosting platform. The documentation is built using VitePress and deployed at https://coolify.io/docs.

The source code of Coolify itself can be found at https://github.com/coollabsio/coolify for reference and testing purposes.

## Branch Strategy

- **main**: Production branch (deployed to https://coolify.io/docs/)
- **next**: Development branch (deployed to https://next.coolify.io/docs/)
- **IMPORTANT**: All pull requests MUST target the `next` branch, NEVER `main`
- Weekly release cycle merges `next` → `main`

## Technology Stack

- **VitePress 1.6.3** - Static site generator
- **Vue 3.5.13** - Component framework
- **Tailwind CSS 3.2.4** - Utility-first CSS
- **TypeScript** - Type safety
- **Plausible** - Privacy-focused analytics

## Common Development Commands

### Package Management

- **Preferred**: `bun` (as per README)
- **Configured**: `pnpm@10.6.3` (as per package.json)
- If using a different package manager, do NOT commit its lock files

### Local Development

```bash
# Install dependencies
bun install

# Run development server (http://localhost:5173/docs/)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Convert OpenAPI YAML to JSON (run after updating API spec)
bun run transform-openapi
```

### Alternative: Task Runner

```bash
# Install Task: https://taskfile.dev/docs/installation
task --list          # List all available tasks
task dev             # Run dev server on port 2222 (all network interfaces)
task docker-build    # Build Docker container
task docker-deploy   # Run Docker container
```

## Directory Structure

```
docs/
├── .vitepress/
│   ├── config.mts           # Main VitePress config
│   ├── plugins/             # Custom Vite plugins
│   └── theme/               # Custom theme & components
│       └── components/      # Vue components (including Services/List.vue)
├── public/                  # Static assets (images, openapi.yml)
│   └── images/              # Organized by section
├── get-started/             # Getting started guides
├── applications/            # Application deployment docs
├── services/                # One-click services docs
├── databases/               # Database docs
├── knowledge-base/          # How-tos and concepts
├── api-reference/           # Auto-generated API docs
└── troubleshoot/            # Troubleshooting guides

nginx/
└── redirects.conf           # URL redirect rules
```

## Architecture

### VitePress Configuration

- Main config: [docs/.vitepress/config.mts](docs/.vitepress/config.mts)
- Custom theme: [docs/.vitepress/theme/index.ts](docs/.vitepress/theme/index.ts)
- Theme extends VitePress default theme with custom components and layouts

### Custom VitePress Plugins

1. **vitepress-openapi**: Auto-generates API documentation from OpenAPI spec
   - Dynamically fetches from GitHub: `https://raw.githubusercontent.com/coollabsio/coolify/v4.x/openapi.json`
   - Falls back to local file: [docs/.vitepress/theme/openapi.json](docs/.vitepress/theme/openapi.json)

2. **vitepress-plugin-coolbot**: Custom plugin that converts markdown to plain text for AI/RAG systems
   - Generates `llms-text.json` file map during build
   - Configured in [docs/.vitepress/plugins/vitepress-plugin-coolbot.ts](docs/.vitepress/plugins/vitepress-plugin-coolbot.ts)

3. **vitepress-plugin-llms**: Generates llms.txt for LLM consumption

4. **vitepress-plugin-tabs**: Enables tabbed content blocks

5. **vitepress-plugin-group-icons**: Adds icons to code group labels

### Custom Vue Components

Located in [docs/.vitepress/theme/components/](docs/.vitepress/theme/components/):

- **ZoomableImage**: MUST be used for all documentation images
  ```vue
  <ZoomableImage src="/docs/images/path/to/image.webp" alt="Description" />
  ```
- **Callout**: Important notes and warnings (types: `tip`, `warning`, `danger`, `info`, `success`)
- **TabBlock**: Tabbed content sections
- **Card/CardGroup**: Landing page card layouts
- **KorrektlySearch**: Integrated search component

## Content Guidelines

### Images

- **Format**: All images MUST be `.webp` format
- **Location**: Store in `docs/public/images/[section]/`
- **Paths**: Always use absolute paths: `/docs/images/...`
- **Usage**: Always use the `ZoomableImage` component

### Writing Style

- Use clear, simple language (consider non-native English speakers)
- Break instructions into small, numbered steps
- Include screenshots for complex processes using `<ZoomableImage>`
- Structure with clear headings and bullet points

### Markdown Features

- Standard markdown + VitePress extensions
- Frontmatter for page metadata (title and description required)
- Custom containers: `:::success`, `:::warning`, `:::danger`, `:::info`, `:::tip`
- Tabs via `vitepress-plugin-tabs`
- Code groups with icons via `vitepress-plugin-group-icons`

### Links

- **Internal**: Use absolute paths `/services/wordpress`
- **External**: Full URLs with UTM parameter `?utm_source=coolify.io`
- Always include descriptive anchor text (not bare URLs)

## Service Documentation

### Source of Truth

The authoritative source for service names is:
```
https://raw.githubusercontent.com/coollabsio/coolify/refs/heads/v4.x/templates/service-templates-latest.json
```

### File Naming Rules

Service documentation files in `docs/services/` must follow these conventions:

1. **Use kebab-case lowercase** for all filenames
2. **Match the base service name** from `service-templates-latest.json`
3. **Do not use camelCase** even if the JSON template uses it (e.g., `denoKV` → `denokv.md`)
4. **Include version numbers** when specified (e.g., `mautic5.md` not `mautic.md`)
5. **Use compound names** when specified (e.g., `ente-photos.md` not `ente.md`)

### Files to Update When Managing Services

When adding, renaming, or disabling services, update these locations:

| File | Purpose |
|------|---------|
| `docs/services/{name}.md` | The documentation file |
| `docs/.vitepress/theme/components/Services/List.vue` | Service listing (slug must match filename) |
| `nginx/redirects.conf` | URL redirects (when renaming/removing) |
| `docs/public/images/services/` | Service logo |

### Disabling Services

For deprecated or unavailable services:
1. Add `disabled: true` to the entry in `List.vue`
2. Add a warning callout in the markdown: `::: warning SERVICE NOT AVAILABLE`
3. Keep the file for SEO (users may find via search)

## Environment Variables

Configuration via `.env` file (see [.env.example](.env.example)):

```bash
VITE_SITE_URL=https://coolify.io/docs/       # Base URL for sitemap and meta
VITE_ANALYTICS_DOMAIN=coolify.io/docs        # Plausible analytics domain
VITE_KORREKTLY_BASE_URL=https://korrektly.com
VITE_KORREKTLY_API_TOKEN=kly_pub_...
VITE_KORREKTLY_DATASET_ID=uuid
```

## Build & Deployment

### Docker Build

Multi-stage Dockerfile:
1. **Builder stage**: Uses `oven/bun:1.1.44-alpine` to build VitePress site
2. **Final stage**: Uses `nginxinc/nginx-unprivileged:1.27.3-alpine-slim` to serve static files

Custom nginx config in [nginx/nginx.conf](nginx/nginx.conf) and [nginx/redirects.conf](nginx/redirects.conf)

### CI/CD Workflows

Located in `.github/workflows/`:
- **staging-build.yml**: Builds and deploys `next` branch to staging
- **production-build.yml**: Builds and deploys `main` branch to production
- **update-korrektly.yml**: Updates search index
- **enforce-pr-standards.yml**: PR validation

## Styling

### Color Scheme

- **Primary Brand**: Purple (`#7937f3`, `#7442d1`, `#B392F0`)
- **Tips**: Brand purple
- **Warnings**: Yellow
- **Danger/Errors**: Red (`#ff4444`)
- **Success**: Green (`#36d399`)
- **Info**: Blue (`#42b8e7`)

### Theme

- Dark/light mode support (user-switchable, dark by default)
- Custom styles in [theme/style.css](docs/.vitepress/theme/style.css) and [theme/custom.css](docs/.vitepress/theme/custom.css)
- Mobile-first responsive design

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not displaying | Check path is absolute (`/docs/images/...`) |
| Links broken after rename | Update all 3 locations (file, List.vue, redirects.conf) |
| Build fails | Check frontmatter YAML syntax |
| Service not showing | Verify slug in List.vue matches filename |

## Important Notes

- The documentation may occasionally be outdated; refer to the Coolify source code for accuracy
- OpenAPI spec is fetched from GitHub's v4.x branch at build time
- Search is powered by local provider + Korrektly integration
- VitePress plugins generate additional outputs: llms.txt, llms-text.json for AI consumption
