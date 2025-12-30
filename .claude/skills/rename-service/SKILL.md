---
name: rename-service
description: Rename a service documentation file and update all references. Use when renaming services, changing service slugs, or when a service name in the Coolify repository changes.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Rename Service Documentation

This skill guides you through renaming a service in the Coolify documentation, ensuring all references are updated correctly.

## When to Use This Skill

- Service name changed in the Coolify repository
- Fixing incorrect service naming (e.g., camelCase to kebab-case)
- Consolidating duplicate service documentation
- Correcting typos in service slugs

## Critical: Three Locations Must Be Updated

When renaming a service, you **MUST** update all three locations:

1. **Documentation file** (`docs/services/`)
2. **Services list** (`docs/.vitepress/theme/components/Services/List.vue`)
3. **Nginx redirects** (`nginx/redirects.conf`)

Failing to update all three will cause broken links or 404 errors.

## Step-by-Step Process

### 1. Rename the Documentation File

```bash
# Rename the markdown file
git mv docs/services/old-name.md docs/services/new-name.md
```

**Naming rules:**
- Use lowercase only
- Use hyphens for spaces (kebab-case)
- Match the service name from `service-templates-latest.json`
- Don't use camelCase even if the JSON does (e.g., `denoKV` → `denokv.md`)

### 2. Update the Services List

Edit `docs/.vitepress/theme/components/Services/List.vue`:

```javascript
// Find the service entry and update the slug
{
    name: 'Service Name',
    slug: 'new-name',  // ← Change from 'old-name'
    icon: '/docs/images/services/service-logo.svg',
    description: 'Service description',
    category: 'Category'
},
```

### 3. Add Nginx Redirects

Add redirect rules to `nginx/redirects.conf`:

```nginx
# Redirect old service URL to new URL
location = /docs/services/old-name { return 301 /docs/services/new-name; }

# Also redirect legacy knowledge-base path if it existed
location = /knowledge-base/services/old-name { return 301 /docs/services/new-name; }
```

**Important:** Keep redirects even for deleted pages to prevent 404 errors from search engines and bookmarks.

### 4. Update Internal Links

Search for any internal links referencing the old name:

```bash
# Search for references to the old service name
grep -r "old-name" docs/
```

Update any found references in other documentation files.

### 5. Rename Logo File (If Needed)

If the logo filename also needs updating:

```bash
# Rename the logo
git mv docs/public/images/services/old-name-logo.svg docs/public/images/services/new-name-logo.svg
```

Then update the `icon` path in List.vue.

## Verification Checklist

After renaming, verify:

- [ ] New file exists: `docs/services/new-name.md`
- [ ] Old file removed or redirected
- [ ] List.vue `slug` matches new filename
- [ ] List.vue `icon` path is correct
- [ ] Redirect added to `nginx/redirects.conf`
- [ ] No broken internal links (run `grep -r "old-name" docs/`)
- [ ] Service appears correctly at http://localhost:5173/docs/services/new-name
- [ ] Old URL redirects to new URL

## Common Scenarios

### Fixing camelCase to kebab-case

When the Coolify JSON uses camelCase but docs should use lowercase:

- `denoKV` → `denokv.md`
- `homeAssistant` → `home-assistant.md`

### Adding Version Numbers

When Coolify adds version-specific services:

- `mautic.md` → `mautic5.md` (if JSON specifies `mautic5`)

### Consolidating Names

When compound names are required:

- `ente.md` → `ente-photos.md` (if JSON specifies `ente-photos`)

## Troubleshooting

### Service shows 404

- Check if redirect is in `nginx/redirects.conf`
- Verify slug in List.vue matches filename
- Ensure markdown file exists

### Old URL still works without redirect

- Nginx config may need reload
- Check redirect syntax in `redirects.conf`

### Search engines still show old URL

- Redirects are working correctly (301 tells search engines to update)
- Takes time for search engines to re-crawl

## Related Skills

- `add-service-documentation` - For creating new service docs
- `disable-service` - For hiding deprecated services
