# Service Documentation Guide

How to write service documentation pages.

## File Location

Create markdown file at:
```
docs/services/{service-slug}.md
```

**Naming convention:** lowercase, hyphenated
- ✅ `my-service.md`
- ❌ `MyService.md`
- ❌ `my_service.md`

## Required Structure

### Frontmatter (YAML)

Every service page must start with frontmatter:

```yaml
---
title: "ServiceName"
description: "Here you can find the documentation for hosting ServiceName with Coolify."
---
```

**title:** Service name with proper capitalization
**description:** SEO-friendly description (used in meta tags and search)

### Page Sections

#### 1. Title
```markdown
# ServiceName
```

#### 2. Logo (Required)
```markdown
![ServiceName](/docs/images/services/service-logo.webp)
```

**Important:**
- **Always download logo locally first** - never use external URLs
- Use standard markdown `![alt](path)` for logos
- Use `<ZoomableImage>` only for large images/screenshots users need to zoom
- Path starts with `/docs/images/services/`
- Extension must match actual file
- Download from: `https://raw.githubusercontent.com/coollabsio/coolify/main/public/svgs/{logo}.svg`

#### 3. What is ServiceName?
```markdown
## What is ServiceName?

[2-4 paragraphs describing the service, features, and use cases]
```

**Writing tips:**
- Start with what the service does
- Explain key features
- Mention who it's for
- Keep language simple and clear

#### 4. Links (Required)
```markdown
## Links

- [The official website](https://example.com?utm_source=coolify.io)
- [GitHub](https://github.com/org/repo?utm_source=coolify.io)
```

**Important:** Always append `?utm_source=coolify.io` to external links

## Optional Sections

Add these sections when relevant:

### Features
```markdown
## Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description
```

### Why ServiceName
```markdown
## Why ServiceName

Explain the benefits and unique selling points:
- Benefit 1
- Benefit 2
```

### Learning Resources
```markdown
## Learning Resources

- [Documentation](https://docs.example.com?utm_source=coolify.io)
- [Tutorials](https://example.com/tutorials?utm_source=coolify.io)
- [Videos](https://youtube.com/@channel?utm_source=coolify.io)
```

### Configuration
```markdown
## Configuration

Special setup instructions or environment variables:

1. Configure X
2. Set environment variable Y
3. Restart the service
```

### Need Help?
```markdown
## Need Help?

- [Discord](https://discord.gg/invite?utm_source=coolify.io)
- [Community Forum](https://forum.example.com?utm_source=coolify.io)
- [support@example.com](mailto:support@example.com)
```

## Documentation Templates

See [TEMPLATES.md](./TEMPLATES.md) for complete examples:
- Minimal template (Ghost)
- Comprehensive template (Appsmith)

## Writing Style Guidelines

1. **Clear and Simple:** Write for non-native English speakers
2. **Concise:** Get to the point quickly
3. **Helpful:** Focus on what users can accomplish
4. **Accurate:** Verify information from official sources
5. **Structured:** Use headings, lists, and short paragraphs

## Common Mistakes

❌ **Don't:**
- **Use external image URLs** - always download logos locally first
- Use relative paths for images
- Omit UTM parameters from external links
- Use overly technical jargon
- Include installation instructions (Coolify handles this)
- Use `<ZoomableImage>` for small logos (unnecessary zoom)

✅ **Do:**
- **Download ALL logos to `docs/public/images/services/`** before using
- Use standard markdown `![alt](path)` for logos
- Use `<ZoomableImage>` for screenshots and large images
- Start image paths with `/docs/images/services/`
- Add `?utm_source=coolify.io` to all external links
- Write in simple, clear language
- Focus on what the service does and why to use it

## Content Sources

Where to find information:
1. Service's official website
2. GitHub README
3. Official documentation
4. Service's "About" page
5. Existing documentation in the repository
