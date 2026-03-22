// Input: Remotion useCurrentFrame/interpolate, theme colors, trefoil SVG path
// Output: Beat 7 / standalone — logo reveal + tagline end card
// Position: Final beat in SelfAssemblyDemo; also standalone LogoReveal composition

import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import { BG, FONT, TEXT, AMBER, CYAN, fadeIn } from '../theme';

const TREFOIL_PATH =
  'M 50 15 Q 75 15 75 40 Q 75 55 50 55 Q 25 55 25 70 Q 25 85 50 85 Q 75 85 75 70 Q 75 55 50 55 Q 25 55 25 40 Q 25 15 50 15';

// Approximate path length for strokeDashoffset animation
const PATH_LENGTH = 320;

export const Branding: React.FC = () => {
  const frame = useCurrentFrame();

  // Trefoil stroke draws over frames 0-30
  const drawProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Center dot fades in frames 15-30
  const dotOpacity = fadeIn(frame, 15, 15);

  // Tagline fades in frames 30-50
  const taglineOpacity = fadeIn(frame, 30, 20);

  // URL fades in frames 50-65
  const urlOpacity = fadeIn(frame, 50, 15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      {/* Trefoil logo */}
      <svg
        viewBox="0 0 100 100"
        style={{ width: 120, height: 120, marginBottom: 32 }}
      >
        <path
          d={TREFOIL_PATH}
          fill="none"
          stroke={AMBER}
          strokeWidth={2.5}
          strokeDasharray={PATH_LENGTH}
          strokeDashoffset={PATH_LENGTH * (1 - drawProgress)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={50}
          cy={50}
          r={3}
          fill={CYAN}
          opacity={dotOpacity}
        />
      </svg>

      {/* Tagline */}
      <div
        style={{
          fontSize: 36,
          color: TEXT,
          opacity: taglineOpacity,
          marginBottom: 12,
        }}
      >
        {"Software that's alive."}
      </div>

      {/* URL */}
      <div
        style={{
          fontSize: 24,
          color: AMBER,
          opacity: urlOpacity,
        }}
      >
        knot0.com
      </div>
    </AbsoluteFill>
  );
};
