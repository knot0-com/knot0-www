// Input: Remotion AbsoluteFill/useCurrentFrame/interpolate/spring/useVideoConfig, theme tokens
// Output: 450-frame TikTok-format (1080x1920) composition — "POV: 2am production incident"
// Position: Standalone vertical video composition registered in Root.tsx

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import {
  BG,
  FONT,
  AMBER,
  CYAN,
  GREEN,
  RED,
  TEXT,
  TEXT_DIM,
  TEXT_MUTED,
} from './theme';

// ---------------------------------------------------------------------------
// Beat boundaries (frames)
// ---------------------------------------------------------------------------

const BEAT1_START = 0; // The Page (0-59)
const BEAT1_END = 59;
const BEAT2_START = 60; // Text Overlay (60-119)
const BEAT2_END = 119;
const BEAT3_START = 120; // Dashboard Montage (120-239)
const BEAT3_END = 239;
const BEAT4_START = 240; // Phone Returns (240-359)
const BEAT4_END = 359;
const BEAT5_START = 360; // Brand (360-449)

// Montage cut boundaries
const CUT1_START = 120;
const CUT1_END = 149;
const CUT2_START = 150;
const CUT2_END = 209; // merged: agent writes fix + sends to servers + pods recover
const CUT4_START = 210;
const CUT4_END = 239;

// Cross-fade duration between montage cuts
const XFADE = 5;

// ---------------------------------------------------------------------------
// Inline helper components
// ---------------------------------------------------------------------------

/** SF-style font stack for iPhone time display. */
const SF_FONT = "'SF Pro Display', 'Helvetica Neue', sans-serif";

