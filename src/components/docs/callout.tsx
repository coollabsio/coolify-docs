import type React from 'react';
import { CheckCircle, InfoCircle, StarSparkle, Warning22 } from 'reicon-react';
import { cn } from '@/lib/ui/cn';

type CalloutType = 'error' | 'idea' | 'info' | 'success' | 'warning';

type CalloutProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  type?: string;
};

const calloutTypes = {
  error: {
    borderClass: 'border-red-600/35 dark:border-red-500/65',
    headerClass: 'border-red-600/30 bg-red-600/10 dark:border-red-500/50 dark:bg-red-500/20',
    icon: Warning22,
    iconClass: 'text-red-600 dark:text-red-400',
    title: 'Warning',
  },
  idea: {
    borderClass: 'border-purple-500/25 dark:border-purple-400/45',
    headerClass: 'border-purple-500/20 bg-purple-500/10 dark:border-purple-400/35 dark:bg-purple-400/15',
    icon: StarSparkle,
    iconClass: 'text-purple-600 dark:text-purple-300',
    title: 'Idea',
  },
  info: {
    borderClass: 'border-sky-500/25 dark:border-sky-400/45',
    headerClass: 'border-sky-500/20 bg-sky-500/10 dark:border-sky-400/35 dark:bg-sky-400/15',
    icon: InfoCircle,
    iconClass: 'text-sky-600 dark:text-sky-300',
    title: 'Note',
  },
  success: {
    borderClass: 'border-emerald-500/25 dark:border-emerald-400/45',
    headerClass: 'border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-400/35 dark:bg-emerald-400/15',
    icon: CheckCircle,
    iconClass: 'text-emerald-600 dark:text-emerald-300',
    title: 'Success',
  },
  warning: {
    borderClass: 'border-amber-500/25 dark:border-amber-400/45',
    headerClass: 'border-amber-500/20 bg-amber-500/10 dark:border-amber-400/35 dark:bg-amber-400/15',
    icon: Warning22,
    iconClass: 'text-amber-600 dark:text-amber-300',
    title: 'Heads up',
  },
} satisfies Record<
  CalloutType,
  {
    borderClass: string;
    headerClass: string;
    icon: React.ComponentType<{ className?: string; weight?: 'Outline' | 'Filled' }>;
    iconClass: string;
    title: string;
  }
>;

function normalizeCalloutType(type?: string): CalloutType {
  switch (type) {
    case 'danger':
      return 'error';
    case 'tip':
      return 'success';
    case 'warn':
      return 'warning';
    case 'idea':
    case 'error':
    case 'info':
    case 'success':
    case 'warning':
      return type;
    default:
      return 'info';
  }
}

export function Callout({ children, className, icon, title, type = 'info', ...props }: CalloutProps) {
  const meta = calloutTypes[normalizeCalloutType(type)];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        'not-prose my-6 overflow-hidden rounded-lg border bg-fd-background/70',
        meta.borderClass,
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex items-center gap-2 border-b px-4 py-3 text-sm font-semibold text-fd-foreground',
          meta.headerClass,
        )}
      >
        {icon === undefined ? (
          <span className={cn('flex size-4 shrink-0 items-center justify-center', meta.iconClass)}>
            <Icon className="size-4" weight="Filled" />
          </span>
        ) : (
          icon
        )}
        <span>{title ?? meta.title}</span>
      </div>
      <div className="px-4 py-4 text-sm leading-6 text-fd-muted-foreground sm:px-5">
        <div className="prose-no-margin [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>ol]:my-3 [&>ol]:list-decimal [&>ol]:ps-5 [&>p]:my-0 [&>p+p]:mt-3 [&>p+ol]:mt-3 [&>p+ul]:mt-3 [&>ul]:my-3 [&>ul]:list-disc [&>ul]:ps-5 [&_a]:font-semibold [&_a]:text-fd-foreground [&_a]:underline [&_a]:decoration-fd-primary [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-fd-primary/70 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:border [&_:not(pre)>code]:border-fd-border [&_:not(pre)>code]:bg-fd-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-xs [&_:not(pre)>code]:font-semibold [&_:not(pre)>code]:text-fd-foreground [&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none [&_li]:my-1.5 [&_li>p]:my-1 [&_ol]:list-decimal [&_strong]:font-semibold [&_strong]:text-fd-foreground [&_ul]:list-disc">
          {children}
        </div>
      </div>
    </div>
  );
}
