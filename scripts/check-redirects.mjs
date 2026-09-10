#!/usr/bin/env node
// Replays known legacy docs URLs through nginx/redirects.conf the way nginx evaluates it.
//
// Production and next.coolify.io strip the /docs prefix before nginx sees a request, while a
// local `docker run` of the image does not. Every URL is therefore checked twice: with the
// prefix (local) and without it (production).
//
// Usage:
//   node scripts/check-redirects.mjs                       # static check (CI)
//   node scripts/check-redirects.mjs --compare old.conf    # show behaviour changes vs another conf
//   node scripts/check-redirects.mjs --live https://next.coolify.io
//   node scripts/check-redirects.mjs --live http://localhost:8080 --strip   # emulate the prod proxy

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const confPath = option('--conf') ?? path.join(root, 'nginx/redirects.conf');
const comparePath = option('--compare');
const liveBase = option('--live');
const liveStrip = args.includes('--strip');
const fixturesPath = path.join(root, 'scripts/fixtures/legacy-urls.txt');
const expectationsPath = path.join(root, 'scripts/fixtures/redirect-expectations.tsv');
const MAX_HOPS = 5;
const RULE_PREFIX = '^(?:/docs)?/';

// ---------------------------------------------------------------------------
// redirects.conf

function parseConf(text, file) {
  const exact = new Map();
  const regex = [];
  const errors = [];

  text.split('\n').forEach((raw, index) => {
    const line = raw.trim();
    const ln = index + 1;
    if (!line || line.startsWith('#')) return;

    const match = line.match(/^location\s+(=|~)\s+(\S+)\s*\{\s*return\s+(30[12])\s+(?:"([^"]*)"|([^\s;"]+))\s*;\s*\}$/);
    if (!match) {
      errors.push(`${file}:${ln}: unsupported directive: ${line}`);
      return;
    }

    const [, kind, source, , quoted, bare] = match;
    const rule = { ln, kind, source, target: quoted ?? bare };

    if (kind === '=') {
      if (exact.has(source)) errors.push(`${file}:${ln}: duplicate exact rule for ${source}`);
      exact.set(source, rule);
      return;
    }

    let re;
    try {
      re = new RegExp(source);
    } catch (error) {
      errors.push(`${file}:${ln}: invalid regex ${source}: ${error.message}`);
      return;
    }

    const groupCount = new RegExp(`${source}|`).exec('').length - 1;
    for (const [, n] of rule.target.matchAll(/\$(\d)/g)) {
      if (Number(n) > groupCount) errors.push(`${file}:${ln}: target uses $${n} but the pattern has ${groupCount} capture group(s)`);
    }

    regex.push({ ...rule, re });
  });

  return { exact, regex, errors };
}

function matchRule(conf, requestPath) {
  const exact = conf.exact.get(requestPath);
  if (exact) return { rule: exact, target: exact.target };

  for (const rule of conf.regex) {
    const match = rule.re.exec(requestPath);
    if (match) return { rule, target: rule.target.replace(/\$(\d)/g, (_, n) => match[Number(n)] ?? '') };
  }

  return null;
}

// Returns the literal path a regex rule was written for, or null when it has wildcards.
function literalSource(rule) {
  if (rule.kind === '=') return rule.source;
  if (!rule.source.startsWith(RULE_PREFIX)) return null;

  const body = rule.source.slice(RULE_PREFIX.length).replace(/\/\?\$$/, '').replace(/\$$/, '');
  if (/[()[\]{}*+?|^$]/.test(body.replace(/\\./g, ''))) return null;
  return `/${body.replace(/\\(.)/g, '$1')}`;
}

// ---------------------------------------------------------------------------
// Pages and anchors

async function findMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findMdxFiles(fullPath)));
    else if (entry.isFile() && entry.name.endsWith('.mdx')) files.push(fullPath);
  }

  return files;
}

function slugifyTag(tag) {
  // fumadocs-openapi's default groupBy: 'tag' folder name
  return tag.replace(/\s+/g, '-').toLowerCase();
}

async function loadPages() {
  const pages = new Map();
  const contentDir = path.join(root, 'content/docs');

  for (const file of await findMdxFiles(contentDir)) {
    const relative = path.relative(contentDir, file).split(path.sep).join('/').replace(/\.mdx$/, '');
    const pagePath = relative === 'index' ? '' : relative.replace(/\/index$/, '');
    pages.set(pagePath ? `/docs/${pagePath}` : '/docs', file);
  }

  // API endpoint pages are generated from the OpenAPI spec (src/lib/docs/source.ts, src/lib/config/openapi.ts).
  const spec = JSON.parse(await readFile(path.join(root, 'config/openapi.json'), 'utf8'));
  for (const operations of Object.values(spec.paths ?? {})) {
    for (const operation of Object.values(operations ?? {})) {
      if (!operation || typeof operation !== 'object' || !operation.operationId) continue;
      const tags = Array.isArray(operation.tags) && operation.tags.length > 0 ? operation.tags : ['System'];
      for (const tag of tags) pages.set(`/docs/api/endpoints/${slugifyTag(tag)}/${operation.operationId}`, null);
    }
  }

  return pages;
}

