# Service Catalog Generation

The catalog is generated from authored MDX pages, rather than a manually maintained component array.

| Output | Generator | Consumer |
|---|---|---|
| `src/generated/services.json` | `scripts/generate-service-list.mjs` | `src/components/data/services-list.tsx`, shown at `/docs/services/overview` |
| `content/docs/services/all.mdx` | `scripts/generate-services-page.mjs` | Categorized directory at `/docs/services/all` |

**Do not hand-edit these outputs.** Run:

```bash
bun run generate:services
```

Individual commands are `bun run generate:services:data` and `bun run generate:services:page`. Generation also runs before `dev`, `build`, and `types:check`; `preview` serves the existing build.

## Collector Contract

Both generators call `scripts/services-data.mjs`, which:

1. Reads top-level `.mdx` files in `content/docs/services/`.
2. Excludes `all.mdx`, `index.mdx`, `overview.mdx`, `how-services-work.mdx`, and `what-is-a-service.mdx`.
3. Parses top-level scalar frontmatter values and derives the slug from the filename.
4. Resolves icons from `public/images/services/`.
5. Sorts records alphabetically by display name.

For example, `content/docs/services/my-service.mdx` yields slug `my-service` and an internal URL of `/services/my-service`.

| Frontmatter | Generated field |
|---|---|
| `title` | `name` (falls back to the slug when absent) |
| `description` | `description` (falls back to an empty string) |
| `category` | `category` (falls back to `Uncategorized`) |
| `icon` | First valid icon candidate |
| `disabled` | Included as `true` when the service is disabled |

Always supply a useful title, description, and category even though the collector has fallbacks. Nested `og` metadata does not contribute to catalog entries.

## Icon Resolution

The collector tries a valid frontmatter `icon`, then an automatically matched local image, then a body-image fallback. A candidate must refer to an existing file directly under `public/images/services/`, using a `/docs/images/services/...` URL.

Automatic basename candidates are `<slug>-logo`, `<slug>_logo`, `<slug>logo`, the bare `<slug>`, `<title>-logo`, and the bare `<title>`. Comparison ignores case and non-alphanumeric characters. Recognized extensions are `.svg`, `.png`, `.webp`, `.jpg`, and `.jpeg`. A fuzzy slug-prefix match follows exact candidates.

The body fallback recognizes `<ZoomableImage src="...">` or a Markdown image. `<ZoomImage>` is supported by the renderer, but it is not matched by this fallback; give it a resolver-friendly asset name or set `icon` explicitly.

An invalid explicit icon produces a warning even if another candidate resolves. An enabled service with no icon also produces a warning.

## Availability

The collector sets `disabled: true` when the frontmatter flag is true or the page contains a recognized title: `SERVICE HIDDEN`, `SERVICE NOT AVAILABLE`, `SERVICE REMOVED FROM COOLIFY`, or `SERVICE TEMPORARILY DISABLED` (case-insensitive).

The JSON retains disabled records. The React listing filters them out, and the directory generator omits them from `all.mdx`; their source pages remain reachable. Prefer an explicit frontmatter flag plus a visible MDX callout. See [disabling-services](../disabling-services/SKILL.md).

## Categories

Categories are used verbatim for filters and directory headings. Match the spelling and capitalization already in use. To inspect current categories after generation:

```bash
node --input-type=module -e 'import { collectServices } from "./scripts/services-data.mjs"; console.log([...new Set((await collectServices()).map(service => service.category))].sort().join("\n"))'
```

Reuse a category when it fits. An intentional new value creates a new filter and a heading when it has enabled services. The directory sorts categories and service names alphabetically.

## Verify Changes

Inspect `git diff -- src/generated/services.json content/docs/services/all.mdx` after regeneration. Check the expected slug, title, description, category, icon, and availability, then inspect the page and catalog in the development server. See [TESTING.md](../TESTING.md) for an isolated path check.
