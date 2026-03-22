// Input: Remotion AbsoluteFill, theme colors, Terminal component
// Output: Beat 2 overlay — syntax-highlighted handler code
// Position: Fades in/out over the assembly terminal in Beat 2

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, TEXT, TEXT_MUTED, AMBER, CYAN } from '../theme';

interface CodeFlashProps {
  opacity: number;
}

const CODE_LINES = [
  { text: '// api-gateway/handler.ts — generated', type: 'comment' },
  { text: "export default sdk.handler({", type: 'code' },
  { text: "  trigger: 'http.request',", type: 'code' },
  { text: "  match: '/api/v1/*',", type: 'code' },
  { text: '', type: 'blank' },
  { text: '  async run(ctx) {', type: 'code' },
  { text: '    const cached = await ctx.cache.get(ctx.req.path);', type: 'code' },
  { text: '    if (cached) return cached;', type: 'code' },
  { text: '    const res = await ctx.upstream.forward(ctx.req);', type: 'code' },
  { text: '    await ctx.cache.set(ctx.req.path, res, { ttl: 30 });', type: 'code' },
  { text: '    return res;', type: 'code' },
  { text: '  }', type: 'code' },
  { text: '});', type: 'code' },
];

const KEYWORDS = new Set([
  'import', 'export', 'default', 'const', 'async', 'await', 'return', 'if',
]);

function tokenizeLine(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match: strings, numbers, keywords, comments, rest
  const regex = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d[\d_]*\b)|(\b[a-zA-Z_]\w*\b)|(\S)/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = regex.exec(line)) !== null) {
    // Whitespace gap
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    lastIndex = regex.lastIndex;

    const full = match[0];

    if (match[1]) {
      // String literal
      nodes.push(
        <span key={`s${match.index}`} style={{ color: CYAN }}>
          {full}
        </span>,
      );
    } else if (match[2]) {
      // Number
      nodes.push(
        <span key={`n${match.index}`} style={{ color: '#ff6b6b' }}>
          {full}
        </span>,
      );
    } else if (match[3] && KEYWORDS.has(full)) {
      // Keyword
      nodes.push(
        <span key={`k${match.index}`} style={{ color: AMBER }}>
          {full}
        </span>,
      );
    } else {
      nodes.push(
        <span key={`t${match.index}`} style={{ color: TEXT }}>
          {full}
        </span>,
      );
    }
  }

  // Trailing whitespace
  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

function renderCode(): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < CODE_LINES.length; i++) {
    if (i > 0) nodes.push('\n');
    const { text, type } = CODE_LINES[i];

    if (type === 'comment') {
      nodes.push(
        <span key={i} style={{ color: TEXT_MUTED }}>
          {text}
        </span>,
      );
    } else if (type === 'blank') {
      // nothing
    } else {
      nodes.push(<React.Fragment key={i}>{tokenizeLine(text)}</React.Fragment>);
    }
  }

  return nodes;
}

export const CodeFlash: React.FC<CodeFlashProps> = ({ opacity }) => {
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: 80,
        opacity,
      }}
    >
      <Terminal title="api-gateway/handler.ts" style={{ width: 900 }}>
        <span style={{ fontSize: 16, lineHeight: 1.7 }}>{renderCode()}</span>
      </Terminal>
    </AbsoluteFill>
  );
};
