# Authoring Skill Validation

Check the actual content pipeline as well as the instructions. Use an isolated temporary directory for generator probes so fixtures and generated output do not enter the working tree.

## Service Path Smoke Check

Run this from the repository root. It copies only the dependency-free service generators and a local logo, creates a page at the path prescribed by the service skill, and verifies both outputs.

```bash
(
  set -eu
  task_fixture=$(mktemp -d)
  trap 'rm -rf "$task_fixture"' EXIT
  mkdir -p "$task_fixture/scripts" "$task_fixture/content/docs/services" "$task_fixture/public/images/services"
  cp scripts/services-data.mjs scripts/generate-service-list.mjs scripts/generate-services-page.mjs "$task_fixture/scripts/"
  cp public/images/services/appsmith-logo.svg "$task_fixture/public/images/services/"
  cat > "$task_fixture/content/docs/services/skill-path-probe.mdx" <<'PAGE'
---
title: "Skill path probe"
description: "Disposable catalog path check."
category: "AI"
icon: "/docs/images/services/appsmith-logo.svg"
---

# Skill path probe
PAGE
  node "$task_fixture/scripts/generate-service-list.mjs"
  node "$task_fixture/scripts/generate-services-page.mjs"
  node --input-type=module - "$task_fixture" <<'JS'
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.argv[2];
const services = JSON.parse(await readFile(path.join(root, 'src/generated/services.json'), 'utf8'));
const page = await readFile(path.join(root, 'content/docs/services/all.mdx'), 'utf8');
const service = services.find(item => item.slug === 'skill-path-probe');
assert(service);
assert.equal(service.category, 'AI');
assert.equal(service.icon, '/docs/images/services/appsmith-logo.svg');
assert(page.includes('](/services/skill-path-probe)'));
console.log('Service appears in both generated catalogs.');
JS
)
```

For availability changes, set `disabled: true` and add the documented MDX callout in the temporary page, then rerun both generators. The record must remain in `src/generated/services.json` with `disabled: true`, while the directory link disappears and the source page stays in place. Also verify that removing the flag alone does not override a recognized warning title. Re-enabling requires clearing both signals.

For a rename, move the temporary `.mdx` page and regenerate. The new slug must replace the old one in both outputs while retaining title, category, icon, and availability. Test Nginx redirects separately with `bun run check:redirects -- --base origin/next` when changing repository paths.

## Workflow Checks

| Workflow | Check |
|---|---|
| Add service | Page at `content/docs/services/{slug}.mdx`, local asset in `public/images/services/`, both generated outputs include the enabled service |
| Add guide | Page in the appropriate `content/docs/` section, valid frontmatter and MDX, relevant section `meta.json` entry |
| Disable service | Explicit flag and visible callout, JSON marked disabled, directory entry omitted, direct page preserved |
| Rename service | New filename and cross-links, valid icon, regenerated catalogs, prefixed and stripped old URLs redirect |

Neither catalog output is hand-edited, and individual service entries do not belong in the React listing component. Verify the source instruction and its linked references together so they do not disagree about paths or syntax.

## Content and Navigation

- Check that all relative skill-reference links resolve and each skill's frontmatter still identifies its workflow.
- Compile copied MDX examples when changing their syntax; literal braces, JSX tags, and nested code fences need MDX-safe formatting.
- Use `<Callout>` rather than VitePress containers. Preserve `/docs/images/...` asset URLs and the supported `ZoomImage` / `ZoomableImage` components.
- For visible changes, open `http://localhost:3000/docs/{path}` after `bun run dev`. The searchable service catalog is `/docs/services/overview`; the directory is `/docs/services/all`.
- Confirm navigation ordering against the containing folder's `meta.json`.

`bun run dev` and `bun run build` refresh the remote CLI reference, OpenAPI schema, and service catalogs. Inspect those generated diffs and commit them only when the task intends to update them. `bun run preview` does not regenerate them.

Run `bun run types:check`, `bun run check:redirects`, or `bun run build` when relevant to the change. An instruction-only path correction can be validated with the isolated generators and example compilation; it does not require rebuilding every social-preview image.

## Behavioral Skill Checks

Use realistic requests such as adding a service, writing a troubleshooting guide, renaming a slug, and hiding an unavailable service. Check the actual files and generated behavior, rather than matching instruction wording. If testing across model variants, record the model, request, skill, output paths, observed behavior, and any remaining failures. Do not claim a full agent run or browser check when only the generator probe was executed.
