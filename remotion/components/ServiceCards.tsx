// Input: services array with name/metric/status/metricValue, frame, theme colors, Remotion spring/interpolate
// Output: 2x2 grid of service status cards with animated dots and metrics
// Position: Right panel content during Beat 1, Beat 2, and Beat 5 in SelfAssemblyDemo

import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { BG_LIGHT, BORDER, GREEN, RED, AMBER, TEXT, TEXT_DIM, FONT } from '../theme';

export interface ServiceInfo {
  name: string;
  metric: string;
  metricValue: string;
  status: 'running' | 'crash' | 'patching';
}

interface ServiceCardsProps {
  services: ServiceInfo[];
  frame: number;
}

const STATUS_COLOR: Record<string, string> = {
  running: GREEN,
  crash: RED,
  patching: AMBER,
};

const STATUS_LABEL: Record<string, string> = {
  running: 'Running',
  crash: 'CrashLoop',
  patching: 'Patching...',
};

export const ServiceCards: React.FC<ServiceCardsProps> = ({ services, frame }) => {
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        padding: 16,
        fontFamily: FONT,
      }}
    >
      {services.map((svc, i) => {
        const entrance = spring({
          frame: Math.max(0, frame - i * 6),
          fps,
          config: { damping: 200 },
        });

        const translateY = interpolate(entrance, [0, 1], [12, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const statusColor = STATUS_COLOR[svc.status] || GREEN;

        // Pulse speed varies by status
        const pulseRate = svc.status === 'crash' ? 12 : svc.status === 'patching' ? 20 : 40;
        const pulseOpacity = interpolate(
          frame % pulseRate,
          [0, pulseRate / 2, pulseRate],
          [1, 0.3, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        return (
          <div
            key={svc.name}
            style={{
              backgroundColor: BG_LIGHT,
              border: `1px solid ${svc.status === 'crash' ? RED : BORDER}`,
              borderRadius: 6,
              padding: 16,
              opacity: entrance,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {/* Status dot + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  color: statusColor,
                  opacity: pulseOpacity,
                  textShadow: `0 0 6px ${statusColor}`,
                  fontSize: 10,
                }}
              >
                {'\u25CF'}
              </span>
              <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{svc.name}</span>
            </div>

            {/* Metric */}
            <div style={{ color: TEXT_DIM, fontSize: 12, marginBottom: 4 }}>
              {svc.metric}: <span style={{ color: TEXT }}>{svc.metricValue}</span>
            </div>

            {/* Status label */}
            <div style={{ color: statusColor, fontSize: 11, fontWeight: 700 }}>
              {STATUS_LABEL[svc.status] || svc.status}
            </div>
          </div>
        );
      })}
    </div>
  );
};
