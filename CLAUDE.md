# Claude Code Context

This file provides important context for AI assistants (like Claude) working on the Coolify documentation codebase.

## Documentation Overview

The Coolify documentation is built with **VitePress 1.6.3**, **Vue 3**, and **Tailwind CSS**. It provides comprehensive guides for deploying applications, services, and databases on Coolify.

### Technology Stack
- **VitePress 1.6.3** - Static site generator
- **Vue 3.5.13** - Component framework
- **Tailwind CSS 3.2.4** - Utility-first CSS
- **TypeScript** - Type safety
- **Analytics** - Plausible (privacy-focused)

## Directory Structure

```
docs/
├── .vitepress/              # VitePress config & theme
│   ├── config.mts          # Main configuration
│   ├── theme/              # Custom theme & components
│   │   └── components/     # Vue components
│   └── dist/               # Build output
├── api-reference/          # OpenAPI documentation
├── applications/           # Framework deployment guides
├── databases/              # Database deployment guides
├── get-started/            # Introduction & setup
├── integrations/           # Third-party integrations
├── knowledge-base/         # Organized by subcategories
│   ├── cloudflare/
│   ├── docker/
│   ├── proxy/
│   └── server/
├── services/               # One-click service docs
├── troubleshoot/           # Troubleshooting guides
└── public/images/          # Image assets (by section)
    ├── services/
    ├── troubleshoot/
    └── knowledge-base/

nginx/
└── redirects.conf          # URL redirect rules
```

## Service Documentation

### File Naming Rules

Service documentation files in `docs/services/` must follow these conventions:

1. **Use kebab-case lowercase** for all filenames
2. **Match the base service name** from `service-templates-latest.json` in the main Coolify repository
3. **Do not use camelCase** even if the JSON template uses it (e.g., `denoKV` → `denokv.md`)
4. **Include version numbers** when specified in the JSON (e.g., `mautic5.md` not `mautic.md`)
5. **Use compound names** when the JSON specifies them (e.g., `ente-photos.md` not `ente.md`)

### Source of Truth

The authoritative source for service names is:
```
https://raw.githubusercontent.com/coollabsio/coolify/refs/heads/v4.x/templates/service-templates-latest.json
```

When adding or renaming services, always check this file first.

### Related Files That Must Be Updated

When renaming a service documentation file, you must update **all three locations**:

1. **nginx/redirects.conf** - Add redirect rules from old URLs to new URLs
2. **docs/.vitepress/theme/components/Services/List.vue** - Update the `slug` property to match new filename
3. Any internal links in other documentation files

### Disabled Services

Services that are deprecated or temporarily unavailable should:
- Keep their documentation file
- Add `disabled: true` to the frontmatter
- Optionally include a warning message in the content

Example:
```yaml
---
title: "Service Name"
description: "Service description"
disabled: true
---
```

### Service Documentation Template

```markdown
---
title: "Service Name"
description: "Brief description for SEO and social sharing"
---

## What is [Service]?

Brief description of the service and its purpose.

## Features

- Feature 1
- Feature 2
- Feature 3

## Screenshots

<ZoomableImage src="/docs/images/services/service-name.webp" alt="Description" />

## Links

- [Official Website](https://example.com?utm_source=coolify.io)
- [Documentation](https://docs.example.com?utm_source=coolify.io)
- [GitHub](https://github.com/org/repo?utm_source=coolify.io)
```

## Markdown & Frontmatter Conventions

### Required Frontmatter Fields

```yaml
---
title: "Page Title"              # Required - browser tab and h1
description: "Page description"  # Required - SEO and social sharing meta tags
tags: ["tag1", "tag2"]          # Optional - categorization
outline: [2, 4]                 # Optional - header levels in outline (default: 2-4)
disabled: true                  # Optional - for deprecated services
---
```

### Custom Vue Components

#### ZoomableImage
Use for all screenshots and images:
```markdown
<ZoomableImage
  src="/docs/images/path/to/image.webp"
  alt="Descriptive alt text"
/>
```

#### Callout
Use for tips, warnings, and important information:
```markdown
<Callout type="warning" title="Important">
  Warning content with **markdown** support
</Callout>
```

