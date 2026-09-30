'use client';

import type React from 'react';
import { Children, isValidElement, useEffect, useLayoutEffect, useState } from 'react';
import {
  Autobrightness2,
  LaptopCode,
  ServerCloud,
} from 'reicon-react';

const installationTabs = [
  {
    icon: Autobrightness2,
    id: 'install-automated',
    label: 'Automated',
    value: 'automated',
  },
  {
    icon: LaptopCode,
    id: 'install-manual',
    label: 'Manual',
    value: 'manual',
  },
  {
    icon: ServerCloud,
    id: 'install-raspberry-pi-os',
    label: 'Raspberry Pi OS',
    value: 'raspberry',
  },
] as const;

type InstallationTabValue = (typeof installationTabs)[number]['value'];
type InstallationTabElement = React.ReactElement<{
  children: React.ReactNode;
  id: string;
  value: InstallationTabValue;
}>;

function getInstallationTabFromHash(hash: string): InstallationTabValue | undefined {
  const cleanHash = hash.replace(/^#/, '');
  return installationTabs.find((tab) => tab.id === cleanHash)?.value;
}

function scrollToInstallTab(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - 144;
  window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
}

function scheduleInstallTabScroll(hash: string) {
  scrollToInstallTab(hash);
  requestAnimationFrame(() => scrollToInstallTab(hash));
}

export function SelfHostedInstallationTabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<InstallationTabValue>('automated');
  const [pendingScrollHash, setPendingScrollHash] = useState<string | null>(null);
  const panels = Children.toArray(children).filter(isValidElement) as InstallationTabElement[];

  function activateTab(value: InstallationTabValue, hash: string, shouldScroll = true) {
    setActiveTab(value);
    window.history.replaceState(null, '', hash);

    if (shouldScroll) {
      setPendingScrollHash(hash);
    }
  }

  useLayoutEffect(() => {
    if (!pendingScrollHash) return;

    scheduleInstallTabScroll(pendingScrollHash);
    setPendingScrollHash(null);
  }, [activeTab, pendingScrollHash]);

  useLayoutEffect(() => {
    const initialHash = window.location.hash;
    const value = getInstallationTabFromHash(initialHash);
    if (value) {
      setActiveTab(value);
      setPendingScrollHash(initialHash);
    }
  }, []);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash;
      const value = getInstallationTabFromHash(hash);
      if (value) {
        setActiveTab(value);
        setPendingScrollHash(hash);
      }
    }

    function handleMdxTabChange(event: Event) {
      const detail = (event as CustomEvent<{ hash?: string; id?: string; value?: string }>).detail;
      if (detail.id !== 'installation-method-tabs' || !detail.value) return;

      const tab = installationTabs.find((item) => item.value === detail.value);
      if (!tab) return;

      activateTab(tab.value, detail.hash ?? `#${tab.id}`);
    }

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('mdx-tabs:set-active', handleMdxTabChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('mdx-tabs:set-active', handleMdxTabChange);
    };
  }, []);

  const activePanel = panels.find((panel) => panel.props.value === activeTab);

  return (
    <div
      id="installation-method-tabs"
      data-installation-tabs
      className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-background/70"
    >
      <style>
        {`
          [data-installation-tabs] .installation-tab-active {
            border-color: transparent;
            color: white;
            background:
              linear-gradient(180deg, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.02) 44%, rgb(0 0 0 / 0.1)),
              linear-gradient(135deg, #8b73ff 0%, #6f50e8 48%, #5c38d5 100%);
            box-shadow:
              inset 0 1px 0 rgb(255 255 255 / 0.18),
              inset 0 -1px 0 rgb(0 0 0 / 0.16),
              0 5px 12px rgb(94 62 216 / 0.2);
          }

          .dark [data-installation-tabs] .installation-tab-active {
            background: linear-gradient(135deg, #8b73ff 0%, #6f50e8 48%, #5c38d5 100%);
            box-shadow: 0 5px 12px rgb(94 62 216 / 0.22);
          }
        `}
      </style>
      <div className="not-prose flex gap-1 overflow-x-auto border-b border-fd-border bg-fd-muted/30 px-3 py-2 text-sm font-semibold text-fd-foreground">
        {installationTabs.map((tab) => {
          const isActive = tab.value === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.value}
              type="button"
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'installation-tab-active'
                  : 'border-transparent text-fd-muted-foreground hover:bg-fd-muted/50 hover:text-fd-foreground'
              }`}
              onClick={() => activateTab(tab.value, `#${tab.id}`, false)}
            >
              <Icon className="size-4" weight="Filled" aria-hidden={true} />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="prose max-w-none bg-fd-background p-4 text-[0.9375rem] outline-none prose-no-margin">
        {activePanel}
      </div>
    </div>
  );
}

export function SelfHostedInstallationTab({ children, id }: { children: React.ReactNode; id: string; value: InstallationTabValue }) {
  return (
    <div id={id} className="scroll-mt-36">
      {children}
    </div>
  );
}
