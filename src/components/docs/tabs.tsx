'use client';

import type React from 'react';
import { Children, isValidElement, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Layers } from 'reicon-react';
import { cn } from '@/lib/ui/cn';
import type { CoolIcon } from './cool-types';

type TabsProps = Omit<React.ComponentProps<'div'>, 'defaultValue'> & {
  defaultIndex?: number;
  defaultValue?: string;
  items?: string[];
  label?: React.ReactNode;
};

type TabProps = Omit<React.ComponentProps<'div'>, 'value'> & {
  icon?: CoolIcon;
  value?: string;
};

function normalizeTabValue(value: string) {
  return value.toLowerCase().replace(/\s/, '-');
}

function scrollToHash(hash: string) {
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!id) return;

  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

function scheduleHashScroll(hash: string) {
  scrollToHash(hash);
  requestAnimationFrame(() => scrollToHash(hash));
}

export function Tabs({
  children,
  className,
  defaultIndex = 0,
  defaultValue,
  id,
  items,
  label,
  ...props
}: TabsProps) {
  const initialValue = defaultValue ?? (items ? normalizeTabValue(items[defaultIndex] ?? items[0] ?? '') : undefined);
  const [activeValue, setActiveValue] = useState(initialValue);
  const [pendingScrollHash, setPendingScrollHash] = useState<string | null>(null);
  const panels = Children.toArray(children).filter(isValidElement) as React.ReactElement<TabProps>[];
  const renderedItems = items ?? panels.map((panel) => panel.props.value).filter(Boolean) as string[];
  const activePanel = panels.find((panel) => normalizeTabValue(panel.props.value ?? '') === activeValue) ?? panels[0];
  const iconByValue = useMemo(() => {
    return new Map(
      panels
        .filter((panel) => panel.props.value && panel.props.icon)
        .map((panel) => [normalizeTabValue(panel.props.value ?? ''), panel.props.icon as CoolIcon]),
    );
  }, [panels]);

  useLayoutEffect(() => {
    if (!pendingScrollHash) return;

    scheduleHashScroll(pendingScrollHash);
    setPendingScrollHash(null);
  }, [activeValue, pendingScrollHash]);

  useEffect(() => {
    if (!id) return;

    function handleTabChange(event: Event) {
      const detail = (event as CustomEvent<{ hash?: string; id?: string; value?: string }>).detail;
      if (detail.id !== id || !detail.value) return;

      setActiveValue(normalizeTabValue(detail.value));

      if (detail.hash) {
        setPendingScrollHash(detail.hash);
      }
    }

    window.addEventListener('mdx-tabs:set-active', handleTabChange);

    return () => {
      window.removeEventListener('mdx-tabs:set-active', handleTabChange);
    };
  }, [id]);

  return (
    <div
      id={id}
      data-mdx-tabs
      className={cn(
        'my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-background/70',
        className,
      )}
      {...props}
    >
      <div className="not-prose flex items-center gap-3 border-b border-fd-border bg-fd-muted/30 px-3 py-2 text-sm font-semibold text-fd-foreground">
        {label ? <span className="shrink-0 text-fd-muted-foreground">{label}</span> : null}
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {renderedItems.map((item) => {
            const value = normalizeTabValue(item);
            const isActive = value === activeValue;
            const Icon = iconByValue.get(value) ?? Layers;

            return (
              <button
                key={item}
                type="button"
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'mdx-tab-active'
                    : 'border-transparent text-fd-muted-foreground hover:bg-fd-muted/50 hover:text-fd-foreground',
                )}
                onClick={() => setActiveValue(value)}
              >
                <Icon className="size-4" weight="Filled" aria-hidden={true} />
                {item}
              </button>
            );
          })}
        </div>
      </div>
      <div className="prose max-w-none p-4 text-[0.9375rem]">
        {activePanel}
      </div>
    </div>
  );
}

export function Tab({ children, className, icon: _icon, value, ...props }: TabProps) {
  return (
    <div className={cn('prose-no-margin', className)} data-tab-value={value} {...props}>
      {children}
    </div>
  );
}
