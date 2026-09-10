import type React from 'react';

const inlineTokenPattern = /(`([^`]+)`)|\[([^\]]+)\]\(([^)\s]+)\)/g;
const urlPattern = /^https?:\/\/[^\s]+$/;

function linkProps(href: string) {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { href, rel: 'noreferrer noopener', target: '_blank' };
  }

  return { href };
}

export function renderCoolInlineContent(content: React.ReactNode): React.ReactNode {
  if (typeof content !== 'string') {
    return content;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineTokenPattern.exec(content)) !== null) {
    const [source, , code, label, href] = match;

    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    if (code) {
      parts.push(
        <code key={`code-${match.index}`} className="rounded bg-fd-muted px-1 py-0.5 font-mono text-[0.85em] text-fd-foreground">
          {code}
        </code>,
      );
    } else if (label && href) {
      parts.push(
        <a key={`${href}-${match.index}`} {...linkProps(href)}>
          {label}
        </a>,
      );
    }

    lastIndex = match.index + source.length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length ? parts : content;
}

export function renderCoolLinkValue(content: React.ReactNode): React.ReactNode {
  if (typeof content === 'string' && urlPattern.test(content)) {
    return <a {...linkProps(content)}>{content}</a>;
  }

  return renderCoolInlineContent(content);
}
