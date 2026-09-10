import type React from 'react';
import { ArrowRight, Check } from 'reicon-react';
import { cn } from '@/lib/ui/cn';
import type { CoolActionType, CoolIcon } from './cool-types';

type CoolCardButton = {
  href: string;
  label: React.ReactNode;
  type?: CoolActionType;
};

type CoolCardProps = Omit<React.ComponentProps<'article'>, 'title'> & {
  bullets?: React.ReactNode[];
  buttons?: [CoolCardButton] | [CoolCardButton, CoolCardButton];
  description?: React.ReactNode;
  href?: string;
  icon: CoolIcon;
  linkLabel?: string;
  title: React.ReactNode;
  type?: CoolActionType;
};

type CoolCardGridProps = React.ComponentProps<'div'> & {
  columns?: 1 | 2 | 3;
};

const gridColumns: Record<NonNullable<CoolCardGridProps['columns']>, string> = {
  1: '',
  2: 'md:grid-cols-2',
  3: 'lg:grid-cols-3',
};

export function CoolCardGrid({ children, className, columns = 2, ...props }: CoolCardGridProps) {
  return (
    <div data-cool-docs className={cn('grid gap-4', gridColumns[columns], className)} {...props}>
      {children}
    </div>
  );
}

export function CoolCard({
  bullets,
  buttons,
  className,
  description,
  href,
  icon: Icon,
  linkLabel,
  title,
  type = 'secondary',
  ...props
}: CoolCardProps) {
  const visibleButtons = buttons?.slice(0, 2) ?? [];
  const hasMultipleButtons = visibleButtons.length > 1;

  return (
    <article
      className={cn(
        'method-card flex h-full flex-col rounded-lg border border-fd-border bg-fd-background/70 p-5 shadow-sm',
        hasMultipleButtons ? undefined : `method-card-${type}`,
        href ? 'relative cursor-pointer' : undefined,
        className,
      )}
      {...props}
    >
      {href ? (
        <a
          href={href}
          aria-label={linkLabel ?? (typeof title === 'string' ? title : undefined)}
          className="absolute inset-0 z-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-fd-primary focus:ring-offset-2 focus:ring-offset-fd-background"
        />
      ) : null}

      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-muted/40 text-fd-foreground">
          <Icon className="size-5" weight="Filled" aria-hidden={true} />
        </span>
        <h3 className="m-0 min-w-0 text-base font-semibold text-fd-foreground">{title}</h3>
      </div>

      {description ? (
        <p className="m-0 mt-4 text-sm leading-6 text-fd-muted-foreground">{description}</p>
      ) : null}

      {bullets?.length ? (
        <ul className="m-0 mt-4 space-y-2 p-0">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2 text-sm leading-6 text-fd-muted-foreground">
              <Check className="mt-1 size-4 shrink-0 text-fd-foreground" aria-hidden={true} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {visibleButtons.length > 0 ? (
        <div className="relative z-20 mt-5 flex flex-wrap gap-2">
          {visibleButtons.map((button) => (
            <a
              key={`${button.href}-${String(button.label)}`}
              href={button.href}
              className={`method-button method-button-${button.type ?? type} inline-flex w-fit items-center gap-2 border px-3 py-2 text-sm font-semibold transition`}
            >
              {button.label}
              <ArrowRight className="size-4" aria-hidden={true} />
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
