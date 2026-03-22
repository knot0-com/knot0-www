// Input: visible flag, alert text, frame, theme colors, Remotion spring/interpolate
// Output: Slide-in PagerDuty notification overlay from top-right corner
// Position: Overlay in SelfAssemblyDemo during Beat 2

import React from 'react';
import { spring, interpolate, useVideoConfig } from 'remotion';
import { RED, TEXT, TEXT_DIM, FONT } from '../theme';

interface PagerDutyAlertProps {
  visible: boolean;
  frame: number;
  /** Frame at which the alert first appears */
  enterFrame: number;
  title: string;
  subtitle: string;
  severity: string;
}

export const PagerDutyAlert: React.FC<PagerDutyAlertProps> = ({
  visible,
  frame,
  enterFrame,
  title,
  subtitle,
  severity,
}) => {
  const { fps } = useVideoConfig();

  if (!visible) return null;

  const localFrame = frame - enterFrame;

  // Slide in with spring
  const slideSpring = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const translateY = interpolate(slideSpring, [0, 1], [-60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out after 60 frames
  const fadeOut = interpolate(localFrame, [50, 70], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        right: 24,
        zIndex: 100,
        opacity: slideSpring * fadeOut,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          backgroundColor: `${RED}26`,
          borderLeft: `3px solid ${RED}`,
          borderRadius: 6,
          padding: '14px 20px',
          width: 360,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 700,
            color: RED,
          }}
        >
          {'\uD83D\uDD34'} PagerDuty
        </div>
        <div style={{ color: TEXT, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ color: TEXT_DIM, fontSize: 12 }}>{subtitle}</div>
        <div style={{ color: TEXT_DIM, fontSize: 11, marginTop: 6 }}>
          Severity: {severity} {'\u00B7'} Triggered 3s ago
        </div>
      </div>
    </div>
  );
};
