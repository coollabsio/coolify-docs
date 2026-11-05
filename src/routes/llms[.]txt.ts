import { createFileRoute } from '@tanstack/react-router';
import { renderLlmsTxt } from '@/lib/docs/llms-text';
import { source } from '@/lib/docs/source';

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () => new Response(renderLlmsTxt(source)),
    },
  },
});
