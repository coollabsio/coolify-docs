import { useId } from 'react';
import type { IconComponent } from 'reicon-react';
import { Box2 } from 'reicon-react/icons/Box2';
import { Profile2user2 } from 'reicon-react/icons/Profile2user2';
import { ShieldNetwork } from 'reicon-react/icons/ShieldNetwork';
import type { Beam, Box, ContainerState, Frame, Layout, WireId } from './scene';
import { wire } from './scene';

// Theme colors, so the drawing follows light and dark mode. The --cd-* tokens are
// Coolify's status colors (src/styles/app.css, `.cool-diagram`).
const FG = 'var(--color-fd-foreground)';
const MUTED = 'var(--color-fd-muted-foreground)';
const BORDER = 'var(--color-fd-border)';
const PAGE = 'var(--color-fd-background)';
const FILL = 'var(--color-fd-muted)';
const SUCCESS = 'var(--cd-success)';
const WARNING = 'var(--cd-warning)';
const ERROR = 'var(--cd-error)';
// The Coolify Cloud button's gradient runs from #8b73ff to #5c38d5.
const CLOUD = '#7a5cf0';
const CLOUD_LIGHT = '#9a86ff';
// Requests to the current container are blue.
const BLUE = '#3b82f6';
const BLUE_LIGHT = '#60a5fa';

const STATUS: Record<ContainerState, { label: string; color: string }> = {
  building: { label: 'Building', color: WARNING },
  running: { label: 'Running', color: SUCCESS },
  starting: { label: 'Starting', color: WARNING },
  healthy: { label: 'Healthy', color: SUCCESS },
  unhealthy: { label: 'Unhealthy', color: ERROR },
  stopping: { label: 'Stopping', color: WARNING },
  removed: { label: 'Removed', color: MUTED },
  stopped: { label: 'Stopped', color: MUTED },
};

type Ids = { glow: string; shadow: string };
type Sizes = { tile: number; icon: number; title: number; sub: number; pad: number; rx: number; port: number };
const sizesOf = (L: Layout): Sizes =>
  L.mini
    ? { tile: 30, icon: 17, title: 12.5, sub: 10.5, pad: 10, rx: 11, port: 3 }
    : L.narrow
      ? { tile: 30, icon: 17, title: 11.5, sub: 10.5, pad: 11, rx: 12, port: 3.5 }
      : { tile: 38, icon: 21, title: 14, sub: 12, pad: 13, rx: 14, port: 4 };

