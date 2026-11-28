import services from '../../generated/services.json' with { type: 'json' };

const MIN_META = 120;
const MAX_META = 160;

const serviceSlugs = new Set(services.map((service) => service.slug));

const titleOverrides: Record<string, string> = {
  '/docs': 'Coolify Docs: Install, deploy & self-host apps',
  '/docs/core/what-is-coolify': 'What is Coolify? Open-source, self-hostable PaaS',
  '/docs/start-with-self-hosted': 'Install Coolify (Self-hosted): One-command Setup',
  '/docs/hetzner': 'Hetzner Promo Code: €20 Credit for New Users | Coolify',
};

const danglingWord = /\b(?:a|an|the|and|or|with|for|to|of|in|on|from|as|by|via|your|its|their)$/i;

export interface DocSeoInput {
  url: string;
  title: string;
  description: string;
  isIndex?: boolean;
  siteTitle?: string;
  siteDescription?: string;
}

export interface DocSeo {
  title: string;
  description: string;
}

export function normalizeDocsPath(url: string): string {
  const path = url.split(/[?#]/)[0] ?? url;
  const withBase = path.startsWith('/docs')
    ? path
    : path === '/' || path === ''
      ? '/docs'
      : `/docs/${path.replace(/^\/+/, '')}`;
  return withBase.replace(/\/+$/, '') || '/docs';
}

export function servicePageSlug(url: string): string | undefined {
  const match = normalizeDocsPath(url).match(/^\/docs\/services\/([^/]+)$/);
  const slug = match?.[1];
  return slug && serviceSlugs.has(slug) ? slug : undefined;
}

function cleanDescription(description: string): string {
  return description.trim().replace(/[.!\s]+$/g, '').replace(/\s+/g, ' ');
}

function shortenClause(value: string, max: number): string {
  if (value.length <= max) return value;

  let text = value.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s,;:–—-]+$/g, '');
  while (danglingWord.test(text) && text.includes(' ')) {
    text = text.replace(danglingWord, '').replace(/[\s,;:–—-]+$/g, '');
  }
  return text;
}

function patternsFor(name: string): Array<(description: string) => string> {
  return [
    (desc) =>
      `Deploy ${name} (${desc}) on your own server with Coolify's one-click Docker template. Setup, environment variables, and updates.`,
    (desc) =>
      `Deploy ${name} (${desc}) on your own server with Coolify's one-click Docker template. Setup and updates.`,
    (desc) => `Deploy ${name} (${desc}) on your own server with Coolify's one-click Docker template.`,
    (desc) =>
      `Deploy ${name} on your own server with Coolify: ${desc}. One-click Docker setup, environment variables, and updates.`,
    (desc) => `Deploy ${name} on your own server with Coolify: ${desc}. One-click Docker template.`,
    (desc) => `Self-host ${name} with Coolify: ${desc}. One-click Docker template for your own server.`,
    (desc) => `Self-host ${name} with Coolify: ${desc}. One-click Docker template.`,
    (desc) => `Self-host ${name} with Coolify: ${desc}.`,
  ];
}

function shrinkPattern(pattern: (description: string) => string, description: string): string | null {
  const emptyLength = pattern('').length;
  if (emptyLength >= MAX_META) return null;

  let clause = shortenClause(description, Math.max(1, MAX_META - emptyLength));
  if (!clause) return null;

  let text = pattern(clause);
  while (text.length > MAX_META && clause.includes(' ')) {
    clause = shortenClause(clause, clause.length - 1);
    if (!clause) return null;
    text = pattern(clause);
  }

  return text.length >= MIN_META && text.length <= MAX_META ? text : null;
}

/** 120–160 character meta built from a service's own description. */
export function serviceMetaDescription(name: string, description: string): string {
  const cleaned = cleanDescription(description) || 'a one-click Docker service';
  const patterns = patternsFor(name);
  const fullFits = patterns
    .map((pattern) => pattern(cleaned))
    .filter((text) => text.length >= MIN_META && text.length <= MAX_META);

  if (fullFits.length > 0) {
    return fullFits.sort((left, right) => right.length - left.length)[0]!;
  }

  // The description is too long for every template. Keep as much of it as possible.
  for (const pattern of [...patterns].reverse()) {
    const shrunk = shrinkPattern(pattern, cleaned);
    if (shrunk) return shrunk;
  }

  return shortenClause(`Self-host ${name} with Coolify: ${cleaned}. One-click Docker template.`, MAX_META);
}

export function resolveDocSeo(input: DocSeoInput): DocSeo {
  const url = normalizeDocsPath(input.url);
  const siteTitle = input.siteTitle ?? 'Coolify Docs';
  const description = input.description?.trim() || input.siteDescription || '';
  const overrideTitle = titleOverrides[url];

  if (overrideTitle) {
    return { title: overrideTitle, description };
  }

  if (servicePageSlug(url)) {
    return {
      title: `Self-host ${input.title} with Coolify (One-click Docker)`,
      description: serviceMetaDescription(input.title, description),
    };
  }

  return {
    title: input.isIndex ? siteTitle : `${input.title} | ${siteTitle}`,
    description,
  };
}
