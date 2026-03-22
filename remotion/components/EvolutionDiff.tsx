// Input: Remotion useCurrentFrame/interpolate, theme colors, Terminal component
// Output: Beat 5 — split-view diff + validation panels
// Position: Fifth beat (the money shot) in SelfAssemblyDemo composition

import React from 'react';
import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';
import { Terminal } from './Terminal';
import { FONT, TEXT, TEXT_DIM, TEXT_MUTED, GREEN, RED, AMBER, fadeIn } from '../theme';

// Diff lines (left panel)
const DIFF_LINES: Array<{ text: string; color: string }> = [
  { text: '// cache-layer/handler.ts  v1 → v2', color: TEXT_DIM },
  { text: '', color: TEXT },
  { text: '- const pool = createPool({ max: 10 });', color: RED },
  { text: '+ const pool = createPool({', color: GREEN },
  { text: '+   max: 50,', color: GREEN },
  { text: '+   idleTimeout: 30_000', color: GREEN },
  { text: '+ });', color: GREEN },
  { text: '+', color: GREEN },
  { text: '+ const breaker = new CircuitBreaker({', color: GREEN },
  { text: '+   threshold: 5,', color: GREEN },
  { text: '+   resetTimeout: 10_000', color: GREEN },
  { text: '+ });', color: GREEN },
];

// Validation lines (right panel)
const VALIDATION_LINES: Array<{ label: string; value: string; valueColor: string }> = [
  { label: 'evolution:', value: ' cache-layer v1 → v2', valueColor: TEXT },
  { label: '', value: '', valueColor: TEXT },
  { label: 'change:', value: '    pool scaling + circuit breaker', valueColor: TEXT },
  { label: '', value: '', valueColor: TEXT },
  { label: 'testing:', value: '   shadow traffic... passed', valueColor: TEXT },
  { label: '', value: '           p99: 340ms → 38ms', valueColor: TEXT },
  { label: '', value: '', valueColor: TEXT },
  { label: 'SLO:', value: '       38ms < 100ms  ', valueColor: TEXT },
  { label: '', value: '', valueColor: TEXT },
  { label: 'promoted:', value: '  v2 now active', valueColor: AMBER },
];

const FRAMES_PER_DIFF_LINE = 4;
const DIFF_TOTAL_FRAMES = DIFF_LINES.length * FRAMES_PER_DIFF_LINE;
const VALIDATION_START = Math.floor(DIFF_TOTAL_FRAMES * 0.6);
const FRAMES_PER_VAL_LINE = 6;

export const EvolutionDiff: React.FC = () => {
  const frame = useCurrentFrame();

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
      <div style={{ flex: 1, maxWidth: 860 }}>
        <Terminal title="diff" style={{ height: 460 }}>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            {DIFF_LINES.slice(0, visibleDiffLines).map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.color,
                  opacity: interpolate(
                    frame,
                    [i * FRAMES_PER_DIFF_LINE, i * FRAMES_PER_DIFF_LINE + 4],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                  ),
                }}
              >
                {line.text || '\u00A0'}
              </div>
            ))}
            {visibleDiffLines < DIFF_LINES.length && (
              <span style={{ color: AMBER, opacity: frame % 20 < 10 ? 1 : 0 }}>_</span>
            )}
          </div>
        </Terminal>
      </div>

      {/* Right panel: validation */}
      <div style={{ flex: 1, maxWidth: 860 }}>
        <Terminal title="validation" style={{ height: 460 }}>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            {VALIDATION_LINES.slice(0, visibleValLines).map((line, i) => {
              const lineFrame = VALIDATION_START + i * FRAMES_PER_VAL_LINE;
              const lineOpacity = fadeIn(frame, lineFrame, 6);

              // SLO line gets a checkmark
              const isSloLine = line.label === 'SLO:';
              const isPromoted = line.label === 'promoted:';

              return (
                <div key={i} style={{ opacity: lineOpacity }}>
                  {line.label && (
                    <span style={{ color: TEXT_MUTED }}>{line.label}</span>
                  )}
                  <span style={{ color: line.valueColor }}>{line.value}</span>
                  {isSloLine && <span style={{ color: GREEN }}>{'✓'}</span>}
                  {isPromoted && null}
                </div>
              );
            })}
            {visibleValLines > 0 && visibleValLines < VALIDATION_LINES.length && (
              <span style={{ color: AMBER, opacity: frame % 20 < 10 ? 1 : 0 }}>_</span>
            )}
          </div>
        </Terminal>
      </div>
    </AbsoluteFill>
  );
};
