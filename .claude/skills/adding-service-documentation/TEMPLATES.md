# Documentation Templates

Create these pages as `content/docs/services/{slug}.mdx`, or start from `templates/service.mdx` and add the required catalog frontmatter. The frontmatter is load-bearing — the generator (`scripts/services-data.mjs`) reads `title`, `description`, `category`, optional `icon`, and optional `disabled` to build the listing.

## Minimal Template

Use for simple services without extensive features or documentation.

**Example:** Ghost, Plausible, simple utilities

```mdx
---
title: "ServiceName"
description: "Short description for the listing card and all.mdx."
category: "CMS"
---

# ServiceName

![ServiceName](/docs/images/services/servicename-logo.svg)

## What is ServiceName?

[2-3 paragraphs describing:]
- What the service does
- Key features or capabilities
- Who it's for / common use cases

## Links

- [The official website](https://servicename.com?utm_source=coolify.io)
- [GitHub](https://github.com/org/servicename?utm_source=coolify.io)
```

### Minimal Example (Ghost)

```mdx
---
title: "Ghost"
description: "A professional publishing platform."
category: "CMS"
icon: "/docs/images/services/ghost-logo.svg"
---

# Ghost

![Ghost](/docs/images/services/ghost-logo.svg)

## What is Ghost?

Ghost is a powerful app for professional publishers to create, share, and grow a business around their content. It comes with modern tools to build a website, publish content, send newsletters & offer paid subscriptions to members.

## Links

- [The official website](https://ghost.org/?utm_source=coolify.io)
- [GitHub](https://github.com/TryGhost/Ghost?utm_source=coolify.io)
```

---

## Comprehensive Template

Use for complex services with many features, learning resources, or special configuration needs.

**Example:** Appsmith, Authentik, development platforms

```mdx
---
title: "ServiceName"
description: "Short description for the listing card."
category: "Development"
---

# ServiceName

![ServiceName](/docs/images/services/servicename-logo.svg)

## What is ServiceName?

[Detailed explanation — 2-4 paragraphs]

[First paragraph: what it is and its primary purpose]

[Second paragraph: core functionality and features]

[Third paragraph: use cases and who it's for]

## Why ServiceName?

ServiceName makes it easy to [key benefit]:

- **Benefit 1:** Description
- **Benefit 2:** Description
- **Benefit 3:** Description
- **Benefit 4:** Description

## Features

- **Feature 1:** Brief description
- **Feature 2:** Brief description
- **Feature 3:** Brief description
- **Feature 4:** Brief description

## Learning Resources

- [Documentation](https://docs.servicename.com?utm_source=coolify.io)
- [Tutorials](https://servicename.com/tutorials?utm_source=coolify.io)
- [Video Guides](https://youtube.com/@servicename?utm_source=coolify.io)
- [Templates](https://servicename.com/templates?utm_source=coolify.io)

## Need Help?

- [Discord](https://discord.gg/invite?utm_source=coolify.io)
- [Community Forum](https://community.servicename.com?utm_source=coolify.io)
- [Support Email](mailto:support@servicename.com)

## Links

- [The official website](https://servicename.com?utm_source=coolify.io)
- [GitHub](https://github.com/org/servicename?utm_source=coolify.io)
```

### Comprehensive Example (Appsmith)

