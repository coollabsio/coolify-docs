import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { remarkLLMs } from 'fumadocs-core/mdx-plugins/remark-llms';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { llmsMarkdownOptions } from './llms-markdown';

async function toLlmsMarkdown(mdx: string) {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkLLMs, { ...llmsMarkdownOptions, _data: true });
  const file = new VFile(mdx);
  await processor.run(processor.parse(file), file);
  return (file.data as { markdown: string }).markdown.trim();
}

describe('llms markdown', () => {
  test('keeps heading levels', async () => {
    assert.equal(await toLlmsMarkdown('# Title\n\n## Section\n\n### Sub *part*'), '# Title\n\n## Section\n\n### Sub *part*');
  });

  test('turns images and callouts into Markdown', async () => {
    const markdown = await toLlmsMarkdown(
      [
        '<ZoomImage src="/docs/images/a.webp" alt="Dashboard" />',
        '<ZoomableImage src="shadow-to-do" alt="Missing" />',
        '<Callout type="warning" title="Back up first">\n  Run a **backup**.\n</Callout>',
      ].join('\n\n'),
    );

    assert.equal(markdown, '![Dashboard](/docs/images/a.webp)\n\n \n\n> **Warning: Back up first**\n>\n> Run a **backup**.');
  });

  test('reads card props from expressions and drops icon identifiers', async () => {
    const markdown = await toLlmsMarkdown(`<CoolNextSteps
  cards={[
    { title: 'Deploy an app', href: '/deploy-your-first-app', description: 'Start here.', icon: WindowPointer },
    { title: 'Backups', description: 'Plan restores.', bullets: ['Daily', \`Off-site\`] },
  ]}
/>`);

    assert.equal(
      markdown,
      '- **[Deploy an app](/deploy-your-first-app)**: Start here.\n- **Backups**: Plan restores.\n  - Daily\n  - Off-site',
    );
  });

  test('keeps tab and step content without layout wrappers', async () => {
    const markdown = await toLlmsMarkdown(`<Tabs items={['Dashboard', 'API']}>
<Tab value="Dashboard">

Open **Settings**.

</Tab>
</Tabs>

<Steps>
<Step>

### Install

Run the script.

</Step>
</Steps>`);

    assert.equal(markdown, '**Dashboard**\n\nOpen **Settings**.\n\n### Install\n\nRun the script.');
  });

  test('renders inline values as code and keeps HTML elements', async () => {
    assert.equal(
      await toLlmsMarkdown('Use <CoolInlineValue>latest</CoolInlineValue> or <kbd>Ctrl</kbd>.'),
      'Use `latest` or <kbd>Ctrl</kbd>.',
    );
  });
});
