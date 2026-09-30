import React from 'react';
import { cn } from '@/lib/ui/cn';
import { CoolActionCard } from './cool-action-card';
import type { CoolActionType, CoolIcon } from './cool-types';

export type CoolActionCardItem = {
  'btn-cta'?: React.ReactNode;
  bullets?: React.ReactNode[];
  description?: React.ReactNode;
  href?: string;
  icon: CoolIcon;
  tabValue?: string;
  title: React.ReactNode;
  type?: CoolActionType;
};

type CoolActionCardGridProps = React.ComponentProps<'section'> & {
  cards?: CoolActionCardItem[];
  surface?: boolean;
  tabId?: string;
};

export function CoolActionCardGrid({
  cards,
  children,
  className,
  surface = false,
  tabId,
  ...props
}: CoolActionCardGridProps) {
  const renderedCards = cards?.map((card) => (
    <CoolActionCard
      key={String(card.title)}
      href={card.href}
      onClick={
        card.href && tabId
          ? (event) => {
              openCoolTab(event, tabId, card.tabValue ?? String(card.title), card.href);
            }
          : undefined
      }
      title={card.title}
      description={card.description}
      bullets={card.bullets}
      icon={card.icon}
      type={card.type}
      btn-cta={card['btn-cta']}
    />
  ));
  const content = renderedCards ?? children;
  const cardCount = React.Children.toArray(content).filter(Boolean).length;

  return (
    <section
      data-cool-docs
      className={cn(
        'not-prose grid gap-4 sm:grid-cols-2',
        surface ? 'overflow-hidden rounded-lg border border-fd-border bg-fd-background/70 p-4 sm:p-5' : null,
        cardCount === 1 ? 'max-w-md' : null,
        className,
      )}
      {...props}
    >
      {content}
    </section>
  );
}

export function openCoolTab(
  event: React.MouseEvent<HTMLAnchorElement>,
  id: string,
  value: string,
  hash?: string,
) {
  event.preventDefault();
  const targetHash = hash ?? `#${id}`;

  window.dispatchEvent(
    new CustomEvent('mdx-tabs:set-active', {
      detail: {
        hash: targetHash,
        id,
        value,
      },
    }),
  );

  const targetId = targetHash.startsWith('#') ? targetHash.slice(1) : targetHash;
  document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
  window.history.pushState(null, '', targetHash);
}
