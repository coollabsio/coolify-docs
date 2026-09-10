import type React from 'react';
import { cn } from '@/lib/ui/cn';
import type { CoolIcon } from './cool-types';

export type CoolIconCardItem = {
  description?: React.ReactNode;
  href?: string;
  icon: CoolIcon;
  title: React.ReactNode;
};

type CoolIconCardGridProps = React.ComponentProps<'section'> & {
  cards?: CoolIconCardItem[];
  columns?: 1 | 2 | 3;
  surface?: boolean;
};

const gridColumns: Record<NonNullable<CoolIconCardGridProps['columns']>, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
};

export function CoolIconCardGrid({
  cards,
  children,
  className,
  columns = 2,
  surface = false,
  ...props
}: CoolIconCardGridProps) {
  const content = cards?.map((card) => <CoolIconCard key={String(card.title)} {...card} />) ?? children;

  return (
    <section
      data-cool-docs
      className={cn(
        'not-prose my-4 grid gap-4',
        gridColumns[columns],
        surface ? 'overflow-hidden rounded-lg border border-fd-border bg-fd-background/70 p-4 sm:p-5' : null,
        className,
      )}
      {...props}
    >
      {content}
    </section>
  );
}

export function CoolIconCard({ description, href, icon: Icon, title }: CoolIconCardItem) {
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-muted/40 text-fd-foreground">
        <Icon className="size-5" weight="Filled" aria-hidden={true} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-fd-foreground">{title}</span>
        {description ? (
          <span className="mt-1 block text-sm leading-6 text-fd-muted-foreground">{description}</span>
        ) : null}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group flex gap-3 rounded-lg border border-fd-border bg-fd-background/70 p-4 shadow-sm transition hover:bg-fd-muted/35"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex gap-3 rounded-lg border border-fd-border bg-fd-background/70 p-4 shadow-sm">
      {content}
    </div>
  );
}
