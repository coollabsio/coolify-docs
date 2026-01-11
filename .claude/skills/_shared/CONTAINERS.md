# VitePress Containers

Callout containers for highlighting important information.

## Available Containers

### Tip

For helpful recommendations:

```markdown
::: tip
Helpful tips and recommendations.
:::
```

### Info

For additional context:

```markdown
::: info
Additional information or context.
:::
```

### Warning

For important prerequisites or cautions:

```markdown
::: warning
Important warnings or prerequisites.
:::
```

### Danger

For critical warnings:

```markdown
::: danger
Critical warnings about data loss or security.
:::
```

### Success

For confirmation messages:

```markdown
::: success
Success messages or confirmations.
:::
```

## Custom Titles

Add a custom title after the container type:

```markdown
::: warning Prerequisites
You must complete X before proceeding.
:::

::: tip Pro Tip
This advanced technique can save time.
:::

::: danger Data Loss Warning
This action cannot be undone.
:::
```

## When to Use Each Type

| Container | Use For |
|-----------|---------|
| `tip` | Best practices, shortcuts, recommendations |
| `info` | Background context, explanations, notes |
| `warning` | Prerequisites, cautions, important notes |
| `danger` | Data loss, security risks, breaking changes |
| `success` | Completed steps, confirmations |

## Examples in Context

### Prerequisites Section

```markdown
## Prerequisites

::: warning Required Setup
Before proceeding, ensure you have:
- SSH access to your server
- Docker installed
- A domain name configured
:::
```

### After a Risky Step

```markdown
## 3. Reset Database

::: danger
This will delete all existing data. Make sure you have a backup.
:::

```bash
coolify db:reset
```
```

### Helpful Tip

```markdown
## Configuration

::: tip
You can also set these values via environment variables for easier deployment.
:::
```

## Nesting Content

Containers can include any markdown:

```markdown
::: info Multiple Items
You can include:
- Bullet lists
- **Bold text**
- `code snippets`
- [Links](/path)
:::
```
