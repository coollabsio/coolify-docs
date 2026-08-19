import { readdir, readFile } from 'node:fs/promises';

const DOCS_URL = process.argv[2] ?? process.env.DOCS_URL ?? 'http://localhost:8080/docs';
const REDIRECTS_CONF = new URL('../nginx/redirects.conf', import.meta.url);
const CONTENT_DIR = new URL('../content/docs/', import.meta.url);
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 12);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS ?? 15000);

const docsUrl = normalizeStartUrl(DOCS_URL);
const docsOrigin = docsUrl.origin;
const docsPathPrefix = trimTrailingSlash(docsUrl.pathname);

const linkChecks = new Map();
const brokenLinks = [];
const redirectIssues = [];
const ignoredResponses = [];
let markdownFileCount = 0;
let markdownLinkCount = 0;
let redirectCount = 0;

const ignoredStatusCodes = new Set([403, 429]);

const ignoredUrlPatterns = [
  /^https:\/\/example\.com\/?$/,
  /^https:\/\/github\.com\/example\/repo(?:\?.*)?$/,
  /^https:\/\/support\.google\.com\/cloud\/answer\/15549257$/,
  /\/docs\/brand\/favicon\.ico$/,
  /\/docs\/images\/services\/service-name-logo\.svg$/,
  /\/docs\/site\.webmanifest$/,
  /\/docs\/@tanstack-start\/styles\.css$/,
];

async function main() {
  logPhase('Scanning markdown links');
  await scanMarkdownLinks();

  logPhase('Checking links');
  await checkLinks();

  logPhase('Checking redirects');
  await checkRedirects();

  printResults();

  if (brokenLinks.length > 0 || redirectIssues.length > 0) {
    process.exitCode = 1;
  }
}

async function scanMarkdownLinks() {
  const files = await findMdxFiles(CONTENT_DIR);
  markdownFileCount = files.length;

  for (const file of files) {
    const contents = await readFile(file, 'utf8');
    const sourcePageUrl = sourceFileToPageUrl(file);

    for (const link of extractMarkdownLinks(contents)) {
      const linkUrl = normalizeLink(link.href, sourcePageUrl);
      if (!linkUrl || shouldIgnoreUrl(linkUrl)) continue;

      markdownLinkCount += 1;
      addLinkCheck(linkUrl, `${relativeContentPath(file)}:${link.line}`);
    }
  }

  console.log(`Found ${markdownLinkCount} markdown links in ${markdownFileCount} files.`);
}

async function checkLinks() {
  const checks = Array.from(linkChecks.entries());
  let completed = 0;
  console.log(`Checking ${checks.length} unique links with concurrency ${CONCURRENCY}.`);

  await runWithConcurrency(checks, CONCURRENCY, async ([url, sources]) => {
    const response = await request(url, { method: 'HEAD' });
    const result = response.status === 405 ? await request(url, { method: 'GET' }) : response;
    const source = Array.from(sources).sort().join(', ');

    if (shouldIgnoreStatus(result.status)) {
      addIgnoredResponse({
        source,
        url,
        status: result.status,
        reason: result.statusText,
      });
    } else if (result.status >= 400 || result.error) {
      brokenLinks.push({
        source,
        url,
        status: result.status,
        reason: result.error ?? result.statusText,
      });
    }


    completed += 1;
    if (completed === checks.length || completed % 50 === 0) {
      console.log(`Checked ${completed}/${checks.length} links.`);
    }
  });
}

