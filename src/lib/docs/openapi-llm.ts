export interface OpenApiOperationRef {
  path: string;
  method: string;
}

export interface OpenApiWebhookRef {
  name: string;
  method: string;
}

interface JsonSchema {
  $ref?: string;
  type?: string | string[];
  format?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: unknown[];
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  additionalProperties?: boolean | JsonSchema;
  nullable?: boolean;
  default?: unknown;
  const?: unknown;
}

interface ParameterObject {
  $ref?: string;
  name?: string;
  in?: string;
  required?: boolean;
  description?: string;
  schema?: JsonSchema;
}

interface MediaTypeObject {
  schema?: JsonSchema;
}

interface ResponseObject {
  $ref?: string;
  description?: string;
  headers?: Record<string, { description?: string; schema?: JsonSchema; $ref?: string }>;
  content?: Record<string, MediaTypeObject>;
}

interface RequestBodyObject {
  $ref?: string;
  description?: string;
  required?: boolean;
  content?: Record<string, MediaTypeObject>;
}

interface OperationObject {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses?: Record<string, ResponseObject>;
  security?: Array<Record<string, string[]>> | null;
}

interface SecuritySchemeObject {
  type?: string;
  scheme?: string;
  description?: string;
  $ref?: string;
}

export interface OpenApiDocument {
  security?: Array<Record<string, string[]>>;
  paths?: Record<string, Record<string, OperationObject | ParameterObject[] | undefined> & { parameters?: ParameterObject[] }>;
  webhooks?: Record<string, Record<string, OperationObject | undefined>>;
  components?: {
    schemas?: Record<string, JsonSchema>;
    responses?: Record<string, ResponseObject>;
    parameters?: Record<string, ParameterObject>;
    requestBodies?: Record<string, RequestBodyObject>;
    securitySchemes?: Record<string, SecuritySchemeObject>;
  };
}

export interface OpenApiLlmPage {
  title: string;
  pageUrl: string;
  description?: string;
  operations?: OpenApiOperationRef[];
  webhooks?: OpenApiWebhookRef[];
  document: OpenApiDocument;
}

const httpMethods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']);

export function renderOpenApiLlmText(page: OpenApiLlmPage): string {
  const sections: string[] = [`# ${page.title} (${page.pageUrl})`];
  const operations = page.operations ?? [];
  const webhooks = page.webhooks ?? [];
  const pageDescription = cleanProse(page.description);
  if (pageDescription && !descriptionRepeatsOperation(page.document, pageDescription, operations, webhooks)) {
    sections.push(pageDescription);
  }

  if (operations.length === 0 && webhooks.length === 0) {
    sections.push('This page has no operations.');
    return `${sections.join('\n\n')}\n`;
  }

  for (const operation of operations) {
    sections.push(renderOperation(page.document, operation.path, operation.method, false));
  }
  for (const webhook of webhooks) {
    sections.push(renderOperation(page.document, webhook.name, webhook.method, true));
  }

  return `${sections.filter((section) => section.trim().length > 0).join('\n\n')}\n`;
}

function renderOperation(document: OpenApiDocument, pathOrName: string, method: string, webhook: boolean): string {
  const operation = lookupOperation(document, pathOrName, method, webhook);
  const lines: string[] = [`## ${method.toUpperCase()} ${pathOrName}`];
  if (!operation) {
    lines.push('Operation not found in the OpenAPI document.');
    return lines.join('\n\n');
  }

  const summary = cleanProse(operation.summary);
  const description = cleanProse(operation.description);
  if (summary) lines.push(summary);
  if (description && description !== summary) lines.push(description);
  lines.push(`**Authentication:** ${authenticationText(document, operation)}`);

  const seen = new Set<string>();
  const parameters = collectParameters(document, pathOrName, operation, webhook);
  if (parameters.length > 0) {
    lines.push('### Parameters', parameterTable(document, parameters));
  }

  const requestBody = resolveRequestBody(document, operation.requestBody);
  if (requestBody) {
    lines.push('### Request body', renderRequestBody(document, requestBody, seen));
  }

  const responses = operation.responses ?? {};
  const responseCodes = Object.keys(responses);
  if (responseCodes.length > 0) {
    lines.push('### Responses');
    for (const code of responseCodes) {
      lines.push(renderResponse(document, code, responses[code], seen));
    }
  }

  return lines.filter((line) => line.trim().length > 0).join('\n\n');
}