function slugifyHeading(text) {
  // github-slugger, which Fumadocs uses for heading ids
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
    .replace(/ /g, '-');
}

const anchorCache = new Map();

async function anchorsFor(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);

  const source = await readFile(file, 'utf8');
  const anchors = new Set();
  const seenSlugs = new Map();
  let inFence = false;

  for (const match of source.matchAll(/\bid=(?:"([^"]+)"|'([^']+)'|\{\s*["'`]([^"'`]+)["'`]\s*\})/g)) {
    anchors.add(match[1] ?? match[2] ?? match[3]);
  }

  for (const line of source.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;

    const heading = line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
    if (!heading) continue;

    const custom = heading[1].match(/\[#([^\]]+)\]\s*$/);
    if (custom) {
      anchors.add(custom[1]);
      continue;
    }

    const text = heading[1]
      .replace(/<[^>]+>/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[`*]/g, '')
      .trim();
    const base = slugifyHeading(text);
    const count = seenSlugs.get(base) ?? 0;
    seenSlugs.set(base, count + 1);
    anchors.add(count ? `${base}-${count}` : base);
  }

  anchorCache.set(file, anchors);
  return anchors;
}

// ---------------------------------------------------------------------------
// Resolution

const stripDocs = (value) => value.replace(/^\/docs(?=\/|$)/, '') || '/';
const normalizePage = (value) => value.replace(/\/+$/, '') || '/docs';

function splitTarget(target) {
  const hashIndex = target.indexOf('#');
  return hashIndex === -1 ? [target, ''] : [target.slice(0, hashIndex), target.slice(hashIndex + 1)];
}

function resolve(conf, pages, url, strip) {
  let current = url.replace(/[?#].*$/, '');
  let fragment = '';
  const seen = new Set();
  const hops = [];

  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    const requestPath = strip ? stripDocs(current) : current;
    if (seen.has(requestPath)) return { status: 'loop', hops };
    seen.add(requestPath);

    const hit = matchRule(conf, requestPath);
    if (hit) {
      hops.push(`${requestPath} -> ${hit.target} (line ${hit.rule.ln})`);
      [current, fragment] = splitTarget(hit.target);
      continue;
    }

    const page = normalizePage(current);
    if (pages.has(page)) return { status: 'ok', final: page, fragment, hops };
    return { status: 'soft-404', final: current, hops };
  }

  return { status: 'too-many-hops', hops };
}

const describe = (result) =>
  result.status === 'ok' ? `${result.final}${result.fragment ? `#${result.fragment}` : ''}` : result.status;

// ---------------------------------------------------------------------------
// Fixtures

async function loadFixtures() {
  const urls = [];

  for (const raw of (await readFile(fixturesPath, 'utf8')).split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    const allowed = line.startsWith('!');
    const url = (allowed ? line.slice(1) : line).split(/\s+/)[0];
    urls.push({ url, allowed });
  }

  return urls;
}

async function loadExpectations() {
  return (await readFile(expectationsPath, 'utf8'))
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [source, expected] = line.split('\t');
      return { source, expected };
    });
}

// ---------------------------------------------------------------------------
// Modes

async function runStatic() {
  const conf = parseConf(await readFile(confPath, 'utf8'), path.relative(root, confPath));
  const pages = await loadPages();
  const fixtures = await loadFixtures();
  const expectations = await loadExpectations();
  const errors = [...conf.errors];
  const rules = [...conf.exact.values(), ...conf.regex].sort((a, b) => a.ln - b.ln);

  // Every rule must match both /docs/x and /x.
  for (const rule of rules) {
    if (rule.kind === '=' || !rule.source.startsWith(RULE_PREFIX)) {
      errors.push(`line ${rule.ln}: rule must be written as "location ~ ${RULE_PREFIX}..." so it matches with and without /docs: ${rule.source}`);
    }
  }

  // Targets without captures must be real pages with real anchors.
  for (const rule of rules) {
    if (rule.target.includes('$')) continue;
    const [target, fragment] = splitTarget(rule.target);
    if (!target.startsWith('/docs')) {
      errors.push(`line ${rule.ln}: target must start with /docs: ${rule.target}`);
      continue;
    }
    const file = pages.get(normalizePage(target));
    if (file === undefined) errors.push(`line ${rule.ln}: target is not a page: ${rule.target}`);
    else if (fragment && file && !(await anchorsFor(file)).has(fragment)) errors.push(`line ${rule.ln}: anchor #${fragment} does not exist on ${target}`);
  }

  // No rule may catch a real page.
  for (const page of pages.keys()) {
    for (const requestPath of [page, stripDocs(page)]) {
      const hit = matchRule(conf, requestPath);
      if (hit) errors.push(`line ${hit.rule.ln}: rule shadows the real page ${page} (request ${requestPath})`);
    }
  }

  // Each literal rule must be the first rule that matches its own path.
  for (const rule of rules) {
    const literal = literalSource(rule);
    if (!literal) continue;
    for (const requestPath of [literal, `/docs${literal}`]) {
      const hit = matchRule(conf, requestPath);
      if (hit && hit.rule !== rule) errors.push(`line ${rule.ln}: unreachable, line ${hit.rule.ln} already matches ${requestPath}`);
    }
  }

  // Every legacy URL must end on a real page, with and without /docs.
  let resolved = 0;
  for (const { url, allowed } of fixtures) {
    for (const strip of [true, false]) {
      const result = resolve(conf, pages, url, strip);
      const mode = strip ? 'prod' : 'local';
      if (result.status !== 'ok') {
        if (!allowed) errors.push(`[${mode}] ${url}: ${result.status}${result.hops.length ? `\n      ${result.hops.join('\n      ')}` : ''}`);
        continue;
      }
      const file = pages.get(result.final);
      if (result.fragment && file && !(await anchorsFor(file)).has(result.fragment)) {
        errors.push(`[${mode}] ${url}: anchor #${result.fragment} does not exist on ${result.final}`);
        continue;
      }
      if (strip) resolved++;
    }
  }

  for (const { source, expected } of expectations) {
    for (const strip of [true, false]) {
      const actual = describe(resolve(conf, pages, source, strip));
      if (actual !== expected) errors.push(`[${strip ? 'prod' : 'local'}] expectation failed: ${source} -> ${actual}, expected ${expected}`);
    }
  }

  console.log(`Checked ${rules.length} rules, ${pages.size} pages, ${fixtures.length} legacy URLs (${resolved} resolve), ${expectations.length} expectations.`);

  if (errors.length) {
    console.error(`\n${errors.length} problem(s):\n${errors.map((error) => `  - ${error}`).join('\n')}`);
    process.exit(1);
  }

  console.log('All redirects OK.');
}

async function runCompare() {
  const oldConf = parseConf(await readFile(comparePath, 'utf8'), comparePath);
  const newConf = parseConf(await readFile(confPath, 'utf8'), path.relative(root, confPath));
  const pages = await loadPages();
  const fixtures = await loadFixtures();
  const changes = [];

  for (const { url } of fixtures) {
    for (const strip of [true, false]) {
      const before = describe(resolve(oldConf, pages, url, strip));
      const after = describe(resolve(newConf, pages, url, strip));
      if (before !== after) changes.push(`[${strip ? 'prod' : 'local'}] ${url}: ${before} => ${after}`);
    }
  }

  console.log(changes.length ? changes.join('\n') : 'No behaviour changes.');
  console.log(`\n${changes.length} change(s) across ${fixtures.length} legacy URLs.`);
}

async function runLive() {
  const base = liveBase.replace(/\/+$/, '');
  const fixtures = await loadFixtures();
  const failures = [];
  const queue = [...fixtures];

  async function check({ url, allowed }) {
    let current = url;
    const seen = new Set();

    for (let hop = 0; hop <= MAX_HOPS; hop++) {
      const requestPath = liveStrip ? stripDocs(current) : current;
      if (seen.has(requestPath)) return allowed || failures.push(`${url}: loop`);
      seen.add(requestPath);

      const response = await fetch(`${base}${requestPath}`, { redirect: 'manual' });
      const location = response.headers.get('location');

      if (response.status >= 300 && response.status < 400 && location) {
        const next = new URL(location, `${base}${requestPath}`).pathname;
        if (response.status === 302 && normalizePage(next) === '/docs' && normalizePage(url) !== '/docs') {
          return allowed || failures.push(`${url}: soft 404 (302 -> /docs)`);
        }
        current = next;
        continue;
      }

      if (response.status !== 200) return allowed || failures.push(`${url}: HTTP ${response.status} at ${requestPath}`);
      return;
    }

    return allowed || failures.push(`${url}: too many hops`);
  }

  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) await check(queue.shift());
    }),
  );

  console.log(`Checked ${fixtures.length} legacy URLs against ${base}${liveStrip ? ' (stripping /docs)' : ''}.`);
  if (failures.length) {
    console.error(`\n${failures.length} problem(s):\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
    process.exit(1);
  }
  console.log('All legacy URLs resolve.');
}

if (liveBase) await runLive();
else if (comparePath) await runCompare();
else await runStatic();