Types: `tip`, `warning`, `danger`, `info`, `success`

#### Card & CardGroup
Use for service listings or feature showcases:
```markdown
<CardGroup>
  <Card
    title="Service Name"
    image="/docs/images/services/logo.svg"
    link="/services/service-name"
  />
</CardGroup>
```

### Container Syntax (VitePress Built-in)

```markdown
::: warning Custom Title
Warning content here
:::

::: danger
Critical information
:::

::: success
Success message
:::

::: tip
Helpful tip
:::

::: info
Additional information
:::
```

### Code Blocks

Always specify language for syntax highlighting:

```markdown
```bash
npm install
```

```yaml
key: value
```

```docker
FROM ubuntu
```

```javascript
console.log('example')
```
```

## Image Management

### Image Organization

- **Location**: `docs/public/images/[section]/`
- **Format**: Use `.webp` for optimization
- **Naming**: Descriptive kebab-case or numbered (`1.webp`, `2.webp`)
- **Paths**: Always use absolute paths: `/docs/images/...`

### Image Best Practices

1. Always use `<ZoomableImage>` component for screenshots
2. Include descriptive alt text
3. Place images in logically organized directories
4. Use .webp format for best performance
5. Never use relative paths (always `/docs/images/...`)

### Image Directory Structure

```
docs/public/images/
├── services/           # Service logos and screenshots
├── troubleshoot/       # Troubleshooting screenshots
│   ├── applications/
│   ├── dashboard/
│   └── dns-and-domains/
├── knowledge-base/     # KB article images
├── database/           # Database guides
├── get-started/        # Setup guides
└── aws-s3/            # Integration screenshots
```

## Common Tasks

### Adding a New Service

1. Create `docs/services/service-name.md` following the template
2. Add service logo to `docs/public/images/services/`
3. Add entry to `docs/.vitepress/theme/components/Services/List.vue`:
   ```javascript
   {
       name: 'Service Name',
       slug: 'service-name',  // Must match filename without .md
       icon: '/docs/images/services/service-logo.svg',
       description: 'Brief description',
       category: 'Category Name'
   }
   ```
4. Verify service name matches the JSON template

### Renaming a Service

**Critical: Must update all 3 locations**

1. Rename the file: `docs/services/old-name.md` → `docs/services/new-name.md`
2. Update slug in `docs/.vitepress/theme/components/Services/List.vue`:
   ```javascript
   slug: 'new-name',  // Change from 'old-name'
   ```
3. Add redirect in `nginx/redirects.conf`:
   ```nginx
   location = /docs/services/old-name { return 301 /docs/services/new-name; }
   location = /knowledge-base/services/old-name { return 301 /docs/services/new-name; }
   ```
4. Search for internal links referencing the old name

### Disabling a Service

1. Add `disabled: true` to frontmatter:
   ```yaml
   ---
   title: "Service Name"
   description: "Description"
   disabled: true
   ---
   ```
2. Optionally add warning message in content:
   ```markdown
   ::: danger SERVICE TEMPORARILY DISABLED
   This service is currently disabled in Coolify due to known bugs.
   :::
   ```
3. **Keep the file** - do not delete it
4. **Keep nginx redirects** pointing to it

### Adding Documentation Pages

1. Create markdown file in appropriate directory
2. Add required frontmatter (title, description)
3. Update sidebar configuration in `.vitepress/config.mts` if needed
4. Use absolute links for internal references: `/path/to/page`

## Styling Guidelines

### Color Scheme

- **Primary Brand**: Purple (`#7937f3`, `#7442d1`, `#B392F0`)
- **Tips**: Brand purple
- **Warnings**: Yellow
- **Danger/Errors**: Red (`#ff4444`)
- **Success**: Green (`#36d399`)
- **Info**: Blue (`#42b8e7`)

### Responsive Design

- Mobile-first approach
- Breakpoints: 480px, 640px, and larger
- Use Tailwind utility classes
- Test on multiple screen sizes

## Content Guidelines

### Writing Style

