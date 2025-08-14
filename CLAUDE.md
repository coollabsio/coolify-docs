# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official documentation repository for Coolify, built with VitePress. The documentation covers installation, usage, troubleshooting, and API reference for Coolify - an open-source self-hostable alternative to Heroku/Netlify/Vercel.

## Development Commands

**Package Manager**: The project uses pnpm as specified in package.json, but contributors are encouraged to use bun for local development as mentioned in the README.

### Core Commands
```bash
# Install dependencies
bun install  # or npm install

# Start development server
bun run dev  # or npm run dev
# Serves on localhost:5173/docs/

# Build for production
bun run build  # or npm run build

# Preview production build
bun run preview  # or npm run preview

# Convert OpenAPI YAML to JSON
bun run transform-openapi  # or npm run transform-openapi
```

### VitePress Commands
- `vitepress dev docs` - Start development server
- `vitepress build docs` - Build documentation
- `vitepress preview docs` - Preview built documentation

## Architecture & Structure

### Content Organization
- **docs/**: Main documentation content directory
  - **get-started/**: Installation, introduction, concepts
  - **applications/**: Framework-specific guides (Django, Laravel, Next.js, etc.)
  - **services/**: Individual service documentation (200+ services)
  - **databases/**: Database-specific guides
  - **knowledge-base/**: Advanced topics, how-tos, troubleshooting
  - **api-reference/**: Auto-generated API documentation
  - **troubleshoot/**: Common issues and solutions

### Technical Stack
- **VitePress 1.6.3**: Static site generator
- **Vue 3.5.13**: Component framework
- **TailwindCSS 3.2.4**: Styling
- **TypeScript**: Type checking via tsx
- **OpenAPI Integration**: Auto-generated API docs from openapi.yml

### Key Configuration Files
- **docs/.vitepress/config.mts**: Main VitePress configuration
  - Sidebar structure with 200+ service pages
  - Custom theme components and aliases
  - OpenAPI integration via vitepress-openapi
  - Markdown plugins (tabs, containers, group icons)
- **package.json**: Dependencies and npm scripts
- **tailwind.config.js**: TailwindCSS configuration
- **scripts/convert-openapi.ts**: YAML to JSON converter for OpenAPI spec

### Custom Components & Plugins
- **ZoomableImage**: For documentation images (all images must be .webp format in docs/public/)
- **Custom VitePress theme**: Overrides default components (VPNavBar, VPSidebar, etc.)
- **vitepress-plugin-llms**: LLM integration
- **vitepress-plugin-tabs**: Tabbed content
- **vitepress-plugin-group-icons**: Code group icons
- **vitepress-openapi**: API documentation generation

### Contribution Workflow
- **Main branch**: Production
- **Next branch**: Development branch for contributions
- **Pull requests**: Must target the `next` branch, not `main`
- **Images**: Must be .webp format, stored in docs/public/
- **Content**: Use ZoomableImage component for images
- **Package managers**: Bun preferred for development, avoid committing lockfiles from other managers

### Development Notes
- The documentation uses a complex sidebar structure with 400+ pages
- Custom markdown containers (success blocks, etc.)
- SSH syntax highlighting support via custom Shiki configuration
- Carbon Ads integration
- Analytics via Plausible
- Custom OpenAPI spec processing from YAML to JSON