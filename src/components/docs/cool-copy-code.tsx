'use client';

import type React from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { Copy, CopySuccess2 } from 'reicon-react';
import { cn } from '@/lib/ui/cn';

type CoolCopyCodeProps = React.ComponentProps<'div'> & {
  label?: React.ReactNode;
  value: string;
};

export function CoolCopyCode({ className, label = 'Value', value, ...props }: CoolCopyCodeProps) {
  const [copied, copyValue] = useCopyButton(() => navigator.clipboard.writeText(value));
  const CopyIcon = copied ? CopySuccess2 : Copy;
  const labelText = typeof label === 'string' ? label : 'value';

  return (
    <div className={cn('mt-4 rounded-lg border border-fd-border bg-fd-background p-4', className)} {...props}>
      <p className="m-0 text-xs font-medium leading-5 text-fd-muted-foreground">{label}</p>
      <div className="relative mt-2">
        <button
          type="button"
          onClick={copyValue}
          aria-label={`Copy ${labelText}`}
          title={copied ? 'Copied' : `Copy ${labelText}`}
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className: 'absolute right-2 top-2 z-10 h-7 gap-1.5 px-2 text-xs [&_svg]:size-3.5',
            }),
          )}
        >
          <CopyIcon weight="Filled" aria-hidden={true} />
          {copied ? 'Copied' : 'Copy'}
        </button>
        <pre className="overflow-x-auto rounded-md border border-fd-border bg-fd-muted/40 px-3 py-2 pe-20 text-sm font-semibold leading-6">
          <code className="select-all font-mono text-fd-foreground">
            <span className="text-fd-primary">{value}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}
