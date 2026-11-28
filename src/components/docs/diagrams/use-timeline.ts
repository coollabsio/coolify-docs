'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** One beat of an animated diagram: a part of the process with a title and a caption. */
export type Beat<Id extends string = string> = {
  id: Id;
  /** Stepper label, one or two words. */
  title: string;
  /** Caption, one plain sentence. */
  body: string;
  /** Seconds the beat plays. */
  dur: number;
};

/** A pause after each beat, in seconds. */
const PAUSE = 0.4;

/** Start time of each beat and the loop length, from the beats' durations. */
export function timeline<Id extends string>(beats: readonly Beat<Id>[]) {
  const start = {} as Record<Id, number>;
  let at = 0;
  for (const beat of beats) {
    start[beat.id] = at;
    at += beat.dur + PAUSE;
  }
  return { start, end: at + PAUSE };
}

/** The beat playing at `t`. */
export function beatAt<Id extends string>(beats: readonly Beat<Id>[], start: Record<Id, number>, t: number): Id {
  let current = beats[0].id;
  for (const beat of beats) if (t >= start[beat.id]) current = beat.id;
  return current;
}

/**
 * Plays a diagram's timeline: loops while the figure is on screen and not paused,
 * and jumps to a beat when it is picked. With reduced motion it does not move.
 * `settled(id)` is a still time late in each beat, shown before JavaScript runs,
 * with reduced motion, and when a beat is picked while paused.
 */
export function useTimeline<Id extends string>(beats: readonly Beat<Id>[], settled: (id: Id) => number, first: Id) {
  const { start, end } = timeline(beats);
  const ref = useRef<HTMLElement | null>(null);
  const [t, setT] = useState(() => settled(first));
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const time = useRef(t);
  const begun = useRef(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    const el = ref.current;
    const observer = el ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting)) : null;
    if (el && observer) observer.observe(el);
    return () => {
      query.removeEventListener('change', onChange);
      observer?.disconnect();
    };
  }, []);

  const running = visible && !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    // The prerendered still stays until the figure is first seen; then the loop starts at 0.
    if (!begun.current) {
      begun.current = true;
      time.current = 0;
    }
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      if (last) time.current += Math.min(0.1, (now - last) / 1000);
      last = now;
      if (time.current >= end) time.current = 0;
      setT(time.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, end]);

  const jump = useCallback(
    (id: Id) => {
      begun.current = true;
      time.current = running ? start[id] : settled(id);
      setT(time.current);
    },
    // `start` and `settled` are fixed for a diagram.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [running],
  );

  const beat = beatAt(beats, start, t);
  const index = beats.findIndex((b) => b.id === beat);
  const next = index + 1 < beats.length ? start[beats[index + 1].id] : end;
  const progress = Math.min(1, Math.max(0, (t - start[beat]) / (next - start[beat])));

  return {
    ref,
    t,
    beat,
    index,
    progress,
    running,
    paused,
    reduced,
    togglePause: () => setPaused((p) => !p),
    jump,
  };
}
