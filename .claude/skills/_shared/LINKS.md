# Documentation Links

## Internal Routes

Use extensionless absolute paths from the content root, without the deployment's `/docs` prefix:

```markdown
[WordPress guide](/services/wordpress)
[Choose your setup](/choose-your-path)
[SSH keys](/core/infrastructure/servers/ssh-keys)
[Laravel guide](/applications/framework-examples/php/laravel)
```

For example, `content/docs/services/wordpress.mdx` maps to `/services/wordpress` in authored links and `http://localhost:3000/docs/services/wordpress` in the browser. A folder's `index.mdx` maps to the folder route itself.

Use a page that actually exists rather than guessing a path from its title. Check the current `content/docs/` tree and local section `meta.json` files. See [SIDEBAR.md](../adding-documentation-pages/SIDEBAR.md) for navigation entries, which use a different folder-relative format.

Image URLs follow a different convention and retain `/docs/images/...`; see [IMAGES.md](./IMAGES.md).

## External Resources

Use descriptive Markdown labels and complete HTTPS URLs. Follow the existing tracking convention for third-party documentation and project links:

```markdown
[Official documentation](https://docs.example.com?utm_source=coolify.io)
[Configuration reference](https://example.com/page?tab=config&utm_source=coolify.io)
```

Preserve existing query parameters and fragments. Use `&utm_source=coolify.io` when a query string already exists. Coolify's own GitHub, Discord, and changelog links do not need tracking parameters. The MDX runtime handles link rendering; do not add manual external-link decorations.

## Anchors

```markdown
[Configuration options](#configuration)
[WordPress troubleshooting](/services/wordpress#troubleshooting)
```

Use the heading's actual generated anchor. Repeated headings and punctuation can affect the ID; inspect the rendered link when unsure.

## Renamed Pages

Update authored cross-links and preserve old public routes in `nginx/redirects.conf`. Rules must accept the optional `/docs` prefix and optional trailing slash, and redirect to the canonical `/docs/...` URL. Run `bun run check:redirects -- --base origin/next` for renamed or removed paths.

For a running site, `node scripts/check-links.js <docs-url>` can check broken links. Nginx redirects do not run in the Vite development server.
