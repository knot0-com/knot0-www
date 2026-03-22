// Input: Remotion useCurrentFrame/spring/useVideoConfig/interpolate, theme helpers, Terminal component
// Output: Beat 1 — YAML config typewriter reveal with spring entrance (frames 0-104)
// Position: First beat in SelfAssemblyDemo composition

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, TEXT, TEXT_MUTED, CYAN, AMBER, typewriter } from '../theme';

const YAML_LINES = [
  { text: '# knot0.yaml', type: 'comment' as const },
  { text: 'goal: "p99 latency < 100ms for /api/v1/*"', type: 'kv-string' as const },
  { text: 'actors: auto', type: 'kv-special' as const },
  { text: 'evolution: enabled', type: 'kv-special' as const },
];

const FULL_TEXT = YAML_LINES.map((l) => l.text).join('\n');

function colorize(visible: string): React.ReactNode[] {
  const lines = visible.split('\n');
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i > 0) nodes.push('\n');

    const def = YAML_LINES[i];
    if (!def) {
      nodes.push(line);
      continue;
    }

    if (def.type === 'comment') {
      nodes.push(
        <span key={i} style={{ color: TEXT_MUTED }}>
          {line}
        </span>,
      );
    } else if (def.type === 'kv-string') {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx);
        const rest = line.slice(colonIdx);
        // Find the quoted string portion
        const quoteStart = rest.indexOf('"');
        const quoteEnd = rest.lastIndexOf('"');
        nodes.push(
          <span key={`${i}-k`} style={{ color: TEXT }}>
            {key}
          </span>,
        );
        if (quoteStart !== -1 && quoteEnd > quoteStart) {
          nodes.push(
            <span key={`${i}-c`} style={{ color: TEXT }}>
              {rest.slice(0, quoteStart)}
            </span>,
          );
          nodes.push(
            <span key={`${i}-v`} style={{ color: CYAN }}>
              {rest.slice(quoteStart, quoteEnd + 1)}
            </span>,
          );
          if (quoteEnd + 1 < rest.length) {
            nodes.push(
              <span key={`${i}-r`} style={{ color: TEXT }}>
                {rest.slice(quoteEnd + 1)}
              </span>,
            );
          }
        } else {
          nodes.push(
            <span key={`${i}-r`} style={{ color: TEXT }}>
              {rest}
            </span>,
          );
        }
      } else {
        nodes.push(line);
      }
    } else if (def.type === 'kv-special') {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx);
        const rest = line.slice(colonIdx);
        nodes.push(
          <span key={`${i}-k`} style={{ color: TEXT }}>
            {key}
          </span>,
        );
        nodes.push(
          <span key={`${i}-colon`} style={{ color: TEXT }}>
            :
          </span>,
        );
        nodes.push(
          <span key={`${i}-v`} style={{ color: AMBER }}>
            {rest.slice(1)}
          </span>,
        );
      } else {
        nodes.push(line);
      }
    }
  }

  return nodes;
}

export const ConfigReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const visible = typewriter(frame, FULL_TEXT, 2);

  // Spring entrance — terminal springs in from slight scale-down
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.92, 1]);
  const opacity = entrance;

  // Smooth blinking cursor
  const cursorOpacity = interpolate(
    frame % 16,
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: 80,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <Terminal title="knot0.yaml" style={{ width: 800 }}>
        <span style={{ fontSize: 20, lineHeight: 1.8 }}>{colorize(visible)}</span>
        {/* Blinking cursor */}
        <span
          style={{
            opacity: cursorOpacity,
            color: AMBER,
          }}
        >
          {'\u258C'}
        </span>
      </Terminal>
    </AbsoluteFill>
  );
};
