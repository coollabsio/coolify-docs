import { siteDefinition } from '@config/site.shared';
import Link from 'fumadocs-core/link';
import type React from 'react';

// Hrefs passed as component props don't go through the MDX `a` override, so a plain
// `<a href="/mcp/setup">` resolves against the domain root instead of `/docs`.
// The router adds the base path, so strip it here in case a page already includes it.
function toRouterHref(href: string): string {
  const { docsBasePath } = siteDefinition;

  if (href === docsBasePath) return '/';
  if (href.startsWith(`${docsBasePath}/`)) return href.slice(docsBasePath.length);

  return href;
}

export function CoolLink({ href = '#', ...props }: React.ComponentProps<typeof Link>) {
  return <Link href={toRouterHref(href)} {...props} />;
}
