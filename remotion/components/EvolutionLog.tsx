// Input: Remotion useCurrentFrame/spring/useVideoConfig/interpolate, theme colors, Terminal component
// Output: Beat 6 — evolution history with FullDemo-style visual timeline (dots + connecting line)
// Position: Sixth beat in SelfAssemblyDemo composition

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, BORDER, TEXT, TEXT_DIM, TEXT_MUTED, CYAN, AMBER, GREEN, RED } from '../theme';

// ---------------------------------------------------------------------------
// Timeline data — FullDemo PostMortemVisual pattern
// ---------------------------------------------------------------------------

interface TimelineEvent {
  time: string;
  label: string;
  dotColor: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  { time: '14:32:01', label: 'System healthy — all actors running', dotColor: GREEN },
  { time: '14:32:47', label: 'Cache degradation detected', dotColor: RED },
  { time: '14:32:48', label: 'Evolution triggered for cache-layer', dotColor: AMBER },
  { time: '14:32:52', label: 'v2 promoted — p99 recovered', dotColor: GREEN },
  { time: '14:33:15', label: 'rate-limiter spawned by health-monitor', dotColor: CYAN },
];

// ---------------------------------------------------------------------------
// Evolution log table data
// ---------------------------------------------------------------------------

interface LogLine {
  segments: Array<{ text: string; color: string; bold?: boolean }>;
}

const LOG_LINES: LogLine[] = [
  {
    segments: [
      { text: 'api-gateway    ', color: TEXT },
      { text: 'v1 → v2 (rate limiting)', color: CYAN },
      { text: '     47m ago', color: TEXT_MUTED },
    ],
  },
  {
    segments: [
      { text: '               ', color: TEXT },
      { text: 'v2 → v3 (retry backoff)', color: CYAN },
      { text: '     23m ago', color: TEXT_MUTED },
    ],
  },
  {
    segments: [
      { text: 'cache-layer    ', color: TEXT },
      { text: 'v1 → v2 (pool + breaker)', color: CYAN },
      { text: '    ', color: TEXT },
      { text: 'just now', color: AMBER, bold: true },
    ],
  },
  {
    segments: [
      { text: 'health-monitor ', color: TEXT },
      { text: 'v1 (stable)', color: CYAN },
    ],
  },
  {
    segments: [
      { text: 'load-balancer  ', color: TEXT },
      { text: 'v1 → v2 (weighted routing)', color: CYAN },
      { text: '  1h ago', color: TEXT_MUTED },
    ],
  },
  {
    segments: [
      { text: '+ rate-limiter', color: GREEN, bold: true },
      { text: '  spawned by health-monitor', color: TEXT_DIM },
    ],
  },
  {
    segments: [
      { text: '               handler.ts (18 lines) ', color: TEXT },
      { text: '✓', color: GREEN },
    ],
  },
  {
    segments: [
      { text: '               reason: ', color: TEXT_MUTED },
      { text: 'traffic pattern shift', color: TEXT },
    ],
  },
];

const FRAMES_PER_TIMELINE = 10;
const FRAMES_PER_LOG_LINE = 6;
const LOG_START = TIMELINE_EVENTS.length * FRAMES_PER_TIMELINE + 8;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const EvolutionLog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance for the whole terminal
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  // Timeline visible count
  const visibleTimeline = Math.min(
    TIMELINE_EVENTS.length,
    Math.floor(frame / FRAMES_PER_TIMELINE),
  );

  // Log visible count (starts after timeline is mostly done)
  const logFrame = frame - LOG_START;
  const visibleLog = logFrame > 0
    ? Math.min(LOG_LINES.length, Math.floor(logFrame / FRAMES_PER_LOG_LINE))
    : 0;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: 60,
        opacity: entrance,
        transform: `scale(${scale})`,
      }}
    >
      <Terminal title="knot0 evolution" style={{ width: 920 }}>
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          {/* Section header: TIMELINE */}
          <div style={{ color: AMBER, marginBottom: 8, fontWeight: 700 }}>TIMELINE</div>

          {/* Timeline with vertical line and dots */}
          <div style={{ position: 'relative', paddingLeft: 8, marginBottom: 16 }}>
            {/* Vertical connecting line */}
            {visibleTimeline > 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: 76,
                  top: 10,
                  bottom: `${((TIMELINE_EVENTS.length - visibleTimeline) / TIMELINE_EVENTS.length) * 100}%`,
                  width: 1,
                  backgroundColor: BORDER,
                }}
              />
            )}

            {TIMELINE_EVENTS.slice(0, visibleTimeline).map((event, i) => {
              // Each event springs in
              const eventSpring = spring({
                frame: Math.max(0, frame - i * FRAMES_PER_TIMELINE),
                fps,
                config: { damping: 200 },
              });

              const translateX = interpolate(eventSpring, [0, 1], [-12, 0]);

              // Pulse for the latest dot
              const isLatest = i === visibleTimeline - 1;
              const pulseOpacity = isLatest
                ? interpolate(frame % 20, [0, 10, 20], [1, 0.5, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  })
                : 1;

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: eventSpring,
                    transform: `translateX(${translateX}px)`,
                    lineHeight: 2,
                  }}
                >
                  {/* Timestamp */}
                  <span style={{ color: TEXT_MUTED, width: 60, fontSize: 12 }}>
                    {event.time}
                  </span>

                  {/* Dot with glow */}
                  <span
                    style={{
                      color: event.dotColor,
                      fontSize: 10,
                      opacity: pulseOpacity,
                      textShadow: `0 0 6px ${event.dotColor}`,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    ●
                  </span>

                  {/* Event label */}
                  <span style={{ color: TEXT }}>
                    {event.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Separator */}
          {visibleLog > 0 && (
            <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: 12, paddingTop: 8 }}>
              <span style={{ color: AMBER, fontWeight: 700 }}>EVOLUTION LOG</span>
            </div>
          )}

          {/* Evolution log table */}
          {LOG_LINES.slice(0, visibleLog).map((line, i) => {
            const lineSpring = spring({
              frame: Math.max(0, logFrame - i * FRAMES_PER_LOG_LINE),
              fps,
              config: { damping: 200 },
            });

            return (
              <div key={i} style={{ opacity: lineSpring }}>
                {line.segments.map((seg, j) => (
                  <span
                    key={j}
                    style={{
                      color: seg.color,
                      fontWeight: seg.bold ? 700 : 400,
                      textShadow: seg.bold && seg.color !== TEXT ? `0 0 4px ${seg.color}` : undefined,
                    }}
                  >
                    {seg.text}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </Terminal>
    </AbsoluteFill>
  );
};