- Use clear, conversational language
- Include code examples for technical content
- Link to related documentation sections
- Provide external links to official resources
- Include support/community links when appropriate

### Content Structure

**Step-by-Step Guides:**
- Use numbered headers: `## 1. Step Name`
- Include ZoomableImages at each step
- Use Callout for tips and warnings
- Provide external support link at end

**Configuration Guides:**
- Brief description of tool
- Prerequisites section
- Setup instructions with code blocks
- Common issues with solutions
- External resource links

**Troubleshooting Articles:**
- Clear problem statement
- Step-by-step resolution with screenshots
- Alternative solutions if applicable
- Links to related issues

### Links

- **Internal**: Use relative paths `/services/wordpress`
- **External**: Full URLs with UTM parameter `?utm_source=coolify.io`
- Always include descriptive anchor text (not bare URLs)
- Update redirects when renaming pages

## Build & Development

### Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build production site
npm run preview  # Preview production build
```

### Build Output

- Distribution: `docs/.vitepress/dist/`
- Includes LLM text mappings in `llms-text.json`
- Static HTML output for hosting

### Environment Variables

```bash
VITE_SITE_URL              # Base URL (default: https://coolify.io/docs/)
VITE_ANALYTICS_DOMAIN      # Plausible analytics domain
VITE_KORREKTLY_BASE_URL    # Korrektly API endpoint
VITE_KORREKTLY_API_TOKEN   # Korrektly authentication
VITE_KORREKTLY_DATASET_ID  # Korrektly dataset ID
```

## VitePress Configuration

### Key Settings

- **Base URL**: `/docs/`
- **Clean URLs**: Enabled (no `.html` extensions)
- **Last Updated**: Timestamp enabled
- **Theme**: Dark mode by default (user-changeable)
- **Search**: Local search provider
- **Outline**: Headers h2-h4 in sidebar

### Custom Plugins

1. **vitepress-plugin-tabs** - Tabbed content blocks
2. **vitepress-plugin-llms** - LLM documentation support
3. **vitepress-plugin-group-icons** - Icon grouping for code samples
4. **vite-plugin-yaml** - YAML file support
5. **vitepress-openapi** - OpenAPI spec documentation
6. **vitepress-plugin-coolbot** - Markdown to text for RAG chains

## Important Notes

### Service Documentation
- **Never use camelCase** for filenames, even if the JSON template does
- **Always check the JSON template** before naming services
- **Update all three locations** when renaming: file, List.vue, redirects.conf
- **Maintain redirect rules** even for deleted services to prevent 404 errors

### Images
- Always use `<ZoomableImage>` for screenshots
- Use absolute paths: `/docs/images/...`
- Use `.webp` format for optimization
- Include descriptive alt text

### Content
- All pages must have `title` and `description` in frontmatter
- Use UTM parameters for external links: `?utm_source=coolify.io`
- Internal links should be absolute: `/path/to/page`
- Test all links before committing

### Redirects
- Add redirects in `nginx/redirects.conf` when renaming pages
- Keep redirects even for deleted pages (prevent 404s)
- Format: `location = /old/path { return 301 /new/path; }`

## Common Patterns

### Callout Usage Patterns
- `type="tip"` - Helpful hints and best practices
- `type="warning"` - Important notes, prerequisites
- `type="danger"` - Critical information, breaking changes
- `type="info"` - Additional information
- `type="success"` - Success states, confirmation messages

### Code Example Patterns
```markdown
```bash
# Command with explanation
coolify deploy
```

```yaml
# Configuration example
version: '3'
services:
  app:
    image: nginx
```

```javascript
// Code example with comments
const config = { port: 3000 }
```
```

## Troubleshooting

### Common Issues

1. **Images not displaying**: Check path is absolute (`/docs/images/...`)
2. **Links broken after rename**: Update all 3 locations (file, List.vue, redirects.conf)
3. **Build fails**: Check frontmatter YAML syntax
4. **Service not showing**: Verify slug in List.vue matches filename

### Getting Help

- Check existing documentation for patterns
- Review similar files for examples
- Test locally with `npm run dev` before committing
- Verify all links work after changes
