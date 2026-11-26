import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getDocGithubPath } from '../config/site';
import { getDiscordEmbedScript } from './discord-embed';

const page = {
  title: 'Deploy a service',
  description: 'Deploy a Docker Compose service with Coolify.',
  url: 'https://coolify.io/docs/deploy-your-first-service',
  markdownUrl: 'https://coolify.io/docs/llms.mdx/docs/deploy-your-first-service/content.md',
  githubUrl: getDocGithubPath('deploy-your-first-service.mdx'),
};

test('places the page title and description beside a raster logo with useful link buttons', () => {
  const payload = JSON.parse(getDiscordEmbedScript(page));
  assert.equal(payload.component.type, 17);
  const [section, actions] = payload.component.components;
  assert.equal(section.type, 9);
  assert.deepEqual(section.components.map((item: { content: string }) => item.content), [
    '## Deploy a service', page.description,
  ]);
  assert.equal(section.accessory.type, 11);
  assert.equal(section.accessory.media.url, 'https://coolify.io/docs/brand/logo.png');
  assert.deepEqual(actions.components.map((button: { label: string }) => button.label), [
    'Visit in browser', 'Read Markdown', 'View on GitHub',
  ]);
  for (const button of actions.components) {
    assert.equal(button.style, 5);
    assert.deepEqual(Object.keys(button).sort(), ['label', 'style', 'type', 'url']);
  }
});

test('uses production MDX source paths on main for GitHub links', () => {
  assert.equal(page.githubUrl, 'https://github.com/coollabsio/coolify-docs/blob/main/content/docs/deploy-your-first-service.mdx');
  assert.equal(getDocGithubPath('services/a page.mdx'), 'https://github.com/coollabsio/coolify-docs/blob/main/content/docs/services/a%20page.mdx');
});

test('omits unavailable actions for API pages', () => {
  const payload = JSON.parse(getDiscordEmbedScript({ ...page, markdownUrl: undefined, githubUrl: undefined }));
  assert.deepEqual(payload.component.components[1].components.map((button: { label: string }) => button.label), [
    'Visit in browser',
  ]);
});

test('escapes inline script terminators and Discord markdown in page text', () => {
  const json = getDiscordEmbedScript({ ...page, title: '[Title] *test*', description: '</script><script>alert(1)</script>' });
  assert.equal(json.includes('<'), false);
  assert.match(JSON.parse(json).component.components[0].components[0].content, /\\\[Title\\\] \\\*test\\\*/);
  assert.ok(JSON.parse(json).component.components[0].components[1].content.includes('</script'));
});

test('keeps the serialized payload below 3,000 UTF-8 bytes with long Unicode metadata and URLs', () => {
  const longUrl = `https://coolify.io/docs/${'a'.repeat(480)}`;
  const json = getDiscordEmbedScript({ ...page, title: '🚀'.repeat(300), description: '<🚀>'.repeat(2000), url: longUrl, markdownUrl: longUrl + '/md', githubUrl: longUrl + '/git' });
  assert.ok(Buffer.byteLength(json, 'utf8') <= 3000);
  assert.equal(JSON.parse(json).component.components[1].components[0].label, 'Visit in browser');
});
