'use client';

import { useMemo } from 'react';
import { DiagramFigure } from '../diagram-figure';
import { useTimeline } from '../use-timeline';
import { RollingUpdateSvg } from './draw';
import { BEATS, layout, sceneFrame, settled, STEP_LABELS, STEP_STATES, stepFrame, type StepState } from './scene';

const LABEL =
  'Users send requests through the proxy to the current container. Coolify builds the new version, starts a new container on the same server and waits for its health check to pass. ' +
  'The proxy then sends requests to the new container too, and after the drain time Coolify stops the old container and removes it.';

/**
 * The rolling update animation, for the top of "How a rolling update works":
 *
 *   <RollingUpdateScene />
 */
export function RollingUpdateScene() {
  const layouts = useMemo(() => ({ wide: layout('wide'), narrow: layout('narrow') }), []);
  const timeline = useTimeline(BEATS, settled, 'drain');
  const { t } = timeline;

  return (
    <DiagramFigure
      figureRef={timeline.ref}
      label={LABEL}
      beats={BEATS}
      index={timeline.index}
      progress={timeline.progress}
      onPick={timeline.jump}
      draw={(kind) => <RollingUpdateSvg L={layouts[kind]} f={sceneFrame(t)} className="block h-auto w-full" />}
    />
  );
}

const MINI = layout('mini');

/**
 * The state after one step of a rolling update, drawn small and still:
 *
 *   <RollingUpdateStep state="unhealthy" />
 */
export function RollingUpdateStep({ state }: { state: StepState }) {
  if (!STEP_STATES.includes(state)) throw new Error(`<RollingUpdateStep state="${state}">: no such state`);
  return (
    <figure className="not-prose my-4 grid items-center gap-x-6 gap-y-3 rounded-xl border border-fd-border bg-fd-background p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_6px_18px_-12px_rgb(0_0_0/0.12)] sm:grid-cols-[420px_1fr] sm:p-5 dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_10px_24px_-16px_rgb(0_0_0/0.7)]">
      <RollingUpdateSvg L={MINI} f={stepFrame(state)} className="block h-auto w-full max-w-[420px]" />
      <figcaption className="border-fd-border text-[17px] leading-relaxed text-fd-foreground/90 sm:border-l sm:pl-6">{STEP_LABELS[state]}</figcaption>
    </figure>
  );
}
