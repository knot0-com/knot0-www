// Input: Remotion useCurrentFrame/interpolate/spring/useVideoConfig, theme colors, Terminal component
// Output: Beat 5 — split-view diff + validation panels with FullDemo-style diff coloring
// Position: Fifth beat (the money shot) in SelfAssemblyDemo composition

import React from 'react';
import { useCurrentFrame, AbsoluteFill, interpolate, spring, useVideoConfig } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, TEXT, TEXT_DIM, TEXT_MUTED, GREEN, RED, AMBER, CYAN, fadeIn } from '../theme';

// Purple for keywords in code context
const PURPLE = '#c084fc';

// ---------------------------------------------------------------------------
// FullDemo-style diff/patch highlighter
// ---------------------------------------------------------------------------

interface DiffLine {
  text: string;
  type: 'header' | 'meta' | 'add' | 'remove' | 'hunk' | 'context' | 'blank';
}

const DIFF_LINES: DiffLine[] = [
  { text: '// cache-layer/handler.ts  v1 → v2', type: 'header' },
  { text: '', type: 'blank' },
  { text: '@@ -4,2 +4,8 @@ export default sdk.handler({', type: 'hunk' },
  { text: '- const pool = createPool({ max: 10 });', type: 'remove' },
  { text: '+ const pool = createPool({', type: 'add' },
  { text: '+   max: 50,', type: 'add' },
  { text: '+   idleTimeout: 30_000', type: 'add' },
  { text: '+ });', type: 'add' },
  { text: '+', type: 'add' },
  { text: '+ const breaker = new CircuitBreaker({', type: 'add' },
  { text: '+   threshold: 5,', type: 'add' },
  { text: '+   resetTimeout: 10_000', type: 'add' },
  { text: '+ });', type: 'add' },
];

function renderDiffLine(line: DiffLine, idx: number): React.ReactNode {
  switch (line.type) {
    case 'header':
      return <span style={{ color: TEXT_DIM, fontStyle: 'italic' }}>{line.text}</span>;
    case 'hunk':
      return <span style={{ color: CYAN }}>{line.text}</span>;
    case 'add':
      return (
        <span>
          <span
            style={{
              backgroundColor: 'rgba(57, 255, 20, 0.08)',
              display: 'inline',
            }}
          >
            <span style={{ color: GREEN }}>{line.text}</span>
          </span>
        </span>
      );
    case 'remove':
      return (
        <span>
          <span
            style={{
              backgroundColor: 'rgba(255, 68, 68, 0.08)',
              display: 'inline',
            }}
          >
            <span style={{ color: RED }}>{line.text}</span>
          </span>
        </span>
      );
    case 'blank':
      return <span>{'\u00A0'}</span>;
    default:
      return <span style={{ color: TEXT }}>{line.text}</span>;
  }
}

// ---------------------------------------------------------------------------
// Validation lines (right panel) — with FullDemo-style SLO progress bar
// ---------------------------------------------------------------------------

interface ValLine {
  label: string;
  value: string;
  valueColor: string;
  badge?: 'pass' | 'fail' | 'promoted';
  progressBar?: { value: number; max: number; color: string };
}

const VALIDATION_LINES: ValLine[] = [
  { label: 'evolution:', value: ' cache-layer v1 → v2', valueColor: TEXT },
  { label: '', value: '', valueColor: TEXT },
  { label: 'change:', value: '    pool scaling + circuit breaker', valueColor: TEXT },
  { label: '', value: '', valueColor: TEXT },
  { label: 'testing:', value: '   shadow traffic...', valueColor: TEXT },
  { label: '  p99:', value: '     ', valueColor: TEXT, progressBar: { value: 38, max: 400, color: GREEN } },
  { label: '  was:', value: '     ', valueColor: TEXT, progressBar: { value: 340, max: 400, color: RED } },
  { label: '', value: '', valueColor: TEXT },
  { label: 'SLO:', value: '       38ms < 100ms  ', valueColor: TEXT, badge: 'pass' },
  { label: '', value: '', valueColor: TEXT },
  { label: 'promoted:', value: '  v2 now active', valueColor: AMBER, badge: 'promoted' },
];

const FRAMES_PER_DIFF_LINE = 4;
const DIFF_TOTAL_FRAMES = DIFF_LINES.length * FRAMES_PER_DIFF_LINE;
const VALIDATION_START = Math.floor(DIFF_TOTAL_FRAMES * 0.6);
const FRAMES_PER_VAL_LINE = 6;

