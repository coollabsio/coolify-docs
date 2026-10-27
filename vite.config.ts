import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';
import { openapiSource } from 'fumadocs-openapi/server';
import { defineConfig } from 'vite';
import { getAllDocEntries } from './scripts/lib/content';
import { siteDefinition } from './config/site.shared';
import { openapi } from './src/lib/config/openapi';

const docEntries = await getAllDocEntries();
const prerenderDocPages = docEntries.map((doc) => ({
  path:
    doc.routeSegments.length === 0
      ? siteDefinition.docsBasePath
      : `${siteDefinition.docsBasePath}/${doc.routeSegments.join('/')}`,
}));
// The crawler finds API endpoint pages through links, but no link points to their Markdown.
const openapiPages = (await openapiSource(openapi, { baseDir: 'api/endpoints', groupBy: 'tag' })).files
  .filter((file) => file.type === 'page')
  .map((file) => file.path.replace(/\.mdx?$/, '').split('/'));
const prerenderMarkdownPages = [...docEntries.map((doc) => doc.routeSegments), ...openapiPages].map((slugs) => ({
  path: `${siteDefinition.docsBasePath}/llms.mdx/docs/${[...slugs, 'content.md'].join('/')}`,
}));

export default defineConfig({
  base: '/docs/',
  server: {
    port: 3000,
    watch: {
      ignored: ['**/.output/**', '**/node_modules/.nitro/**'],
      usePolling: true,
      interval: 1000,
    },
  },
  plugins: [
    mdx(await import('./source.config')),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
      },
      pages: [
        ...prerenderDocPages,
        ...prerenderMarkdownPages,
        {
          path: `${siteDefinition.docsBasePath}/api/search`,
        },
        {
          path: `${siteDefinition.docsBasePath}/llms.txt`,
        },
        {
          path: `${siteDefinition.docsBasePath}/llms-full.txt`,
        },
      ],
    }),
    react(),
    nitro(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    tsconfigPaths: true,
  },
});
