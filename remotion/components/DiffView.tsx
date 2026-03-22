// Input: filename, diff lines array, visibleLines count, theme colors
// Output: Code diff panel with syntax-colored additions/deletions appearing line-by-line
// Position: Right panel content during Beat 4 in SelfAssemblyDemo

import React from 'react';
import { BG, BG_LIGHT, BORDER, CYAN, GREEN, RED, TEXT, TEXT_DIM, TEXT_MUTED, FONT } from '../theme';

interface DiffViewProps {
  filename: string;
  lines: string[];
  visibleLines: number;
}

function lineColor(line: string): string {
  if (line.startsWith('@@')) return CYAN;
  if (line.startsWith('---') || line.startsWith('+++')) return TEXT_MUTED;
  if (line.startsWith('-')) return RED;
  if (line.startsWith('+')) return GREEN;
  return TEXT_DIM;
}

function lineBg(line: string): string {
  if (line.startsWith('-') && !line.startsWith('---')) return `${RED}18`;
  if (line.startsWith('+') && !line.startsWith('+++')) return `${GREEN}18`;
  return 'transparent';
}

export const DiffView: React.FC<DiffViewProps> = ({ filename, lines, visibleLines }) => {
  const shown = lines.slice(0, Math.max(0, Math.floor(visibleLines)));

  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 13,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* File tab header */}
      <div
        style={{
          backgroundColor: BG_LIGHT,
          borderBottom: `1px solid ${BORDER}`,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span style={{ color: CYAN, fontSize: 11 }}>{'\u2702'}</span>
        <span style={{ color: TEXT_DIM, fontSize: 12 }}>{filename}</span>
      </div>

      {/* Diff content */}
      <div
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: BG,
          overflowY: 'hidden',
        }}
      >
        {shown.map((line, i) => (
          <div
            key={i}
            style={{
              color: lineColor(line),
              backgroundColor: lineBg(line),
              padding: '1px 6px',
              lineHeight: 1.7,
              whiteSpace: 'pre',
              borderRadius: 2,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