```mdx
---
title: "Appsmith"
description: "A low-code application platform for building internal tools."
category: "Development"
icon: "/docs/images/services/appsmith-logo.svg"
---

# Appsmith

![Appsmith](/docs/images/services/appsmith-logo.svg)

## What is Appsmith

Organizations build internal applications such as dashboards, database GUIs, admin panels, approval apps, customer support tools, etc. to help improve their business operations.

Appsmith is an open-source developer tool that enables the rapid development of these applications. You can drag and drop pre-built widgets to build UI.

Connect securely to your databases & APIs using its datasources. Write business logic to read & write data using queries & JavaScript.

## Why Appsmith

Appsmith makes it easy to build a UI that talks to any datasource. You can create anything from simple CRUD apps to complicated multi-step workflows with a few simple steps:

- Connect Datasource: Integrate with a database or API. Appsmith supports the most popular databases and REST APIs.
- Build UI: Use built-in widgets to build your app layout.
- Write Logic: Express your business logic using queries and JavaScript anywhere in the editor.
- Collaborate, Deploy, Share: Appsmith supports version control using Git to build apps in collaboration using branches to track and roll back changes. Deploy the app and share it with other users.

## Learning Resources

- [Documentation](https://docs.appsmith.com?utm_source=coolify.io)
- [Tutorials](https://docs.appsmith.com/getting-started/tutorials?utm_source=coolify.io)
- [Videos](https://www.youtube.com/appsmith?utm_source=coolify.io)
- [Templates](https://www.appsmith.com/templates?utm_source=coolify.io)

## Need Help?

- [Discord](https://discord.gg/rBTTVJp?utm_source=coolify.io)
- [Community Portal](https://community.appsmith.com/?utm_source=coolify.io)
- [support@appsmith.com](mailto:support@appsmith.com)

## Links

- [The official website](https://www.appsmith.com?utm_source=coolify.io)
- [GitHub](https://github.com/appsmithorg/appsmith?utm_source=coolify.io)
```

---

## Template Selection Guide

### Use Minimal Template when:

- Service has limited documentation
- Service is straightforward / self-explanatory
- Official docs cover everything users need
- No special configuration required

**Examples:** Ghost, Redis Insight, Miniflux

### Use Comprehensive Template when:

- Service has complex features
- Multiple use cases or workflows
- Rich learning resources available
- Community support channels exist
- Service is a platform (not just a tool)

**Examples:** Appsmith, Authentik, Home Assistant, GitLab

---

## Template Variables Reference

Replace these placeholders:

| Variable | Description | Example |
|---|---|---|
| `ServiceName` | Official service name | `Appsmith` |
| `servicename` | Lowercase, no spaces | `appsmith` |
| `service-name` | Lowercase, hyphenated | `home-assistant` |
| `{key benefit}` | Primary value proposition | `building internal tools` |
| `{official website}` | Service homepage URL | `https://appsmith.com` |
| `{github org}` | GitHub organization | `appsmithorg` |
| `{github repo}` | GitHub repository | `appsmith` |

---

## Customization Tips

### Adding a Configuration Section

```mdx
## Configuration

### Environment Variables

- `VARIABLE_NAME`: Description of what it does
- `ANOTHER_VAR`: Description

### Initial Setup

1. After deployment, navigate to the admin panel
2. Create your first admin user
3. Configure the database connection
```

### Adding a Troubleshooting Section

```mdx
## Troubleshooting

### Service won't start
Check that required environment variables are set correctly.

### Database connection failed
Ensure the database service is running and accessible.
```

### Adding Screenshots

```mdx
## Screenshots

### Dashboard
<ZoomableImage src="/docs/images/services/servicename-dashboard.webp" alt="Service dashboard" />

### Configuration Panel
<ZoomableImage src="/docs/images/services/servicename-config.webp" alt="Service configuration" />
```

---

## Quality Checklist

Before submitting:

- [ ] Frontmatter includes `title`, `description`, and `category`
- [ ] `category` matches an existing category (or is intentionally new)
- [ ] Service name is consistently capitalized in `title` and the H1
- [ ] Logo file exists in `public/images/services/` with a name the resolver finds, **or** `icon` is set in frontmatter
- [ ] Logo displays using standard markdown `![alt](path)` syntax
- [ ] "What is..." section is clear and informative
- [ ] All external links include `?utm_source=coolify.io`
- [ ] GitHub and website links are correct
- [ ] No typos or grammatical errors
- [ ] Filename is `{slug}.mdx` in `content/docs/services/`, lowercase kebab-case
- [ ] Ran `bun run generate:services`; `services.json` and `all.mdx` are committed alongside the new page
