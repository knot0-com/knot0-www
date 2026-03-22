// Input: feed items array, visibleItems count, frame, theme colors, Remotion spring/interpolate
// Output: Terminal-style activity feed with sequential spring-in line entries
// Position: Left panel content in SelfAssemblyDemo across all beats

import React from 'react';
import { spring, interpolate, useVideoConfig } from 'remotion';
import { TEXT, TEXT_MUTED, FONT } from '../theme';

export interface FeedItem {
  icon: string;
  color: string;
  lines: string[];
  /** Optional: per-line color overrides (same length as lines) */
  lineColors?: (string | null)[];
}

interface AgentFeedProps {
  items: FeedItem[];
  visibleItems: number;
  frame: number;
}

export const AgentFeed: React.FC<AgentFeedProps> = ({ items, visibleItems, frame }) => {
  const { fps } = useVideoConfig();
  const shown = items.slice(0, Math.max(0, Math.floor(visibleItems)));

  return (
    <div
      style={{
        padding: 20,
        fontFamily: FONT,
        fontSize: 13,
        lineHeight: 1.8,
        overflowY: 'hidden',
        height: '100%',
      }}
    >
      {shown.length === 0 && (
        <div style={{ color: TEXT_MUTED, fontStyle: 'italic' }}>Waiting...</div>
      )}
      {shown.map((item, i) => {
        const itemSpring = spring({
          frame: Math.max(0, frame - i * 2),
          fps,
          config: { damping: 200 },
        });

        const translateX = interpolate(itemSpring, [0, 1], [-20, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              opacity: itemSpring,
              transform: `translateX(${translateX}px)`,
              marginBottom: 2,
            }}
          >
            {item.lines.map((line, j) => {
              const lineColor =
                item.lineColors && item.lineColors[j]
                  ? item.lineColors[j]!
                  : j === 0
                    ? item.color
                    : TEXT;
              return (
                <div key={j} style={{ color: lineColor }}>
                  {j === 0 && (
                    <span style={{ color: item.color, marginRight: 6 }}>{item.icon}</span>
                  )}
                  {j > 0 && <span style={{ marginRight: 6, visibility: 'hidden' }}>{item.icon}</span>}
                  {line}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
