import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { renderOpenApiLlmText, type OpenApiDocument } from './openapi-llm';

const document: OpenApiDocument = {
  paths: {
    '/applications/{uuid}/previews': {
      parameters: [
        {
          name: 'trace',
          in: 'header',
          required: false,
          description: 'Optional trace header.',
          schema: { type: 'string' },
        },
      ],
      post: {
        summary: 'Create Preview Deployment',
        description:
          'Open a preview deployment. See [domains](/applications/domains) for the public URL.',
        operationId: 'create-preview-deployment-by-application-uuid',
        parameters: [
          {
            $ref: '#/components/parameters/ApplicationUuid',
          },
          {
            name: 'verbose',
            in: 'query',
            description: 'Include extra fields | notes.',
            schema: { $ref: '#/components/schemas/Flag' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['pull_request_id'],
                properties: {
                  pull_request_id: { type: 'integer', description: 'Pull request id.' },
                  domains: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Existing preview deployment updated.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApplicationPreview' },
              },
            },
          },
          '201': {
            description: 'Preview deployment created.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApplicationPreview' },
              },
            },
          },
          '401': { $ref: '#/components/responses/401' },
          '403': { $ref: '#/components/responses/403' },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/health': {
      get: {
        summary: 'Healthcheck',
        description: 'Healthcheck endpoint.',
        responses: {
          '200': {
            description: 'Healthcheck endpoint.',
            content: { 'text/html': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/projects': {
      get: {
        summary: 'List',
        description: 'List projects.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Get all projects.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Project' },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    parameters: {
      ApplicationUuid: {
        name: 'uuid',
        in: 'path',
        required: true,
        description: 'UUID of the application.',
        schema: { type: 'string' },
      },
    },
    schemas: {
      Flag: { type: 'boolean' },
      ApplicationPreview: {
        type: 'object',
        properties: {
          uuid: { type: 'string', description: 'Preview id.' },
          owner: { $ref: '#/components/schemas/User' },
        },
      },
      User: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Project name.' },
        },
      },
    },
    responses: {
      '401': {
        description: 'Unauthenticated.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', description: 'Error message.' },
              },
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' },
    },
  },
};

const pageUrl =
  'https://coolify.io/docs/api/endpoints/applications/create-preview-deployment-by-application-uuid';

describe('renderOpenApiLlmText', () => {
  test('renders one operation with auth, parameters, body, and responses', () => {
    const text = renderOpenApiLlmText({
      title: 'Create Preview Deployment',
      pageUrl,
      description: 'Open a preview deployment. See [domains](/applications/domains) for the public URL.',
      operations: [{ path: '/applications/{uuid}/previews', method: 'post' }],
      document,
    });

    assert.match(text, new RegExp(`^# Create Preview Deployment \\(${pageUrl}\\)`));
    assert.match(text, /## POST \/applications\/\{uuid\}\/previews/);
    assert.match(text, /\*\*Authentication:\*\* Bearer token \(`bearerAuth`\)/);
    assert.match(text, /\| uuid \| path \| yes \| string \| UUID of the application\. \|/);
    assert.match(text, /\| trace \| header \| no \| string \| Optional trace header\. \|/);
    assert.match(text, /\| verbose \| query \| no \| boolean \| Include extra fields \\\| notes\. \|/);
    assert.match(text, /`application\/json`, required\./);
    assert.match(text, /\| pull_request_id \| integer \| yes \| Pull request id\. \|/);
    assert.match(text, /Fields of `domains`:/);
    assert.match(text, /#### 401\n\nUnauthenticated\./);
    assert.match(text, /\| message \| string \| no \| Error message\. \|/);
    assert.match(text, /#### 403\n\nUnresolved response reference `#\/components\/responses\/403`\./);
    assert.equal(text.match(/Schema `ApplicationPreview`/g)?.length, 2);
    assert.match(text, /Schema `User`:/);
    assert.equal(text.includes('/health'), false);
    assert.equal(text.includes('/projects'), false);
    assert.equal(text.includes('"openapi"'), false);
    assert.match(text, /\[domains\]\(\/applications\/domains\)/);
  });

  test('reports no authentication when the operation does not require it', () => {
    const text = renderOpenApiLlmText({
      title: 'Healthcheck',
      pageUrl: 'https://coolify.io/docs/api/endpoints/system/healthcheck',
      description: 'Healthcheck endpoint.',
      operations: [{ path: '/health', method: 'get' }],
      document,
    });

    assert.match(text, /\*\*Authentication:\*\* None\./);
    assert.match(text, /#### 200\n\nHealthcheck endpoint\./);
    assert.match(text, /`text\/html`: string/);
    assert.equal(text.includes('bearerAuth'), false);
    assert.equal(text.includes('/applications/'), false);
  });

  test('expands an array response schema once', () => {
    const text = renderOpenApiLlmText({
      title: 'List',
      pageUrl: 'https://coolify.io/docs/api/endpoints/projects/list-projects',
      description: 'List projects.',
      operations: [{ path: '/projects', method: 'get' }],
      document,
    });

    assert.match(text, /Type: array of Project/);
    assert.match(text, /Schema `Project`:/);
    assert.match(text, /\| name \| string \| no \| Project name\. \|/);
    assert.equal(text.includes('Create Preview Deployment'), false);
  });
});
