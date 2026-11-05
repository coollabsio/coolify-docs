import { siteDefinition } from '@config/site.shared';

type DiscordEmbedPage = {
  title: string;
  description: string;
  url: string;
  markdownUrl?: string;
  githubUrl?: string;
};

type LinkButton = {
  type: 2;
  style: 5;
  label: string;
  url: string;
};

function plainText(value: string, limit: number): string {
  const characters = Array.from(value.replace(/\s+/g, ' ').trim());
  if (limit === 0) return '';
  const text = characters.length > limit ? `${characters.slice(0, limit - 1).join('')}…` : characters.join('');
  return text.replace(/([\\`*_{}\[\]()<>#|~])/g, '\\$1');
}

function linkButton(label: string, url?: string): LinkButton | undefined {
  if (!url || url.length > 512) return undefined;
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return undefined;
  return { type: 2, style: 5, label, url };
}

/**
 * Server-rendered Discord link preview, including its 3,000-byte serialized payload limit.
 * @see https://docs.discord.com/developers/link-previews/component-embeds
 */
export function getDiscordEmbedScript(page: DiscordEmbedPage): string {
  const title = page.title.trim() || siteDefinition.title;
  const description = page.description.trim() || siteDefinition.description;
  const logoUrl = new URL(`${siteDefinition.docsBasePath}/brand/logo.png`, page.url).href;
  const seen = new Set<string>();
  const buttons = [
    linkButton('Visit in browser', page.url),
    linkButton('Read Markdown', page.markdownUrl),
    linkButton('View on GitHub', page.githubUrl),
  ].filter((button): button is LinkButton => {
    if (!button || seen.has(button.url)) return false;
    seen.add(button.url);
    return true;
  });

  function serialize(descriptionLimit: number): string {
    const content = plainText(description, descriptionLimit);
    const payload = {
      component: {
        type: 17,
        accent_color: Number.parseInt(siteDefinition.og.accent.slice(1), 16),
        components: [
          {
            type: 9,
            components: [
              { type: 10, content: `## ${plainText(title, 120)}` },
              ...(content ? [{ type: 10, content }] : []),
            ],
            accessory: {
              type: 11,
              media: { url: logoUrl },
              description: `${siteDefinition.name} logo`,
            },
          },
          ...(buttons.length ? [{ type: 1, components: buttons }] : []),
        ],
      },
    };

    // Prevent page text from closing the inline script element.
    return JSON.stringify(payload).replaceAll('<', '\\u003c');
  }

  let descriptionLimit = 500;
  let json = serialize(descriptionLimit);
  while (new TextEncoder().encode(json).byteLength > 3000) {
    if (descriptionLimit > 0) {
      descriptionLimit = Math.max(0, descriptionLimit - 50);
    } else {
      // Preserve the primary action when unusually long URLs exceed the budget.
      buttons.pop();
    }
    json = serialize(descriptionLimit);
  }

  return json;
}
