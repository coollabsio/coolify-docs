import { describe, expect, test } from 'bun:test';
import {
  frontmatterOgDescription,
  isServiceDoc,
  resolveSeoDescription,
  serviceMetaDescription,
  tocHasH1,
} from './seo';

describe('serviceMetaDescription', () => {
  test('builds a one-click deploy template from the service name', () => {
    expect(serviceMetaDescription('Ghost')).toBe(
      'Deploy Ghost on Coolify with one-click Docker. Runs on your server with SSL and backups.',
    );
  });

  test('keeps a short slogan and lengthens it', () => {
    expect(serviceMetaDescription('WordPress', 'Website and blogging platform.')).toBe(
      'Deploy WordPress on Coolify with one-click Docker. Website and blogging platform. Runs on your server with SSL and backups.',
    );
  });

  test('keeps an already long description', () => {
    const long =
      'Deploy Ghost publishing platform on Coolify for professional blogs, newsletters, memberships, and content monetization with modern editor.';
    expect(serviceMetaDescription('Ghost', long)).toBe(long);
  });
});

describe('resolveSeoDescription', () => {
  test('prefers a long Open Graph description for services', () => {
    expect(
      resolveSeoDescription({
        title: 'WordPress',
        description: 'Website and blogging platform.',
        ogDescription:
          'Run WordPress on Coolify for blogging, CMS, e-commerce with plugins, themes, and the most popular website building platform.',
        slugs: ['services', 'wordpress'],
        fallback: 'fallback',
      }),
    ).toContain('Run WordPress on Coolify');
  });

  test('does not rewrite non-service pages', () => {
    expect(
      resolveSeoDescription({
        title: 'Installation',
        description: 'Install Coolify self-hosted PaaS on Linux servers.',
        slugs: ['get-started', 'installation'],
        fallback: 'fallback',
      }),
    ).toBe('Install Coolify self-hosted PaaS on Linux servers.');
  });

  test('ignores service directory index pages', () => {
    expect(isServiceDoc(['services', 'overview'])).toBe(false);
    expect(isServiceDoc(['services', 'ghost'])).toBe(true);
  });
});

describe('tocHasH1', () => {
  test('detects a document H1 from the table of contents', () => {
    expect(tocHasH1([{ depth: 2 }, { depth: 3 }])).toBe(false);
    expect(tocHasH1([{ depth: 1 }, { depth: 2 }])).toBe(true);
  });
});

describe('frontmatterOgDescription', () => {
  test('reads nested og.description', () => {
    expect(frontmatterOgDescription({ og: { description: 'Longer social description.' } })).toBe(
      'Longer social description.',
    );
  });
});
