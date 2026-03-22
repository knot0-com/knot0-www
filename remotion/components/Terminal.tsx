// Input: React, theme colors
// Output: Terminal chrome component with title bar + traffic lights
// Position: Reusable wrapper used by all beat components

import React from 'react';
import { BG_LIGHT, BORDER, TEXT, TEXT_DIM, FONT } from '../theme';

interface TerminalProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Terminal: React.FC<TerminalProps> = ({ title, children, style }) => {
  const dotStyle = (color: string): React.CSSProperties => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: color,
  });

  return (
    <div
      style={{
        backgroundColor: BG_LIGHT,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          borderBottom: `1px solid ${BORDER}`,
          position: 'relative',
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={dotStyle('#ff5f57')} />
          <div style={dotStyle('#febc2e')} />
          <div style={dotStyle('#28c840')} />
        </div>

        {/* Centered title */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 13,
            color: TEXT_DIM,
            pointerEvents: 'none',
          }}
        >
          {title}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '20px 24px',
          flex: 1,
          fontSize: 16,
          lineHeight: 1.6,
          color: TEXT,
          whiteSpace: 'pre-wrap',
          fontFamily: FONT,
        }}
      >
        {children}
      </div>
    </div>
  );
};
