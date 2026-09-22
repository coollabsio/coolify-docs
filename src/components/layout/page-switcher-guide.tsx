'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const STORAGE_KEY = 'coolify:page-switcher-guide-dismissed';

type AnchorRect = { top: number; left: number; width: number; height: number };

function isVisible(el: Element | null | undefined): el is HTMLElement {
  if (!el) return false;
  const style = getComputedStyle(el);
  // Reject hidden elements — some are only visibility:hidden placeholders that
  // still report a layout box (e.g. the mobile sidebar-toggle placeholder).
  if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  // Must actually intersect the viewport — off-screen elements (e.g. the
  // hidden desktop sidebar pill on mobile) still report a non-zero size.
  return (
    rect.right > 0 &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight
  );
}

// Anchor to whichever section-navigation entry point is currently on screen:
// the desktop sidebar's "Home" pill, or the mobile top-bar sidebar toggle.
function findAnchor(): HTMLElement | null {
  const pill = document.getElementById('nd-sidebar')?.querySelector<HTMLElement>('[aria-haspopup]');
  if (isVisible(pill)) return pill;

  // Mobile: the visible sidebar toggle in the top bar opens the section nav.
  const selectors = ['[aria-label="Open Sidebar"]', '[data-mobile-sidebar-toggle]'];
  for (const selector of selectors) {
    for (const el of document.querySelectorAll<HTMLElement>(selector)) {
      if (isVisible(el)) return el;
    }
  }

  return null;
}

function readRect(el: HTMLElement): AnchorRect | null {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function PageSwitcherGuide() {
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [visible, setVisible] = useState(false);
  const anchorElRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Ignore storage failures (private mode, etc.) — just hide for this session.
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (isDismissed()) return;

    let frame = 0;
    let attempts = 0;

    const sync = () => {
      if (!isVisible(anchorElRef.current)) {
        anchorElRef.current = findAnchor();
      }
      const current = anchorElRef.current;
      if (current) {
        const rect = readRect(current);
        if (rect) {
          setAnchor(rect);
          setVisible(true);
          return;
        }
      }
      // Keep looking for a short while until the layout has hydrated.
      attempts += 1;
      if (attempts < 40) {
        frame = window.setTimeout(sync, 150);
      }
    };

    sync();

    const track = () => {
      // Re-resolve the anchor if the current one is gone (e.g. the viewport
      // crossed the mobile/desktop breakpoint and the entry point changed).
      if (!isVisible(anchorElRef.current)) {
        anchorElRef.current = findAnchor();
      }
      const el = anchorElRef.current;
      if (!el) return;
      const rect = readRect(el);
      if (rect) setAnchor(rect);
    };

    window.addEventListener('resize', track);
    window.addEventListener('scroll', track, true);

    return () => {
      window.clearTimeout(frame);
      window.removeEventListener('resize', track);
      window.removeEventListener('scroll', track, true);
    };
  }, []);

  // Dismiss as soon as the user discovers the switcher on their own.
  useEffect(() => {
    if (!visible) return;
    const el = anchorElRef.current;
    if (!el) return;
    const onClick = () => dismiss();
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [visible, dismiss]);

  if (!visible || !anchor) return null;

  const cardWidth = Math.min(300, window.innerWidth - 24);
  const gap = 14;
  const maxLeft = window.innerWidth - cardWidth - 12;
  const cardLeft = Math.max(12, Math.min(anchor.left, maxLeft));
  const cardTop = anchor.top + anchor.height + gap;
  const arrowLeft = Math.max(16, Math.min(anchor.left + anchor.width / 2 - cardLeft, cardWidth - 24));

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {/* Dim the rest of the UI, spotlighting the switcher through a tight
          rounded cutout so attention lands on it. */}
      <div
        aria-hidden="true"
        className="absolute rounded-[0.55rem] transition-[top,left] duration-150"
        style={{
          top: anchor.top - 2,
          left: anchor.left - 2,
          width: anchor.width + 4,
          height: anchor.height + 4,
          boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.55)',
        }}
      />
      {/* Soft purple glow behind the switcher */}
      <div
        aria-hidden="true"
        className="absolute rounded-[0.75rem] transition-[top,left] duration-150"
        style={{
          top: anchor.top - 3,
          left: anchor.left - 3,
          width: anchor.width + 6,
          height: anchor.height + 6,
          boxShadow: '0 0 10px 0 rgb(139 115 255 / 0.5)',
        }}
      />
      {/* Animated gradient shimmer border around the switcher */}
      <div
        data-page-switcher-shimmer
        aria-hidden="true"
        className="absolute rounded-[0.65rem] transition-[top,left] duration-150"
        style={{
          top: anchor.top - 3,
          left: anchor.left - 3,
          width: anchor.width + 6,
          height: anchor.height + 6,
        }}
      />

      {/* Coachmark card */}
      <div
        role="dialog"
        aria-label="Section switcher tip"
        className="pointer-events-auto absolute rounded-xl p-4 text-white shadow-2xl"
        style={{
          top: cardTop,
          left: cardLeft,
          width: cardWidth,
          backgroundImage: 'linear-gradient(135deg, #8b73ff 0%, #6f50e8 48%, #5c38d5 100%)',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-1.5 size-3 rotate-45"
          style={{ left: arrowLeft, backgroundColor: '#7a5ce9' }}
        />
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold">Explore other parts of the docs</p>
          <button
            type="button"
            aria-label="Dismiss tip"
            className="-me-1 -mt-1 rounded-md p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            onClick={dismiss}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-[0.8125rem] leading-5 text-white/85">
          Use this menu to navigate to other sections of the docs — Applications, Databases, Services, the CLI, and more.
        </p>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-[#5c38d5] shadow-sm transition-colors hover:bg-white/90"
            onClick={dismiss}
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
