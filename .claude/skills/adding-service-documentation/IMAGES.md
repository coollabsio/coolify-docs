# Service Logos and Screenshots

The service catalog resolves local icons from `public/images/services/`. Public URLs stay under `/docs/images/services/`.

## Find and Save the Logo

Read the relevant upstream template in Coolify's `templates/compose/` directory. Its `# logo:` comment typically names an asset under `public/svgs/`. Use the same upstream revision for the template and logo.

For a template with `# logo: svgs/appsmith.svg`, the main-branch source is:

```text
https://raw.githubusercontent.com/coollabsio/coolify/main/public/svgs/appsmith.svg
```

Save the asset as `public/images/services/appsmith-logo.svg`. Match the actual source format and extension; do not rename raster data to `.svg`.

Use local assets in committed documentation. See [shared image guidance](../_shared/IMAGES.md) for optimization, accessibility, and supported components.

## Naming and Resolution

For a service with filename `my-service.mdx` and title `My Service`, `scripts/services-data.mjs` checks basename candidates in this order:

1. `my-service-logo`
2. `my-service_logo`
3. `my-servicelogo`
4. `my-service`
5. The title followed by `-logo`
6. The bare title

Matching ignores case and non-alphanumeric characters. Exact candidates are followed by a fuzzy slug-prefix match. Supported extensions are `.svg`, `.png`, `.webp`, `.jpg`, and `.jpeg`.

Use `{slug}-logo.{ext}` for predictable resolution. If an asset is shared or its name does not match, set a frontmatter icon explicitly:

```yaml
icon: "/docs/images/services/some-other-name.svg"
```

An explicit icon must point to an existing file directly under `public/images/services/`. It can also choose between several possible logos. The collector warns about an invalid explicit path even when a fallback resolves.

## Page Images

A Markdown logo is valid MDX:

```mdx
![Service Name](/docs/images/services/service-name-logo.svg)
```

For a screenshot, use descriptive alt text:

```mdx
<ZoomImage src="/docs/images/services/service-name-dashboard.webp" alt="Service dashboard" />
```

`ZoomableImage` remains a supported alias. Both aliases and Markdown images use the same registered image implementation.

## Body Fallback

After explicit and automatic candidates, the collector can use a local image referenced by `<ZoomableImage src="...">` or `![alt](...)` in the body. This fallback does not match `<ZoomImage>`, even though the renderer supports it. Use a predictable filename or explicit frontmatter `icon` for reliable catalog behavior.

A body fallback using `/images/services/...` is normalized to `/docs/images/services/...`; prefer the canonical prefixed URL in new content.

## Verify

1. Check that the asset exists with the expected filename and extension.
2. Run `bun run generate:services` and inspect the service's `icon` in `src/generated/services.json`.
3. Open `/docs/services/overview` and `/docs/services/{slug}` on the development server; verify the card, logo, screenshots, and alt text.
4. Inspect generated diffs and include them with the authored page and assets when committing. Do not edit the JSON by hand.
