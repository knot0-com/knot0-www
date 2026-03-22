// Input: runners array with name/platform/status/progress, frame, theme colors, Remotion spring/interpolate
// Output: Side-by-side deployment runner cards with animated progress bars
// Position: Right panel content (top half) during Beat 5 in SelfAssemblyDemo

import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { BG_LIGHT, BORDER, GREEN, AMBER, TEXT, TEXT_DIM, FONT } from '../theme';

export interface RunnerInfo {
  name: string;
  platform: string;
  status: 'deploying' | 'done';
  progress: number;
}

interface RunnerCardsProps {
  runners: RunnerInfo[];
  frame: number;
}

export const RunnerCards: React.FC<RunnerCardsProps> = ({ runners, frame }) => {
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: 16,
        fontFamily: FONT,
      }}
    >
      {runners.map((runner, i) => {
        const entrance = spring({
          frame: Math.max(0, frame - i * 8),
          fps,
          config: { damping: 200 },
        });

        const translateY = interpolate(entrance, [0, 1], [12, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const borderColor = runner.status === 'done' ? GREEN : AMBER;

        // Pulse dot during deploying
        const pulseOpacity =
          runner.status === 'deploying'
            ? interpolate(frame % 16, [0, 8, 16], [1, 0.3, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 1;

        const statusColor = runner.status === 'done' ? GREEN : AMBER;
        const statusLabel = runner.status === 'done' ? 'Done' : 'Deploying...';

        // Progress bar width
        const barWidth = Math.min(100, Math.max(0, runner.progress));
        const filledBlocks = Math.round((barWidth / 100) * 10);
        const emptyBlocks = 10 - filledBlocks;
        const barStr =
          '\u2588'.repeat(filledBlocks) + '\u2591'.repeat(emptyBlocks) + ` ${Math.round(barWidth)}%`;

        return (
          <div
            key={runner.name}
            style={{
              flex: 1,
              backgroundColor: BG_LIGHT,
              border: `1px solid ${borderColor}`,
              borderRadius: 6,
              padding: 16,
              opacity: entrance,
              transform: `translateY(${translateY}px)`,
            }}
          >
            <div style={{ color: TEXT, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {runner.name}
            </div>
            <div style={{ color: TEXT_DIM, fontSize: 11, marginBottom: 8 }}>{runner.platform}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  color: statusColor,
                  opacity: pulseOpacity,
                  textShadow: `0 0 6px ${statusColor}`,
                  fontSize: 10,
                }}
              >
                {'\u25CF'}
              </span>
              <span style={{ color: statusColor, fontSize: 12, fontWeight: 700 }}>
                {statusLabel}
              </span>
            </div>
            <div style={{ color: statusColor, fontSize: 11, letterSpacing: 1 }}>{barStr}</div>
          </div>
        );
      })}
    </div>
  );
};
