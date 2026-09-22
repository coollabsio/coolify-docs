import { type InferPageType, loader, multiple } from 'fumadocs-core/source';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { docs } from 'collections/server';
import { openapi } from '../config/openapi';
import { getDocMarkdownPath, site } from '../config/site';

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

function getPublicDocUrl(url: string) {
  if (url === '/') return site.docsBasePath;
  return `${site.docsBasePath}${url}`;
}

export async function getLLMText(page: InferPageType<typeof source>) {
  if (page.data.type === 'openapi') {
    return `# ${page.data.title} (${getPublicDocUrl(page.url)})\n\n${JSON.stringify(page.data.getSchema().bundled, null, 2)}`;
  }

  const processed = await page.data.getText('processed');
  return `# ${page.data.title} (${getPublicDocUrl(page.url)})\n\n${processed}`;
}
