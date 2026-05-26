import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { loader, multiple, source as createSource } from 'fumadocs-core/source';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { getDocEntries, getDocSourceFiles } from './lib/content';
import { getManifestKey } from '../src/lib/docs-manifest';
import { openapi } from '../src/lib/openapi';
import { preparePageTree } from '../src/lib/page-tree';
import { absoluteUrl, site } from './lib/site';
import { getDocMarkdownPath, getDocOgPath } from '../src/lib/site';
import { currentDirFromMetaUrl } from './lib/runtime-path';

const currentDir = currentDirFromMetaUrl(import.meta.url);

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(value: string, maxCharsPerLine: number, maxLines: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
    } else {
      lines.push(word.slice(0, maxCharsPerLine));
      current = word.slice(maxCharsPerLine);
    }

    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  const remainingWords = words.join(' ');
  const consumed = lines.join(' ');
  if (consumed.length < remainingWords.length && lines.length > 0) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = `${lines[lastIndex].replace(/\.*$/, '')}...`;
  }

  return lines;
}

async function loadCoolifyLogoDataUri() {
  const logoPath = resolve(currentDir, '../public/brand/logo.png');
  const logoBuffer = await readFile(logoPath);
  return `data:image/png;base64,${logoBuffer.toString('base64')}`;
}

function renderCoolifyLogoSvg(logoDataUri: string, x: number, y: number, size: number): string {
  return `<image href="${logoDataUri}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" />`;
}

function renderOgSvg(title: string, description: string, logoDataUri: string): string {
  const titleLines = wrapText(title, 22, 3);
  const descriptionLines = wrapText(description, 48, 3);
  const titleLineHeight = 82;
  const descriptionLineHeight = 42;
  const titleFontSize = 72;
  const descriptionFontSize = 34;
  const blockGap = 8;
  const contentBottomY = 554;
  const titleHeight = titleLines.length * titleLineHeight;
  const descriptionHeight = descriptionLines.length * descriptionLineHeight;
  const contentHeight = titleHeight + blockGap + descriptionHeight;
  const titleStartY = contentBottomY - contentHeight + titleFontSize;
  const descriptionStartY = titleStartY + titleHeight + blockGap + (descriptionFontSize - descriptionLineHeight);

  return `
    <svg width="${site.og.width}" height="${site.og.height}" viewBox="0 0 ${site.og.width} ${site.og.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${site.og.width}" height="${site.og.height}" rx="32" fill="${site.og.background}" />
      ${renderCoolifyLogoSvg(logoDataUri, 74, 62, 202)}
      ${titleLines
        .map(
          (line, index) =>
          `<text x="72" y="${titleStartY + index * titleLineHeight}" fill="${site.og.text}" font-size="${titleFontSize}" font-family="'Inter', 'DejaVu Sans', 'Noto Sans', Arial, sans-serif" font-weight="800" letter-spacing="-1.8">${escapeXml(line)}</text>`,
        )
        .join('')}
      ${descriptionLines
        .map(
          (line, index) =>
            `<text x="72" y="${descriptionStartY + index * descriptionLineHeight}" fill="${site.og.muted}" font-size="${descriptionFontSize}" font-family="'Inter', 'DejaVu Sans', 'Noto Sans', Arial, sans-serif" font-weight="500" letter-spacing="-0.3">${escapeXml(line)}</text>`,
        )
        .join('')}
    </svg>
  `.trim();
}

async function writeOgImages() {
  const docs = await getDocEntries();
  const outputRoot = resolve(currentDir, '../.output/public');
  const logoDataUri = await loadCoolifyLogoDataUri();

  await Promise.all(
    docs.map(async (doc) => {
      const outputPath = resolve(outputRoot, doc.ogOutputPath);
      await mkdir(dirname(outputPath), { recursive: true });

      const svg = renderOgSvg(doc.title, doc.description, logoDataUri);
      const png = new Resvg(svg, {
        font: {
          loadSystemFonts: true,
          defaultFontFamily: 'DejaVu Sans',
        },
      }).render().asPng();

      await writeFile(outputPath, png);
    }),
  );
}

async function writeSitemap() {
  const docs = await getDocEntries();
  const outputRoot = resolve(currentDir, '../.output/public');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${docs
  .map(
    (doc) => `  <url>
    <loc>${escapeXml(absoluteUrl(doc.routePath))}</loc>
    <lastmod>${doc.lastModified}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  await mkdir(outputRoot, { recursive: true });
  await writeFile(resolve(outputRoot, 'sitemap.xml'), xml, 'utf8');
}

async function writeRobots() {
  const outputRoot = resolve(currentDir, '../.output/public');
  const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl(`${site.docsBasePath}/sitemap.xml`)}
`;

  await mkdir(outputRoot, { recursive: true });
  await writeFile(resolve(outputRoot, 'robots.txt'), robots, 'utf8');
}

async function writeDocsManifest() {
  const outputRoot = resolve(currentDir, '../.output/public');
  const { metas, pages: sourcePages } = await getDocSourceFiles();
  const docsSource = loader(
    multiple({
      docs: createSource({ metas, pages: sourcePages }),
      openapi: await openapiSource(openapi, {
        baseDir: 'api-reference/api',
        groupBy: 'tag',
      }),
    }),
    {
      baseUrl: '/',
      plugins: [openapiPlugin()],
    },
  );
  const pageTree = await docsSource.serializePageTree(preparePageTree(docsSource.getPageTree()));
  const pages = Object.fromEntries(
    await Promise.all(docsSource.getPages().map(async (page) => {
      const base = {
        description: page.data.description ?? site.description,
        isIndex: page.slugs.length === 0,
        ogImagePath: getDocOgPath(page.slugs),
        title: page.data.title,
        url: page.url === '/' ? site.docsBasePath : `${site.docsBasePath}${page.url}`,
      };

      return [
        getManifestKey(page.slugs),
        page.data.type === 'openapi'
          ? {
              ...base,
              type: 'openapi',
              props: await page.data.getClientAPIPageProps(),
            }
          : {
              ...base,
              type: 'docs',
              markdownUrl: getDocMarkdownPath(page.slugs),
              path: page.path,
            },
      ];
    })),
  );

  await mkdir(outputRoot, { recursive: true });
  await writeFile(
    resolve(outputRoot, 'docs-manifest.json'),
    JSON.stringify({ pageTree, pages }, null, 2),
    'utf8',
  );
}

async function copyBaseScopedPublicAssets() {
  const publicImages = resolve(currentDir, '../public/images');
  const docsImages = resolve(currentDir, '../.output/public/docs/images');
  const publicBrand = resolve(currentDir, '../public/brand');
  const docsBrand = resolve(currentDir, '../.output/public/docs/brand');
  const publicManifest = resolve(currentDir, '../public/site.webmanifest');
  const docsManifest = resolve(currentDir, '../.output/public/docs/site.webmanifest');

  await cp(publicImages, docsImages, { recursive: true, force: true });
  await cp(publicBrand, docsBrand, { recursive: true, force: true });
  await cp(publicManifest, docsManifest, { force: true });
}

async function cleanupNonStaticOutput() {
  const outputRoot = resolve(currentDir, '../.output');

  await Promise.all([
    rm(resolve(outputRoot, 'server'), { recursive: true, force: true }),
    rm(resolve(outputRoot, 'nitro.json'), { force: true }),
  ]);
}

await writeOgImages();
await writeSitemap();
await writeRobots();
await writeDocsManifest();
await copyBaseScopedPublicAssets();
await cleanupNonStaticOutput();
