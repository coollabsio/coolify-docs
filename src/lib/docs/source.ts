import { type InferPageType, loader, multiple } from 'fumadocs-core/source';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { docs } from 'collections/server';
import { openapi } from '../config/openapi';
import { getDocMarkdownPath } from '../config/site';
import { absoluteDocsLink, rewritePageLinks } from './llms-text';

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      baseDir: 'api/endpoints',
      groupBy: 'tag',
    }),
  }),
  {
    baseUrl: '/',
    plugins: [openapiPlugin()],
  },
);

export function getPageMarkdownUrl(page: InferPageType<typeof source>) {
  return {
    segments: [...page.slugs, 'content.md'],
    url: getDocMarkdownPath(page.slugs),
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const pageUrl = absoluteDocsLink(page.url);

  if (page.data.type === 'openapi') {
    return `# ${page.data.title} (${pageUrl})\n\n${JSON.stringify(page.data.getSchema().bundled, null, 2)}`;
  }

  const processed = await page.data.getText('processed');
  return `# ${page.data.title} (${pageUrl})\n\n${rewritePageLinks(processed, page.url)}`;
}
