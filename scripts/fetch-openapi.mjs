import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Downloads the Coolify OpenAPI spec and refreshes config/openapi.json, which is
// imported directly by src/lib/config/openapi.ts to render the API reference.
// The custom API servers (Coolify Cloud / Self-hosted) are applied at runtime in
// normalizeOpenAPI() and are NOT read from this file, so they are unaffected.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.resolve(__dirname, '../config/openapi.json');
const SOURCE_URL =
  process.env.COOLIFY_OPENAPI_URL ?? 'https://raw.githubusercontent.com/coollabsio/coolify/main/openapi.json';

async function fetchOpenAPI() {
  const response = await fetch(SOURCE_URL, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const text = await response.text();

  let spec;
  try {
    spec = JSON.parse(text);
  } catch {
    throw new Error('response was not valid JSON');
  }

  // Sanity-check before overwriting so a bad response can't wipe the spec.
  const pathCount = spec?.paths && typeof spec.paths === 'object' ? Object.keys(spec.paths).length : 0;
  if (!spec.openapi || pathCount === 0) {
    throw new Error(`unexpected document (openapi=${spec?.openapi ?? 'missing'}, paths=${pathCount})`);
  }

  return { spec, pathCount };
}

async function main() {
  try {
    const { spec, pathCount } = await fetchOpenAPI();
    const serialized = `${JSON.stringify(spec, null, 2)}\n`;

    const current = await readFile(OUTPUT_FILE, 'utf8').catch(() => null);
    if (current === serialized) {
      console.log(`OpenAPI spec already up to date (${pathCount} paths).`);
      return;
    }

    await writeFile(OUTPUT_FILE, serialized);
    console.log(`Updated ${path.relative(process.cwd(), OUTPUT_FILE)} from ${SOURCE_URL} (${pathCount} paths).`);
  } catch (error) {
    // Never fail the build over a transient network issue — keep the committed
    // spec so the API reference still renders (possibly stale).
    console.warn(
      `Warning: could not refresh OpenAPI spec (${error.message}). Keeping existing config/openapi.json.`,
    );
  }
}

await main();