function lookupOperation(
  document: OpenApiDocument,
  pathOrName: string,
  method: string,
  webhook: boolean,
): OperationObject | undefined {
  const collection = webhook ? document.webhooks : document.paths;
  const item = collection?.[pathOrName];
  if (!item) return undefined;
  const operation = item[method.toLowerCase()];
  if (!operation || Array.isArray(operation) || !httpMethods.has(method.toLowerCase())) return undefined;
  return operation;
}

function authenticationText(document: OpenApiDocument, operation: OperationObject): string {
  const requirements = operation.security === undefined ? document.security : operation.security ?? undefined;
  if (!requirements || requirements.length === 0) return 'None.';

  const names = [...new Set(requirements.flatMap((requirement) => Object.keys(requirement)))];
  if (names.length === 0) return 'None.';

  return names
    .map((name) => {
      const scheme = document.components?.securitySchemes?.[name];
      if (scheme && !scheme.$ref && scheme.type === 'http' && scheme.scheme?.toLowerCase() === 'bearer') {
        return `Bearer token (\`${name}\`)`;
      }
      return `\`${name}\``;
    })
    .join(', ');
}

function descriptionRepeatsOperation(
  document: OpenApiDocument,
  pageDescription: string,
  operations: OpenApiOperationRef[],
  webhooks: OpenApiWebhookRef[],
): boolean {
  if (operations.length + webhooks.length !== 1) return false;
  const only = operations[0];
  const webhook = webhooks[0];
  const operation = only
    ? lookupOperation(document, only.path, only.method, false)
    : webhook
      ? lookupOperation(document, webhook.name, webhook.method, true)
      : undefined;
  return cleanProse(operation?.description) === pageDescription;
}

function collectParameters(
  document: OpenApiDocument,
  pathOrName: string,
  operation: OperationObject,
  webhook: boolean,
): ParameterObject[] {
  const pathItem = webhook ? undefined : document.paths?.[pathOrName];
  const shared = pathItem?.parameters ?? [];
  const merged = new Map<string, ParameterObject>();
  for (const parameter of [...shared, ...(operation.parameters ?? [])]) {
    const resolved = resolveParameter(document, parameter);
    if (!resolved.name) continue;
    merged.set(`${resolved.in ?? ''}:${resolved.name}`, resolved);
  }
  return [...merged.values()];
}

function resolveParameter(document: OpenApiDocument, parameter: ParameterObject): ParameterObject {
  if (!parameter.$ref) return parameter;
  const name = refName(parameter.$ref, 'parameters');
  return (name && document.components?.parameters?.[name]) || parameter;
}

function resolveRequestBody(
  document: OpenApiDocument,
  requestBody: RequestBodyObject | undefined,
): RequestBodyObject | undefined {
  if (!requestBody) return undefined;
  if (!requestBody.$ref) return requestBody;
  const name = refName(requestBody.$ref, 'requestBodies');
  return (name && document.components?.requestBodies?.[name]) || requestBody;
}

