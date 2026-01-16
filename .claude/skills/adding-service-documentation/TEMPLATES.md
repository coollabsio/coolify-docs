# Documentation Templates

Ready-to-use templates for service documentation.

## Minimal Template

Use for simple services without extensive features or documentation.

**Example:** Ghost, Plausible, simple utilities

```markdown
---
title: "ServiceName"
description: "Deploy ServiceName on Coolify for [key benefit or use case]."
---

# ServiceName

![ServiceName](/docs/images/services/servicename-logo.webp)

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

```markdown
---
title: "Ghost"
description: "Deploy Ghost publishing platform on Coolify for professional blogs, newsletters, memberships, and content monetization with modern editor."
---

# Ghost

![Ghost](https://user-images.githubusercontent.com/353959/169805900-66be5b89-0859-4816-8da9-528ed7534704.png)

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

```markdown
---
title: "ServiceName"
description: "[Detailed description including key features and benefits]"
---

# ServiceName

![ServiceName](/docs/images/services/servicename-logo.webp)

## What is ServiceName?

[Detailed explanation of the service - 2-4 paragraphs]

[First paragraph: What it is and its primary purpose]

[Second paragraph: Core functionality and features]

[Third paragraph: Use cases and who it's for]

## Why ServiceName?

[Explain the unique benefits and advantages]

ServiceName makes it easy to [key benefit]:

- **Benefit 1:** Description of advantage
- **Benefit 2:** Description of advantage
- **Benefit 3:** Description of advantage
- **Benefit 4:** Description of advantage

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

```markdown
---
title: "Appsmith"
description: "Build internal tools on Coolify with Appsmith's low-code platform featuring drag-and-drop UI, database connectors, and custom business logic."
---

# Appsmith

![Appsmith](https://raw.githubusercontent.com/appsmithorg/appsmith/release/static/images/appsmith-in-100-seconds.png)

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

Choose your template based on:

### Use Minimal Template when:
- Service has limited documentation
- Service is straightforward/self-explanatory
- Official docs cover everything users need
- No special configuration required
- Service has a simple purpose

**Examples:** Ghost, Redis Insight, Miniflux

### Use Comprehensive Template when:
- Service has complex features
- Multiple use cases or workflows
- Rich learning resources available
- Community support channels exist
- Benefits need explanation
- Service is a platform (not just a tool)

**Examples:** Appsmith, Authentik, Home Assistant, GitLab

---

## Template Variables Reference

When using templates, replace these placeholders:

| Variable | Description | Example |
|----------|-------------|---------|
| `ServiceName` | Official service name | `Appsmith` |
| `servicename` | Lowercase, no spaces | `appsmith` |
| `service-name` | Lowercase, hyphenated | `app-smith` |
| `{key benefit}` | Primary value proposition | `building internal tools` |
| `{official website}` | Service homepage URL | `https://appsmith.com` |
| `{github org}` | GitHub organization | `appsmithorg` |
| `{github repo}` | GitHub repository | `appsmith` |

---

## Customization Tips

### Adding Configuration Section

For services requiring special setup:

```markdown
## Configuration

### Environment Variables

- `VARIABLE_NAME`: Description of what it does
- `ANOTHER_VAR`: Description

### Initial Setup

1. After deployment, navigate to the admin panel
2. Create your first admin user
3. Configure the database connection
4. Set up authentication provider

### Common Settings

[Explain frequently-used configuration options]
```

### Adding Troubleshooting Section

For services with common issues:

```markdown
## Troubleshooting

### Service won't start
Check that required environment variables are set correctly.

### Database connection failed
Ensure the database service is running and accessible.

### Can't login
Try resetting the admin password using the CLI tool.
```

### Adding Screenshots

For services where UI is important:

```markdown
## Screenshots

### Dashboard
<ZoomableImage src="/docs/images/services/servicename-dashboard.webp" />

### Configuration Panel
<ZoomableImage src="/docs/images/services/servicename-config.webp" />
```

---

## Quality Checklist

Before submitting documentation:

- [ ] Frontmatter includes title and description
- [ ] Service name is consistently capitalized
- [ ] Logo displays using standard markdown `![alt](path)` syntax
- [ ] "What is..." section is clear and informative
- [ ] All external links include `?utm_source=coolify.io`
- [ ] GitHub and website links are correct
- [ ] No typos or grammatical errors
- [ ] Appropriate template chosen (minimal vs comprehensive)
- [ ] All markdown syntax is valid
- [ ] File saved as `{slug}.md` in `docs/services/`
