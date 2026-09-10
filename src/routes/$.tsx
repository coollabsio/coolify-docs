import { createServerFn } from '@tanstack/react-start';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import browserCollections from 'collections/browser';
import type { Root } from 'fumadocs-core/page-tree';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense, useMemo, type ReactNode } from 'react';
import { ClientAPIPage } from '@/components/pages/api-page';
import { ReiconMarkdownCopyButton } from '@/components/docs/markdown-copy-button';
import { MobileDrawerHeaderActions } from '@/components/layout/mobile-header-controls';
import { PageSwitcherGuide } from '@/components/layout/page-switcher-guide';
import { DocsLayout, type DocsSlots } from 'fumadocs-ui/layouts/notebook';
import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/notebook/page';
import { useMDXComponents } from '@/components/docs/mdx';
import { CarbonAds } from '@/components/layout/carbon-ads';
import { ViewOptionsPopover } from '@/components/layout/page-actions';
import { type DocsManifest, getManifestKey, type LoaderData } from '@/lib/docs/docs-manifest';
import { createDocsLayoutTabs } from '@/lib/docs/docs-layout-tabs';
import { baseOptions } from '@/lib/ui/layout.shared';
import { prepareHomeSidebarPageTree, preparePageTree } from '@/lib/docs/page-tree';
import { absoluteUrl, getDocGithubPath, getDocOgPath, site } from '@/lib/config/site';
import { getPageMarkdownUrl, source } from '@/lib/docs/source';
import services from '@/generated/services.json';

type RuntimeLoaderData = LoaderData extends infer T
  ? T extends unknown
    ? Omit<T, 'pageTree'> & { pageTree: Root }
    : never
  : never;

const hiddenSidebarSlots: DocsSlots['sidebar'] = {
  provider: ({ children }) => children,
  root: () => null,
  trigger: () => null,
  collapseTrigger: () => null,
  useSidebar: () => ({ collapsed: true, open: false, setOpen: () => {} }),
};

const servicePageUrls = new Set(services.map((service) => `/services/${service.slug}`));

function toPublicDocUrl(url: string): string {
  if (url === '/') return site.docsBasePath;
  return `${site.docsBasePath}${url}`;
}

function toInternalDocUrl(url: string): string {
  if (!url.startsWith(site.docsBasePath)) return url;

  const path = url.slice(site.docsBasePath.length);
  return path || '/';
}

const folderIndexRedirects = new Map([
  ['applications/build-packs/overview', '/applications/build-packs'],
  ['applications/ci-cd/introduction', '/applications/ci-cd'],
  ['integrations/networking/cloudflare/tunnels/overview', '/integrations/networking/cloudflare/tunnels'],
  ['knowledge-base/overview', '/knowledge-base'],
  ['knowledge-base/proxy/traefik/overview', '/knowledge-base/proxy/traefik'],
  ['knowledge-base/proxy/caddy/overview', '/knowledge-base/proxy/caddy'],
  ['troubleshoot/overview', '/troubleshoot'],
]);

export const Route = createFileRoute('/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const redirectPath = folderIndexRedirects.get(slugs.join('/'));

    if (redirectPath) {
      throw redirect({ href: toPublicDocUrl(redirectPath), statusCode: 308 });
    }

    const data = await loadPageData(slugs);
    if (data.type === 'docs') {
      await clientLoader.preload(data.path);
    }

    return data;
  },
  head: ({ loaderData }) => {
    const data = loaderData as LoaderData | undefined;
    if (!data) {
      return {};
    }

    const title = data.isIndex ? site.title : `${data.title} | ${site.title}`;
    const description = data.description || site.description;
    const canonicalUrl = absoluteUrl(data.url.endsWith('/') ? data.url : `${data.url}`);
    const ogImageUrl = absoluteUrl(data.ogImagePath);
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': data.isIndex ? 'WebPage' : 'TechArticle',
      headline: data.title,
      description,
      url: canonicalUrl,
      image: absoluteUrl(data.ogImagePath),
      inLanguage: site.locale,
      publisher: {
        '@type': 'Organization',
        name: site.name,
      },
    };

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: String(site.og.width) },
        { property: 'og:image:height', content: String(site.og.height) },
        { property: 'og:type', content: data.isIndex ? 'website' : 'article' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImageUrl },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }): Promise<LoaderData> => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();
    const pageTree = await source.serializePageTree(preparePageTree(source.getPageTree()));

    if (page.data.type === 'openapi') {
      return {
        type: 'openapi',
        description: page.data.description ?? site.description,
        isIndex: page.slugs.length === 0,
        ogImagePath: getDocOgPath(page.slugs),
        pageTree,
        props: await page.data.getClientAPIPageProps(),
        title: page.data.title ?? 'API Reference',
        url: toPublicDocUrl(page.url),
      } satisfies LoaderData;
    }

    return {
      type: 'docs',
      description: page.data.description ?? site.description,
      isIndex: page.slugs.length === 0,
      markdownUrl: getPageMarkdownUrl(page).url,
      ogImagePath: getDocOgPath(page.slugs),
      pageTree,
      path: page.path,
      title: page.data.title,
      url: toPublicDocUrl(page.url),
    } satisfies LoaderData;
  });

