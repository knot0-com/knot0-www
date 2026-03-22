// Input: frame, theme colors, Remotion spring/interpolate/useVideoConfig
// Output: Final branding card with MTTR stat, tagline, and URL with spring-in animations
// Position: Full-screen overlay during Beat 7 in SelfAssemblyDemo

import React from 'react';
import { spring, interpolate, useVideoConfig } from 'remotion';
import { BG, GREEN, TEXT, TEXT_DIM, AMBER, FONT } from '../theme';

interface BrandCardProps {
  frame: number;
  /** Frame within Beat 7 (0-based) */
  localFrame: number;
}

export const BrandCard: React.FC<BrandCardProps> = ({ frame: _frame, localFrame }) => {
  const { fps } = useVideoConfig();

  // Fade from black
  const fadeIn = interpolate(localFrame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // MTTR stat springs in at frame 30
  const mttrSpring = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { damping: 200 },
  });

  const mttrTranslateY = interpolate(mttrSpring, [0, 1], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "No human involved" springs in at frame 45
  const noHumanSpring = spring({
    frame: Math.max(0, localFrame - 45),
    fps,
    config: { damping: 200 },
  });

  const noHumanTranslateY = interpolate(noHumanSpring, [0, 1], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tagline springs in at frame 75
  const taglineSpring = spring({
    frame: Math.max(0, localFrame - 75),
    fps,
    config: { damping: 200 },
  });

  const taglineTranslateY = interpolate(taglineSpring, [0, 1], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL springs in at frame 90
  const urlSpring = spring({
    frame: Math.max(0, localFrame - 90),
    fps,
    config: { damping: 200 },
  });

  const urlTranslateY = interpolate(urlSpring, [0, 1], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        opacity: fadeIn,
        zIndex: 200,
      }}
    >
      {/* MTTR stat */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: GREEN,
          textShadow: `0 0 20px ${GREEN}`,
          opacity: mttrSpring,
          transform: `translateY(${mttrTranslateY}px)`,
          marginBottom: 8,
        }}
      >
        MTTR: 47 seconds
      </div>

      {/* No human involved */}
      <div
        style={{
          fontSize: 20,
          color: TEXT_DIM,
          opacity: noHumanSpring,
          transform: `translateY(${noHumanTranslateY}px)`,
          marginBottom: 60,
        }}
      >
        No human involved.
      </div>

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
    </div>
  );
};
