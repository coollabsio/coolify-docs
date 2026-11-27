'use client';

import type React from 'react';
import type { Beat } from './use-timeline';

/** The gradient of the header's Coolify Cloud button, used for everything that is active. */
export const CLOUD_GRADIENT = 'linear-gradient(135deg, #8b73ff 0%, #6f50e8 48%, #5c38d5 100%)';

type DiagramFigureProps<Id extends string> = {
  /** The whole process in two or three sentences, for screen readers. */
  label: string;
  beats: readonly Beat<Id>[];
  index: number;
  progress: number;
  onPick: (id: Id) => void;
  /** Draws the scene in a layout: `wide`, or `narrow` below 520px of figure width. */
  draw: (kind: 'wide' | 'narrow') => React.ReactNode;
  figureRef: React.Ref<HTMLElement>;
};

/**
 * The frame around an animated diagram: the drawing, a timeline of the steps, and
 * the current step's caption.
 */
export function DiagramFigure<Id extends string>({
  label,
  beats,
  index,
  progress,
  onPick,
  draw,
  figureRef,
}: DiagramFigureProps<Id>) {
  const current = beats[index];
  return (
    <figure
      ref={figureRef}
      className="not-prose @container my-6 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)] dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_12px_32px_-16px_rgb(0_0_0/0.7)]"
    >
      <div role="img" aria-label={label} className="px-3 py-7 sm:px-8 sm:py-9">
        <div className="mx-auto max-w-[760px] @max-[519px]:hidden">{draw('wide')}</div>
        <div className="mx-auto hidden max-w-[400px] @max-[519px]:block">{draw('narrow')}</div>
      </div>

      <div className="border-t border-fd-border px-4 pb-5 pt-4 sm:px-6">
        <ol className="m-0 flex list-none gap-1.5 p-0 sm:gap-2" aria-label="Steps">
          {beats.map((b, i) => {
            const now = i === index;
            const fill = i < index ? 1 : now ? progress : 0;
            return (
              <li key={b.id} className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onPick(b.id)}
                  aria-current={now ? 'step' : undefined}
                  className="group flex w-full flex-col gap-2 rounded-md pb-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                >
                  <span className="relative block h-1.5 w-full overflow-hidden rounded-full bg-fd-muted group-hover:bg-fd-accent">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${fill * 100}%`, background: CLOUD_GRADIENT, boxShadow: now ? '0 0 10px rgb(111 80 232 / 0.55)' : undefined }}
                    />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className={`shrink-0 font-mono text-[13px] font-semibold tabular-nums sm:text-sm ${now || i < index ? 'text-[#7a5cf0] dark:text-[#9a86ff]' : 'text-fd-muted-foreground'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-xs leading-snug sm:text-[13px] @max-[519px]:hidden ${now ? 'font-semibold text-fd-foreground' : 'text-fd-muted-foreground group-hover:text-fd-foreground'}`}
                    >
                      {b.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex items-start gap-3">
          <span
            aria-hidden={true}
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_4px_10px_rgb(94_62_216/0.25)]"
            style={{ background: CLOUD_GRADIENT }}
          >
            {index + 1}
          </span>
          <p className="m-0 min-w-0 text-sm leading-relaxed text-fd-muted-foreground">
            <span className="block font-semibold text-fd-foreground">{current.title}</span>
            {current.body}
          </p>
        </div>
      </div>
    </figure>
  );
}
