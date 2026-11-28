// The rolling update scene as a small node graph, left to right: Users, the
// proxy with its two routes, and the current and new containers of the
// `storefront` application. Everything here is a pure function of time or state,
// so the same frame renders at build time and in the browser.
//
// The sequence follows ApplicationDeploymentJob::rolling_update() in Coolify
// v4.7.9: start the new container, wait for its health check, wait the rolling
// update drain time (5 seconds by default) for the proxy to route to it, then
// stop the old container gracefully.
import { timeline, type Beat } from '../use-timeline';

export const BEATS = [
  {
    id: 'before',
    title: 'Building',
    body: 'Coolify builds the new version of the application. The current container keeps serving every request.',
    dur: 3,
  },
  {
    id: 'start',
    title: 'Start new container',
    body: 'Coolify starts a new container on the same server. Requests still go to the current container.',
    dur: 3,
  },
  {
    id: 'health',
    title: 'Health check',
    body: "Coolify waits for the new container's health check to pass. If it fails, the current container keeps serving.",
    dur: 4,
  },
  {
    id: 'drain',
    title: 'Drain time',
    body: 'The proxy starts sending requests to the new container. Coolify waits for the drain time, 5 seconds by default.',
    dur: 4,
  },
  {
    id: 'stop',
    title: 'Stop old container',
    body: 'The current container gets a stop signal, finishes its requests within the stop grace period, and is removed.',
    dur: 5,
  },
] as const satisfies readonly Beat[];

export type BeatId = (typeof BEATS)[number]['id'];
export const { start: START, end: END } = timeline<BeatId>(BEATS);
const S = START;

// When things happen, in seconds.
const NEW_IN = S.start + 0.3;
const HEALTHY = S.health + 3;
const ROUTE_NEW = S.drain + 0.2;
const STOPPING = S.stop + 0.2;
const REMOVED = S.stop + 2.6;
const DONE = S.stop + 3.4;

/** A still time late in each beat: prerendered, shown with reduced motion and when paused. */
export const settled = (id: BeatId) =>
  id === 'before'
    ? S.before + 1.5
    : id === 'health'
      ? S.health + 2.2
      : id === 'stop'
        ? DONE + 0.6
        : S[id] + BEATS.find((b) => b.id === id)!.dur * 0.85;

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => {
  const k = clamp(x);
  return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
};

export type Box = { x: number; y: number; w: number; h: number };
export type Kind = 'wide' | 'narrow' | 'mini';

// Node positions for each drawing: Users and the proxy on one line, the two
// containers above and below it on the right.
const SIZES = {
  wide: { W: 760, H: 240, users: { x: 0, y: 88, w: 130, h: 64 }, proxy: { x: 250, y: 88, w: 150, h: 64 }, cur: { x: 550, y: 20, w: 210, h: 64 }, next: { x: 550, y: 156, w: 210, h: 64 } },
  narrow: { W: 380, H: 230, users: { x: 0, y: 95, w: 40, h: 40 }, proxy: { x: 76, y: 89, w: 100, h: 52 }, cur: { x: 208, y: 20, w: 172, h: 56 }, next: { x: 208, y: 154, w: 172, h: 56 } },
  mini: { W: 420, H: 150, users: { x: 0, y: 59, w: 32, h: 32 }, proxy: { x: 64, y: 52, w: 116, h: 46 }, cur: { x: 228, y: 8, w: 192, h: 56 }, next: { x: 228, y: 86, w: 192, h: 56 } },
} as const;

export function layout(kind: Kind) {
  const z = SIZES[kind];
  return {
    kind,
    mini: kind === 'mini',
    narrow: kind === 'narrow',
    W: z.W,
    H: z.H,
    users: { ...z.users } as Box,
    proxy: { ...z.proxy } as Box,
    cur: { ...z.cur } as Box,
    next: { ...z.next } as Box,
  };
}
export type Layout = ReturnType<typeof layout>;

/** A wire between two ports, as a horizontal S-curve. */
export function wire(x1: number, y1: number, x2: number, y2: number) {
  const k = (x2 - x1) * 0.5;
  return `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`;
}

export type ContainerState = 'building' | 'running' | 'starting' | 'healthy' | 'unhealthy' | 'stopping' | 'removed' | 'stopped';
export type WireId = 'users' | 'cur' | 'new';
/** A beam of light on a wire: `head` runs from 0 (start) to 1 (end), and past 1 while its tail drains. */
export type Beam = { wire: WireId; head: number; to: 'cur' | 'new' };

