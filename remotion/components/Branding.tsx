// Input: Remotion useCurrentFrame/interpolate/spring/useVideoConfig, theme colors, trefoil SVG path
// Output: Beat 7 / standalone -- logo reveal + tagline end card with spring entrances
// Position: Final beat in SelfAssemblyDemo; also standalone LogoReveal composition

import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';
import { BG, FONT, TEXT, AMBER, CYAN } from '../theme';

const TREFOIL_PATH =
  'M 50 15 Q 75 15 75 40 Q 75 55 50 55 Q 25 55 25 70 Q 25 85 50 85 Q 75 85 75 70 Q 75 55 50 55 Q 25 55 25 40 Q 25 15 50 15';

// Approximate path length for strokeDashoffset animation
const PATH_LENGTH = 320;

export const Branding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Trefoil stroke draws over frames 0-30
  const drawProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Center dot springs in at frame 15
  const dotSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 200 },
  });

  // Tagline springs in at frame 30
  const taglineSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 200 },
  });

  const taglineTranslateY = interpolate(taglineSpring, [0, 1], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL springs in at frame 50
  const urlSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 200 },
  });

  const urlTranslateY = interpolate(urlSpring, [0, 1], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo container springs in
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        style={{
          width: 120,
          height: 120,
          marginBottom: 32,
          opacity: logoSpring,
          transform: `scale(${logoScale})`,
        }}
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
          opacity={dotSpring}
        />
      </svg>

      {/* Tagline */}
      <div
        style={{
          fontSize: 36,
          color: TEXT,
          opacity: taglineSpring,
          transform: `translateY(${taglineTranslateY}px)`,
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
          opacity: urlSpring,
          transform: `translateY(${urlTranslateY}px)`,
        }}
      >
        knot0.com
      </div>
    </AbsoluteFill>
  );
};
