import type React from 'react';
import { ArrowRight, Check } from 'reicon-react';
import { cn } from '@/lib/ui/cn';
import type { CoolActionType, CoolIcon } from './cool-types';

type CoolActionCardProps = Omit<React.ComponentProps<'a'>, 'title'> & {
  'btn-cta'?: React.ReactNode;
  bullets?: React.ReactNode[];
  description?: React.ReactNode;
  icon: CoolIcon;
  title: React.ReactNode;
  type?: CoolActionType;
};

export function CoolActionCard({
  'btn-cta': buttonCta,
  bullets,
  className,
  description,
  href,
  icon: Icon,
  onClick,
  title,
  type = 'primary',
  ...props
}: CoolActionCardProps) {
  const isSimpleCard = !buttonCta && !bullets?.length;
  const iconNode = (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-muted/40 text-fd-foreground transition-colors group-hover:bg-fd-muted/60">
      <Icon className="size-5" weight="Filled" aria-hidden={true} />
    </span>
  );

  const content = isSimpleCard ? (
    <article className="flex h-full items-start gap-3">
      {iconNode}
      <div className="min-w-0 pt-2">
        <h3 className="m-0 text-base font-semibold leading-6 text-fd-foreground">{title}</h3>
        {description ? (
          <p className="m-0 mt-1 text-sm leading-6 text-fd-muted-foreground">{description}</p>
        ) : null}
      </div>
    </article>
  ) : (
    <article className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        {iconNode}
        <div className="min-w-0">
          <h3 className="m-0 text-base font-semibold text-fd-foreground">{title}</h3>
        </div>
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

      {buttonCta ? (
        <span className={`method-button method-button-${type} mt-5 inline-flex w-fit items-center gap-2 border px-3 py-2 text-sm font-semibold transition`}>
          {buttonCta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden={true} />
        </span>
      ) : null}
    </article>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cn(
          `not-prose method-card method-card-${type} group rounded-lg border border-fd-border bg-fd-background/70 shadow-sm transition duration-200 hover:-translate-y-1`,
          isSimpleCard ? 'p-4' : 'p-5',
          className,
        )}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={cn(
        'not-prose method-card group rounded-lg border border-fd-border bg-fd-background/70 shadow-sm',
        isSimpleCard ? 'p-4' : 'p-5',
        className,
      )}
    >
      {content}
    </div>
  );
}
