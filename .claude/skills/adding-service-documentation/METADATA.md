# Service Metadata Extraction

This guide explains how to extract service information from Coolify's YAML templates.

## YAML Template Location

Service templates are located in the Coolify repository at:

```
https://github.com/coollabsio/coolify/tree/main/templates/compose
```

Files: `{service-name}.yaml`

## Metadata Format

Each YAML template starts with metadata comments:

```yaml
# documentation: https://example.com
# slogan: Short service description
# category: category-name
# tags: tag1, tag2, tag3
# logo: svgs/service-name.svg
# ignore: false  # Optional: if true, skip documentation

services:
  service-name:
    image: ...
```

## Metadata Fields

### documentation

The official website URL for the service.

**Usage:** Include in the "Links" section of documentation

```markdown
- [The official website](https://example.com?utm_source=coolify.io)
```

### slogan

A brief, one-line description of what the service does.

**Usage:**

- As the service description in List.vue
- As the starting point for "What is..." section

### category

The service category for organization and filtering.

**Common categories:**

- AI, Analytics, Automation, Business
- CMS, Communication, Development, Documentation
- Media, Monitoring, Productivity, Security
- Storage, and more

**Usage:** Assign to the `category` field in List.vue

### tags

Comma-separated keywords for search and classification.

**Usage:** Not directly used in documentation, but helpful for understanding the service

### logo

Path to the logo file in the Coolify repository.

**Example:** `svgs/appsmith.svg`

**Usage:**

1. Download from GitHub: `https://raw.githubusercontent.com/coollabsio/coolify/main/public/svgs/appsmith.svg`
2. Save to: `docs/public/images/services/appsmith-logo.svg`

### ignore

If set to `true`, do not create documentation for this service.

**Example:**

```yaml
# ignore: true
```

## Extraction Example

**YAML template** (from Coolify repository `appsmith.yaml`):

```yaml
# documentation: https://appsmith.com
# slogan: A low-code application platform for building internal tools.
# category: productivity
# tags: lowcode, nocode, no, low, platform
# logo: svgs/appsmith.svg
```

**Extracted metadata:**

- **Name:** Appsmith (from filename)
- **Website:** https://appsmith.com
- **Description:** "A low-code application platform for building internal tools."
- **Category:** Productivity
- **Logo:** Download from Coolify repo `svgs/appsmith.svg` → save as `appsmith-logo.svg`

## GitHub Repository

If not specified in YAML, search for the GitHub repo using:

- Service website footer/about page
- GitHub search: `https://github.com/search?q={service-name}`
- Service documentation

Most open-source services prominently link their GitHub repository.
