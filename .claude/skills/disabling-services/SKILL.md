---
name: disabling-services
description: Hides or disables a service from the documentation listing while preserving the page for SEO and bookmarks. Use when deprecating services, marking services unavailable, adding disabled:true to List.vue, or adding warning callouts to service pages. Keeps docs/services/ pages accessible via direct URL.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Disable Service Documentation

This skill guides you through hiding a service from the documentation listing while preserving the documentation page for SEO and users who find it via search.

## When to Use This Skill

- Service is deprecated in Coolify
- Service is temporarily unavailable
- Service is removed from Coolify's service catalog
- Service has been replaced by another service

## Why Keep the Documentation File?

**DO NOT delete the documentation file.** Keep it because:

1. **SEO preservation** - Users may find the page via search engines
2. **Bookmark support** - Users may have bookmarked the page
3. **Historical reference** - Users may need to understand what the service was
4. **Future reinstatement** - Service may become available again

## Step-by-Step Process

### 1. Add `disabled: true` to List.vue

Edit `docs/.vitepress/theme/components/Services/List.vue`:

```javascript
{
    name: 'Service Name',
    slug: 'service-name',
    icon: '/docs/images/services/service-logo.svg',
    description: 'Service description',
    category: 'Category',
    disabled: true  // ← Add this line
},
```

This hides the service from the services listing page but keeps the documentation accessible via direct URL.

### 2. Add Warning Callout to Documentation

Edit the service's markdown file (`docs/services/service-name.md`):

Add a warning callout at the **top** of the content (after frontmatter):

```markdown
---
title: "Service Name"
description: "..."
---

::: warning SERVICE NOT AVAILABLE
This service is currently not available in Coolify's service catalog.
:::

# Service Name
...
```

### 3. Optional: Add Context

If you know why the service is unavailable, add context:

```markdown
::: warning SERVICE DEPRECATED
This service has been deprecated and replaced by [New Service](/services/new-service).
Please use the new service for all new deployments.
:::
```

Or for temporary unavailability:

```markdown
::: warning TEMPORARILY UNAVAILABLE
This service is temporarily unavailable due to upstream changes.
We're working on bringing it back. Check the [Coolify changelog](https://coolify.io/changelog) for updates.
:::
```

### 4. Keep Redirects (If Any)

If the service had any redirects pointing to it in `nginx/redirects.conf`, **keep them**. They ensure users reaching old URLs still find the page.

## Warning Message Templates

### Generic unavailable

```markdown
::: warning SERVICE NOT AVAILABLE
This service is currently not available in Coolify's service catalog.
:::
```

### Deprecated with replacement

```markdown
::: warning SERVICE DEPRECATED
This service has been deprecated and replaced by [Alternative Service](/services/alternative).
Please migrate to the new service.
:::
```

### Temporarily removed

```markdown
::: warning TEMPORARILY UNAVAILABLE
This service is temporarily unavailable. Check the [Coolify Discord](https://discord.gg/coolify) for updates on when it will return.
:::
```

### Removed due to issues

```markdown
::: danger SERVICE REMOVED
This service has been removed from Coolify due to [reason].
If you were using this service, please [migration instructions or alternative].
:::
```

## Verification Checklist

After disabling, verify:

- [ ] `disabled: true` added to service entry in List.vue
- [ ] Warning callout added to markdown file
- [ ] Documentation file still exists (NOT deleted)
- [ ] Service no longer appears in listing at http://localhost:5173/docs/services/
- [ ] Direct URL still works: http://localhost:5173/docs/services/service-name
- [ ] Warning is visible at top of page

## Re-enabling a Service

To make a service available again:

1. Remove `disabled: true` from List.vue (or set to `false`)
2. Remove the warning callout from the markdown file
3. Update any "deprecated" or "unavailable" messaging

## Example: Full Disabled Service

**List.vue entry:**
```javascript
{
    name: 'Legacy Service',
    slug: 'legacy-service',
    icon: '/docs/images/services/legacy-service-logo.svg',
    description: 'A service that is no longer available.',
    category: 'Utilities',
    disabled: true
},
```

**Documentation file:**
```markdown
---
title: "Legacy Service"
description: "Documentation for Legacy Service on Coolify."
---

::: warning SERVICE DEPRECATED
This service has been deprecated as of January 2025 and is no longer available in Coolify.
Consider using [Alternative Service](/services/alternative) instead.
:::

# Legacy Service

![Legacy Service](/docs/images/services/legacy-service-logo.svg)

## What was Legacy Service?

Legacy Service was a tool for... [rest of documentation]
```

## Related Skills

- `adding-service-documentation` - For creating new service docs
- `renaming-services` - For renaming services
