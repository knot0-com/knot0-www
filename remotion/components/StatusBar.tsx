// Input: frame number, theme colors, Remotion interpolate
// Output: Top status bar with company/cluster info and connection indicator
// Position: Top bar inside BrowserChrome in SelfAssemblyDemo

import React from 'react';
import { interpolate } from 'remotion';
import { BG_LIGHT, BORDER, GREEN, TEXT, TEXT_DIM, TEXT_MUTED, FONT } from '../theme';

interface StatusBarProps {
  frame: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ frame }) => {
  // Pulsing green connection dot
  const pulseOpacity = interpolate(
    frame % 40,
    [0, 20, 40],
    [1, 0.4, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        height: 40,
        backgroundColor: BG_LIGHT,
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: FONT,
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      {/* Left: Company / cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: TEXT, fontWeight: 700 }}>VAULTPAY</span>
        <span style={{ color: TEXT_MUTED }}>/</span>
        <span style={{ color: TEXT_DIM }}>prod-us-east-1</span>
        <span style={{ color: TEXT_MUTED }}>/</span>
        <span style={{ color: TEXT_DIM }}>payment-cluster</span>
      </div>

      {/* Right: Connection indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            color: GREEN,
            opacity: pulseOpacity,
            textShadow: `0 0 6px ${GREEN}`,
            fontSize: 10,
          }}
        >
          {'\u25CF'}
        </span>
        <span style={{ color: GREEN, fontWeight: 700 }}>CONNECTED</span>
        <span style={{ color: TEXT_MUTED, marginLeft: 12 }}>14:32:07 UTC</span>
      </div>
    </div>
  );
};
