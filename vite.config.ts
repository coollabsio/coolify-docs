import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import { getDocEntries, getOpenApiEntries } from './scripts/lib/content';
import { siteDefinition } from './config/site.shared';

const docEntries = [...(await getDocEntries()), ...(await getOpenApiEntries())];
const prerenderDocPages = docEntries.map((doc) => ({
  path:
    doc.routeSegments.length === 0
      ? siteDefinition.docsBasePath
      : `${siteDefinition.docsBasePath}/${doc.routeSegments.join('/')}`,
}));
const prerenderMarkdownPages = docEntries.map((doc) => ({
  path: `${siteDefinition.docsBasePath}/llms.mdx/docs/${[...doc.routeSegments, 'content.md'].join('/')}`,
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
    tsconfigPaths: true,
  },
});
