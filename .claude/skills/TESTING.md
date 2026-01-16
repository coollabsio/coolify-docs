# Skill Testing Guide

How to validate that skills work correctly across different Claude models.

## Why Test Across Models?

Skills act as additions to models, so effectiveness depends on the underlying model:

| Model | Characteristics | Testing Focus |
|-------|-----------------|---------------|
| **Haiku** | Fast, economical | Does the skill provide enough guidance? |
| **Sonnet** | Balanced | Is the skill clear and efficient? |
| **Opus** | Powerful reasoning | Does the skill avoid over-explaining? |

What works perfectly for Opus might need more detail for Haiku.

## Testing Checklist

### 1. Skill Discovery

Test that Claude correctly identifies when to use each skill.

| Prompt | Expected Skill | Pass? |
|--------|----------------|-------|
| "Add documentation for the new Ghost service" | `adding-service-documentation` | |
| "Create a troubleshooting guide for SSL issues" | `adding-documentation-pages` | |
| "Rename the minio service to minio-s3" | `renaming-services` | |
| "The fider service is deprecated, hide it" | `disabling-services` | |
| "Add a how-to guide for backups" | `adding-documentation-pages` | |
| "Document the new appwrite service from Coolify" | `adding-service-documentation` | |

### 2. Skill Execution

For each skill, verify Claude follows the documented steps.

#### adding-service-documentation

- [ ] Extracts metadata from YAML template
- [ ] Downloads logo locally (doesn't use external URL)
- [ ] Creates markdown file with correct frontmatter
- [ ] Updates List.vue with new entry
- [ ] Inserts alphabetically in List.vue
- [ ] Uses correct image path format

#### adding-documentation-pages

- [ ] Creates file in correct section directory
- [ ] Includes required frontmatter (title, description)
- [ ] Uses `<ZoomableImage>` for screenshots
- [ ] Adds UTM parameters to external links
- [ ] Updates sidebar config if needed

#### renaming-services

- [ ] Renames markdown file correctly
- [ ] Updates slug in List.vue
- [ ] Adds nginx redirect for old URL
- [ ] Searches for and updates internal links
- [ ] Updates logo filename if needed

#### disabling-services

- [ ] Adds `disabled: true` to List.vue entry
- [ ] Adds warning callout to markdown file
- [ ] Does NOT delete the documentation file
- [ ] Keeps redirects intact

### 3. Edge Cases

Test handling of unusual situations:

| Scenario | Expected Behavior |
|----------|-------------------|
| Service YAML has `# ignore: true` | Skip documentation, inform user |
| Logo is PNG instead of SVG | Download as-is, use correct extension |
| Service name uses camelCase | Convert to kebab-case for filename |
| Duplicate service name exists | Warn user, ask for clarification |
| External link missing protocol | Add https:// prefix |

### 4. Reference File Navigation

Verify Claude correctly navigates to reference files when needed:

| Task | Should Read |
|------|-------------|
| Need frontmatter format | `_shared/FRONTMATTER.md` |
| Need image guidelines | `_shared/IMAGES.md` or skill-specific `IMAGES.md` |
| Need List.vue structure | `adding-service-documentation/CATALOG.md` |
| Need page template | Skill-specific `TEMPLATES.md` |

## Recording Test Results

When testing, record:

1. **Model used**: Haiku / Sonnet / Opus
2. **Skill tested**: Which skill
3. **Prompt given**: Exact wording
4. **Result**: Pass / Fail / Partial
5. **Notes**: Any unexpected behavior

### Example Test Log

```markdown
## Test: 2025-01-15

**Model**: Sonnet
**Skill**: adding-service-documentation
**Prompt**: "Add documentation for the listmonk service"

**Steps Observed**:
1. ✅ Found YAML template in templates/compose/
2. ✅ Extracted metadata correctly
3. ✅ Downloaded logo to correct path
4. ✅ Created markdown with frontmatter
5. ✅ Updated List.vue alphabetically
6. ✅ Used correct image path format

**Result**: Pass

**Notes**: None
```

## Common Issues and Fixes

### Skill Not Triggered

**Symptom**: Claude doesn't recognize when to use a skill.

**Possible causes**:
- Description missing key trigger words
- User prompt too vague

**Fix**: Add more trigger terms to the skill description.

### Incomplete Execution

**Symptom**: Claude skips steps or misses files.

**Possible causes**:
- SKILL.md workflow not clear enough
- Reference file not properly linked

**Fix**: Make workflow steps more explicit, add verification checklist.

### Wrong File Paths

**Symptom**: Claude uses incorrect paths for images or files.

**Possible causes**:
- Path format inconsistent in examples
- Confusion between `/public/` and `/docs/`

**Fix**: Standardize path examples, add explicit path rules.

## Iteration Process

1. **Test** with representative prompts
2. **Document** failures and partial successes
3. **Identify** patterns in failures
4. **Update** skill content to address gaps
5. **Re-test** to verify fixes
6. **Repeat** until consistent across models
