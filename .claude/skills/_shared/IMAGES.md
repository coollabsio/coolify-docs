# Images in MDX

Store documentation assets in `public/images/{section}/` and reference them as `/docs/images/{section}/{filename}`. The `/docs` public URL prefix is valid and must not be removed when updating filesystem paths.

| File on disk | URL in MDX |
|---|---|
| `public/images/services/appsmith-logo.svg` | `/docs/images/services/appsmith-logo.svg` |
| `public/images/applications/domain.webp` | `/docs/images/applications/domain.webp` |

Use the exact filename, extension, and case. Prefer lowercase kebab-case for new assets. Keep related screenshots together under the existing section's image directory.

## Supported Syntax

Markdown images are supported:

```mdx
![Appsmith](/docs/images/services/appsmith-logo.svg)
```

For an explicit image component:

```mdx
<ZoomImage src="/docs/images/applications/domain.webp" alt="Application domain settings" />
```

The legacy alias remains supported:

```mdx
<ZoomableImage src="/docs/images/applications/domain.webp" alt="Application domain settings" />
```

`src/components/docs/mdx.tsx` maps Markdown images, `Image`, `ZoomImage`, and `ZoomableImage` to the same zoomable-image implementation. No import is needed for these registered components. Do not rewrite valid `ZoomableImage` uses just because the docs moved to MDX.

## Assets and Accessibility

- Download service logos locally rather than depending on remote image URLs.
- Prefer SVG for vector logos, WebP for screenshots and raster images, and PNG when needed for transparency.
- Optimize large images while keeping UI text readable; aim for under 100 KB when practical.
- Add meaningful alt text describing the screen, setting, or diagram.
- Check both light and dark themes when a logo may disappear against the background.

## Service Icons

The catalog resolves icons from files directly under `public/images/services/`. Name the logo `{slug}-logo.svg` (or its actual extension), or set an explicit `icon: "/docs/images/services/..."` in frontmatter.

The catalog's body-image fallback is narrower than the renderer: it recognizes Markdown images and `ZoomableImage`, but not `ZoomImage`. Prefer a matching filename or explicit `icon` instead of relying on that fallback. See [service image rules](../adding-service-documentation/IMAGES.md).