async function checkRedirects() {
  const redirects = parseRedirects(await readFile(REDIRECTS_CONF, 'utf8'));
  redirectCount = redirects.length;
  let completed = 0;
  console.log(`Checking ${redirects.length} nginx redirects with concurrency ${CONCURRENCY}.`);

  await runWithConcurrency(redirects, CONCURRENCY, async (redirect) => {
    const markCompleted = () => {
      completed += 1;
      if (completed === redirects.length || completed % 25 === 0) {
        console.log(`Checked ${completed}/${redirects.length} redirects.`);
      }
    };
    const fromUrl = docsUrlForPath(redirect.from);
    const expectedToUrl = new URL(redirect.to, docsOrigin).href;
    const source = await request(fromUrl, { method: 'GET', redirect: 'manual' });

    if (shouldIgnoreStatus(source.status)) {
      addIgnoredResponse({
        source: 'redirect source',
        url: fromUrl,
        status: source.status,
        reason: source.statusText,
      });
      markCompleted();
      return;
    }

    if (source.status >= 400 || source.error) {
      redirectIssues.push({
        from: fromUrl,
        to: expectedToUrl,
        status: source.status,
        reason: source.error ?? source.statusText,
      });
      markCompleted();
      return;
    }

    const location = source.headers?.get('location');
    if (source.status < 300 || source.status >= 400 || !location) {
      redirectIssues.push({
        from: fromUrl,
        to: expectedToUrl,
        status: source.status,
        reason: 'Expected a 3xx redirect with a Location header',
      });
      markCompleted();
      return;
    }

    const actualToUrl = new URL(location, fromUrl).href;
    if (actualToUrl !== expectedToUrl) {
      redirectIssues.push({
        from: fromUrl,
        to: expectedToUrl,
        status: source.status,
        reason: `Redirects to ${actualToUrl}`,
      });
    }

    const target = await request(expectedToUrl, { method: 'HEAD' });
    const targetResult = target.status === 405 ? await request(expectedToUrl, { method: 'GET' }) : target;

    if (shouldIgnoreStatus(targetResult.status)) {
      addIgnoredResponse({
        source: `redirect target from ${fromUrl}`,
        url: expectedToUrl,
        status: targetResult.status,
        reason: targetResult.statusText,
      });
    } else if (targetResult.status >= 400 || targetResult.error) {
      redirectIssues.push({
        from: fromUrl,
        to: expectedToUrl,
        status: targetResult.status,
        reason: targetResult.error ?? targetResult.statusText,
      });
    }

    markCompleted();
  });
}

function addLinkCheck(url, source) {
  const cleanUrl = stripHash(url);
  if (!linkChecks.has(cleanUrl)) {
    linkChecks.set(cleanUrl, new Set());
  }

  linkChecks.get(cleanUrl).add(source);
}

function extractMarkdownLinks(contents) {
  const links = [];
  const markdownLinkPattern = /!?\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;

  for (const match of contents.matchAll(markdownLinkPattern)) {
    const href = match[1];
    if (!href || href.startsWith('<')) continue;

    links.push({
      href,
      line: lineNumberAt(contents, match.index ?? 0),
    });
  }

  return links;
}

function normalizeLink(href, baseUrl) {
  if (!href || href.startsWith('#')) return null;

  const trimmed = href.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('data:')
  ) {
    return null;
  }

  try {
    return new URL(trimmed, baseUrl).href;
  } catch {
    return null;
  }
}

function addIgnoredResponse(response) {
  ignoredResponses.push(response);
}

function shouldIgnoreStatus(status) {
  return ignoredStatusCodes.has(status);
}

function shouldIgnoreUrl(url) {
  const parsed = new URL(url);
  return ignoredUrlPatterns.some((pattern) => pattern.test(url) || (parsed.origin === docsOrigin && pattern.test(parsed.pathname)));
}

function parseRedirects(contents) {
  const redirects = [];
  const seen = new Set();

  const add = (from, status, to) => {
    const key = `${from}=>${to}`;
    if (!from || seen.has(key)) return;
    seen.add(key);
    redirects.push({ from, status, to });
  };

  for (const match of contents.matchAll(/location\s+=\s+(\S+)\s+\{\s+return\s+(30[1278])\s+([^;\s]+)\s*;\s+\}/g)) {
    add(match[1], Number(match[2]), match[3]);
  }

  for (const match of contents.matchAll(/location\s+~\s+\^(.+?)\$\s+\{\s+return\s+(30[1278])\s+([^;\s]+)\s*;\s+\}/g)) {
    const status = Number(match[2]);
    const to = match[3];
    for (const from of expandRedirectPattern(match[1])) {
      add(from, status, to);
    }
  }

  return redirects;
}

function expandRedirectPattern(pattern) {
  const paths = new Set();

  const expand = (current) => {
    const optionalGroup = current.match(/^(.*)(?:\(\?:([^)]+)\)\?)(.*)$/);
    if (optionalGroup && optionalGroup[2] && !optionalGroup[2].includes('(')) {
      expand(`${optionalGroup[1]}${optionalGroup[3]}`);
      expand(`${optionalGroup[1]}${optionalGroup[2]}${optionalGroup[3]}`);
      return;
    }

    const optionalSlash = current.match(/^(.*)\/\?(.*)$/);
    if (optionalSlash) {
      expand(`${optionalSlash[1]}${optionalSlash[2]}`);
      expand(`${optionalSlash[1]}/${optionalSlash[2]}`);
      return;
    }

    if (/[()[\]{}.*+]/.test(current)) return;

    paths.add(current.startsWith('/') ? current : `/${current}`);
  };

  expand(pattern);
  return [...paths];
}

