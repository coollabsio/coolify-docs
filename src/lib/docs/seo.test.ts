import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { resolveDocSeo, serviceMetaDescription, servicePageSlug } from './seo';
import services from '../../generated/services.json' with { type: 'json' };

const homeDescription =
  'Install Coolify on your own server, deploy apps from Git, run databases and 300+ one-click services. Guides for self-hosted and Coolify Cloud.';
const whatDescription =
  'Coolify is an open-source, self-hostable alternative to Heroku, Vercel and Netlify. Deploy apps, databases and services to any server you own over SSH.';
const installDescription =
  'Install self-hosted Coolify on your own server with one command, or set it up manually. Server requirements, supported OS, Raspberry Pi and first login.';
const hetznerDescription =
  "Use Coolify's Hetzner promo code for €20 credit valid for 3 months on new Hetzner accounts. How to redeem it, and how it compares to the sign-up offer.";

describe('resolveDocSeo', () => {
  test('uses the high-impression page titles', () => {
    assert.deepEqual(resolveDocSeo({ url: '/docs/', title: 'Home', description: homeDescription, isIndex: true }), {
      title: 'Coolify Docs: Install, deploy & self-host apps',
      description: homeDescription,
    });
    assert.equal(
      resolveDocSeo({ url: '/docs/core/what-is-coolify', title: 'What is Coolify', description: whatDescription }).title,
      'What is Coolify? Open-source, self-hostable PaaS',
    );
    assert.equal(
      resolveDocSeo({ url: '/start-with-self-hosted', title: 'Start with Self-hosted', description: installDescription }).title,
      'Install Coolify (Self-hosted): One-command Setup',
    );
    assert.equal(
      resolveDocSeo({ url: '/docs/hetzner', title: 'Hetzner', description: hetznerDescription }).title,
      'Hetzner Promo Code: €20 Credit for New Users | Coolify',
    );
  });

  test('builds one-click service titles without changing guide pages', () => {
    assert.equal(servicePageSlug('/docs/services/forgejo'), 'forgejo');
    assert.equal(servicePageSlug('/docs/services/what-is-a-service'), undefined);
    assert.equal(
      resolveDocSeo({
        url: '/docs/services/forgejo',
        title: 'Forgejo',
        description: 'A self-hosted Git service fork of Gitea.',
      }).title,
      'Self-host Forgejo with Coolify (One-click Docker)',
    );
    assert.match(
      resolveDocSeo({ url: '/docs/services/overview', title: 'Services', description: 'Catalog.' }).title,
      /\| Coolify Docs$/,
    );
  });
});

describe('serviceMetaDescription', () => {
  test('stays within 120-160 characters for every catalog service', () => {
    const failures: string[] = [];

    for (const service of services) {
      const meta = serviceMetaDescription(service.name, service.description);
      if (meta.length < 120 || meta.length > 160) {
        failures.push(`${meta.length} ${service.slug}: ${meta}`);
      }
      if (/\b(?:with|and|or|for|to|of|the|a)\.$/.test(meta)) {
        failures.push(`dangling ${service.slug}: ${meta}`);
      }
      if (meta.includes('()') || meta.includes(': .')) {
        failures.push(`empty clause ${service.slug}: ${meta}`);
      }
    }

    assert.deepEqual(failures, []);
  });

  test('keeps the service description in the sentence', () => {
    const meta = serviceMetaDescription('Forgejo', 'A self-hosted Git service fork of Gitea.');
    assert.match(meta, /Forgejo/);
    assert.match(meta, /self-hosted Git service fork of Gitea/i);
    assert.ok(meta.length >= 120 && meta.length <= 160);
    assert.match(serviceMetaDescription('Infisical', 'Open source secret management platform.'), /secret management platform/);
    assert.match(
      serviceMetaDescription('SeaweedFS', 'Simple and highly scalable distributed file system compatible with S3.'),
      /distributed file system/,
    );
  });
});

describe('page descriptions', () => {
  test('frontmatter matches the meta copy', () => {
    const files: Array<[string, string]> = [
      ['content/docs/index.mdx', homeDescription],
      ['content/docs/core/what-is-coolify.mdx', whatDescription],
      ['content/docs/start-with-self-hosted.mdx', installDescription],
      ['content/docs/hetzner.mdx', hetznerDescription],
    ];

    for (const [file, description] of files) {
      const source = readFileSync(new URL(`../../../${file}`, import.meta.url), 'utf8');
      assert.equal(source.includes(description), true, file);
    }
  });
});
