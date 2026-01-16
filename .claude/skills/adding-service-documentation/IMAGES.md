# Service Logo Guidelines

How to handle service logos and images.

## Logo Source

Service logos are stored in the Coolify repository:

```
https://github.com/coollabsio/coolify/tree/main/public/svgs
```

The logo filename is specified in the YAML template:

```yaml
# logo: svgs/appsmith.svg
```

## Download Logo to Documentation

**IMPORTANT: Always download and store logos locally. Do NOT link to external URLs.**

**Source:** Coolify GitHub repository `public/svgs/{logo-name}.svg`
**Destination:** `docs/public/images/services/{service}-logo.{ext}`

Download directly from GitHub raw URL:

```
https://raw.githubusercontent.com/coollabsio/coolify/main/public/svgs/{logo-name}.svg
```

### Why Download Locally?

✅ **Benefits of local storage:**
- **Full control:** No broken links if external source changes or moves
- **Consistency:** Logos won't disappear or change unexpectedly
- **Performance:** Faster loading from same domain (no external requests)
- **Reliability:** Documentation works offline and in restricted networks
- **Optimization:** Can compress and optimize images for docs
- **Version control:** Track logo changes in git history

❌ **Risks of external links:**
- External URLs can break or change without notice
- No control over image optimization or format
- Slower page loads due to external requests
- CORS or security issues in some environments
- Documentation breaks if external service is down

### Naming Convention

Format: `{service-name}-logo.{extension}`

**Examples:**

- `appsmith-logo.svg`
- `ghost-logo.webp`
- `nextcloud-logo.png`

**Rules:**

- Use lowercase
- Use hyphens for spaces
- Keep original extension
- Always include `-logo` suffix

## File Format Preferences

1. **SVG** - Best for vector logos (preferred)

   - Scalable, small file size
   - Perfect for logos and icons

2. **WebP** - Best for raster images

   - Modern format, great compression
   - Supported by all modern browsers

3. **PNG** - Acceptable alternative

   - Good for logos with transparency
   - Larger file size than WebP

4. **JPEG** - Avoid for logos
   - No transparency support
   - Lossy compression affects quality

## Image Optimization

### Before adding images:

1. **Compress** - Use tools like:

   - [Squoosh](https://squoosh.app/) for WebP conversion
   - [SVGOMG](https://jakearchibald.github.io/svgomg/) for SVG optimization

2. **Check size** - Keep under 100KB when possible

   - SVG: Usually < 50KB
   - WebP: Aim for < 100KB
   - PNG: Compress if > 100KB

3. **Verify dimensions** - Logos should be:
   - Minimum 200px wide
   - Square or landscape orientation
   - High enough resolution for zoom

## Using Images in Documentation

### When to Use Each Syntax

| Image Type | Syntax | Example |
|------------|--------|---------|
| Logos (small) | Standard markdown | `![Appsmith](/docs/images/services/appsmith-logo.svg)` |
| Screenshots | `<ZoomableImage>` | `<ZoomableImage src="/docs/images/services/dashboard.webp" />` |
| Large images | `<ZoomableImage>` | `<ZoomableImage src="/docs/images/services/overview.webp" />` |

### For Service Logos

Use standard markdown image syntax for logos:

```markdown
![ServiceName](/docs/images/services/servicename-logo.svg)
```

**Important:**

- Path starts with `/docs/` (not `/public/`)
- Use exact filename including extension
- Include alt text for accessibility

### For Screenshots and Large Images

Use `<ZoomableImage>` for images users may want to zoom into:

```vue
<ZoomableImage src="/docs/images/services/appsmith-dashboard.webp" />
```

**Use ZoomableImage for:**

- Dashboard screenshots
- Configuration panels
- UI walkthroughs
- Any image with details users need to see closely

**Screenshot guidelines:**

- Save as WebP for best compression
- Optimize/compress before adding
- Use descriptive filenames
- Keep reasonable dimensions (max 1920px wide)

### For External Images

**⚠️ Avoid external image links when possible. Only use temporarily.**

```markdown
![Appsmith](https://raw.githubusercontent.com/appsmithorg/appsmith/release/static/images/logo.png)
```

**Only acceptable for:**

- **Temporary placeholder** while downloading/optimizing the proper logo

**Action required:** Replace external links with downloaded versions before finalizing documentation.

## Path Reference

All image paths in documentation use this structure:

**File system location:**

```
docs/public/images/services/logo.svg
```

**In markdown/Vue:**

```
/docs/images/services/logo.svg
```

**Note:** The `/public/` part is omitted in references because VitePress serves files from `public/` at the root `/docs/` path.

## Services List (List.vue)

When adding to the services array in `List.vue`:

```javascript
{
    name: 'Appsmith',
    slug: 'appsmith',
    icon: '/docs/images/services/appsmith-logo.svg',  // Same path as docs
    description: '...',
    category: 'Development'
}
```

## Troubleshooting Images

### Image not displaying

1. **Check file exists:**

   ```bash
   ls docs/public/images/services/{name}-logo.{ext}
   ```

2. **Verify path in code:**

   - Should start with `/docs/images/services/`
   - Should NOT include `/public/`

3. **Check file extension matches:**
   - If file is `.svg`, code must use `.svg`
   - Case-sensitive on some systems

### Image shows fallback icon

This happens when the image fails to load. Check:

1. Path is correct in `List.vue`
2. File exists in `docs/public/images/services/`
3. File is not corrupted
4. Network can access the file

### Image quality issues

- **Blurry:** Image too small, need higher resolution
- **Pixelated:** Use SVG instead of raster, or larger PNG/WebP
- **Large file size:** Compress with Squoosh or similar tool
- **Wrong colors:** Check dark mode compatibility

## Best Practices

✅ **Do:**

- **Download ALL logos locally** to `docs/public/images/services/`
- Use SVG for vector logos
- Convert PNG to WebP for better compression
- Optimize all images before adding
- Use descriptive, consistent naming
- Keep file sizes reasonable
- Test images in both light and dark themes
- Use standard markdown `![alt](path)` for logos
- Use `<ZoomableImage>` for screenshots and large images

❌ **Don't:**

- **Use external image URLs** (GitHub, CDNs, etc.) - always download locally
- Use JPEG for logos
- Add uncompressed images
- Use inconsistent naming
- Forget the `-logo` suffix
- Use spaces or uppercase in filenames
- Reference images with wrong extensions
- Link to images that might break or change
- Use `<ZoomableImage>` for small logos (unnecessary zoom)
