// Input: Remotion useCurrentFrame/interpolate/spring/useVideoConfig, theme colors, Terminal component
// Output: Beats 3-4 — metrics table transitioning from green/healthy to red/breach with spring entrance
// Position: Third+fourth beat in SelfAssemblyDemo composition

import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, TEXT, TEXT_DIM, TEXT_MUTED, GREEN, RED, AMBER, typewriter } from '../theme';

interface MetricsDashboardProps {
  startBreakAtFrame: number;
}

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

  // Trigger evolution text after breach stabilizes
  const triggerText = '\u2192 triggering evolution cycle';
  const triggerStart = startBreakAtFrame + 40;
  const visibleTrigger = frame >= triggerStart ? typewriter(frame - triggerStart, triggerText, 2) : '';

  // Smooth blinking cursor
  const cursorOpacity = interpolate(
    frame % 16,
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const check = (
    <span style={{ color: GREEN }}>{'\u2713'}</span>
  );
  const cross = (
    <span style={{ color: RED }}>{'\u2717'}</span>
  );

  if (!isBreaching) {
    // GREEN state
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
            <div style={{ color: TEXT_DIM, marginBottom: 8 }}>
              {'ACTOR            STATUS   P99     RPS      DETAIL'}
            </div>
            <div style={{ color: TEXT }}>
              {'api-gateway      '}{check}{' ok     42ms    1.2k     cache hit: 94%'}
            </div>
            <div style={{ color: TEXT }}>
              {'cache-layer      '}{check}{' ok     3ms     1.1k     evictions: 3/min'}
            </div>
            <div style={{ color: TEXT }}>
              {'health-monitor   '}{check}{' ok     \u2014       2/s      all checks passing'}
            </div>
            <div style={{ color: TEXT }}>
              {'load-balancer    '}{check}{' ok     1ms     1.2k     backends: 4'}
            </div>
            <div style={{ height: 16 }} />
            <div style={{ color: TEXT }}>
              {'SLO: p99 < 100ms                           '}
              <span style={{ color: GREEN }}>42ms</span>
              {'  '}{check}
            </div>
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
          <div style={{ color: TEXT_DIM, marginBottom: 8 }}>
            {'ACTOR            STATUS   P99     RPS      DETAIL'}
          </div>

          {/* Cache degrades first */}
          <div style={{ color: interpolate(breachOpacity, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) > 0.3 ? RED : TEXT }}>
            {'cache-layer      '}
            <span style={{ color: AMBER }}>{'\u26A0'}</span>
            {' degraded   hit: 94% \u2192 '}
            <span style={{ color: RED }}>{hitDisplay}%</span>
            {'   pool exhausted'}
          </div>

          {/* API gateway breaches */}
          <div style={{ color: TEXT, opacity: breachOpacity }}>
            {'api-gateway      '}{cross}{' breach     p99: 42ms \u2192 '}
            <span style={{ color: RED }}>{p99Display}ms</span>
          </div>

          <div style={{ height: 16 }} />

          {/* SLO breach */}
          <div style={{ color: TEXT }}>
            {'SLO: p99 < 100ms                           '}
            <span style={{ color: RED }}>{p99Display}ms</span>
            {'  '}{cross}
            <span style={{ color: RED, fontWeight: 700 }}>{' BREACH'}</span>
          </div>

          <div style={{ height: 16 }} />

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
        </div>
      </Terminal>
    </AbsoluteFill>
  );
};
