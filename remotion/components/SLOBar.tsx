// Input: value, threshold, breached flag, theme colors
// Output: Bottom SLO indicator bar with colored progress and status label
// Position: Bottom bar inside BrowserChrome in SelfAssemblyDemo

import React from 'react';
import { BG_LIGHT, BORDER, GREEN, RED, TEXT_DIM, TEXT_MUTED, FONT } from '../theme';

interface SLOBarProps {
  value: number;
  threshold: number;
  breached: boolean;
}

export const SLOBar: React.FC<SLOBarProps> = ({ value, threshold, breached }) => {
  const color = breached ? RED : GREEN;
  const pct = Math.min(100, (value / (threshold * 2)) * 100);
  const checkMark = breached ? '\u2717 BREACH' : '\u2713';

  return (
    <div
      style={{
        height: 30,
        backgroundColor: BG_LIGHT,
        borderTop: `1px solid ${BORDER}`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: FONT,
        fontSize: 11,
        flexShrink: 0,
        gap: 12,
      }}
    >
      <span style={{ color: TEXT_DIM }}>SLO: p99 &lt; {threshold}ms</span>

      {/* Bar */}
      <div
        style={{
          flex: 1,
          maxWidth: 300,
          height: 6,
          backgroundColor: `${TEXT_MUTED}33`,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 3,
            boxShadow: `0 0 6px ${color}`,
            transition: 'none',
          }}
        />
      </div>

      <span style={{ color, fontWeight: 700 }}>
        {Math.round(value)}ms {checkMark}
      </span>
    </div>
  );
};
