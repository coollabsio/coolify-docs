# Sidebar Configuration

Fumadocs navigation is defined by `meta.json` files under `content/docs/`. Edit the metadata for the folder containing the page, rather than a central application config.

## Add a Page

For `content/docs/knowledge-base/my-guide.mdx`, add `my-guide` to `content/docs/knowledge-base/meta.json` while preserving its existing entries:

```json
{
  "title": "Knowledge Base",
  "root": true,
  "pages": [
    "---How-To Guides---",
    "my-guide",
    "other-guide"
  ]
}
```

Page entries are relative to the folder containing `meta.json`, with no leading slash or `.mdx` extension. The display title normally comes from the page's frontmatter. `---Heading---` creates a section separator.

## Nested Sections

For `content/docs/knowledge-base/docker/my-guide.mdx`:

1. Add `docker` to the parent folder's `pages` array when it should appear as a nested folder.
2. Create or update `content/docs/knowledge-base/docker/meta.json`:

```json
{
  "title": "Docker",
  "pages": ["index", "my-guide"]
}
```

Use `index` only when that folder actually contains `index.mdx`. Do not add `root: true` to every nested folder; it is used for top-level navigation sections in this repository. Follow nearby metadata for collapsibility and ordering.

## Navigation Entries and Page Links

| Source file | Local metadata entry | Internal Markdown link |
|---|---|---|
| `content/docs/knowledge-base/my-guide.mdx` | `my-guide` in `knowledge-base/meta.json` | `/knowledge-base/my-guide` |
| `content/docs/troubleshoot/applications/my-error.mdx` | `my-error` in `troubleshoot/applications/meta.json` | `/troubleshoot/applications/my-error` |
| `content/docs/start-with-self-hosted.mdx` | `start-with-self-hosted` in the root `meta.json` | `/start-with-self-hosted` |

Some metadata uses nested entries such as `configuration/overview` or custom link labels such as `[Guidelines](/contribute/guidelines)`. Preserve the existing style rather than replacing a whole section with the minimal examples above.

A page can stay outside an explicit navigation list when it is intentionally reached through cross-links. Individual one-click services are reached through the generated catalog, so they do not each need a sidebar entry.

## Verify

Run `bun run dev`, open `http://localhost:3000/docs/`, and check the page title, ordering, section labels, nested navigation, and link destination. Add redirects when renaming an existing page; see [renaming-services](../renaming-services/SKILL.md) for the Nginx URL convention.