async function findMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryUrl = new URL(entry.name, ensureDirectoryUrl(directory));

    if (entry.isDirectory()) {
      files.push(...(await findMdxFiles(entryUrl)));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(entryUrl);
    }
  }

  return files;
}

function sourceFileToPageUrl(file) {
  const relativePath = relativeDocPath(file).replace(/\.mdx$/, '');
  const pagePath = relativePath.endsWith('/index') ? relativePath.slice(0, -'/index'.length) : relativePath;
  return docsUrlForPath(pagePath);
}

function docsUrlForPath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (docsPathPrefix !== '/' && (path === docsPathPrefix || path.startsWith(`${docsPathPrefix}/`))) {
    return new URL(path, docsOrigin).href;
  }

  const prefix = docsPathPrefix === '/' ? '' : docsPathPrefix;
  return new URL(`${prefix}${path}`, docsOrigin).href;
}

function relativeContentPath(file) {
  return `content/docs/${relativeDocPath(file)}`;
}

function relativeDocPath(file) {
  return decodeURIComponent(file.pathname.replace(CONTENT_DIR.pathname, ''));
}

function ensureDirectoryUrl(url) {
  return url.href.endsWith('/') ? url : new URL(`${url.href}/`);
}

function lineNumberAt(contents, index) {
  return contents.slice(0, index).split('\n').length;
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      ...options,
      headers: {
        'user-agent': 'coolify-docs-broken-link-checker',
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const text =
      options.method !== 'HEAD' && contentType.includes('text/html') ? await response.text() : undefined;

    return {
      headers: response.headers,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      text,
    };
  } catch (error) {
    return {
      headers: undefined,
      ok: false,
      status: 0,
      statusText: 'Request failed',
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function runWithConcurrency(items, concurrency, worker) {
  let index = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      await worker(current);
    }
  });

  await Promise.all(workers);
}

function normalizeStartUrl(value) {
  const parsed = new URL(value);
  parsed.hash = '';
  return parsed;
}

function stripHash(value) {
  const parsed = new URL(value);
  parsed.hash = '';
  return parsed.href;
}

function trimTrailingSlash(value) {
  return value.length > 1 ? value.replace(/\/+$/, '') : value;
}

function printResults() {
  console.log(`Checked ${linkChecks.size} unique links`);

  if (brokenLinks.length > 0) {
    console.log('\nBroken links:');
    for (const link of brokenLinks) {
      console.log(`- ${link.status} ${link.url}`);
      console.log(`  Source: ${link.source}`);
      if (link.reason) console.log(`  Reason: ${link.reason}`);
    }
  }

  if (redirectIssues.length > 0) {
    console.log('\nRedirect issues:');
    for (const redirect of redirectIssues) {
      console.log(`- ${redirect.status} ${redirect.from}`);
      console.log(`  Expected: ${redirect.to}`);
      if (redirect.reason) console.log(`  Reason: ${redirect.reason}`);
    }
  }

  if (ignoredResponses.length > 0) {
    console.log('\nIgnored responses:');
    for (const response of ignoredResponses) {
      console.log(`- ${response.status} ${response.url}`);
      console.log(`  Source: ${response.source}`);
      if (response.reason) console.log(`  Reason: ${response.reason}`);
    }
  }

  if (brokenLinks.length === 0 && redirectIssues.length === 0) {
    console.log('\nNo broken links or redirect issues found.');
  }

  console.log('\nSummary:');
  console.log(`- Markdown files scanned: ${markdownFileCount}`);
  console.log(`- Markdown links found: ${markdownLinkCount}`);
  console.log(`- Links checked: ${linkChecks.size}`);
  console.log(`- Broken links: ${brokenLinks.length}`);
  console.log(`- Redirects checked: ${redirectCount}`);
  console.log(`- Redirect issues: ${redirectIssues.length}`);
  console.log(`- Ignored responses: ${ignoredResponses.length}`);
}

function logPhase(message) {
  console.log(`\n${message}...`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
