# Image Guidelines

How to use images in Coolify documentation.

## Quick Reference

| Image Type | Syntax | When to Use |
|------------|--------|-------------|
| Logos/icons | `![Alt](/docs/images/path.svg)` | Small images, service logos |
| Screenshots | `<ZoomableImage src="/docs/images/path.webp" />` | UI screenshots, large images |
| Diagrams | Either (based on size) | Architecture diagrams, flowcharts |

## Standard Markdown Images

Use for **small images** that don't need zoom capability:

```markdown
![Service Name](/docs/images/services/service-logo.svg)
```

**Best for:**
- Service logos
- Small icons
- Badges and status indicators
- Simple inline graphics

## ZoomableImage Component

Use for **large images** users may want to examine closely:

```vue
<ZoomableImage src="/docs/images/section/screenshot.webp" alt="Description" />
```

**Best for:**
- Dashboard screenshots
- Configuration panels
- UI walkthroughs
- Any image with fine details

## File Paths

### Storage Location

```
docs/public/images/{section}/{filename}.{ext}
```

**Sections:**
- `services/` - Service logos and screenshots
- `get-started/` - Getting started guide images
- `applications/` - Application deployment screenshots
- `knowledge-base/` - KB article images
- `og/` - Open Graph social images

### In Documentation

```
/docs/images/{section}/{filename}.{ext}
```

**Note:** The `/public/` part is omitted - VitePress serves from `/docs/` directly.

## File Format Preferences

| Format | Use For | Notes |
|--------|---------|-------|
| SVG | Vector logos, icons | Best quality, smallest size |
| WebP | Screenshots, photos | Modern format, great compression |
| PNG | Logos with transparency | When SVG unavailable |
| JPEG | Never for logos | Avoid - no transparency, lossy |

## Optimization

Before adding images:

1. **Compress**: Use [Squoosh](https://squoosh.app/) or [SVGOMG](https://jakearchibald.github.io/svgomg/)
2. **Check size**: Keep under 100KB when possible
3. **Verify dimensions**: Screenshots max 1920px wide

## Naming Convention

```
{descriptive-name}-{type}.{ext}
```

**Examples:**
- `wordpress-logo.svg` (service logo)
- `deploy-button.webp` (UI screenshot)
- `architecture-diagram.svg` (diagram)

**Rules:**
- Lowercase only
- Hyphens for spaces
- Include type suffix (`-logo`, `-screenshot`, `-diagram`)
- Match actual file extension

## Common Mistakes

❌ **Don't:**
- Use external image URLs (GitHub raw, CDNs)
- Use `<ZoomableImage>` for small logos (unnecessary zoom)
- Use relative paths (`./images/...`)
- Forget alt text for accessibility

✅ **Do:**
- Download all images locally
- Use standard markdown for logos
- Use ZoomableImage for screenshots
- Start paths with `/docs/images/`
- Include descriptive alt text