/** Everything that changes in the drawing, at one moment. */
export type Frame = {
  cur: ContainerState;
  next: ContainerState;
  /** How far the new container has appeared, 0 to 1. */
  nextIn: number;
  /** How far the old container has faded out, 0 to 1. */
  curOut: number;
  /** Share of requests the proxy sends to the new container, 0 to 1. */
  share: number;
  /** No container can serve: requests fail. */
  outage: boolean;
  beams: Beam[];
};

/** Share of new requests the proxy sends to the new container at `t`, 0 to 1. */
const shareAt = (t: number) => (t >= STOPPING ? 0.5 + 0.5 * ease((t - STOPPING) / 0.4) : 0.5 * ease((t - ROUTE_NEW) / 1.2));

// Each request is a beam: from Users to the proxy, a short pause inside it, then
// along the wire to the container the proxy picks at that moment.
const HOP = 0.6;
const THROUGH = 0.1;
const OUT = 0.7;
const TAIL = 0.45;
const AT_PROXY = HOP + THROUGH;
const REQUESTS = (() => {
  let seed = 11;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const list: { t: number; to: 'cur' | 'new' }[] = [];
  for (let t = -3; t < END; t += 0.62) {
    const share = shareAt(t + AT_PROXY);
    list.push({ t, to: share >= 1 || (share > 0 && rnd() < share) ? 'new' : 'cur' });
  }
  return list;
})();

function beamsAt(t: number): Beam[] {
  const beams: Beam[] = [];
  const on = (wire: WireId, start: number, dur: number, to: 'cur' | 'new') => {
    const head = (t - start) / dur;
    if (head > 0 && head < 1 + TAIL) beams.push({ wire, head, to });
  };
  for (const q of REQUESTS) {
    on('users', q.t, HOP, q.to);
    on(q.to, q.t + AT_PROXY, OUT, q.to);
  }
  return beams;
}

/** The animation at `t` seconds. */
export function sceneFrame(t: number): Frame {
  return {
    cur: t >= REMOVED ? 'removed' : t >= STOPPING ? 'stopping' : 'running',
    next: t < NEW_IN ? 'building' : t >= HEALTHY ? 'healthy' : 'starting',
    nextIn: ease((t - NEW_IN) / 0.5),
    curOut: ease((t - REMOVED) / 0.6),
    share: shareAt(t),
    outage: false,
    beams: beamsAt(t),
  };
}

// The state after each step of "How a rolling update works", and the contrast case.
export const STEP_STATES = ['start', 'health', 'unhealthy', 'drain', 'stop', 'stop-first'] as const;
export type StepState = (typeof STEP_STATES)[number];
export const STEP_LABELS: Record<StepState, string> = {
  start: 'The new container starts on the same server. The current one still serves every request.',
  health: "The new container's health check passes.",
  unhealthy: 'The health check fails. Coolify removes the new container, and the current one keeps serving.',
  drain: 'Both containers serve while the proxy moves requests to the new one.',
  stop: 'The old container is removed. The new one serves every request.',
  'stop-first': 'Without a rolling update, the current container stops first. Requests fail until the new one starts.',
};

/** The still for a step diagram: a beam sits on every wire that carries requests. */
export function stepFrame(state: StepState): Frame {
  const flowing = (to: 'cur' | 'new', ...wires: WireId[]): Beam[] => wires.map((w) => ({ wire: w, head: 0.75, to }));
  const base: Frame = { cur: 'running', next: 'starting', nextIn: 1, curOut: 0, share: 0, outage: false, beams: flowing('cur', 'users', 'cur') };
  switch (state) {
    case 'start':
      return base;
    case 'health':
      return { ...base, next: 'healthy' };
    case 'unhealthy':
      return { ...base, next: 'unhealthy' };
    case 'drain':
      return { ...base, next: 'healthy', share: 0.5, beams: [...flowing('cur', 'users', 'cur'), ...flowing('new', 'new')] };
    case 'stop':
      return { ...base, cur: 'removed', curOut: 1, next: 'healthy', share: 1, beams: flowing('new', 'users', 'new') };
    case 'stop-first':
      return { ...base, cur: 'stopped', curOut: 1, outage: true, beams: [] };
  }
}
