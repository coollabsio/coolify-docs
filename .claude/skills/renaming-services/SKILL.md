---
name: renaming-services
description: Rename a Coolify service documentation slug in content/docs/services/, update references and local icons, regenerate catalogs, and preserve old URLs with Nginx redirects.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Rename Service Documentation

The slug is the `.mdx` filename in `content/docs/services/`. The searchable catalog and categorized directory derive their entries from that page; neither generated output is hand-edited.

## Workflow

### 1. Rename the Page

```bash
git mv content/docs/services/old-name.mdx content/docs/services/new-name.mdx
```

Use a lowercase kebab-case slug that matches the intended service identity. Confirm the relevant upstream template when choosing a new name; a display-title correction alone does not require changing the URL.

### 2. Check Title and Images

Update `title` and the body when the displayed name changes. If the icon was resolved from the old slug, either rename the local asset or keep the asset and set an explicit `icon` path:

```yaml
icon: "/docs/images/services/old-name-logo.svg"
```

If renaming the asset, update frontmatter and body references too:

```bash
git mv public/images/services/old-name-logo.svg public/images/services/new-name-logo.svg
```

The resolver accepts an existing icon under `/docs/images/services/`. See [IMAGES.md](../adding-service-documentation/IMAGES.md) for naming and resolution details.

### 3. Preserve Old URLs

Add rules to `nginx/redirects.conf` that handle both prefixed and stripped requests, with optional trailing slashes:

```nginx
location ~ ^(?:/docs)?/services/old-name/?$ { return 301 "/docs/services/new-name"; }
```

If an older knowledge-base route existed, preserve that too:

```nginx
location ~ ^(?:/docs)?/knowledge-base/services/old-name/?$ { return 301 "/docs/services/new-name"; }
```

Check existing rules for shadowing and loops. Keep older redirects working, preferably pointing straight to the final destination. See `CLAUDE.md` for the deployment's `/docs` prefix handling.

### 4. Update Authored References

```bash
rg -n 'old-name' content/docs src public templates
```

Update relevant handwritten links and image references, plus any explicit section `meta.json` entry. Individual service pages normally use the generated catalog rather than individual sidebar entries. Leave intentional upstream names and historical references intact.

### 5. Regenerate and Verify

```bash
bun run generate:services
bun run check:redirects -- --base origin/next
```

Check `src/generated/services.json` and `content/docs/services/all.mdx` for the new slug and destination. Do not edit either output by hand. When committing, include the rename, any asset changes, cross-links, redirect rules, and both generated outputs.

## Verification

- `content/docs/services/new-name.mdx` exists; the old source file is gone.
- The title, category, icon, and disabled state remain correct after regeneration.
- The old slug is absent from catalog records and directory links.
- The new page and catalog card work at `http://localhost:3000/docs/services/new-name` and `/docs/services/overview`.
- The redirect checker passes for prefixed, stripped, and trailing-slash old URLs. Nginx redirects are not executed by the Vite development server; verify HTTP redirect behavior in a deployment or Nginx preview when available.

See [TESTING.md](../TESTING.md) for generator checks.

## Related Skills

- [adding-service-documentation](../adding-service-documentation/SKILL.md): create service pages and metadata.
- [disabling-services](../disabling-services/SKILL.md): hide unavailable services while keeping their pages reachable.
