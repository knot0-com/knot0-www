// Input: React children, theme colors
// Output: Fake browser window chrome wrapping dashboard content
// Position: Top-level visual wrapper in SelfAssemblyDemo

import React from 'react';
import { BG, BG_LIGHT, BORDER, TEXT_DIM, TEXT_MUTED, FONT } from '../theme';

export const BrowserChrome: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: BG,
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 28,
          backgroundColor: BG_LIGHT,
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
          paddingRight: 12,
          flexShrink: 0,
        }}
      >
        {/* Traffic light dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#ff5f56',
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#ffbd2e',
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#27c93f',
            }}
          />
        </div>

        {/* Tab */}
        <div
          style={{
            marginLeft: 24,
            fontSize: 11,
            color: TEXT_DIM,
            backgroundColor: BG,
            padding: '3px 14px',
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            borderTop: `1px solid ${BORDER}`,
            borderLeft: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            position: 'relative',
            top: 1,
          }}
        >
          Knot0 Dashboard
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* URL bar hint */}
        <div
          style={{
            fontSize: 10,
            color: TEXT_MUTED,
          }}
        >
          dashboard.knot0.com
        </div>
      </div>

      {/* Page content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};
