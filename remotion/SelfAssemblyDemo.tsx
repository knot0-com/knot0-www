// Input: All beat components, Remotion Sequence/AbsoluteFill/interpolate/useCurrentFrame
// Output: Main 900-frame demo composition sequencing 7 beats with cross-fade transitions
// Position: Primary composition for Knot0Demo and IncidentResponse

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { BG, FONT, AMBER, GREEN, TEXT, TEXT_MUTED, typewriter } from './theme';
import { Terminal } from './components/Terminal';
import { ConfigReveal } from './components/ConfigReveal';
import { CodeFlash } from './components/CodeFlash';
import { MetricsDashboard } from './components/MetricsDashboard';
import { EvolutionDiff } from './components/EvolutionDiff';
import { EvolutionLog } from './components/EvolutionLog';
import { Branding } from './components/Branding';

// ---------------------------------------------------------------------------
// Beat 2 inner component — assembly terminal + code flash overlay
// ---------------------------------------------------------------------------

const ASSEMBLY_TEXT = `$ knot0 deploy --goal knot0.yaml

Assembling actors from goal...
  api-gateway     handler.ts (47 lines)  ✓
  cache-layer     handler.ts (31 lines)  ✓
  health-monitor  handler.ts (22 lines)  ✓
  load-balancer   handler.ts (18 lines)  ✓

Topology: 4 actors, 6 connections
Starting...`;

const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = typewriter(frame, ASSEMBLY_TEXT, 2);

  // CodeFlash overlay: fade in 120-135, hold, fade out 165-180
  const codeOpacity = interpolate(frame, [120, 135, 165, 180], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Colorize assembly output
  const colorized = colorizeAssembly(visible, frame);

  return (
    <>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          padding: 80,
          // Fade out terminal when code flashes in
          opacity: interpolate(frame, [120, 135], [1, 0.15], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <Terminal title="terminal" style={{ width: 900 }}>
          <span style={{ fontSize: 16, lineHeight: 1.7 }}>
            {colorized}
            <span style={{ color: AMBER, opacity: frame % 20 < 10 ? 1 : 0 }}>_</span>
          </span>
        </Terminal>
      </AbsoluteFill>

      {codeOpacity > 0 && <CodeFlash opacity={codeOpacity} />}
    </>
  );
};

function colorizeAssembly(visible: string, _frame: number): React.ReactNode[] {
  const lines = visible.split('\n');
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (i > 0) nodes.push('\n');
    const line = lines[i];

    if (line.startsWith('$')) {
      // Command line
      nodes.push(
        <span key={i} style={{ color: AMBER }}>{line}</span>,
      );
    } else if (line.includes('✓')) {
      // Actor line with checkmark
      const parts = line.split('✓');
      nodes.push(
        <span key={`${i}-t`} style={{ color: TEXT }}>{parts[0]}</span>,
      );
      nodes.push(
        <span key={`${i}-c`} style={{ color: GREEN }}>{'✓'}</span>,
      );
      if (parts[1]) {
        nodes.push(
          <span key={`${i}-r`} style={{ color: TEXT }}>{parts[1]}</span>,
        );
      }
    } else if (line.startsWith('Assembling') || line.startsWith('Topology') || line.startsWith('Starting')) {
      nodes.push(
        <span key={i} style={{ color: TEXT_MUTED }}>{line}</span>,
      );
    } else {
      nodes.push(
        <span key={i} style={{ color: TEXT }}>{line}</span>,
      );
    }
  }

  return nodes;
}

// ---------------------------------------------------------------------------
// Cross-beat fade wrapper
// ---------------------------------------------------------------------------

interface FadeWrapProps {
  children: React.ReactNode;
  durationInFrames: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

const FadeWrap: React.FC<FadeWrapProps> = ({
  children,
  durationInFrames,
  fadeInDuration = 15,
  fadeOutDuration = 15,
}) => {
  const frame = useCurrentFrame();

  const inOpacity = fadeInDuration > 0
    ? interpolate(frame, [0, fadeInDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const outOpacity = fadeOutDuration > 0
    ? interpolate(
        frame,
        [durationInFrames - fadeOutDuration, durationInFrames],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : 1;

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

export const SelfAssemblyDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT }}>
      {/* Beat 1: Config reveal (frames 0-89) — fade out only */}
      <Sequence from={0} durationInFrames={90}>
        <FadeWrap durationInFrames={90} fadeInDuration={0} fadeOutDuration={15}>
          <ConfigReveal />
        </FadeWrap>
      </Sequence>

      {/* Beat 2: Assembly terminal + code flash (frames 90-269) */}
      <Sequence from={90} durationInFrames={180}>
        <FadeWrap durationInFrames={180} fadeInDuration={15} fadeOutDuration={15}>
          <Beat2 />
        </FadeWrap>
      </Sequence>

      {/* Beats 3-4: Metrics dashboard green → red (frames 270-479) */}
      <Sequence from={270} durationInFrames={210}>
        <FadeWrap durationInFrames={210} fadeInDuration={15} fadeOutDuration={15}>
          <MetricsDashboard startBreakAtFrame={120} />
        </FadeWrap>
      </Sequence>

      {/* Beat 5: Evolution diff — the money shot (frames 480-689) */}
      <Sequence from={480} durationInFrames={210}>
        <FadeWrap durationInFrames={210} fadeInDuration={15} fadeOutDuration={15}>
          <EvolutionDiff />
        </FadeWrap>
      </Sequence>

      {/* Beat 6: Evolution log (frames 690-809) */}
      <Sequence from={690} durationInFrames={120}>
        <FadeWrap durationInFrames={120} fadeInDuration={15} fadeOutDuration={15}>
          <EvolutionLog />
        </FadeWrap>
      </Sequence>

      {/* Beat 7: Branding end card (frames 810-899) — fade in only */}
      <Sequence from={810} durationInFrames={90}>
        <FadeWrap durationInFrames={90} fadeInDuration={15} fadeOutDuration={0}>
          <Branding />
        </FadeWrap>
      </Sequence>

      {/* Subtle scan lines overlay */}
      <AbsoluteFill
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
