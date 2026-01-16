# Sidebar Configuration

How to add pages to the VitePress sidebar navigation.

## File Location

```
docs/.vitepress/config.mts
```

The sidebar configuration starts around **line 130**.

## Structure

```typescript
sidebar: [
  {
    text: 'Section Name',
    collapsed: true,  // Can be expanded/collapsed
    items: [
      { text: 'Page Title', link: '/section/page-slug' },
      { text: 'Another Page', link: '/section/another-page' },
    ]
  },
  // More sections...
]
```

## Adding a Page

1. Find the appropriate section in the sidebar array
2. Add a new item to the `items` array
3. Use the page's display title for `text`
4. Use the relative path (without `.md`) for `link`

### Example

Adding a new guide to Knowledge Base:

```typescript
{
  text: 'Knowledge Base',
  collapsed: true,
  items: [
    { text: 'Existing Guide', link: '/knowledge-base/existing' },
    { text: 'My New Guide', link: '/knowledge-base/docker/my-guide' },  // Added
  ]
}
```

## Nested Sections

For subdirectories, you can create nested sections:

```typescript
{
  text: 'Knowledge Base',
  collapsed: true,
  items: [
    {
      text: 'Docker',
      collapsed: true,
      items: [
        { text: 'Docker Basics', link: '/knowledge-base/docker/basics' },
        { text: 'Docker Compose', link: '/knowledge-base/docker/compose' },
      ]
    },
    {
      text: 'Server',
      collapsed: true,
      items: [
        { text: 'SSH Setup', link: '/knowledge-base/server/ssh' },
      ]
    }
  ]
}
```

## Link Format

- **Always** start with `/` (absolute from docs root)
- **Never** include `.md` extension
- **Never** include `/docs` prefix

| File Path | Sidebar Link |
|-----------|--------------|
| `docs/knowledge-base/guide.md` | `/knowledge-base/guide` |
| `docs/troubleshoot/apps/error.md` | `/troubleshoot/apps/error` |

## When Sidebar Update Is Optional

Some pages don't need sidebar entries:

- Pages linked from other pages but not primary navigation
- Supplementary content accessed via in-page links
- Index pages that redirect

## Verification

After updating:

1. Run `bun run dev`
2. Check sidebar shows new page
3. Click to verify link works
4. Check page renders correctly
