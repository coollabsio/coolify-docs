'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/ui/cn';

type CoolHighlightedCodeProps = {
  className?: string;
  code: string;
  lang: string;
};

export function CoolHighlightedCode({ className, code, lang }: CoolHighlightedCodeProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function highlightCode() {
      try {
        const { codeToHtml } = await import('shiki/bundle/web');
        const highlighted = await codeToHtml(code, {
          defaultColor: false,
          lang,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });

        if (!cancelled) {
          setHtml(highlighted);
        }
      } catch {
        if (!cancelled) {
          setHtml(null);
        }
      }
    }

    void highlightCode();

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const codeClassName = cn(
    'not-fumadocs-codeblock mt-2 overflow-hidden rounded-md border border-fd-border bg-fd-muted text-xs font-semibold text-fd-foreground',
    '[&_pre]:!m-0 [&_pre]:max-h-48 [&_pre]:overflow-auto [&_pre]:!bg-transparent [&_pre]:!text-xs [&_pre]:!text-fd-foreground',
    '[&_code]:block [&_code]:overflow-auto [&_code]:px-3 [&_code]:py-2 [&_code]:font-mono [&_code]:text-xs',
    className,
  );

  if (html) {
    return <div className={codeClassName} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <pre className={codeClassName}>
      <code>{code}</code>
    </pre>
  );
}
