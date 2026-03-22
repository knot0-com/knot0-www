// Input: Remotion useCurrentFrame, theme colors, Terminal component
// Output: Beat 6 — evolution history table with sequential fade-in
// Position: Sixth beat in SelfAssemblyDemo composition

import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, TEXT, TEXT_DIM, TEXT_MUTED, CYAN, AMBER, GREEN, fadeIn } from '../theme';

interface LogLine {
  segments: Array<{ text: string; color: string }>;
}

const LOG_LINES: LogLine[] = [
  {
    segments: [{ text: 'EVOLUTION LOG', color: AMBER }],
  },
  {
    segments: [{ text: '', color: TEXT }],
  },
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
      { text: 'just now', color: AMBER },
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
    segments: [{ text: '', color: TEXT }],
  },
  {
    segments: [
      { text: '+ rate-limiter', color: GREEN },
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

const FRAMES_PER_LINE = 8;

export const EvolutionLog: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: 60,
      }}
    >
      <Terminal title="knot0 evolution" style={{ width: 920 }}>
        <div style={{ fontSize: 15, lineHeight: 1.8 }}>
          {LOG_LINES.map((line, i) => {
            const lineOpacity = fadeIn(frame, i * FRAMES_PER_LINE, 8);
            return (
              <div key={i} style={{ opacity: lineOpacity, minHeight: line.segments[0].text === '' ? 8 : undefined }}>
                {line.segments.map((seg, j) => (
                  <span key={j} style={{ color: seg.color }}>
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
