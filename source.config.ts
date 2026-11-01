import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { llmsMarkdownOptions } from './src/lib/docs/llms-markdown';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    postprocess: {
      includeProcessedMarkdown: llmsMarkdownOptions,
    },
  },
});

export default defineConfig();
