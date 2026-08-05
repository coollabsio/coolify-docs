import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import * as React from 'react';
import { DocsLink } from '@/components/docs-link';
import SearchDialog from '@/components/search';
import { absoluteUrl, publicAssetFallbackPath, site } from '@/lib/site';
import '@/styles/app.css';

export const Route = createRootRoute({
  head: () => {
    const rootOgImage = `${site.docsBasePath}/og/index.png`;

    return {
      meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: site.title,
      },
      {
        name: 'description',
        content: site.description,
      },
      {
        name: 'theme-color',
        content: site.themeColor,
      },
      {
        name: 'robots',
        content: 'index,follow',
      },
      {
        property: 'og:site_name',
        content: site.title,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: site.title,
      },
      {
        property: 'og:description',
        content: site.description,
      },
      {
        property: 'og:image',
        content: rootOgImage,
      },
      {
        property: 'og:image:type',
        content: 'image/png',
      },
      {
        property: 'og:image:width',
        content: String(site.og.width),
      },
      {
        property: 'og:image:height',
        content: String(site.og.height),
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: site.title,
      },
      {
        name: 'twitter:description',
        content: site.description,
      },
      {
        name: 'twitter:image',
        content: rootOgImage,
      },
      {
        name: 'keywords',
        content: site.keywords.join(', '),
      },
      ],
      links: [
        { rel: 'icon', href: publicAssetFallbackPath('/brand/favicon.ico'), type: 'image/x-icon', sizes: 'any' },
        { rel: 'shortcut icon', href: publicAssetFallbackPath('/brand/favicon.ico') },
        { rel: 'manifest', href: publicAssetFallbackPath('/site.webmanifest') },
        { rel: 'alternate', href: absoluteUrl(site.llmsUrl), title: 'Coolify LLM Index', type: 'text/plain' },
      ],
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang={site.locale} suppressHydrationWarning>
      <head>
        <HeadContent />
        {site.plausible.enabled ? (
          <script
            defer
            data-domain={site.plausible.domain}
            src={site.plausible.scriptUrl}
            {...(site.plausible.apiHost
              ? {
                  'data-api': `${site.plausible.apiHost}/api/event`,
                }
              : {})}
          />
        ) : null}
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider search={{ SearchDialog }} components={{ Link: DocsLink }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
