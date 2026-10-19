import type { Folder, Item, Node, Root } from 'fumadocs-core/page-tree';
import { site } from '@/lib/config/site';
import { rewriteDocsMarkdownLinks, toAbsoluteDocsUrl, type DocsUrlOptions } from '@/lib/docs/absolute-docs-url';

const llmsTitle = 'Coolify Documentation';
const llmsSummary =
  'Coolify is an open-source, self-hostable alternative to Heroku, Vercel, Netlify and Railway, also available as Coolify Cloud';

type DocsSource = typeof import('@/lib/docs/source').source;

type DocsPageData = {
  title?: string;
  description?: string;
};

function docsUrlOptions(basePageUrl?: string): DocsUrlOptions {
  return {
    siteUrl: site.siteUrl,
    docsBasePath: site.docsBasePath,
    basePageUrl,
  };
}

export function absoluteDocsLink(url: string, basePageUrl?: string): string {
  return toAbsoluteDocsUrl(url, docsUrlOptions(basePageUrl));
}

export function rewritePageLinks(markdown: string, pageUrl: string): string {
  return rewriteDocsMarkdownLinks(markdown, docsUrlOptions(pageUrl));
}

function nodeLabel(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function escapeLinkLabel(value: string): string {
  return value.replace(/[[\]]/g, '\\$&');
}

function escapeLinkDestination(value: string): string {
  return value.replace(/[()]/g, '\\$&');
}

function pageCopy(docs: Pick<DocsSource, 'getNodePage'>, node: Item): { title: string; description: string } {
  const page = docs.getNodePage(node);
  const data = page?.data as DocsPageData | undefined;
  const title = (typeof data?.title === 'string' && data.title.trim()) || nodeLabel(node.name) || 'Page';
  const description =
    (typeof data?.description === 'string' && data.description) ||
    (typeof node.description === 'string' ? node.description : '');

  return {
    title,
    description: description.replace(/[\r\n]+/g, ' ').trim(),
  };
}

function sectionTitle(folderPath: string[], separator: string | null): string {
  return [...folderPath, separator].filter(Boolean).join(' / ') || 'Overview';
}

function folderIndexItem(docs: Pick<DocsSource, 'getPage'>, folder: Folder): Item | undefined {
  if (folder.index) return folder.index;

  const ref = folder.$ref;
  if (typeof ref !== 'string' || !ref.endsWith('meta.json')) return undefined;

  const slugs = ref.replace(/\/?meta\.json$/, '').split('/').filter(Boolean);
  if (slugs.length === 0) return undefined;

  const page = docs.getPage(slugs);
  if (!page) return undefined;

  const data = page.data as DocsPageData;
  return {
    type: 'page',
    name: (typeof data.title === 'string' && data.title.trim()) || folder.name,
    url: page.url,
    description: typeof data.description === 'string' ? data.description : undefined,
    $ref: page.path,
  };
}

export function renderLlmsTxt(docs: Pick<DocsSource, 'getPageTree' | 'getNodePage' | 'getPage'>): string {
  const sections: Array<{ title: string; lines: string[] }> = [];
  const seen = new Set<string>();

  const ensureSection = (title: string) => {
    const existing = sections.find((section) => section.title === title);
    if (existing) return existing;

    const section = { title, lines: [] as string[] };
    sections.push(section);
    return section;
  };

  const addPage = (node: Item, title: string) => {
    const url = absoluteDocsLink(node.url);
    if (seen.has(url)) return;
    seen.add(url);

    const copy = pageCopy(docs, node);
    const link = `[${escapeLinkLabel(copy.title)}](${escapeLinkDestination(url)})`;
    const description = rewritePageLinks(copy.description, node.url);
    ensureSection(title).lines.push(description ? `- ${link}: ${description}` : `- ${link}`);
  };

  const walk = (nodes: Node[], folderPath: string[]) => {
    let separator: string | null = null;

    for (const node of nodes) {
      if (node.type === 'separator') {
        const name = nodeLabel(node.name);
        if (name) separator = name;
        continue;
      }

      if (node.type === 'page') {
        addPage(node, sectionTitle(folderPath, separator));
        continue;
      }

      const folder: Folder = node;
      const folderName = nodeLabel(folder.name) || 'Section';
      const nextPath = [...folderPath, ...(!folder.root && separator ? [separator] : []), folderName];
      const index = folderIndexItem(docs, folder);
      if (index) addPage(index, nextPath.join(' / '));
      walk(folder.children, nextPath);
    }
  };

  walk((docs.getPageTree() as Root).children, []);

  const lines = [`# ${llmsTitle}`, '', `> ${llmsSummary}`, ''];
  for (const section of sections) {
    if (section.lines.length === 0) continue;
    lines.push(`## ${section.title}`, '', ...section.lines, '');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}
