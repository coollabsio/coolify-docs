'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'fumadocs-ui/provider/base';
import { Moon3, Sun } from 'reicon-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? Sun : Moon3;

  return (
    <button
      type="button"
      data-theme-toggle=""
      aria-label={`Switch to ${nextTheme} theme`}
      className="inline-flex size-9 items-center justify-center rounded-lg border bg-fd-secondary/50 text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      onClick={() => setTheme(nextTheme)}
    >
      <Icon className="size-4" weight="Filled" aria-hidden="true" />
    </button>
  );
}
