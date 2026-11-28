import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { isIndexableDocsSite, toCanonicalDocsUrl } from '../../../config/site.shared';

describe('docs indexing', () => {
  test('coolify.io builds stay indexable and self-canonical', () => {
    for (const siteUrl of ['https://coolify.io', 'https://coolify.io/docs/']) {
      assert.equal(isIndexableDocsSite(siteUrl), true, siteUrl);
      assert.equal(
        toCanonicalDocsUrl(siteUrl, '/docs/services/forgejo'),
        'https://coolify.io/docs/services/forgejo',
      );
    }
  });

  test('preview hosts stay on their own origin in the check and canonicalize to production', () => {
    assert.equal(isIndexableDocsSite('https://next.coolify.io/docs/'), false);
    assert.equal(isIndexableDocsSite('https://www.coolify.io/docs'), false);
    assert.equal(isIndexableDocsSite('https://preview.example/docs'), false);
    assert.equal(
      toCanonicalDocsUrl('https://next.coolify.io/docs/', '/docs/core/what-is-coolify'),
      'https://coolify.io/docs/core/what-is-coolify',
    );
    assert.equal(toCanonicalDocsUrl('https://next.coolify.io/docs/', '/docs'), 'https://coolify.io/docs');
  });
});
