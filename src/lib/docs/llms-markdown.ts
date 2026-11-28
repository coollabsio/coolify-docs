import type { Expression, Pattern, SpreadElement } from 'estree';
import type { LLMsOptions } from 'fumadocs-core/mdx-plugins';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx';
import type { Info, State } from 'mdast-util-to-markdown';

// Options for Fumadocs `includeProcessedMarkdown`, which makes the page Markdown for
// `content.md` and `llms-full.txt`. It must stay free of `@/` imports: source.config.ts loads it.

type JsxElement = MdxJsxFlowElement | MdxJsxTextElement;
type Props = Record<string, unknown>;

// Components whose props only control layout. Their children carry the content.
const layoutOnly = new Set(['Steps', 'Step', 'Tabs', 'Accordions']);
const listProps = ['bullets', 'items', 'steps', 'list'];

function literal(node: Expression | Pattern | SpreadElement | null): unknown {
  switch (node?.type) {
    case 'Literal':
      return node.value;
    case 'TemplateLiteral':
      return node.expressions.length === 0 ? node.quasis.map((quasi) => quasi.value.cooked).join('') : undefined;
    case 'ArrayExpression':
      return node.elements.map(literal);
    case 'ObjectExpression':
      return Object.fromEntries(
        node.properties.flatMap((property) => {
          if (property.type !== 'Property' || property.computed) return [];
          const key = property.key.type === 'Identifier' ? property.key.name : String(literal(property.key));
          return [[key, literal(property.value)]];
        }),
      );
    default:
      // Identifiers, such as icon components, have no text value.
      return undefined;
  }
}

function readProps(node: JsxElement): Props {
  const props: Props = {};
  for (const attribute of node.attributes) {
    if (attribute.type !== 'mdxJsxAttribute') continue;
    const { value } = attribute;
    if (value === null || value === undefined || typeof value === 'string') {
      props[attribute.name] = value ?? true;
      continue;
    }
    const statement = value.data?.estree?.body[0];
    props[attribute.name] = statement?.type === 'ExpressionStatement' ? literal(statement.expression) : undefined;
  }
  return props;
}

function text(value: unknown): string | undefined {
  if (typeof value === 'number') return String(value);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter((item) => item !== undefined) : [];
}

function summary(props: Props, title = text(props.title) ?? text(props.label)): string | undefined {
  const href = text(props.href);
  const description = text(props.description);
  const label = title && (href ? `[${title}](${href})` : title);
  if (!label) return description;
  return description ? `**${label}**: ${description}` : `**${label}**`;
}

function cardItem(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const props = value as Props;
  const line = summary(props);
  if (!line) return undefined;
  const bullets = strings(props.bullets).map((bullet) => `  - ${bullet}`);
  return [`- ${line}`, ...bullets].join('\n');
}

function image(props: Props): string | undefined {
  const src = text(props.src) ?? text(props.imageSrc);
  // Some pages use placeholder sources, such as "shadow-to-do", until a screenshot exists.
  if (!src || !/^(\/|https?:)/.test(src)) return undefined;
  return `![${text(props.alt) ?? text(props.imageAlt) ?? ''}](${src})`;
}

function callout(node: MdxJsxFlowElement, props: Props, state: State, info: Info): string {
  const kind = text(props.type);
  const label = [kind && kind[0].toUpperCase() + kind.slice(1), text(props.title)].filter(Boolean).join(': ');
  return state.handle(
    {
      type: 'blockquote',
      children: [...(label ? [{ type: 'html' as const, value: `**${label}**` }] : []), ...node.children],
    },
    undefined,
    state,
    info,
  );
}

function component(node: MdxJsxFlowElement, state: State, info: Info): string {
  const props = readProps(node);
  if (node.name === 'Callout' || node.name === 'CoolCallout') return callout(node, props, state, info);

  const blocks: Array<string | undefined> = [];
  if (!layoutOnly.has(node.name ?? '')) {
    blocks.push(image(props), summary(props, node.name === 'Tab' ? text(props.value) : undefined));
    const code = text(props.code) ?? (node.name === 'Tab' ? undefined : text(props.value));
    if (code) blocks.push(`\`\`\`\n${code}\n\`\`\``);
    for (const key of listProps) blocks.push(strings(props[key]).map((item) => `- ${item}`).join('\n'));
    if (Array.isArray(props.cards)) blocks.push(props.cards.map(cardItem).filter(Boolean).join('\n'));
    if (Array.isArray(props.buttons)) blocks.push(props.buttons.map((button) => cardItem({ ...button, title: button?.label })).filter(Boolean).join('\n'));
  }
  blocks.push(state.containerFlow(node, info));

  // An empty string would make Fumadocs print the raw JSX.
  return blocks.filter(Boolean).join('\n\n') || ' ';
}

export const llmsMarkdownOptions: LLMsOptions = {
  stringify(node, _parent, state, info) {
    if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return undefined;
    // Lowercase names are HTML elements. Keep them as authored.
    if (!node.name || !/^[A-Z]/.test(node.name)) return undefined;

    if (node.type === 'mdxJsxFlowElement') return component(node, state, info);
    const inline = state.containerPhrasing(node, info);
    if (node.name === 'CoolInlineValue') return `\`${inline}\``;
    return inline || ' ';
  },
  handlers: {
    // Fumadocs prints headings without the `#` markers, which removes the page structure.
    heading(node, _parent, state, info) {
      const exit = state.enter('headingAtx');
      const value = state.containerPhrasing(node, { ...info, before: '# ', after: '\n' });
      exit();
      return `${'#'.repeat(node.depth)} ${value}`;
    },
  },
};
