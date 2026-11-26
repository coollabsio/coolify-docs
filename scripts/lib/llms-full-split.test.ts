import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { splitLlmsFull, type LlmsPage } from './llms-full-split';

function page(path: string, title: string, size = 10): LlmsPage {
  const header = `# ${title}\n`;
  return { slugs: path ? path.split('/') : [], text: header + 'x'.repeat(Math.max(0, size - header.length)) };
}

function summary(files: ReturnType<typeof splitLlmsFull>) {
  return files.map((file) => [file.name, file.title, file.contents, file.pages.map((p) => p.slugs.join('/'))]);
}

describe('splitLlmsFull', () => {
  test('packs root pages and small top-level folders into one overview file', () => {
    const pages = [page('', 'Home'), page('usage', 'Usage'), page('mcp', 'MCP'), page('mcp/setup', 'Setup')];

    assert.deepEqual(summary(splitLlmsFull(pages, 1000)), [
      ['overview', 'Overview', ['Home', 'Usage', 'MCP'], ['', 'usage', 'mcp', 'mcp/setup']],
    ]);
  });

  test('gives a large subfolder its own files and keeps the folder index with its folder', () => {
    const pages = [
      page('core', 'Core', 40),
      page('core/networking', 'Networking', 40),
      page('core/networking/dns', 'DNS', 40),
      page('core/networking/proxy', 'Proxy', 40),
      page('core/teams', 'Teams', 40),
    ];

    assert.deepEqual(summary(splitLlmsFull(pages, 100)), [
      ['core', 'Core', ['Core', 'Teams'], ['core', 'core/teams']],
      ['core/networking-1', 'Core / Networking (part 1 of 2)', ['Networking', 'DNS'], ['core/networking', 'core/networking/dns']],
      ['core/networking-2', 'Core / Networking (part 2 of 2)', ['Proxy'], ['core/networking/proxy']],
    ]);
  });

  test('packs small subfolders together, uses sidebar titles, and never drops a page', () => {
    const pages = ['a', 'b', 'c', 'd', 'e'].map((tag) => page(`api/endpoints/${tag}/list`, `List ${tag}`, 40));
    const files = splitLlmsFull(pages, 100, new Map([['api', 'API Reference']]));

    assert.deepEqual(
      files.map((file) => [file.name, file.title, file.contents]),
      [
        ['api/endpoints-1', 'API Reference / Endpoints (part 1 of 3)', ['A', 'B']],
        ['api/endpoints-2', 'API Reference / Endpoints (part 2 of 3)', ['C', 'D']],
        ['api/endpoints-3', 'API Reference / Endpoints (part 3 of 3)', ['E']],
      ],
    );
    assert.equal(files.flatMap((file) => file.pages).length, pages.length);
    assert.ok(files.every((file) => Buffer.byteLength(file.text) <= 100));
  });
});
