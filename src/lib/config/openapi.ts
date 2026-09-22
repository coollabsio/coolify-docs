import { createOpenAPI } from 'fumadocs-openapi/server';
import type { Document } from 'fumadocs-openapi';
import openapiSchema from '../../../config/openapi.json' with { type: 'json' };

function titleFromOperationId(operationId: string) {
  return operationId
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function titleFromDuplicateOperation(operationId: string, method: string) {
  const methodWords = new Set([method.toLowerCase(), method.toLowerCase().replace('patch', 'update')]);
  const words = operationId
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split(/[-_]+/)
    .filter(Boolean);

  if (words.length > 0 && methodWords.has(words[0].toLowerCase())) {
    words.shift();
  }

  const byIndex = words.findIndex((word) => word.toLowerCase() === 'by');
  const meaningfulWords = byIndex === -1 ? words : words.slice(0, byIndex);

  const title = meaningfulWords.join(' ');

  return title.charAt(0).toUpperCase() + title.slice(1);
}

function normalizeOpenAPI() {
  const schema = structuredClone(openapiSchema);
  const document = schema as Document;

  document.servers = [
    {
      name: 'Coolify Cloud',
      url: 'https://app.coolify.io/api/v1',
      description: 'Coolify Cloud API',
    },
    {
      name: 'Self-hosted',
      url: '{protocol}://{domain}/api/v1',
      description: 'Your self-hosted Coolify API',
      variables: {
        protocol: {
          default: 'https',
          enum: ['https', 'http'],
          description: 'Select the protocol used by your Coolify instance.',
        },
        domain: {
          default: 'coolify.example.com',
          description: 'Enter only the trusted Coolify domain or IP address. Do not include http:// or https://.',
        },
      },
    },
  ];

  const declaredTags = new Set((schema.tags ?? []).map((tag) => tag.name));
  const usedTags = new Set<string>();
  const operations: Array<{
    method: string;
    path: string;
    operation: { operationId?: string; summary?: string; tags?: string[] };
  }> = [];
  const summaryCountsByTag = new Map<string, number>();

  for (const [routePath, pathItem] of Object.entries(schema.paths ?? {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!operation || typeof operation !== 'object' || !('operationId' in operation)) continue;
      const summary = typeof operation.summary === 'string' ? operation.summary.trim() : undefined;
      const tags = Array.isArray(operation.tags) && operation.tags.length > 0 ? operation.tags : ['System'];
      operation.tags = tags;
      operations.push({ method, path: routePath, operation });

      for (const tag of tags) {
        usedTags.add(tag);
      }

      if (summary) {
        for (const tag of tags) {
          const key = `${tag}\n${summary.toLowerCase()}`;
          summaryCountsByTag.set(key, (summaryCountsByTag.get(key) ?? 0) + 1);
        }
      }
    }
  }

  schema.tags = [
    ...(schema.tags ?? []),
    ...[...usedTags]
      .filter((tag) => !declaredTags.has(tag))
      .sort()
      .map((tag) => ({ name: tag, description: '' })),
  ];

  for (const { method, operation } of operations) {
    const summary = typeof operation.summary === 'string' ? operation.summary.trim() : undefined;
    const normalizedSummary = summary?.toLowerCase();
    const tags = Array.isArray(operation.tags) && operation.tags.length > 0 ? operation.tags : ['System'];
    const isDuplicateInTag =
      normalizedSummary &&
      tags.some((tag) => (summaryCountsByTag.get(`${tag}\n${normalizedSummary}`) ?? 0) > 1);

    if (!summary && operation.operationId) {
      operation.summary = titleFromOperationId(operation.operationId);
      continue;
    }

    if (summary && isDuplicateInTag && operation.operationId) {
      operation.summary = titleFromDuplicateOperation(operation.operationId, method);
    }
  }

  for (const pathItem of Object.values(schema.paths ?? {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    for (const operation of Object.values(pathItem)) {
      if (!operation || typeof operation !== 'object' || !('operationId' in operation)) continue;

      if (!operation.summary && operation.operationId) {
        operation.summary = titleFromOperationId(operation.operationId);
      }
    }
  }

  return {
    'coolify-openapi': document,
  };
}

export const openapi = createOpenAPI({
  input: normalizeOpenAPI,
});