/** A node: a rounded card with an icon tile, a title and one line under it. */
function Node({ b, z, icon: Icon, title, sub, subSize, stroke = BORDER, strokeWidth = 1, dashed = false, ids }: {
  b: Box; z: Sizes; icon: IconComponent; title: React.ReactNode; sub?: React.ReactNode; subSize?: number; stroke?: string; strokeWidth?: number; dashed?: boolean; ids: Ids;
}) {
  const tx = b.x + z.pad;
  const ty = b.y + (b.h - z.tile) / 2;
  const textX = tx + z.tile + (z.pad - 1);
  const cy = b.y + b.h / 2;
  const subFs = subSize ?? z.sub;
  return (
    <g>
      <rect
        x={b.x + 0.5}
        y={b.y + 0.5}
        width={b.w - 1}
        height={b.h - 1}
        rx={z.rx}
        fill={dashed ? 'none' : PAGE}
        stroke={dashed ? MUTED : stroke}
        strokeOpacity={dashed ? 0.45 : 1}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '3 4' : undefined}
        filter={dashed ? undefined : `url(#${ids.shadow})`}
      />
      <rect x={tx} y={ty} width={z.tile} height={z.tile} rx={z.tile * 0.28} fill={FILL} stroke={BORDER} />
      <Icon x={tx + (z.tile - z.icon) / 2} y={ty + (z.tile - z.icon) / 2} size={z.icon} weight="Filled" color={MUTED} />
      <text x={textX} y={sub ? cy - subFs * 0.25 : cy + z.title * 0.35} fontSize={z.title} fontWeight={600} fill={dashed ? MUTED : FG}>
        {title}
      </text>
      {sub ? (
        <text x={textX} y={cy + subFs * 1.15} fontSize={subFs} fill={MUTED}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/** A status line: Coolify's dot and word. */
function Status({ state, z }: { state: ContainerState; z: Sizes }) {
  const { label, color } = STATUS[state];
  return (
    <>
      <tspan fill={color} fontSize={z.sub * 1.05}>
        ●
      </tspan>
      <tspan dx={z.sub * 0.35} fill={color === MUTED ? MUTED : FG}>
        {label}
      </tspan>
    </>
  );
}

/** A port: the small circle where a wire meets a node. */
const Port = ({ x, y, color = MUTED, r }: { x: number; y: number; color?: string; r: number }) => (
  <circle cx={x} cy={y} r={r} fill={PAGE} stroke={color} strokeWidth={1.5} />
);

type Ends = { x1: number; y1: number; x2: number; y2: number };

/** The point at `u` (0 to 1) along a wire's S-curve. */
function pointOn({ x1, y1, x2, y2 }: Ends, u: number) {
  const k = (x2 - x1) * 0.5;
  const v = 1 - u;
  const bx = (a: number, b: number, c: number, d: number) => v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
  return { x: bx(x1, x1 + k, x2 - k, x2), y: bx(y1, y1, y2, y2) };
}

/**
 * A beam of light flowing along a wire: overlapping segments that all end at the
 * head, so it is brightest at the head and fades along its tail, with a blurred
 * copy under it for the glow.
 */
function BeamPath({ ends, head, color, ids, width }: { ends: Ends; head: number; color: string; ids: Ids; width: number }) {
  const d = wire(ends.x1, ends.y1, ends.x2, ends.y2);
  const h = head * 100;
  const tail = 38;
  const layers = [1, 2, 3, 4, 5, 6].map((k) => {
    const a = Math.max(0, h - (tail * k) / 6);
    const b = Math.min(100, h);
    return b > a ? { a, len: b - a } : null;
  });
  const tip = head <= 1 ? pointOn(ends, head) : null;
  const seg = (s: { a: number; len: number }, i: number, w: number, o: number) => (
    <path key={i} d={d} pathLength={100} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${s.len} 1000`} strokeDashoffset={-s.a} opacity={o} />
  );
  return (
    <g>
      <g filter={`url(#${ids.glow})`}>{layers.map((s, i) => (s ? seg(s, i, width * 3, 0.22) : null))}</g>
      {layers.map((s, i) => (s ? seg(s, i, width, 0.24) : null))}
      {tip ? <circle cx={tip.x} cy={tip.y} r={width * 0.9} fill={color} /> : null}
    </g>
  );
}

/** One frame of the rolling update scene, drawn on one layout. */
export function RollingUpdateSvg({ L, f, className }: { L: Layout; f: Frame; className?: string }) {
  const id = useId().replace(/:/g, '');
  const ids: Ids = { glow: `ru-glow-${id}`, shadow: `ru-shadow-${id}` };
  const z = sizesOf(L);
  const { users, proxy, cur, next, mini, narrow } = L;
  const toCur = f.outage || f.cur === 'removed' ? 0 : 1 - Math.max(0, (f.share - 0.5) * 2);
  const toNew = f.outage ? 0 : Math.min(1, f.share * 2);
  const live = f.next === 'healthy' && f.share > 0;

  const ends: Record<WireId, Ends> = {
    users: { x1: users.x + users.w, y1: users.y + users.h / 2, x2: proxy.x, y2: proxy.y + proxy.h / 2 },
    cur: { x1: proxy.x + proxy.w, y1: proxy.y + proxy.h / 2, x2: cur.x, y2: cur.y + cur.h / 2 },
    new: { x1: proxy.x + proxy.w, y1: proxy.y + proxy.h / 2, x2: next.x, y2: next.y + next.h / 2 },
  };
  const path = (w: WireId) => wire(ends[w].x1, ends[w].y1, ends[w].x2, ends[w].y2);
  const beamColor = (b: Beam) => (b.to === 'new' ? CLOUD_LIGHT : BLUE_LIGHT);
  const beamWidth = 2;

  return (
    <svg viewBox={`-6 -6 ${L.W + 12} ${L.H + 12}`} className={`cool-diagram ${className ?? ''}`} aria-hidden={true}>
      <defs>
        <filter id={ids.glow} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation={mini ? 2 : 2.5} />
        </filter>
        <filter id={ids.shadow} x="-10%" y="-20%" width="120%" height="150%">
          <feDropShadow dx={0} dy={mini ? 1 : 2} stdDeviation={mini ? 1.5 : 3} floodColor="#000" floodOpacity={0.08} />
        </filter>
      </defs>

      {/* Wires: faint lines, a little brighter on the routes the proxy uses. */}
      {(['users', 'cur', 'new'] as const).map((w) => {
        const use = f.outage ? 0 : w === 'users' ? 1 : w === 'cur' ? toCur : toNew;
        return (
          <g key={w}>
            <path d={path(w)} fill="none" stroke={f.outage ? ERROR : MUTED} strokeOpacity={f.outage ? 0.7 : 0.3} strokeWidth={1.5} strokeDasharray={f.outage ? '3 4' : undefined} />
            {use > 0 ? <path d={path(w)} fill="none" stroke={w === 'new' ? CLOUD : w === 'cur' ? BLUE : MUTED} strokeOpacity={w === 'cur' || w === 'new' ? 0.55 : 0.45} strokeWidth={1.5} opacity={use} /> : null}
          </g>
        );
      })}

      {/* Requests: beams of light flowing through the proxy to a container. */}
      {f.outage ? null : f.beams.map((b, i) => <BeamPath key={i} ends={ends[b.wire]} head={b.head} color={beamColor(b)} ids={ids} width={beamWidth} />)}

      {/* Users: an icon tile on phones and in step diagrams. */}
      {narrow || mini ? (
        <g>
          <rect x={users.x + 0.5} y={users.y + 0.5} width={users.w - 1} height={users.h - 1} rx={users.w * 0.3} fill={PAGE} stroke={BORDER} filter={`url(#${ids.shadow})`} />
          <Profile2user2 x={users.x + users.w * 0.2} y={users.y + users.h * 0.2} size={users.w * 0.6} weight="Filled" color={MUTED} />
        </g>
      ) : (
        <Node b={users} z={z} icon={Profile2user2} title="Users" ids={ids} />
      )}

      {/* The proxy. */}
      <Node b={proxy} z={z} icon={ShieldNetwork} title="Proxy" sub="Traefik" stroke={f.outage ? ERROR : BORDER} ids={ids} />

      {/* The containers. */}
      {[
        { b: cur, state: f.cur, title: 'Current container', fade: 1 - f.curOut * 0.5, hot: false },
        { b: next, state: f.next, title: 'New container', fade: f.next === 'building' ? 1 : 0.3 + 0.7 * f.nextIn, hot: live },
      ].map(({ b, state, title, fade, hot }) => (
        <g key={title} opacity={fade}>
          <Node
            b={b}
            z={z}
            icon={Box2}
            title={title}
            sub={<Status state={state} z={z} />}
            dashed={state === 'removed' || state === 'stopped' || state === 'building'}
            stroke={hot ? CLOUD : state === 'unhealthy' ? ERROR : BORDER}
            strokeWidth={hot || state === 'unhealthy' ? 1.5 : 1}
            ids={ids}
          />
        </g>
      ))}

      {/* Ports, over the wires' ends. */}
      <Port x={ends.users.x1} y={ends.users.y1} r={z.port} color={f.outage ? ERROR : MUTED} />
      <Port x={ends.users.x2} y={ends.users.y2} r={z.port} color={f.outage ? ERROR : MUTED} />
      <Port x={ends.cur.x1} y={ends.cur.y1} r={z.port} color={f.outage ? ERROR : toNew > 0 ? CLOUD : toCur > 0 ? BLUE : MUTED} />
      <Port x={ends.cur.x2} y={ends.cur.y2} r={z.port} color={toCur > 0 ? BLUE : MUTED} />
      <Port x={ends.new.x2} y={ends.new.y2} r={z.port} color={toNew > 0 ? CLOUD : MUTED} />
      {f.outage ? <path d={`M${ends.cur.x1 + 10} ${ends.cur.y1 - 4} l8 8 m0 -8 l-8 8`} stroke={ERROR} strokeWidth={2} strokeLinecap="round" /> : null}
    </svg>
  );
}
