import { siteDefinition } from '@config/site.shared';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function derivePlausibleApiHost(scriptUrl: string): string {
  if (!scriptUrl) return '';

  try {
    const url = new URL(scriptUrl);
    const pathname = url.pathname.replace(/\/js\/[^/]+$/, '') || '/';
    return trimTrailingSlash(new URL(pathname, url.origin).toString());
  } catch {
    return '';
  }
}

const siteUrl = trimTrailingSlash(import.meta.env.VITE_SITE_URL || 'https://coolify.io');
const plausibleScriptUrl = trimTrailingSlash(
  import.meta.env.VITE_PLAUSIBLE_SCRIPT_URL || 'https://analytics.coollabs.io/js/script.tagged-events.js',
);
const plausibleApiHost = trimTrailingSlash(
  import.meta.env.VITE_PLAUSIBLE_API_HOST || derivePlausibleApiHost(plausibleScriptUrl),
);

export const site = {
  ...siteDefinition,
  siteUrl,
  docsUrl: `${siteUrl}${siteDefinition.docsBasePath}`,
  searchApi: `${siteDefinition.docsBasePath}/api/search`,
  llmsUrl: `${siteDefinition.docsBasePath}/llms.txt`,
  llmsFullUrl: `${siteDefinition.docsBasePath}/llms-full.txt`,
  plausible: {
    enabled: Boolean(plausibleScriptUrl && (import.meta.env.VITE_PLAUSIBLE_DOMAIN || import.meta.env.VITE_ANALYTICS_DOMAIN)),
    domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || import.meta.env.VITE_ANALYTICS_DOMAIN || 'coolify.io/docs',
    scriptUrl: plausibleScriptUrl,
    apiHost: plausibleApiHost,
  },
} as const;

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${site.siteUrl}/`).toString();
}

function normalizeAssetPath(pathname: string): string {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function publicAssetFallbackPath(pathname: string): string {
  const normalized = normalizeAssetPath(pathname);
  return normalized.startsWith(site.docsBasePath) ? normalized : `${site.docsBasePath}${normalized}`;
}

export function publicAssetPath(pathname: string): string {
  return publicAssetFallbackPath(pathname);
}

export function getDocOgPath(slugs: string[]): string {
  if (slugs.length === 0) return `${site.docsBasePath}/og/index.png`;
  return `${site.docsBasePath}/og/${slugs.join('/')}.png`;
}

export function getDocMarkdownPath(slugs: string[]): string {
  const segments = [...slugs, 'content.md'];
  return `${site.docsBasePath}/llms.mdx/docs/${segments.join('/')}`;
}

export function getDocGithubPath(path: string): string {
  return `https://github.com/coollabsio/coolify-docs/blob/next/docs/${path.replace(/\.mdx$/, '.md')}`;
}
