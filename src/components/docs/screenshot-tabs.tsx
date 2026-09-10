'use client';

import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import type { ComponentProps } from 'react';

type TabsComponentProps = ComponentProps<typeof Tabs>;

interface ScreenshotTabsProps
  extends Omit<TabsComponentProps, 'items' | 'persist' | 'updateAnchor'> {
  items?: string[];
  persist?: boolean;
  updateAnchor?: boolean;
}

const DEFAULT_ITEMS = ['Dark Mode', 'Light Mode'];

export function ScreenshotTabs({
  items = DEFAULT_ITEMS,
  id,
  groupId,
  persist = true,
  updateAnchor = true,
  ...props
}: ScreenshotTabsProps) {
  return (
    <Tabs
      items={items}
      id={id}
      groupId={groupId ?? (typeof id === 'string' ? id : undefined)}
      persist={persist}
      updateAnchor={updateAnchor}
      {...props}
    />
  );
}

export { Tab as ScreenshotTab };
