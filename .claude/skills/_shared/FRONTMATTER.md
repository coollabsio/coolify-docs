# Frontmatter Reference

Required and optional frontmatter fields for documentation pages.

## Required Fields

Every documentation page MUST have:

```yaml
---
title: "Page Title"
description: "SEO-friendly description (150-160 characters ideal)."
---
```

### Title Guidelines

- **Be specific**: "Deploying Laravel on Coolify" not "Laravel"
- **Include context**: Users should know what they'll learn
- **Keep concise**: Under 60 characters for SEO

### Description Guidelines

- **Summarize the page**: What will users learn or accomplish?
- **Include keywords**: Terms users might search for
- **Length**: 150-160 characters is ideal for search results

## Optional: Open Graph Image

Override the default social sharing image:

```yaml
---
title: "Page Title"
description: "Description here."
image: /docs/images/og/custom-og-image.png
---
```

### How Open Graph Works

VitePress automatically generates OG meta tags from frontmatter:

| Frontmatter | OG Tag | Fallback |
|-------------|--------|----------|
| `title` | `og:title` | Page heading or "Coolify Docs" |
| `description` | `og:description` | Default site description |
| `image` | `og:image` | `https://coolcdn.b-cdn.net/assets/coolify/og-image-docs.png` |

The same values are used for Twitter Card tags (`twitter:title`, etc.).

### Custom OG Images

For pages that benefit from custom social images (major features, key guides):

1. **Create image**: 1200×630px recommended (summary_large_image)
2. **Save to**: `docs/public/images/og/`
3. **Reference in frontmatter**: Use `/docs/images/og/filename.png`

**Note:** Relative paths are automatically converted to absolute URLs.

## Complete Example

```yaml
---
title: "How to Deploy WordPress on Coolify"
description: "Step-by-step guide to deploying WordPress with automatic SSL, backups, and one-click updates using Coolify."
image: /docs/images/og/wordpress-guide.png
---
```

## Validation Checklist

- [ ] `title` is present and specific
- [ ] `description` is present and descriptive
- [ ] Title under 60 characters (for SEO)
- [ ] Description 150-160 characters (for search results)
- [ ] Custom `image` only if page warrants it
