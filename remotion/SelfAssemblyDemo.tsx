// Input: All beat components, @remotion/transitions TransitionSeries, Remotion AbsoluteFill/interpolate/useCurrentFrame
// Output: Main 900-frame demo composition sequencing 7 beats with cross-fade transitions
// Position: Primary composition for Knot0Demo and IncidentResponse

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
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
  api-gateway     handler.ts (47 lines)  \u2713
  cache-layer     handler.ts (31 lines)  \u2713
  health-monitor  handler.ts (22 lines)  \u2713
  load-balancer   handler.ts (18 lines)  \u2713

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

  // Smooth blinking cursor using interpolate
  const cursorOpacity = interpolate(
    frame % 16,
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

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
            <span style={{ color: AMBER, opacity: cursorOpacity }}>{'\u258C'}</span>
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
    } else if (line.includes('\u2713')) {
      // Actor line with checkmark
      const parts = line.split('\u2713');
      nodes.push(
        <span key={`${i}-t`} style={{ color: TEXT }}>{parts[0]}</span>,
      );
      nodes.push(
        <span key={`${i}-c`} style={{ color: GREEN }}>{'\u2713'}</span>,
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
// Main composition
// ---------------------------------------------------------------------------
// TransitionSeries total = sum(sequences) - sum(transitions)
// 6 fade transitions of 15 frames = 90 frames overlap
// Sequences sum to 990 so total = 990 - 90 = 900 frames

export const SelfAssemblyDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT }}>
      <TransitionSeries>
        {/* Beat 1: Config reveal */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <ConfigReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Beat 2: Assembly terminal + code flash */}
        <TransitionSeries.Sequence durationInFrames={195}>
          <Beat2 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Beats 3-4: Metrics dashboard green -> red */}
        <TransitionSeries.Sequence durationInFrames={225}>
          <MetricsDashboard startBreakAtFrame={120} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Beat 5: Evolution diff — the money shot */}
        <TransitionSeries.Sequence durationInFrames={225}>
          <EvolutionDiff />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Beat 6: Evolution log */}
        <TransitionSeries.Sequence durationInFrames={135}>
          <EvolutionLog />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Beat 7: Branding end card */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <Branding />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Subtle scan lines overlay — outside TransitionSeries, layered on top */}
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
