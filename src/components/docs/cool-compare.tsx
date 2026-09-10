import type React from 'react';
import { cn } from '@/lib/ui/cn';
import { CoolCallout } from './cool-callout';
import { CoolHighlightedCode } from './cool-highlighted-code';
import { renderCoolInlineContent } from './cool-inline-content';
import type { CoolIcon } from './cool-types';

type CoolCompareProps = Omit<React.ComponentProps<'section'>, 'title'> & {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  contentClassName?: string;
  description?: React.ReactNode;
  icon: CoolIcon;
  id: string;
  title: React.ReactNode;
};

type CoolCompareColumnProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  'code-lang'?: string;
  code?: React.ReactNode;
  items: React.ReactNode[];
  title: React.ReactNode;
};

const gridColumns: Record<NonNullable<CoolCompareProps['columns']>, string> = {
  1: '',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
};

export function CoolCompare({
  children,
  className,
  columns = 2,
  contentClassName,
  description,
  icon,
  id,
  title,
  ...props
}: CoolCompareProps) {
  return (
    <CoolCallout
      data-cool-docs
      className={cn('overflow-hidden', className)}
      contentClassName={cn('!p-0', contentClassName)}
      icon={icon}
      id={id}
      title={title}
      {...props}
    >
      {description ? (
        <div className="p-4 sm:p-5">
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{description}</p>
        </div>
      ) : null}

      <div
        className={cn(
          'not-prose grid gap-0 divide-y divide-fd-border',
          description ? 'border-t border-fd-border' : undefined,
          columns > 1 ? 'lg:divide-x lg:divide-y-0' : undefined,
          gridColumns[columns],
        )}
      >
        {children}
      </div>
    </CoolCallout>
  );
}

export function CoolCompareColumn({
  className,
  code,
  'code-lang': syntaxLanguage,
  items,
  title,
  ...props
}: CoolCompareColumnProps) {
  return (
    <div className={cn('px-4 py-3 sm:px-5 sm:py-4', className)} {...props}>
      <h3 className="m-0 text-sm font-semibold text-fd-foreground">{title}</h3>
      {code && syntaxLanguage && typeof code === 'string' ? (
        <CoolHighlightedCode code={code} lang={syntaxLanguage} />
      ) : code ? (
        <code className="mt-2 block rounded-md border border-fd-border bg-fd-muted px-3 py-2 text-xs font-semibold text-fd-foreground">
          {code}
        </code>
      ) : null}
      <ul className="m-0 mt-3 list-disc space-y-2 ps-5">
        {items.map((item, index) => (
          <li key={index} className="pl-1 text-sm leading-6 text-fd-muted-foreground">
            <span>{renderCoolInlineContent(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
