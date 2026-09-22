'use client';

import type React from 'react';
import { useState } from 'react';
import { CheckCircle, InfoCircle, Link3, StarSparkle, Warning22 } from 'reicon-react';
import { cn } from '@/lib/ui/cn';
import type { CoolIcon } from './cool-types';

type CoolCalloutType = 'default' | 'error' | 'idea' | 'info' | 'success' | 'warning';

type CoolCalloutProps = Omit<React.ComponentProps<'section'>, 'title'> & {
  children: React.ReactNode;
  contentClassName?: string;
  icon?: CoolIcon;
  id?: string;
  title: React.ReactNode;
  type?: string;
};

const calloutTypes = {
  default: {
    icon: InfoCircle,
    titleClass: '',
  },
  error: {
    icon: Warning22,
    titleClass: 'text-red-600 dark:text-red-400',
  },
  idea: {
    icon: StarSparkle,
    titleClass: 'text-purple-600 dark:text-purple-300',
  },
  info: {
    icon: InfoCircle,
    titleClass: 'text-sky-600 dark:text-sky-300',
  },
  success: {
    icon: CheckCircle,
    titleClass: 'text-emerald-600 dark:text-emerald-300',
  },
  warning: {
    icon: Warning22,
    titleClass: 'text-amber-600 dark:text-amber-300',
  },
} satisfies Record<
  CoolCalloutType,
  {
    icon: CoolIcon;
    titleClass: string;
  }
>;

function normalizeCalloutType(type?: string): CoolCalloutType {
  switch (type) {
    case 'danger':
      return 'error';
    case 'tip':
      return 'success';
    case 'warn':
      return 'warning';
    case 'error':
    case 'idea':
    case 'info':
    case 'success':
    case 'warning':
      return type;
    default:
      return 'default';
  }
}

export function CoolCallout({ children, className, contentClassName, icon, id, title, type, ...props }: CoolCalloutProps) {
  const [copied, setCopied] = useState(false);
  const meta = calloutTypes[normalizeCalloutType(type)];
  const Icon = icon ?? meta.icon;

  async function copySectionLink() {
    if (!id) return;

    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section
      data-cool-docs
      className={cn('my-5 rounded-lg border border-fd-border bg-fd-background/70', className)}
      {...props}
    >
      <div
        id={id}
        className="section-header flex scroll-mt-24 items-center justify-between gap-3 border-b border-fd-border px-4 py-3 text-sm font-semibold text-fd-foreground"
      >
        <div className={cn('flex min-w-0 items-center gap-2', meta.titleClass)}>
          <Icon className="size-4 shrink-0" weight="Filled" aria-hidden={true} />
          <span className="truncate">{title}</span>
        </div>
        {id ? (
          <button
            type="button"
            aria-label={`Copy link to ${title}`}
            title={copied ? 'Copied' : 'Copy link'}
            onClick={copySectionLink}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-fd-muted-foreground transition hover:bg-fd-muted/50 hover:text-fd-foreground"
          >
            <Link3 className="size-4" weight="Filled" aria-hidden={true} />
          </button>
        ) : null}
      </div>
      <div
        className={cn(
          'prose-no-margin px-4 py-4 text-sm leading-6 text-fd-muted-foreground sm:px-5 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>figure]:my-5 [&>ol]:my-3 [&>ol]:list-decimal [&>ol]:ps-5 [&>p]:my-0 [&>p+p]:mt-3 [&>p+ol]:mt-3 [&>p+ul]:mt-3 [&>ul]:my-3 [&>ul]:list-disc [&>ul]:ps-5 [&_a:not(.method-card):not(.method-button)]:font-semibold [&_a:not(.method-card):not(.method-button)]:text-fd-foreground [&_a:not(.method-card):not(.method-button)]:underline [&_a:not(.method-card):not(.method-button)]:decoration-fd-primary [&_a:not(.method-card):not(.method-button)]:decoration-2 [&_a:not(.method-card):not(.method-button)]:underline-offset-4 [&_a:not(.method-card):not(.method-button):hover]:decoration-fd-primary/70 [&_li]:my-1.5 [&_li>p]:my-1 [&_ol]:list-decimal [&_strong]:font-semibold [&_strong]:text-fd-foreground [&_ul]:list-disc',
          '[&>.fd-steps]:mt-4 [&>.fd-steps]:max-w-full [&_.fd-step]:min-w-0',
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
