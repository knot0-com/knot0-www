// Input: Remotion useCurrentFrame/interpolate/spring/useVideoConfig, theme colors, Terminal component
// Output: Beats 3-4 — metrics table with pod status row, SLO progress bar, glow effects
// Position: Third+fourth beat in SelfAssemblyDemo composition

import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, BORDER, TEXT, TEXT_DIM, TEXT_MUTED, GREEN, RED, AMBER, CYAN, typewriter } from '../theme';

interface MetricsDashboardProps {
  startBreakAtFrame: number;
}

// ---------------------------------------------------------------------------
// SLO progress bar — FullDemo pattern: [████████████████░░░░] 42ms
// ---------------------------------------------------------------------------

function SLOBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const totalBlocks = 20;
  const filled = Math.round((value / max) * totalBlocks);
  const empty = totalBlocks - filled;
  const bar = '█'.repeat(Math.min(totalBlocks, filled)) + '░'.repeat(Math.max(0, empty));

  return (
    <span>
      <span style={{ color: TEXT_MUTED }}>{label} </span>
      <span style={{ color: TEXT_MUTED }}>[</span>
      <span style={{ color }}>{bar}</span>
      <span style={{ color: TEXT_MUTED }}>]</span>
      <span style={{ color, fontWeight: 700 }}> {value}ms</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pulsing status dot — FullDemo pattern: colored dot with glow + pulse
// ---------------------------------------------------------------------------

function StatusDot({ color, pulse, frame }: { color: string; pulse: boolean; frame: number }) {
  const pulseOpacity = pulse
    ? interpolate(frame % 20, [0, 10, 20], [1, 0.4, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <span
      style={{
        color,
        opacity: pulseOpacity,
        textShadow: `0 0 6px ${color}`,
        fontSize: 14,
      }}
    >
      ●
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pod status row — FullDemo IncidentVisual pattern
// ---------------------------------------------------------------------------

interface Pod {
  name: string;
  status: 'Running' | 'CrashLoop' | 'Recovering';
  usage: number;
}

function PodRow({
  pods,
  frame,
  entrance,
}: {
  pods: Pod[];
  frame: number;
  entrance: number;
}) {
  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid ${BORDER}`,
        opacity: entrance,
      }}
    >
      <div style={{ color: TEXT_DIM, marginBottom: 8, fontSize: 12 }}>PODS</div>
      {pods.map((pod, i) => {
        const statusColor =
          pod.status === 'Running' ? GREEN :
          pod.status === 'CrashLoop' ? RED : AMBER;

        const totalBlocks = 10;
        const filled = Math.round((pod.usage / 100) * totalBlocks);
        const empty = totalBlocks - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.9 }}>
            <span style={{ color: TEXT, width: 200, display: 'inline-block' }}>
              {'  '}{pod.name}
            </span>
            <StatusDot color={statusColor} pulse={pod.status !== 'Running'} frame={frame} />
            <span
              style={{
                color: statusColor,
                width: 90,
                display: 'inline-block',
                fontWeight: pod.status !== 'Running' ? 700 : 400,
              }}
            >
              {pod.status}
            </span>
            <span>
              <span style={{ color: TEXT_MUTED }}>[</span>
              <span style={{ color: statusColor }}>{bar}</span>
              <span style={{ color: TEXT_MUTED }}>]</span>
              <span style={{ color: TEXT_DIM }}> {pod.usage}%</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  startBreakAtFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isBreaching = frame >= startBreakAtFrame;

  // Spring entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.95, 1]);
  const entranceOpacity = entrance;

  // Pod section entrance (delayed slightly)
  const podEntrance = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 200 },
  });

  // Interpolated values for breach transition
  const p99 = interpolate(frame, [startBreakAtFrame, startBreakAtFrame + 30], [42, 340], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const hitRate = interpolate(frame, [startBreakAtFrame, startBreakAtFrame + 30], [94, 12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const breachOpacity = interpolate(frame, [startBreakAtFrame, startBreakAtFrame + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pod usage animates during breach
  const cacheUsage = interpolate(
    frame,
    [startBreakAtFrame, startBreakAtFrame + 20],
    [31, 89],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Trigger evolution text after breach stabilizes
  const triggerText = '→ triggering evolution cycle';
  const triggerStart = startBreakAtFrame + 40;
  const visibleTrigger = frame >= triggerStart ? typewriter(frame - triggerStart, triggerText, 2) : '';

  // Smooth blinking cursor
  const cursorOpacity = interpolate(
    frame % 16,
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Live indicator dot
  const livePulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 0.3, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const check = (
    <span style={{ color: GREEN, textShadow: `0 0 4px ${GREEN}` }}>{'\u2713'}</span>
  );
  const cross = (
    <span style={{ color: RED, textShadow: `0 0 4px ${RED}` }}>{'\u2717'}</span>
  );

  // Pods state
  const greenPods: Pod[] = [
    { name: 'api-gateway-7d8f9', status: 'Running', usage: 42 },
    { name: 'cache-layer-3a2b1', status: 'Running', usage: 31 },
    { name: 'health-monitor-9c4e', status: 'Running', usage: 12 },
  ];

  const breachPods: Pod[] = [
    { name: 'api-gateway-7d8f9', status: 'Running', usage: 42 },
    {
      name: 'cache-layer-3a2b1',
      status: breachOpacity > 0.5 ? 'CrashLoop' : 'Running',
      usage: Math.round(cacheUsage),
    },
    { name: 'health-monitor-9c4e', status: 'Running', usage: 12 },
  ];

  if (!isBreaching) {
    // GREEN state
    const p99Display = 42;
    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          padding: 60,
          opacity: entranceOpacity,
          transform: `scale(${scale})`,
        }}
      >
        <Terminal title="knot0 dashboard" style={{ width: 1000 }}>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            {/* Live indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: TEXT_DIM }}>
                {'ACTOR            STATUS   P99     RPS      DETAIL'}
              </span>
              <span style={{ color: GREEN, fontSize: 12 }}>
                <span style={{ opacity: livePulse, textShadow: `0 0 4px ${GREEN}` }}>●</span>
                {' live'}
              </span>
            </div>

            <div style={{ color: TEXT }}>
              {'api-gateway      '}{check}{' ok     42ms    1.2k     cache hit: 94%'}
            </div>
            <div style={{ color: TEXT }}>
              {'cache-layer      '}{check}{' ok     3ms     1.1k     evictions: 3/min'}
            </div>
            <div style={{ color: TEXT }}>
              {'health-monitor   '}{check}{' ok     —       2/s      all checks passing'}
            </div>
            <div style={{ color: TEXT }}>
              {'load-balancer    '}{check}{' ok     1ms     1.2k     backends: 4'}
            </div>

            <div style={{ height: 12 }} />

            {/* SLO with progress bar */}
            <SLOBar value={p99Display} max={200} color={GREEN} label="SLO: p99 < 100ms" />
            {'  '}{check}

            {/* Pod status row */}
            <PodRow pods={greenPods} frame={frame} entrance={podEntrance} />
          </div>
        </Terminal>
      </AbsoluteFill>
    );
  }

  // RED state — breach cascade
  const p99Display = Math.round(p99);
  const hitDisplay = Math.round(hitRate);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: 60,
        opacity: entranceOpacity,
        transform: `scale(${scale})`,
      }}
    >
      <Terminal title="knot0 dashboard" style={{ width: 1000 }}>
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          {/* Live indicator — now red */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: TEXT_DIM }}>
              {'ACTOR            STATUS   P99     RPS      DETAIL'}
            </span>
            <span style={{ color: RED, fontSize: 12 }}>
              <span style={{ opacity: livePulse, textShadow: `0 0 6px ${RED}` }}>●</span>
              {' ALERT'}
            </span>
          </div>

          {/* Cache degrades first */}
          <div style={{ color: breachOpacity > 0.3 ? RED : TEXT }}>
            {'cache-layer      '}
            <span style={{ color: AMBER }}>{'⚠'}</span>
            {' degraded   hit: 94% → '}
            <span style={{ color: RED, fontWeight: 700, textShadow: `0 0 4px ${RED}` }}>{hitDisplay}%</span>
            {'   pool exhausted'}
          </div>

          {/* API gateway breaches */}
          <div style={{ color: TEXT, opacity: breachOpacity }}>
            {'api-gateway      '}{cross}{' breach     p99: 42ms → '}
            <span style={{ color: RED, fontWeight: 700, textShadow: `0 0 4px ${RED}` }}>{p99Display}ms</span>
          </div>

          <div style={{ height: 12 }} />

          {/* SLO breach with progress bar */}
          <SLOBar value={p99Display} max={400} color={RED} label="SLO: p99 < 100ms" />
          {'  '}{cross}
          <span style={{ color: RED, fontWeight: 700, textShadow: `0 0 8px ${RED}` }}>{' BREACH'}</span>

          <div style={{ height: 12 }} />

          {/* Detection + trigger */}
          <div style={{ color: TEXT, opacity: Math.min(1, breachOpacity * 1.5) }}>
            {'health-monitor   detected: cache degradation'}
          </div>
          {visibleTrigger && (
            <div style={{ color: AMBER }}>
              {'                 '}{visibleTrigger}
              <span style={{ opacity: cursorOpacity, color: AMBER }}>{'\u258C'}</span>
            </div>
          )}

          {/* Pod status row — cache-layer now CrashLoop */}
          <PodRow pods={breachPods} frame={frame} entrance={1} />
        </div>
      </Terminal>
    </AbsoluteFill>
  );
};