// ---------------------------------------------------------------------------
// SLO progress bar helper — FullDemo pattern: [████████░░░░] 42ms
// ---------------------------------------------------------------------------

function SLOBar({ value, max, color }: { value: number; max: number; color: string }) {
  const totalBlocks = 16;
  const filled = Math.round((value / max) * totalBlocks);
  const empty = totalBlocks - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <span>
      <span style={{ color: TEXT_MUTED }}>[</span>
      <span style={{ color }}>{bar}</span>
      <span style={{ color: TEXT_MUTED }}>]</span>
      <span style={{ color, fontWeight: 700 }}> {value}ms</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const EvolutionDiff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrances — left panel slides from left, right panel slides from right
  const leftEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const rightEntrance = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 200 },
  });

  const leftTranslateX = interpolate(leftEntrance, [0, 1], [-40, 0]);
  const rightTranslateX = interpolate(rightEntrance, [0, 1], [40, 0]);

  // Calculate visible diff lines
  const visibleDiffLines = Math.min(
    DIFF_LINES.length,
    Math.floor(frame / FRAMES_PER_DIFF_LINE),
  );

  // Calculate visible validation lines
  const valFrame = frame - VALIDATION_START;
  const visibleValLines = valFrame > 0
    ? Math.min(VALIDATION_LINES.length, Math.floor(valFrame / FRAMES_PER_VAL_LINE))
    : 0;

  // Smooth blinking cursor
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: 60,
        gap: 24,
      }}
    >
      {/* Left panel: diff */}
      <div style={{
        flex: 1,
        maxWidth: 860,
        opacity: leftEntrance,
        transform: `translateX(${leftTranslateX}px)`,
      }}>
        <Terminal title="diff — cache-layer/handler.ts" style={{ height: 480 }}>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            {DIFF_LINES.slice(0, visibleDiffLines).map((line, i) => (
              <div
                key={i}
                style={{
                  opacity: interpolate(
                    frame,
                    [i * FRAMES_PER_DIFF_LINE, i * FRAMES_PER_DIFF_LINE + 4],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                  ),
                  paddingLeft: 4,
                  borderLeft: line.type === 'add'
                    ? `2px solid ${GREEN}`
                    : line.type === 'remove'
                      ? `2px solid ${RED}`
                      : '2px solid transparent',
                }}
              >
                {renderDiffLine(line, i)}
              </div>
            ))}
            {visibleDiffLines < DIFF_LINES.length && (
              <span style={{ color: AMBER, opacity: cursorOpacity }}>{'\u258C'}</span>
            )}
          </div>
        </Terminal>
      </div>

      {/* Right panel: validation */}
      <div style={{
        flex: 1,
        maxWidth: 860,
        opacity: rightEntrance,
        transform: `translateX(${rightTranslateX}px)`,
      }}>
        <Terminal title="validation" style={{ height: 480 }}>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            {VALIDATION_LINES.slice(0, visibleValLines).map((line, i) => {
              const lineFrame = VALIDATION_START + i * FRAMES_PER_VAL_LINE;
              const lineOpacity = fadeIn(frame, lineFrame, 6);

              const isSloPass = line.badge === 'pass';
              const isPromoted = line.badge === 'promoted';

              return (
                <div key={i} style={{ opacity: lineOpacity }}>
                  {line.label && (
                    <span style={{ color: TEXT_MUTED }}>{line.label}</span>
                  )}
                  {line.progressBar ? (
                    <SLOBar
                      value={line.progressBar.value}
                      max={line.progressBar.max}
                      color={line.progressBar.color}
                    />
                  ) : (
                    <span style={{ color: line.valueColor }}>{line.value}</span>
                  )}
                  {isSloPass && (
                    <span
                      style={{
                        color: GREEN,
                        textShadow: `0 0 6px ${GREEN}`,
                      }}
                    >
                      {'  ✓ PASS'}
                    </span>
                  )}
                  {isPromoted && (
                    <span
                      style={{
                        color: AMBER,
                        textShadow: `0 0 6px ${AMBER}`,
                        fontWeight: 700,
                      }}
                    >
                      {'  ●'}
                    </span>
                  )}
                </div>
              );
            })}
            {visibleValLines > 0 && visibleValLines < VALIDATION_LINES.length && (
              <span style={{ color: AMBER, opacity: cursorOpacity }}>{'\u258C'}</span>
            )}
          </div>
        </Terminal>
      </div>
    </AbsoluteFill>
  );
};
