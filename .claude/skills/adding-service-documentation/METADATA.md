# Service Metadata Extraction

How to extract service information from Coolify's upstream YAML templates and map it to your service page's frontmatter.

## YAML Template Location

Service templates live in the Coolify repository:

```
https://github.com/coollabsio/coolify/tree/main/templates/compose
```

Files: `{service-name}.yaml`

## Upstream Metadata Format

Each YAML template starts with metadata comments:

```yaml
# documentation: https://example.com
# slogan: Short service description
# category: category-name
# tags: tag1, tag2, tag3
# logo: svgs/service-name.svg
# ignore: false  # if true, skip documentation entirely

services:
  service-name:
    image: ...
```

## How Upstream Metadata Maps to Docs Frontmatter

| Upstream YAML comment | Docs frontmatter / output |
|---|---|
| `documentation` | Used in the page body's `## Links` section as the official-website link |
| `slogan` | Becomes the `description` in frontmatter (which becomes the card description and `all.mdx` entry) |
| `category` | Becomes `category` in frontmatter; capitalize properly (e.g., `productivity` → `Productivity`) |
| `tags` | Not used in docs frontmatter, but useful context for writing the page |
| `logo` | Download to `public/images/services/`. If you name it `<slug>-logo.<ext>`, you don't need an `icon` field — see [IMAGES.md](./IMAGES.md) for the resolver rules |
| `ignore: true` | Do not create documentation for this service |

## Resulting Docs Frontmatter

```yaml
---
title: "Appsmith"                                    # filename + capitalization
description: "A low-code application platform..."    # from slogan
category: "Productivity"                             # from category, capitalized
icon: "/docs/images/services/appsmith-logo.svg"      # optional if logo is named so the resolver finds it
---
```

## Extraction Example

**Upstream YAML** (`appsmith.yaml`):

```yaml
# documentation: https://appsmith.com
# slogan: A low-code application platform for building internal tools.
# category: productivity
# tags: lowcode, nocode, no, low, platform
# logo: svgs/appsmith.svg
```

**Docs frontmatter:**

```yaml
---
title: "Appsmith"
description: "A low-code application platform for building internal tools."
category: "Productivity"
icon: "/docs/images/services/appsmith-logo.svg"
---
```

**Logo:** download `https://raw.githubusercontent.com/coollabsio/coolify/main/public/svgs/appsmith.svg` and save to `public/images/services/appsmith-logo.svg`.

## GitHub Repository Lookup

If the upstream YAML doesn't link the GitHub repo directly, find it via:

- The service's website (footer or About page)
- GitHub search: `https://github.com/search?q={service-name}`
- The service's official documentation

Most open-source services link their GitHub repository prominently.

## Category Capitalization

The upstream `category` is lowercase. The docs use **Title Case** consistently. Examples:

| Upstream | Docs |
|---|---|
| `productivity` | `Productivity` |
| `cms` | `CMS` |
| `ai` | `AI` |
| `business` | `Business` |
| `file-management` | `File Management` |

See [CATALOG.md](./CATALOG.md) for how to inspect the categories currently in use.
