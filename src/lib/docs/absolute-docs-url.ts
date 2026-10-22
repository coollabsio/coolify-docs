export interface DocsUrlOptions {
  siteUrl: string;
  docsBasePath: string;
  basePageUrl?: string;
}

function docsOrigin(siteUrl: string): string {
  return new URL(siteUrl).origin;
}

function suffixIndex(value: string): number {
  const hash = value.indexOf('#');
  const query = value.indexOf('?');
  if (hash === -1) return query;
  if (query === -1) return hash;
  return Math.min(hash, query);
}

function isRelativePath(value: string): boolean {
  return value.startsWith('./') || value.startsWith('../');
}

export function toAbsoluteDocsUrl(url: string, options: DocsUrlOptions): string {
  const value = url.trim();
  if (!value || value.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(value)) {
    return value;
  }

  if (value.startsWith('#') || value.startsWith('?') || isRelativePath(value)) {
    if (!options.basePageUrl) return value;
    const base = toAbsoluteDocsUrl(options.basePageUrl, { ...options, basePageUrl: undefined });
    return new URL(value, base).href;
  }

  if (!value.startsWith('/')) return value;

  const docsBase = options.docsBasePath.startsWith('/') ? options.docsBasePath : `/${options.docsBasePath}`;
  const cut = suffixIndex(value);
  const path = cut === -1 ? value : value.slice(0, cut);
  const suffix = cut === -1 ? '' : value.slice(cut);
  const pathname = path.replace(/\/+$/, '') || '/';
  const docsPath =
    pathname === '/' || pathname === docsBase
      ? docsBase
      : pathname.startsWith(`${docsBase}/`)
        ? pathname
        : `${docsBase}${pathname}`;

  return new URL(`${docsPath}${suffix}`, `${docsOrigin(options.siteUrl)}/`).href;
}

const markdownLink =
  /(!?\[[^\]\n]*\]\()(\s*)(<[^>\n]+>|[^\s)]+)(\s+(?:"[^"\n]*"|'[^'\n]*'))?\)/g;

const htmlAttribute = /\b(href|src)(\s*=\s*)(["'])([^"']+)\3/gi;

const referenceDefinition = /^( {0,3}\[[^\]\n]+\]:[ \t]+)(\S+)/gm;

export function rewriteDocsMarkdownLinks(markdown: string, options: DocsUrlOptions): string {
  const rewriteTarget = (target: string) => toAbsoluteDocsUrl(target, options);

  const withMarkdownLinks = markdown.replace(markdownLink, (match, prefix, space, rawTarget, title = '') => {
    const wrapped = rawTarget.startsWith('<') && rawTarget.endsWith('>');
    const target = wrapped ? rawTarget.slice(1, -1) : rawTarget;
    const absolute = rewriteTarget(target);
    if (absolute === target) return match;
    return `${prefix}${space}${wrapped ? `<${absolute}>` : absolute}${title})`;
  });

  const withReferences = withMarkdownLinks.replace(referenceDefinition, (match, prefix, target) => {
    const absolute = rewriteTarget(target);
    return absolute === target ? match : `${prefix}${absolute}`;
  });

  return withReferences.replace(htmlAttribute, (match, attr, eq, quote, target) => {
    const absolute = rewriteTarget(target);
    return absolute === target ? match : `${attr}${eq}${quote}${absolute}${quote}`;
  });
}