/** Phone lock screen with iPhone frame, dynamic island, iOS notifications. */
const PhoneLockScreen: React.FC<{
  frame: number;
  fps: number;
  time: string;
  notification: 'alert' | 'resolved' | null;
  fadeOut?: boolean;
}> = ({ frame, fps, time, notification, fadeOut }) => {
  // Notification slide-in spring
  const notifLocalFrame =
    notification === 'alert'
      ? frame
      : notification === 'resolved'
        ? Math.max(0, frame - BEAT4_START - 15)
        : 0;

  const notifSpring = spring({
    frame: notifLocalFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const notifY = interpolate(notifSpring, [0, 1], [-120, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phone vibration effect (Beat 1 only, after notification appears)
  const vibrationActive =
    notification === 'alert' && frame >= 20 && frame <= 50;
  const vibrationX = vibrationActive
    ? Math.sin(frame * 2.5) * 3
    : 0;

  // Screen fade-off effect (Beat 4: engineer never woke up)
  const screenOffOpacity = fadeOut
    ? interpolate(frame, [BEAT4_START + 90, BEAT4_START + 110], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const screenOffScale = fadeOut
    ? interpolate(frame, [BEAT4_START + 90, BEAT4_START + 110], [1, 0.98], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const isAlert = notification === 'alert';
  const isResolved = notification === 'resolved';
  const appIconBg = isAlert ? RED : isResolved ? GREEN : '#666';
  const notifTitle = isAlert
    ? 'payment-svc: p99 latency > 200ms'
    : 'payment-svc: Resolved automatically';
  const notifSub = isAlert
    ? 'Severity: P1 \u00B7 Triggered 3s ago'
    : 'MTTR: 47 seconds';

  // Phone frame dimensions
  const PHONE_W = 640;
  const PHONE_H = 1380;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Phone frame — vibration applies here, not to background */}
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 48,
          border: '3px solid #333',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
          transform: `translateX(${vibrationX}px) scale(${screenOffScale})`,
          opacity: screenOffOpacity,
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#000',
            zIndex: 20,
          }}
        />

        {/* Screen content area */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 44,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #0c0c1a 0%, #0a0a0a 100%)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Status bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 44px 0 44px',
              height: 34,
              fontFamily: SF_FONT,
              fontSize: 22,
              fontWeight: 600,
              color: '#fff',
              zIndex: 10,
            }}
          >
            {/* Left: carrier */}
            <span style={{ width: 130 }}>T-Mobile</span>

            {/* Center: status bar time (small) */}
            <span style={{ fontSize: 22, fontWeight: 600 }}>
              {time.replace(' AM', '').replace(' PM', '')}
            </span>

            {/* Right: wifi + battery */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                justifyContent: 'flex-end',
                width: 130,
              }}
            >
              {/* Wifi bars — 3 ascending rectangles */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5 }}>
                <div style={{ width: 5, height: 8, borderRadius: 1.5, backgroundColor: '#fff' }} />
                <div style={{ width: 5, height: 13, borderRadius: 1.5, backgroundColor: '#fff' }} />
                <div style={{ width: 5, height: 18, borderRadius: 1.5, backgroundColor: '#fff' }} />
              </div>
              {/* Battery icon */}
              <div
                style={{
                  width: 38,
                  height: 18,
                  borderRadius: 4,
                  border: '2px solid #fff',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 1.5,
                }}
              >
                {/* Battery fill */}
                <div
                  style={{
                    width: '70%',
                    height: '100%',
                    borderRadius: 1.5,
                    backgroundColor: '#fff',
                  }}
                />
                {/* Battery nub */}
                <div
                  style={{
                    position: 'absolute',
                    right: -4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 2,
                    height: 5,
                    borderRadius: '0 1px 1px 0',
                    backgroundColor: '#fff',
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Big time display */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 128,
                fontWeight: 300,
                color: '#ffffff',
                letterSpacing: 2,
                fontFamily: SF_FONT,
                lineHeight: 1,
              }}
            >
              {time.replace(' AM', '').replace(' PM', '')}
            </div>
            <div
              style={{
                fontSize: 28,
                color: TEXT_DIM,
                marginTop: 16,
                fontFamily: SF_FONT,
                fontWeight: 400,
              }}
            >
              Saturday, March 22
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              style={{
                position: 'absolute',
                top: '56%',
                left: 26,
                right: 26,
                transform: `translateY(${notifY}px)`,
                opacity: notifSpring,
                background: 'rgba(30, 30, 30, 0.85)',
                borderRadius: 24,
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {/* App icon row + time */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* App icon */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 13,
                      backgroundColor: appIconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: SF_FONT,
                    }}
                  >
                    PD
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: TEXT_MUTED,
                        letterSpacing: 0.5,
                        textTransform: 'uppercase' as const,
                        fontFamily: SF_FONT,
                      }}
                    >
                      PAGERDUTY
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: TEXT_MUTED,
                    fontFamily: SF_FONT,
                  }}
                >
                  now
                </span>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: SF_FONT,
                  marginTop: 2,
                  lineHeight: 1.3,
                }}
              >
                {notifTitle}
              </div>

              {/* Body */}
              <div
                style={{
                  fontSize: 22,
                  color: TEXT_DIM,
                  fontFamily: SF_FONT,
                  lineHeight: 1.4,
                }}
              >
                {notifSub}
              </div>
            </div>
          )}

          {/* Bottom icons — flashlight and camera */}
          <div
            style={{
              position: 'absolute',
              bottom: 64,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 56px',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              {'\uD83D\uDD26'}
            </div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              {'\uD83D\uDCF7'}
            </div>
          </div>

          {/* Home indicator bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40%',
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Big TikTok-style centered text overlay. */
const TextOverlay: React.FC<{
  frame: number;
  fps: number;
  lines: string[];
  fontSize?: number;
  startFrame: number;
}> = ({ frame, fps, lines, fontSize = 48, startFrame }) => {
  const localFrame = Math.max(0, frame - startFrame);

  const scaleSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const scale = interpolate(scaleSpring, [0, 1], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 10,
        opacity: scaleSpring,
        transform: `scale(${scale})`,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontSize,
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            fontFamily: FONT,
            textAlign: 'center',
            lineHeight: 1.3,
            padding: '0 40px',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Montage panels
// ---------------------------------------------------------------------------

/** Montage Cut 1: Agent discovering context. */
const MontageDiscovery: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - CUT1_START;

  const lines = [
    { src: '[Prometheus]', text: 'memory > 2GB', delay: 0 },
    { src: '[Kubernetes]', text: '2 pods CrashLoop', delay: 6 },
    { src: '[Git Blame]', text: '"Add session caching"', delay: 12 },
    { src: '[Heap Dump]', text: 'Unbounded HashMap', delay: 18 },
  ];

  return (
    <div
      style={{
        padding: 60,
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: 18,
          color: TEXT_MUTED,
          marginBottom: 12,
          letterSpacing: 2,
        }}
      >
        KNOT0 AGENT
      </div>
      <div style={{ fontSize: 20, color: CYAN, marginBottom: 24 }}>
        {'\u25D0'} Discovering context...
      </div>
      {lines.map((l, i) => {
        const visible = localFrame >= l.delay;
        return (
          <div
            key={i}
            style={{
              fontSize: 18,
              color: TEXT,
              marginBottom: 10,
              opacity: visible ? 1 : 0,
            }}
          >
            <span style={{ color: CYAN }}>{'\u2192'} {l.src}</span>{' '}
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** Montage Cut 2: Agent generates fix + sends to servers. */
const MontageFixAndDeploy: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - CUT2_START;

  // Agent node appears
  const agentSpring = spring({ frame: localFrame, fps, config: { damping: 200 } });

  // Code materializes around agent (frames 5-15)
  const codeVisible = interpolate(localFrame, [5, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Patch flies to servers (frames 16-25)
  const patchProgress1 = interpolate(localFrame, [16, 24], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const patchProgress2 = interpolate(localFrame, [18, 26], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Extend into cut 3 time range for server recovery
  const extFrame = frame - CUT2_START;

  // Server pod status (frames 24-40 — extends into cut 3)
  const pod1Status = extFrame < 24 ? 'crash' : extFrame < 32 ? 'patching' : 'running';
  const pod2Status = extFrame < 26 ? 'crash' : extFrame < 35 ? 'patching' : 'running';

  // p99 recovery (frames 28-45)
  const p99 = interpolate(extFrame, [28, 45], [340, 38], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const p99Color = p99 > 200 ? RED : p99 > 100 ? AMBER : GREEN;

  const podColor = (status: string) =>
    status === 'crash' ? RED : status === 'patching' ? AMBER : GREEN;
  const podLabel = (status: string) =>
    status === 'crash' ? 'CrashLoop' : status === 'patching' ? 'Restarting...' : 'Running';
  const podDot = (status: string, f: number) => {
    const pulse = status === 'patching'
      ? interpolate(f % 10, [0, 5, 10], [1, 0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return pulse;
  };

  // Positions
  const agentX = 540; // center
  const agentY = 340;
  const srv1X = 260;
  const srv1Y = 800;
  const srv2X = 820;
  const srv2Y = 800;

  // Patch position (interpolate from agent to server)
  const patch1X = interpolate(patchProgress1, [0, 1], [agentX, srv1X], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const patch1Y = interpolate(patchProgress1, [0, 1], [agentY + 60, srv1Y - 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const patch2X = interpolate(patchProgress2, [0, 1], [agentX, srv2X], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const patch2Y = interpolate(patchProgress2, [0, 1], [agentY + 60, srv2Y - 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const ServerBox: React.FC<{ x: number; y: number; name: string; status: string }> = ({ x, y, name, status }) => (
    <div style={{
      position: 'absolute',
      left: x - 120,
      top: y - 60,
      width: 240,
      height: 160,
      border: `2px solid ${podColor(status)}`,
      borderRadius: 12,
      backgroundColor: `${podColor(status)}11`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}>
      <div style={{ fontSize: 13, color: TEXT_MUTED, letterSpacing: 1 }}>KUBERNETES</div>
      <div style={{ fontSize: 18, color: TEXT, fontWeight: 600 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 10, height: 10, borderRadius: 5,
          backgroundColor: podColor(status),
          opacity: podDot(status, frame),
        }} />
        <span style={{ fontSize: 15, color: podColor(status) }}>{podLabel(status)}</span>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      fontFamily: FONT,
      backgroundColor: BG,
    }}>
      {/* Agent node */}
      <div style={{
        position: 'absolute',
        left: agentX - 80,
        top: agentY - 50,
        width: 160,
        height: 100,
        border: `2px solid ${AMBER}`,
        borderRadius: 12,
        backgroundColor: `${AMBER}15`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        opacity: agentSpring,
        transform: `scale(${interpolate(agentSpring, [0, 1], [0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
        boxShadow: `0 0 30px ${AMBER}33`,
      }}>
        <div style={{ fontSize: 13, color: TEXT_MUTED, letterSpacing: 1 }}>KNOT0 AGENT</div>
        <div style={{ fontSize: 16, color: AMBER, fontWeight: 600 }}>
          {localFrame < 15 ? 'Writing fix...' : 'Deploying'}
        </div>
      </div>

      {/* Code materializing around agent */}
      {codeVisible > 0 && codeVisible < 1 && (
        <div style={{
          position: 'absolute',
          left: agentX - 140,
          top: agentY + 60,
          opacity: codeVisible,
          fontSize: 11,
          color: CYAN,
          lineHeight: 1.5,
          width: 280,
          textAlign: 'center',
        }}>
          <span style={{ color: GREEN }}>+LRU cache</span>{' '}
          <span style={{ color: GREEN }}>+circuit breaker</span>
        </div>
      )}

      {/* Connection lines (SVG) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* Agent to Server 1 */}
        <line
          x1={agentX} y1={agentY + 50}
          x2={srv1X} y2={srv1Y - 60}
          stroke={patchProgress1 >= 1 ? podColor(pod1Status) : TEXT_MUTED}
          strokeWidth={2}
          strokeDasharray={patchProgress1 > 0 ? 'none' : '6 4'}
          opacity={localFrame >= 16 ? 0.6 : 0.15}
        />
        {/* Agent to Server 2 */}
        <line
          x1={agentX} y1={agentY + 50}
          x2={srv2X} y2={srv2Y - 60}
          stroke={patchProgress2 >= 1 ? podColor(pod2Status) : TEXT_MUTED}
          strokeWidth={2}
          strokeDasharray={patchProgress2 > 0 ? 'none' : '6 4'}
          opacity={localFrame >= 18 ? 0.6 : 0.15}
        />
      </svg>

      {/* Flying patches */}
      {patchProgress1 > 0 && patchProgress1 < 1 && (
        <div style={{
          position: 'absolute',
          left: patch1X - 24,
          top: patch1Y - 12,
          width: 48, height: 24,
          borderRadius: 6,
          backgroundColor: CYAN,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: BG, fontWeight: 700,
          boxShadow: `0 0 16px ${CYAN}`,
        }}>
          PATCH
        </div>
      )}
      {patchProgress2 > 0 && patchProgress2 < 1 && (
        <div style={{
          position: 'absolute',
          left: patch2X - 24,
          top: patch2Y - 12,
          width: 48, height: 24,
          borderRadius: 6,
          backgroundColor: CYAN,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: BG, fontWeight: 700,
          boxShadow: `0 0 16px ${CYAN}`,
        }}>
          PATCH
        </div>
      )}

      {/* Server boxes */}
      <ServerBox x={srv1X} y={srv1Y} name="prod-k8s-01" status={pod1Status} />
      <ServerBox x={srv2X} y={srv2Y} name="prod-k8s-02" status={pod2Status} />

      {/* P99 metric */}
      {extFrame >= 28 && (
        <div style={{
          position: 'absolute',
          bottom: 160,
          width: '100%',
          textAlign: 'center',
          fontSize: 28,
          color: p99Color,
          fontWeight: 700,
          textShadow: p99 <= 100 ? `0 0 20px ${GREEN}` : 'none',
        }}>
          p99: {Math.round(p99)}ms
        </div>
      )}
    </div>
  );
};

/** Montage Cut 4: Resolved. */
const MontageResolved: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const localFrame = frame - CUT4_START;

  const checkSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const stats = [
    { label: 'MTTR:', value: '47 seconds', color: GREEN, glow: true },
    { label: '', value: '2 pods patched', color: TEXT, glow: false },
    { label: '', value: '0 downtime', color: TEXT, glow: false },
  ];

  return (
    <div
      style={{
        padding: 60,
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: 56,
          color: GREEN,
          opacity: checkSpring,
          transform: `scale(${interpolate(checkSpring, [0, 1], [0.5, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })})`,
          marginBottom: 16,
        }}
      >
        {'\u2713'}
      </div>
      <div
        style={{
          fontSize: 22,
          color: TEXT_MUTED,
          letterSpacing: 2,
          marginBottom: 32,
          opacity: checkSpring,
        }}
      >
        INCIDENT RESOLVED
      </div>
      {stats.map((s, i) => {
        const statSpring = spring({
          frame: Math.max(0, localFrame - 8 - i * 6),
          fps,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <div
            key={i}
            style={{
              fontSize: 24,
              color: s.color,
              opacity: statSpring,
              textShadow: s.glow ? `0 0 20px ${GREEN}` : 'none',
              marginBottom: 8,
              transform: `translateY(${interpolate(statSpring, [0, 1], [12, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}px)`,
            }}
          >
            {s.label ? `${s.label} ${s.value}` : s.value}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

export const TikTokDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat detection
  const isBeat1 = frame >= BEAT1_START && frame <= BEAT1_END;
  const isBeat2 = frame >= BEAT2_START && frame <= BEAT2_END;
  const isBeat3 = frame >= BEAT3_START && frame <= BEAT3_END;
  const isBeat4 = frame >= BEAT4_START && frame <= BEAT4_END;
  const isBeat5 = frame >= BEAT5_START;

  // Phone screen visible in Beat 1, Beat 2 (faded), Beat 4
  const phoneVisible = isBeat1 || isBeat2 || isBeat4;

  // Beat 2: fade the phone screen
  const phoneDim = isBeat2
    ? interpolate(frame, [BEAT2_START, BEAT2_START + 10], [1, 0.3], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Beat 4: "slept through it" text appears after screen fades off
  const punchlineVisible = frame >= BEAT4_START + 115;
  const punchlineLocalFrame = Math.max(0, frame - (BEAT4_START + 115));

  // ---------------------------------------------------------------------------
  // Montage cross-fade helpers
  // ---------------------------------------------------------------------------

  const montageCutOpacity = (cutStart: number, cutEnd: number): number => {
    if (frame < cutStart || frame > cutEnd + XFADE) return 0;
    // Fade in
    const fadeIn = interpolate(
      frame,
      [cutStart, cutStart + XFADE],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
    // Fade out
    const fadeOut = interpolate(
      frame,
      [cutEnd, cutEnd + XFADE],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
    return fadeIn * fadeOut;
  };

  // ---------------------------------------------------------------------------
  // Brand beat spring animations
  // ---------------------------------------------------------------------------

  const brandLine1Spring = spring({
    frame: Math.max(0, frame - 360),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const brandLine2Spring = spring({
    frame: Math.max(0, frame - 380),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const brandLine3Spring = spring({
    frame: Math.max(0, frame - 400),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT }}>
      {/* ---- Phone lock screen (Beat 1 + Beat 2 bg + Beat 4) ---- */}
      {phoneVisible && (
        <div style={{ position: 'absolute', inset: 0, opacity: phoneDim }}>
          <PhoneLockScreen
            frame={frame}
            fps={fps}
            time={isBeat4 ? '2:48 AM' : '2:47 AM'}
            notification={
              isBeat4 || frame >= BEAT4_START
                ? 'resolved'
                : frame >= BEAT1_START
                  ? 'alert'
                  : null
            }
            fadeOut={isBeat4}
          />
        </div>
      )}

      {/* ---- Beat 2: text overlay ---- */}
      {isBeat2 && (
        <TextOverlay
          frame={frame}
          fps={fps}
          lines={['but I set up knot0', 'last week...']}
          fontSize={48}
          startFrame={BEAT2_START}
        />
      )}

      {/* ---- Beat 3: Dashboard montage ---- */}
      {isBeat3 && (
        <AbsoluteFill style={{ backgroundColor: BG }}>
          {/* Cut 1: Discovery */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: montageCutOpacity(CUT1_START, CUT1_END),
            }}
          >
            <MontageDiscovery frame={frame} />
          </div>

          {/* Cut 2-3: Agent writes fix + deploys to servers */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: montageCutOpacity(CUT2_START, CUT2_END),
            }}
          >
            <MontageFixAndDeploy frame={frame} fps={fps} />
          </div>

          {/* Cut 4: Resolved */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: montageCutOpacity(CUT4_START, CUT4_END),
            }}
          >
            <MontageResolved frame={frame} fps={fps} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---- Beat 4: punchline text ---- */}
      {punchlineVisible && !isBeat5 && (
        <TextOverlay
          frame={frame}
          fps={fps}
          lines={['the engineer', 'slept through it.']}
          fontSize={52}
          startFrame={BEAT4_START + 115}
        />
      )}

      {/* ---- Beat 5: Brand ---- */}
      {isBeat5 && (
        <AbsoluteFill
          style={{
            backgroundColor: BG,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 40,
              color: TEXT,
              fontWeight: 700,
              opacity: brandLine1Spring,
              transform: `translateY(${interpolate(brandLine1Spring, [0, 1], [16, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}px)`,
              marginBottom: 16,
              fontFamily: FONT,
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            Software that writes itself.
          </div>
          <div
            style={{
              fontSize: 32,
              color: TEXT_DIM,
              opacity: brandLine2Spring,
              transform: `translateY(${interpolate(brandLine2Spring, [0, 1], [12, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}px)`,
              marginBottom: 16,
              fontFamily: FONT,
              textAlign: 'center',
            }}
          >
            And never stops.
          </div>
          <div
            style={{
              fontSize: 28,
              color: AMBER,
              opacity: brandLine3Spring,
              transform: `translateY(${interpolate(brandLine3Spring, [0, 1], [8, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}px)`,
              fontFamily: FONT,
              textAlign: 'center',
            }}
          >
            knot0.com
          </div>
        </AbsoluteFill>
      )}

      {/* Subtle scan lines overlay (matches SelfAssemblyDemo style) */}
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
