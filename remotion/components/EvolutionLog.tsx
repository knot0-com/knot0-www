// Input: visibleLines count, frame, theme colors, Remotion spring/interpolate
// Output: Evolution log table showing actor version history with sequential spring-in entries
// Position: Right panel content during Beat 6 in SelfAssemblyDemo

import React from 'react';
import { spring, interpolate, useVideoConfig } from 'remotion';
import { AMBER, CYAN, GREEN, TEXT, TEXT_DIM, TEXT_MUTED, FONT } from '../theme';

interface EvolutionEntry {
  name: string;
  versions: string;
  description: string;
  timestamp: string;
  isNew?: boolean;
  highlight?: boolean;
}

const ENTRIES: EvolutionEntry[] = [
  { name: 'api-gateway', versions: 'v1 \u2192 v3', description: '3 evolutions', timestamp: '47m ago' },
  {
    name: 'cache-layer',
    versions: 'v1 \u2192 v2',
    description: 'pool + breaker',
    timestamp: 'just now',
    highlight: true,
  },
  { name: 'health-mon', versions: 'v1', description: 'stable', timestamp: '' },
  {
    name: 'load-balancer',
    versions: 'v1 \u2192 v2',
    description: 'weighted routing',
    timestamp: '1h ago',
  },
  {
    name: '+ rate-limiter',
    versions: '',
    description: 'spawned by health-monitor',
    timestamp: '',
    isNew: true,
  },
];

interface EvolutionLogProps {
  visibleLines: number;
  frame: number;
}

export const EvolutionLog: React.FC<EvolutionLogProps> = ({ visibleLines, frame }) => {
  const { fps } = useVideoConfig();
  const shown = ENTRIES.slice(0, Math.max(0, Math.floor(visibleLines)));

  return (
    <div
      style={{
        padding: 20,
        fontFamily: FONT,
        fontSize: 13,
      }}
    >
      <div
        style={{
          color: TEXT_DIM,
          fontSize: 11,
          letterSpacing: 2,
          marginBottom: 16,
          fontWeight: 700,
        }}
      >
        EVOLUTION LOG
      </div>

      {shown.map((entry, i) => {
        const entrySpring = spring({
          frame: Math.max(0, frame - i * 12),
          fps,
          config: { damping: 200 },
        });

        const translateX = interpolate(entrySpring, [0, 1], [-16, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const nameColor = entry.isNew ? GREEN : TEXT;
        const highlightGlow = entry.highlight
          ? { textShadow: `0 0 8px ${AMBER}` }
          : {};

        return (
          <div
            key={entry.name}
            style={{
              opacity: entrySpring,
              transform: `translateX(${translateX}px)`,
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              lineHeight: 2.2,
            }}
          >
            <span
              style={{
                color: nameColor,
                fontWeight: 700,
                width: 140,
                display: 'inline-block',
              }}
            >
              {entry.name}
            </span>
            <span style={{ color: CYAN, width: 80, display: 'inline-block' }}>
              {entry.versions}
            </span>
            <span style={{ color: TEXT_DIM, width: 180, display: 'inline-block' }}>
              {entry.description}
            </span>
            <span
              style={{
                color: entry.highlight ? AMBER : TEXT_MUTED,
                fontWeight: entry.highlight ? 700 : 400,
                ...highlightGlow,
              }}
            >
              {entry.timestamp}
              {entry.highlight && ' \u2190'}
            </span>
          </div>
        );
      })}

      {/* New actor extra line */}
      {visibleLines > 4 && (
        <div
          style={{
            opacity: spring({
              frame: Math.max(0, frame - 5 * 12),
              fps,
              config: { damping: 200 },
            }),
            color: TEXT_MUTED,
            fontSize: 11,
            marginLeft: 156,
            marginTop: -4,
          }}
        >
          reason: traffic pattern shift
        </div>
      )}
    </div>
  );
};
