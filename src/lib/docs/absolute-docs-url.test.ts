import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { rewriteDocsMarkdownLinks, toAbsoluteDocsUrl, type DocsUrlOptions } from './absolute-docs-url';

const production: DocsUrlOptions = {
  siteUrl: 'https://coolify.io/docs/',
  docsBasePath: '/docs',
};

const staging: DocsUrlOptions = {
  siteUrl: 'https://next.coolify.io/docs/',
  docsBasePath: '/docs',
};

describe('toAbsoluteDocsUrl', () => {
  test('prefixes root-relative docs paths with the docs origin', () => {
    assert.equal(toAbsoluteDocsUrl('/choose-your-path', production), 'https://coolify.io/docs/choose-your-path');
    assert.equal(
      toAbsoluteDocsUrl('/core/security/credentials/api-tokens', production),
      'https://coolify.io/docs/core/security/credentials/api-tokens',
    );
  });

  test('uses the canonical page shape without a trailing slash or html extension', () => {
    assert.equal(toAbsoluteDocsUrl('/', production), 'https://coolify.io/docs');
    assert.equal(toAbsoluteDocsUrl('/applications/', production), 'https://coolify.io/docs/applications');
    assert.equal(toAbsoluteDocsUrl('/docs', production), 'https://coolify.io/docs');
    assert.equal(toAbsoluteDocsUrl('/docs/', production), 'https://coolify.io/docs');
  });

  test('keeps hashes and does not double the docs base', () => {
    assert.equal(
      toAbsoluteDocsUrl('/applications/builds/docker-compose#storage', production),
      'https://coolify.io/docs/applications/builds/docker-compose#storage',
    );
    assert.equal(
      toAbsoluteDocsUrl('/docs/applications/builds/docker-compose#environment-variables', production),
      'https://coolify.io/docs/applications/builds/docker-compose#environment-variables',
    );
    assert.equal(
      toAbsoluteDocsUrl('/docs/images/builds/packs/compose/1.webp', production),
      'https://coolify.io/docs/images/builds/packs/compose/1.webp',
    );
  });

  test('resolves hash and relative links against the current page', () => {
    const options = { ...production, basePageUrl: '/applications/builds/docker-compose' };
    assert.equal(
      toAbsoluteDocsUrl('#storage', options),
      'https://coolify.io/docs/applications/builds/docker-compose#storage',
    );
    assert.equal(
      toAbsoluteDocsUrl('../configuration/general', options),
      'https://coolify.io/docs/applications/configuration/general',
    );
  });

  test('leaves external and non-url values unchanged', () => {
    assert.equal(toAbsoluteDocsUrl('https://coolify.io/pricing', production), 'https://coolify.io/pricing');
    assert.equal(toAbsoluteDocsUrl('https://coolify.io/ipv4.txt', production), 'https://coolify.io/ipv4.txt');
    assert.equal(toAbsoluteDocsUrl('mailto:hello@example.com', production), 'mailto:hello@example.com');
    assert.equal(toAbsoluteDocsUrl('shadow-to-do', production), 'shadow-to-do');
  });

  test('uses the staging origin when the site url points at next', () => {
    assert.equal(toAbsoluteDocsUrl('/choose-your-path', staging), 'https://next.coolify.io/docs/choose-your-path');
  });
});

describe('rewriteDocsMarkdownLinks', () => {
  test('rewrites markdown links, images, reference definitions, and html attributes', () => {
    const markdown = [
      'Follow [API Tokens](/core/security/credentials/api-tokens) and [Compose](/applications/builds/docker-compose#storage).',
      'See [Home](/) and [Pricing](https://coolify.io/pricing).',
      '![Diagram](/docs/images/builds/packs/compose/1.webp)',
      '<a href="/choose-your-path">Start</a>',
      '<img src="/docs/images/home/setup-coolify.webp" alt="Setup" />',
      '<ZoomableImage src="shadow-to-do" alt="Later" />',
      '[guide]: /api/overview',
    ].join('\n');

    assert.equal(
      rewriteDocsMarkdownLinks(markdown, { ...production, basePageUrl: '/api/authorization' }),
      [
        'Follow [API Tokens](https://coolify.io/docs/core/security/credentials/api-tokens) and [Compose](https://coolify.io/docs/applications/builds/docker-compose#storage).',
        'See [Home](https://coolify.io/docs) and [Pricing](https://coolify.io/pricing).',
        '![Diagram](https://coolify.io/docs/images/builds/packs/compose/1.webp)',
        '<a href="https://coolify.io/docs/choose-your-path">Start</a>',
        '<img src="https://coolify.io/docs/images/home/setup-coolify.webp" alt="Setup" />',
        '<ZoomableImage src="shadow-to-do" alt="Later" />',
        '[guide]: https://coolify.io/docs/api/overview',
      ].join('\n'),
    );
  });
});
