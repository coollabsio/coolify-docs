const MIN_META_DESCRIPTION_LENGTH = 110;

const serviceIndexSlugs = new Set(['all', 'overview', 'introduction', 'index']);

export function isServiceDoc(slugs: string[]): boolean {
  return slugs[0] === 'services' && slugs.length === 2 && !serviceIndexSlugs.has(slugs[1] ?? '');
}

export function serviceMetaDescription(name: string, description?: string): string {
  const title = name.trim() || 'this service';
  const slogan = (description ?? '').trim().replace(/\s+/g, ' ');
  const suffix = 'Runs on your server with SSL and backups.';
  const prefix = `Deploy ${title} on Coolify with one-click Docker.`;

  if (!slogan) {
    return `${prefix} ${suffix}`;
  }

  if (slogan.length >= MIN_META_DESCRIPTION_LENGTH) {
    return slogan;
  }

  if (/^deploy\b/i.test(slogan)) {
    return /ssl and backups/i.test(slogan) ? slogan : `${slogan.replace(/[.]+$/, '.')} ${suffix}`;
  }

  return `${prefix} ${slogan.replace(/[.]+$/, '.')} ${suffix}`;
}

export function resolveSeoDescription({
  title,
  description,
  ogDescription,
  slugs,
  fallback,
}: {
  title: string;
  description?: string;
  ogDescription?: string;
  slugs: string[];
  fallback: string;
}): string {
  const og = ogDescription?.trim();
  if (og && og.length >= MIN_META_DESCRIPTION_LENGTH) {
    return og;
  }

  const text = description?.trim() ?? '';

  if (isServiceDoc(slugs)) {
    return serviceMetaDescription(title, text || og);
  }

  return text || og || fallback;
}

export function tocHasH1(toc: Array<{ depth: number }> | undefined | null): boolean {
  return Boolean(toc?.some((item) => item.depth === 1));
}

export function frontmatterOgDescription(data: Record<string, unknown>): string | undefined {
  const og = data.og;
  if (!og || typeof og !== 'object') return undefined;

  const description = (og as { description?: unknown }).description;
  return typeof description === 'string' ? description : undefined;
}