let docsManifestPromise: Promise<DocsManifest> | undefined;

async function loadDocsManifest() {
  docsManifestPromise ??= fetch(`${site.docsBasePath}/docs-manifest.json`, {
    method: 'GET',
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Failed to load docs manifest: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as DocsManifest;
  });

  return docsManifestPromise;
}

async function loadPageData(slugs: string[]): Promise<LoaderData> {
  if (import.meta.env.PROD && typeof document !== 'undefined') {
    const manifest = await loadDocsManifest();
    const page = manifest.pages[getManifestKey(slugs)];

    if (!page) throw notFound();

    return {
      ...page,
      pageTree: manifest.pageTree,
    } as LoaderData;
  }

  return serverLoader({ data: slugs });
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    { hideFooter, markdownUrl, path }: { hideFooter?: boolean; markdownUrl: string; path: string },
  ) {
    const hidePageChrome = path.includes('choose-your-path');
    const pageActions = (
      <PageActions
        className="mt-4 border-t pt-4 max-xl:mb-4 max-xl:ps-2"
        githubUrl={getDocGithubPath(path)}
        markdownUrl={markdownUrl}
      />
    );

    if (frontmatter.full) {
      return (
        <DocsPage
          full
          toc={toc}
          tableOfContent={{ enabled: false }}
          breadcrumb={{ enabled: false }}
          footer={{ enabled: !hideFooter }}
        >
          <DocsBody>
            <MDX components={useMDXComponents()} />
          </DocsBody>
        </DocsPage>
      );
    }

    return (
      <DocsPage
        toc={toc}
        breadcrumb={{ enabled: false }}
        footer={{ enabled: !hideFooter && !hidePageChrome }}
        tableOfContent={hidePageChrome ? { enabled: false } : { style: 'clerk', footer: pageActions }}
        tableOfContentPopover={hidePageChrome ? { enabled: false } : { style: 'clerk', footer: pageActions }}
      >
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData()) as unknown as RuntimeLoaderData;
  const hasHomeSidebar = isHomeSidebarRoute(data);
  const internalUrl = toInternalDocUrl(data.url);
  const hideSidebar = servicePageUrls.has(internalUrl);
  const layoutTabs = useMemo(() => createDocsLayoutTabs(data.pageTree), [data.pageTree]);
  const sidebarTree = useMemo(
    () => (hasHomeSidebar ? prepareHomeSidebarPageTree(data.pageTree) : data.pageTree),
    [data.pageTree, hasHomeSidebar],
  );
  const layoutOptions = baseOptions();
  let content: ReactNode;

  if (data.type === 'openapi') {
    content = (
      <DocsPage full tableOfContent={{ enabled: false }} breadcrumb={{ enabled: false }}>
        <DocsBody>
          <ClientAPIPage {...data.props} />
        </DocsBody>
      </DocsPage>
    );
  } else {
    content = clientLoader.useContent(data.path, {
      hideFooter: data.isIndex,
      markdownUrl: data.markdownUrl,
      path: data.path,
    });
  }

  return (
    <DocsLayout
      {...layoutOptions}
      key={hasHomeSidebar ? 'home-sidebar' : 'docs-sidebar'}
      nav={{ ...layoutOptions.nav, mode: 'top' }}
      sidebar={{ banner: <MobileDrawerHeaderActions /> }}
      slots={hideSidebar ? { sidebar: hiddenSidebarSlots } : undefined}
      tree={sidebarTree}
      tabs={layoutTabs}
    >
      <Suspense>{content}</Suspense>
      <PageSwitcherGuide />
    </DocsLayout>
  );
}

function isHomeSidebarRoute(data: RuntimeLoaderData) {
  if (data.type !== 'docs') return false;

  const internalUrl = toInternalDocUrl(data.url);
  if (internalUrl === '/') return true;

  return data.pageTree.children.some((node) => node.type === 'page' && node.url === internalUrl);
}

function PageActions({
  className,
  githubUrl,
  markdownUrl,
}: {
  className?: string;
  githubUrl: string;
  markdownUrl: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-row items-center gap-2">
        <ReiconMarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
      </div>
      <CarbonAds />
    </div>
  );
}
