import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';
import { frontmatterOgDescription, resolveSeoDescription } from '../../src/lib/seo';
import { site } from './site';
import { currentDirFromMetaUrl } from './runtime-path';

export interface DocEntry {
  filePath: string;
  ogOutputPath: string;
  routeSegments: string[];
  routePath: string;
  ogImagePath: string;
  title: string;
  description: string;
  lastModified: string;
}

export interface DocPageSourceFile {
  type: 'page';
  path: string;
  slugs: string[];
  data: {
    title?: string;
    description?: string;
    icon?: string;
  };
}

export interface DocMetaSourceFile {
  type: 'meta';
  path: string;
  data: {
    title?: string;
    description?: string;
    icon?: string;
    root?: boolean;
    defaultOpen?: boolean;
    collapsible?: boolean;
    pages?: string[];
  };
}

const docsDir = resolve(currentDirFromMetaUrl(import.meta.url), '../../content/docs');

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function toPosix(value: string): string {
  return value.split(sep).join('/');
}

function toTitleCase(segment: string): string {
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildRoute(relativeFilePath: string) {
  const cleanPath = toPosix(relativeFilePath).replace(/\.(md|mdx)$/, '');
  const segments = cleanPath.split('/');
  const lastSegment = segments.at(-1) ?? '';
  const isIndex = lastSegment === 'index';
  const routeSegments = isIndex ? segments.slice(0, -1) : segments;
  const ogSegments =
    routeSegments.length === 0 ? ['index'] : isIndex ? [...routeSegments, 'index'] : routeSegments;
  const routePath =
    routeSegments.length === 0
      ? `${site.docsBasePath}/`
      : `${site.docsBasePath}/${routeSegments.join('/')}`;

  return {
    routeSegments,
    routePath,
    ogOutputPath: `og/${ogSegments.join('/')}.png`,
    ogImagePath: `${site.docsBasePath}/og/${ogSegments.join('/')}.png`,
  };
}

export async function getOpenApiEntries(): Promise<DocEntry[]> {
  const { loader, multiple, source: createSource } = await import('fumadocs-core/source');
  const { openapiPlugin, openapiSource } = await import('fumadocs-openapi/server');
  const { openapi } = await import('../../src/lib/openapi');
  const { getDocOgPath } = await import('../../src/lib/site');

  const docsSource = loader(
    multiple({
      docs: createSource({ metas: [], pages: [] }),
      openapi: await openapiSource(openapi, {
        baseDir: 'api-reference/api',
        groupBy: 'tag',
      }),
    }),
    {
      baseUrl: '/',
      plugins: [openapiPlugin()],
    },
  );

  const lastModified = new Date().toISOString();

  return docsSource
    .getPages()
    .filter((page) => page.data.type === 'openapi')
    .map((page) => {
      const title = page.data.title ?? 'API Reference';
      const routePath =
        page.url === '/' ? `${site.docsBasePath}/` : `${site.docsBasePath}${page.url}`;

      return {
        filePath: page.path,
        ogOutputPath: `og/${page.slugs.join('/')}.png`,
        routeSegments: page.slugs,
        routePath,
        ogImagePath: getDocOgPath(page.slugs),
        title,
        description: resolveSeoDescription({
          title,
          description: page.data.description,
          slugs: page.slugs,
          fallback: site.description,
        }),
        lastModified,
      } satisfies DocEntry;
    });
}

export async function getDocEntries(): Promise<DocEntry[]> {
  const files = await walk(docsDir);
  const docs = await Promise.all(
    files
      .filter((filePath) => ['.md', '.mdx'].includes(extname(filePath)))
      .map(async (filePath) => {
        const relativeFilePath = relative(docsDir, filePath);
        const { routeSegments, routePath, ogImagePath, ogOutputPath } = buildRoute(relativeFilePath);
        const raw = await readFile(filePath, 'utf8');
        const parsed = matter(raw);
        const fileStat = await stat(filePath);
        const fallbackTitle = toTitleCase(routeSegments.at(-1) ?? site.name);
        const title = typeof parsed.data.title === 'string' ? parsed.data.title : fallbackTitle;
        const description = typeof parsed.data.description === 'string' ? parsed.data.description : undefined;

        return {
          filePath,
          ogOutputPath,
          routeSegments,
          routePath,
          ogImagePath,
          title,
          description: resolveSeoDescription({
            title,
            description,
            ogDescription: frontmatterOgDescription(parsed.data as Record<string, unknown>),
            slugs: routeSegments,
            fallback: site.description,
          }),
          lastModified: fileStat.mtime.toISOString(),
        } satisfies DocEntry;
      }),
  );

  return docs.sort((left, right) => left.routePath.localeCompare(right.routePath));
}

export async function getDocSourceFiles() {
  const files = await walk(docsDir);
  const pages: DocPageSourceFile[] = [];
  const metas: DocMetaSourceFile[] = [];

  for (const filePath of files) {
    const relativeFilePath = toPosix(relative(docsDir, filePath));
    const extension = extname(filePath);

    if (['.md', '.mdx'].includes(extension)) {
      const raw = await readFile(filePath, 'utf8');
      const parsed = matter(raw);
      const { routeSegments } = buildRoute(relativeFilePath);

      pages.push({
        type: 'page',
        path: relativeFilePath,
        slugs: routeSegments,
        data: {
          title: typeof parsed.data.title === 'string' ? parsed.data.title : undefined,
          description: typeof parsed.data.description === 'string' ? parsed.data.description : undefined,
          icon: typeof parsed.data.icon === 'string' ? parsed.data.icon : undefined,
        },
      });
      continue;
    }

    if (extension === '.json') {
      const raw = await readFile(filePath, 'utf8');
      const parsed = JSON.parse(raw) as DocMetaSourceFile['data'];

      metas.push({
        type: 'meta',
        path: relativeFilePath,
        data: {
          title: typeof parsed.title === 'string' ? parsed.title : undefined,
          description: typeof parsed.description === 'string' ? parsed.description : undefined,
          icon: typeof parsed.icon === 'string' ? parsed.icon : undefined,
          root: typeof parsed.root === 'boolean' ? parsed.root : undefined,
          defaultOpen: typeof parsed.defaultOpen === 'boolean' ? parsed.defaultOpen : undefined,
          collapsible: typeof parsed.collapsible === 'boolean' ? parsed.collapsible : undefined,
          pages: Array.isArray(parsed.pages)
            ? parsed.pages.filter((value): value is string => typeof value === 'string')
            : undefined,
        },
      });
    }
  }

  return { metas, pages };
}
