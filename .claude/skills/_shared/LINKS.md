# Link Guidelines

How to format internal and external links in documentation.

## Internal Links

Use **absolute paths** from the docs root:

```markdown
[WordPress guide](/services/wordpress)
[Getting started](/get-started/introduction)
[SSH keys](/knowledge-base/server/openssh)
```

**Rules:**
- Always start with `/`
- No `.md` extension needed
- Use descriptive anchor text (not "click here")

### Section Paths

| Section | Path Pattern |
|---------|--------------|
| Services | `/services/{slug}` |
| Applications | `/applications/{framework}` |
| Databases | `/databases/{database}` |
| Knowledge Base | `/knowledge-base/{category}/{topic}` |
| Troubleshoot | `/troubleshoot/{issue}` |
| Get Started | `/get-started/{topic}` |

## External Links

Always add UTM tracking parameter:

```markdown
[Official WordPress docs](https://wordpress.org/documentation/?utm_source=coolify.io)
[GitHub repository](https://github.com/example/project?utm_source=coolify.io)
```

### UTM Format

Append `?utm_source=coolify.io` to all external URLs.

**If URL already has parameters:**
```markdown
[Link](https://example.com/page?tab=config&utm_source=coolify.io)
```

### External Link Styling

VitePress automatically adds external link indicators (↗). No manual decoration needed.

## Link Types

### Documentation Cross-References

```markdown
See the [deployment guide](/applications/laravel) for framework-specific instructions.

For more details, refer to [SSH configuration](/knowledge-base/server/openssh).
```

### Official Resources

```markdown
- [Official documentation](https://docs.example.com?utm_source=coolify.io)
- [GitHub repository](https://github.com/example/repo?utm_source=coolify.io)
- [Project website](https://example.com?utm_source=coolify.io)
```

### Coolify Resources

```markdown
- [Coolify Discord](https://discord.gg/coolify)
- [Coolify GitHub](https://github.com/coollabsio/coolify)
- [Coolify Changelog](https://coolify.io/changelog)
```

**Note:** Coolify's own resources don't need UTM parameters.

## Anchor Links

Link to specific sections within pages:

```markdown
[Configuration options](#configuration)
[Troubleshooting section](/services/wordpress#troubleshooting)
```

**Rules:**
- Use lowercase
- Replace spaces with hyphens
- Match the heading exactly

## Common Mistakes

❌ **Don't:**
- Use bare URLs without anchor text
- Forget UTM parameters on external links
- Use relative paths (`./other-page`)
- Use "click here" or "here" as anchor text

✅ **Do:**
- Use descriptive anchor text
- Add `?utm_source=coolify.io` to external URLs
- Use absolute paths starting with `/`
- Link to specific sections when relevant
