'use client';

import type { ComponentProps } from 'react';
import { useState } from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { Copy, CopySuccess2 } from 'reicon-react';
import { cn } from '@/lib/ui/cn';

const markdownCache = new Map<string, Promise<string>>();

export function ReiconMarkdownCopyButton({
  markdownUrl,
  className,
  children,
  ...props
}: ComponentProps<'button'> & { markdownUrl: string }) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = markdownCache.get(markdownUrl);

    if (cached) {
      return navigator.clipboard.writeText(await cached);
    }

    setLoading(true);

    try {
      const markdown = fetch(markdownUrl).then((response) => response.text());
      markdownCache.set(markdownUrl, markdown);
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': markdown })]);
    } finally {
      setLoading(false);
    }
  });
  const Icon = checked ? CopySuccess2 : Copy;

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      {...props}
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'sm',
          className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
        }),
        className,
      )}
    >
      <Icon weight="Filled" aria-hidden="true" />
      {children ?? 'Copy Markdown'}
    </button>
  );
}
