import type React from 'react';
import { ArrowRight } from 'reicon-react';
import { cn } from '@/lib/ui/cn';
import type { CoolIcon } from './cool-types';

type CoolNextStepCard = {
  description: React.ReactNode;
  href: string;
  icon: CoolIcon;
  title: React.ReactNode;
};

type CoolNextStepGroup = {
  description: React.ReactNode;
  icon: CoolIcon;
  links: Array<{
    href: string;
    title: React.ReactNode;
  }>;
  title: React.ReactNode;
};

type CoolNextStepsProps = React.ComponentProps<'section'> & {
  cards: CoolNextStepCard[];
  groups?: CoolNextStepGroup[];
};

export function CoolNextSteps({ cards, className, groups, ...props }: CoolNextStepsProps) {
  return (
    <section
      data-cool-docs
      className={cn(
        'not-prose my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-background/70',
        className,
      )}
      {...props}
    >
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {cards.map((card) => (
          <NextStepCard key={String(card.title)} {...card} />
        ))}
      </div>

      {groups?.length ? (
        <div className="grid gap-0 border-t border-fd-border md:grid-cols-2">
          {groups.map((group) => (
            <NextStepLinkGroup key={String(group.title)} {...group} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function NextStepCard({ description, href, icon: Icon, title }: CoolNextStepCard) {
  return (
    <a
      href={href}
      className="method-card method-card-primary group rounded-lg border border-fd-border bg-fd-muted/20 p-4 shadow-sm transition duration-200 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-background text-fd-foreground">
            <Icon className="size-5" weight="Filled" aria-hidden={true} />
          </span>
          <h3 className="m-0 text-sm font-semibold text-fd-foreground">{title}</h3>
        </div>
        <ArrowRight
          className="mt-2 size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-fd-foreground"
          aria-hidden={true}
        />
      </div>
      <p className="m-0 mt-3 text-sm leading-6 text-fd-muted-foreground">{description}</p>
    </a>
  );
}

function NextStepLinkGroup({ description, icon: Icon, links, title }: CoolNextStepGroup) {
  return (
    <div className="border-b border-fd-border bg-fd-muted/[0.06] p-4 last:border-b-0 md:border-b-0 md:border-e md:last:border-e-0 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-background text-fd-foreground">
            <Icon className="size-5" weight="Filled" aria-hidden={true} />
          </span>
          <div className="min-w-0">
            <h3 className="m-0 text-sm font-semibold text-fd-foreground">{title}</h3>
            <p className="m-0 mt-1 text-sm leading-6 text-fd-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-1">
        {links.map((link, index) => (
          <a
            key={String(link.title)}
            href={link.href}
            className="group flex items-center justify-between gap-3 rounded-md px-2 py-2.5 text-sm font-semibold text-fd-foreground transition hover:bg-fd-background"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-fd-border bg-fd-background text-xs text-fd-muted-foreground transition group-hover:border-fd-primary/45 group-hover:text-fd-primary">
                {index + 1}
              </span>
              <span className="truncate transition group-hover:text-fd-primary">{link.title}</span>
            </span>
            <ArrowRight
              className="size-3.5 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-fd-primary"
              aria-hidden={true}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
