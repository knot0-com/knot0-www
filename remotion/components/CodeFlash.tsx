// Input: Remotion AbsoluteFill/useCurrentFrame/interpolate, theme colors, Terminal component
// Output: Beat 2 overlay — syntax-highlighted handler code with file tab bar
// Position: Fades in/out over the assembly terminal in Beat 2

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, BG_LIGHT, BORDER, TEXT, TEXT_DIM, TEXT_MUTED, AMBER, CYAN, GREEN } from '../theme';

// Purple for keywords, matching FullDemo's text-purple-400
const PURPLE = '#c084fc';

interface CodeFlashProps {
  opacity: number;
}

// ---------------------------------------------------------------------------
// File data — three tabs, each with code
// ---------------------------------------------------------------------------

interface FileTab {
  name: string;
  lines: string[];
}

const FILES: FileTab[] = [
  {
    name: 'api-gateway/handler.ts',
    lines: [
      '// api-gateway/handler.ts — generated',
      "export default sdk.handler({",
      "  trigger: 'http.request',",
      "  match: '/api/v1/*',",
      '',
      '  async run(ctx) {',
      '    const cached = await ctx.cache.get(ctx.req.path);',
      '    if (cached) return cached;',
      '    const res = await ctx.upstream.forward(ctx.req);',
      '    await ctx.cache.set(ctx.req.path, res, { ttl: 30 });',
      '    return res;',
      '  }',
      '});',
    ],
  },
  {
    name: 'cache-layer/handler.ts',
    lines: [
      '// cache-layer/handler.ts — generated',
      "export default sdk.handler({",
      "  trigger: 'cache.miss',",
      '',
      '  async run(ctx) {',
      '    const pool = createPool({ max: 10 });',
      '    const conn = await pool.acquire();',
      '    const data = await conn.fetch(ctx.key);',
      '    pool.release(conn);',
      '    return data;',
      '  }',
      '});',
    ],
  },
  {
    name: 'health-monitor/handler.ts',
    lines: [
      '// health-monitor/handler.ts — generated',
      "export default sdk.handler({",
      "  trigger: 'cron',",
      "  schedule: '*/10 * * * * *',",
      '',
      '  async run(ctx) {',
      '    const checks = await ctx.healthChecks();',
      '    if (checks.failing > 0) {',
      "      await ctx.alert('degradation', checks);",
      '    }',
      '  }',
      '});',
    ],
  },
];

// ---------------------------------------------------------------------------
// FullDemo-style syntax highlighter for TypeScript
// ---------------------------------------------------------------------------

const TS_KEYWORDS = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'async', 'await', 'new', 'class', 'extends', 'interface',
  'type', 'true', 'false', 'null', 'undefined', 'default',
]);

const TS_BUILTINS = new Set([
  'console', 'document', 'window', 'Promise', 'Response', 'WebSocket',
  'sdk', 'ctx', 'createPool',
]);

function highlightTS(line: string, lineIdx: number): React.ReactNode {
  // Comment line
  if (line.trimStart().startsWith('//')) {
    return (
      <span style={{ color: TEXT_MUTED, fontStyle: 'italic' }}>{line}</span>
    );
  }

  // Token-by-token highlighting (FullDemo pattern)
  const words = line.split(/(\s+|[{}()[\]<>,:;=.]|"[^"]*"|'[^']*'|`[^`]*`)/);
  const tokens: React.ReactNode[] = [];
  let key = 0;

  for (const word of words) {
    if (!word) continue;

    if (TS_KEYWORDS.has(word)) {
      tokens.push(
        <span key={`${lineIdx}-${key++}`} style={{ color: PURPLE }}>{word}</span>,
      );
    } else if (TS_BUILTINS.has(word)) {
      tokens.push(
        <span key={`${lineIdx}-${key++}`} style={{ color: CYAN }}>{word}</span>,
      );
    } else if (word.match(/^['"`]/)) {
      tokens.push(
        <span key={`${lineIdx}-${key++}`} style={{ color: GREEN }}>{word}</span>,
      );
    } else if (word.match(/^\d+$/)) {
      tokens.push(
        <span key={`${lineIdx}-${key++}`} style={{ color: AMBER }}>{word}</span>,
      );
    } else if (word.match(/^[{}()[\]<>,:;=.]$/)) {
      tokens.push(
        <span key={`${lineIdx}-${key++}`} style={{ color: TEXT_MUTED }}>{word}</span>,
      );
    } else {
      tokens.push(
        <span key={`${lineIdx}-${key++}`} style={{ color: TEXT }}>{word}</span>,
      );
    }
  }

  return <>{tokens}</>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CodeFlash: React.FC<CodeFlashProps> = ({ opacity }) => {
  const frame = useCurrentFrame();

  // Cycle through files: each file visible for ~20 frames
  const FRAMES_PER_FILE = 20;
  const activeIndex = Math.min(
    FILES.length - 1,
    Math.floor(frame / FRAMES_PER_FILE),
  );
  const activeFile = FILES[activeIndex];

  // Blinking cursor
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
      }}
    >
      <div style={{ width: 900 }}>
        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            marginBottom: -1,
            paddingLeft: 12,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {FILES.map((file, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={file.name}
                style={{
                  padding: '8px 16px',
                  fontSize: 12,
                  fontFamily: FONT,
                  color: isActive ? TEXT : TEXT_MUTED,
                  backgroundColor: isActive ? BG_LIGHT : 'transparent',
                  border: isActive ? `1px solid ${BORDER}` : `1px solid transparent`,
                  borderBottom: isActive ? `1px solid ${BG_LIGHT}` : `1px solid ${BORDER}`,
                  borderRadius: '6px 6px 0 0',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </div>
            );
          })}
          {/* Bottom border that sits behind tabs */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: BORDER,
              zIndex: -1,
            }}
          />
        </div>

        {/* Terminal body */}
        <Terminal title={activeFile.name} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <div style={{ fontSize: 15, lineHeight: 1.8 }}>
            {activeFile.lines.map((line, i) => (
              <div key={i} style={{ minHeight: line === '' ? 8 : undefined }}>
                {/* Line number */}
                <span
                  style={{
                    display: 'inline-block',
                    width: 32,
                    textAlign: 'right',
                    marginRight: 16,
                    color: TEXT_MUTED,
                    fontSize: 12,
                    userSelect: 'none',
                  }}
                >
                  {i + 1}
                </span>
                {line === '' ? '\u00A0' : highlightTS(line, i)}
              </div>
            ))}
            <span style={{ color: AMBER, opacity: cursorOpacity }}>{'\u258C'}</span>
          </div>
        </Terminal>
      </div>
    </AbsoluteFill>
  );
};