function renderRequestBody(document: OpenApiDocument, requestBody: RequestBodyObject, seen: Set<string>): string {
  const content = requestBody.content ?? {};
  const parts: string[] = [];
  const requirement = requestBody.required ? 'Required' : 'Optional';
  const description = cleanProse(requestBody.description);
  if (description) parts.push(description);

  const contentTypes = Object.keys(content);
  if (contentTypes.length === 0) {
    parts.push(requirement);
    return parts.join('\n\n');
  }

  for (const contentType of contentTypes) {
    parts.push(`\`${contentType}\`, ${requirement.toLowerCase()}.`);
    const schema = content[contentType]?.schema;
    if (schema) parts.push(renderSchema(document, schema, seen));
  }

  return parts.join('\n\n');
}

function renderResponse(document: OpenApiDocument, code: string, response: ResponseObject | undefined, seen: Set<string>): string {
  const resolved = resolveResponse(document, response);
  if (!resolved) return `#### ${code}\n\nNo response definition.`;

  const parts = [`#### ${code}`];
  const description = cleanProse(resolved.description);
  if (description) parts.push(description);
  if (resolved.$ref && resolved === response) {
    parts.push(`Unresolved response reference \`${resolved.$ref}\`.`);
  }

  const headers = resolved.headers ?? {};
  for (const [name, header] of Object.entries(headers)) {
    if (!header || header.$ref) continue;
    const headerDescription = cleanProse(header.description);
    const headerType = header.schema ? typeLabel(document, header.schema) : 'header';
    parts.push(`Header \`${name}\` (${headerType})${headerDescription ? `: ${headerDescription}` : ''}`);
  }

  const content = resolved.content ?? {};
  for (const [contentType, media] of Object.entries(content)) {
    if (!media?.schema) {
      parts.push(`\`${contentType}\``);
      continue;
    }
    parts.push(`\`${contentType}\`: ${typeLabel(document, media.schema)}`, renderSchema(document, media.schema, seen));
  }

  return parts.join('\n\n');
}

function resolveResponse(document: OpenApiDocument, response: ResponseObject | undefined): ResponseObject | undefined {
  if (!response?.$ref) return response;
  const name = refName(response.$ref, 'responses');
  return (name && document.components?.responses?.[name]) || response;
}

function renderSchema(document: OpenApiDocument, schema: JsonSchema, seen: Set<string>): string {
  const ref = schema.$ref;
  if (ref) {
    const name = refName(ref, 'schemas');
    const resolved = name ? document.components?.schemas?.[name] : undefined;
    if (!name || !resolved) return `Unresolved schema reference \`${ref}\`.`;
    if (seen.has(name)) return `Schema \`${name}\` (see above).`;
    seen.add(name);
    return [`Schema \`${name}\`: ${typeLabel(document, resolved)}`, schemaFields(document, resolved, seen)].filter(Boolean).join('\n\n');
  }

  return schemaFields(document, schema, seen);
}

function schemaFields(document: OpenApiDocument, schema: JsonSchema, seen: Set<string>): string {
  const combiner = schema.oneOf ? 'oneOf' : schema.anyOf ? 'anyOf' : schema.allOf ? 'allOf' : undefined;
  if (combiner) {
    const variants = schema[combiner] ?? [];
    return variants
      .map((variant, index) => `Variant ${index + 1} (${combiner}):\n\n${renderSchema(document, variant, seen)}`)
      .join('\n\n');
  }

  const properties = schema.properties;
  if (!properties || Object.keys(properties).length === 0) {
    const nested = schema.items ? nestedSchema(document, 'item', schema.items, seen) : [];
    return [`Type: ${typeLabel(document, schema)}`, ...nested].join('\n\n');
  }

  const required = new Set(schema.required ?? []);
  const rows = Object.entries(properties).map(([name, property]) =>
    tableRow([
      name,
      typeLabel(document, property),
      required.has(name) ? 'yes' : 'no',
      cleanCell(property.description),
    ]),
  );
  const table = ['| Field | Type | Required | Description |', '| --- | --- | --- | --- |', ...rows].join('\n');
  const nested = Object.entries(properties).flatMap(([name, property]) => nestedSchema(document, name, property, seen));

  return [table, ...nested].join('\n\n');
}

