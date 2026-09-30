import { Children } from 'react';
import type React from 'react';
import { cn } from '@/lib/ui/cn';
import { renderCoolLinkValue } from './cool-inline-content';

type CoolDocsPageProps = React.ComponentProps<'div'> & {
  hideToc?: boolean;
  spacing?: 'default' | 'none';
};

export function CoolDocsPage({ children, className, hideToc = false, spacing = 'default', ...props }: CoolDocsPageProps) {
  return (
    <div
      data-cool-docs-page
      data-cool-docs
      data-hide-toc={hideToc ? 'true' : undefined}
      className={cn(
        'not-prose space-y-6 [&>hr]:h-px [&>hr]:border-0 [&>hr]:bg-fd-border',
        spacing === 'default' ? 'my-8' : null,
        className,
      )}
      {...props}
    >
      {hideToc ? (
        <style>
          {`
            body:has([data-cool-docs-page][data-hide-toc="true"]) #nd-toc {
              display: none;
            }
          `}
        </style>
      ) : null}
      {children}
    </div>
  );
}

export function CoolInlineValue({ children }: { children: React.ReactNode }) {
  return <span className="font-sans font-semibold text-fd-foreground">{children}</span>;
}

export function CoolPanel({
  children,
  className,
  withDivider = false,
  ...props
}: React.ComponentProps<'div'> & { withDivider?: boolean }) {
  return (
    <div
      data-cool-panel
      className={cn(
        'not-prose prose-no-margin text-sm leading-6 text-fd-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>ol]:my-3 [&>ol]:list-decimal [&>ol]:ps-5 [&>p]:my-0 [&>p+p]:mt-3 [&>p+ol]:mt-3 [&>p+ul]:mt-3 [&>ul]:my-3 [&>ul]:list-disc [&>ul]:ps-5 [&_a:not(.method-card):not(.method-button)]:font-semibold [&_a:not(.method-card):not(.method-button)]:text-fd-foreground [&_a:not(.method-card):not(.method-button)]:underline [&_a:not(.method-card):not(.method-button)]:decoration-fd-primary [&_a:not(.method-card):not(.method-button)]:decoration-2 [&_a:not(.method-card):not(.method-button)]:underline-offset-4 [&_a:not(.method-card):not(.method-button):hover]:decoration-fd-primary/70 [&_li]:my-1.5 [&_li>p]:my-1 [&_ol]:list-decimal [&_strong]:font-semibold [&_strong]:text-fd-foreground [&_ul]:list-disc',
        withDivider ? 'border-t border-fd-border p-4 sm:p-5' : 'p-4 sm:p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CoolPanelGrid({ children, className, ...props }: React.ComponentProps<'div'>) {
  const panels = Children.toArray(children).filter(Boolean);

  return (
    <div className={cn('grid gap-0 lg:grid-cols-[0.9fr_1.1fr]', className)} {...props}>
      {panels.map((panel, index) => (
        <div
          key={index}
          className={cn(
            index < panels.length - 1 ? 'border-b border-fd-border lg:border-b-0 lg:border-e' : null,
          )}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}

type CoolValueGridProps = React.ComponentProps<'div'> & {
  columns?: 1 | 2 | 3;
};

const valueGridColumns: Record<NonNullable<CoolValueGridProps['columns']>, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};

export function CoolValueGrid({ children, className, columns = 3, ...props }: CoolValueGridProps) {
  return (
    <div className={cn('mt-4 grid gap-3', valueGridColumns[columns], className)} {...props}>
      {children}
    </div>
  );
}

export function CoolValueCard({
  children,
  description,
  label,
  layout = 'stacked',
}: {
  children: React.ReactNode;
  description?: React.ReactNode;
  label: string;
  layout?: 'split' | 'stacked';
}) {
  if (layout === 'split') {
    return (
      <div className="rounded-lg border border-fd-border bg-fd-muted/20 p-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-fd-foreground">{label}</span>
          <span className="text-sm font-medium text-fd-foreground">{renderCoolLinkValue(children)}</span>
        </div>
        {description ? (
          <p className="m-0 mt-1 text-xs leading-5 text-fd-muted-foreground">
            {renderCoolLinkValue(description)}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-fd-border bg-fd-muted/20 p-3">
      <p className="m-0 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">{label}</p>
      <p className="m-0 mt-1 text-sm font-semibold text-fd-foreground [&_a]:underline [&_a]:decoration-fd-primary [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-fd-primary/70">
        {renderCoolLinkValue(children)}
      </p>
      {description ? (
        <p className="m-0 mt-1 text-xs leading-5 text-fd-muted-foreground">
          {renderCoolLinkValue(description)}
        </p>
      ) : null}
    </div>
  );
}
