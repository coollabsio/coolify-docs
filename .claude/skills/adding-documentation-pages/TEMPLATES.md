# Documentation Page Templates

Ready-to-use templates for different documentation types.

## Step-by-Step Guide

For how-to guides and tutorials:

```markdown
---
title: "How to Configure X"
description: "Learn how to configure X in Coolify for [benefit]."
---

# How to Configure X

Brief overview of what this guide covers.

## Prerequisites

- Prerequisite 1
- Prerequisite 2

## 1. First Step

Description of the first step.

<ZoomableImage src="/docs/images/section/guide/step-1.webp" alt="Step 1" />

## 2. Second Step

Description of the second step.

::: tip
Helpful tip for this step.
:::

## 3. Third Step

Description of the third step.

## Troubleshooting

### Common Issue 1

Solution to common issue.

## Related Resources

- [Related Guide](/path/to/guide)
- [External Documentation](https://example.com?utm_source=coolify.io)
```

## Troubleshooting Article

For problem-solution documentation:

```markdown
---
title: "Fix: Problem Description"
description: "How to resolve [problem] when using Coolify."
---

# Fix: Problem Description

## Problem

Clear description of the problem users experience.

## Cause

Explanation of why this happens.

## Solution

### Method 1: Quick Fix

```bash
# Commands to fix the issue
```

### Method 2: Alternative Fix

Step-by-step alternative solution.

## Prevention

How to avoid this issue in the future.

## Related Issues

- [Related Problem](/troubleshoot/related)
```

## Configuration Guide

For settings and configuration documentation:

```markdown
---
title: "Configuring X"
description: "Complete guide to configuring X in Coolify."
---

# Configuring X

## Overview

Brief explanation of X and why you'd configure it.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `SETTING_A` | `value` | What it does |
| `SETTING_B` | `value` | What it does |

## Examples

### Basic Configuration

```yaml
setting: value
```

### Advanced Configuration

```yaml
setting1: value1
setting2: value2
nested:
  option: value
```

## Best Practices

- Best practice 1
- Best practice 2

## Troubleshooting

Common configuration issues and solutions.
```

## Knowledge Base Article

For conceptual explanations:

```markdown
---
title: "Understanding X"
description: "Learn about X and how it works in Coolify."
---

# Understanding X

## What is X?

Clear explanation of the concept.

## How It Works

Technical explanation with diagrams if helpful.

## Use Cases

- Use case 1
- Use case 2

## Best Practices

Recommendations for using X effectively.

## Further Reading

- [Related Topic](/knowledge-base/related)
- [External Resource](https://example.com?utm_source=coolify.io)
```

## Template Selection Guide

| Template | Use When |
|----------|----------|
| Step-by-Step Guide | Task requires sequential steps |
| Troubleshooting | Solving a specific problem |
| Configuration | Explaining settings/options |
| Knowledge Base | Conceptual explanation |