function nestedSchema(document: OpenApiDocument, name: string, schema: JsonSchema, seen: Set<string>): string[] {
  const parts: string[] = [];
  const refTarget = schema.$ref ? schema : schema.items?.$ref ? schema.items : undefined;
  if (refTarget?.$ref) {
    const ref = refName(refTarget.$ref, 'schemas');
    if (!ref || !seen.has(ref)) parts.push(renderSchema(document, refTarget, seen));
    return parts;
  }

  const inline = schema.properties ? schema : schema.items?.properties ? schema.items : undefined;
  if (inline?.properties && Object.keys(inline.properties).length > 0) {
    parts.push(`Fields of \`${name}\`:\n\n${schemaFields(document, inline, seen)}`);
  }
  return parts;
}

function parameterTable(document: OpenApiDocument, parameters: ParameterObject[]): string {
  const rows = parameters.map((parameter) =>
    tableRow([
      parameter.name ?? '',
      parameter.in ?? '',
      parameter.required || parameter.in === 'path' ? 'yes' : 'no',
      parameter.schema ? typeLabel(document, parameter.schema) : '',
      cleanCell(parameter.description),
    ]),
  );
  return ['| Name | In | Required | Type | Description |', '| --- | --- | --- | --- | --- |', ...rows].join('\n');
}

function typeLabel(document: Pick<OpenApiDocument, 'components'>, schema: JsonSchema): string {
  if (schema.$ref) {
    const name = refName(schema.$ref, 'schemas');
    const resolved = name ? document.components?.schemas?.[name] : undefined;
    if (!resolved) return name ?? schema.$ref;
    if (resolved.properties || resolved.oneOf || resolved.anyOf || resolved.allOf) return name ?? schema.$ref;
    return typeLabel(document, resolved);
  }

  const combiner = schema.oneOf ? 'oneOf' : schema.anyOf ? 'anyOf' : schema.allOf ? 'allOf' : undefined;
  if (combiner) {
    const variants = (schema[combiner] ?? []).map((variant) => typeLabel(document, variant));
    return `${combiner}: ${variants.join(', ')}`;
  }

  if (schema.enum && schema.enum.length > 0) {
    const values = schema.enum.map((value) => JSON.stringify(value)).join(', ');
    return `${baseType(schema)} enum ${values}`;
  }

  if (schema.const !== undefined) return `const ${JSON.stringify(schema.const)}`;

  const nullable = schema.nullable === true || (Array.isArray(schema.type) && schema.type.includes('null'));
  const primary = Array.isArray(schema.type) ? schema.type.find((item) => item !== 'null') : schema.type;
  if (primary === 'array' || (!primary && schema.items)) {
    const label = schema.items ? `array of ${typeLabel(document, schema.items)}` : 'array';
    return nullable ? `${label} or null` : label;
  }

  const type = baseType(schema);
  if (schema.format && type !== 'object') return `${type} (${schema.format})`;
  return type;
}

function baseType(schema: JsonSchema): string {
  const type = schema.type;
  if (Array.isArray(type)) {
    return type.filter((item) => item !== 'null').join(' or ') + (type.includes('null') ? ' or null' : '');
  }
  if (type) return schema.nullable ? `${type} or null` : type;
  if (schema.properties) return 'object';
  if (schema.nullable) return 'null';
  return 'value';
}

function refName(ref: string, kind: 'schemas' | 'responses' | 'parameters' | 'requestBodies'): string | undefined {
  const prefix = `#/components/${kind}/`;
  if (!ref.startsWith(prefix)) return undefined;
  return decodeURIComponent(ref.slice(prefix.length));
}

function tableRow(cells: string[]): string {
  return `| ${cells.map((cell) => cell.replaceAll('|', '\\|')).join(' | ')} |`;
}

function cleanCell(value: string | undefined): string {
  return cleanProse(value);
}

function cleanProse(value: string | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}
