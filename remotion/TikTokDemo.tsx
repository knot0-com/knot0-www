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

/** Montage Cut 2-3: Self-evolving servers — code rewrites itself inside. */
const MontageEvolve: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const f = frame - CUT2_START;

  // Old code lines (visible inside cache-layer server)
  const oldCode = [
    'cache = new HashMap<>();',
    'pool = createPool({ max: 10 });',
    'return cache.get(key);',
  ];
  // New code lines (replaces old after evolution)
  const newCode = [
    'cache = new LinkedHashMap<>(',
    '  MAX_SESSIONS, 0.75f, true);',
    'breaker = new CircuitBreaker();',
  ];

  // Phase timing
  const showOldCode = f >= 0;
  const dissolveStart = 8;
  const dissolveEnd = 16;
  const typeNewStart = 16;
  const typeNewEnd = 30;
  const serverRecovered = f >= 28;
  const spawnStart = 36;
  const spawnVisible = f >= spawnStart;

  // Old code dissolve (opacity 1 → 0, each line staggered)
  const oldLineOpacity = (lineIdx: number) => {
    const start = dissolveStart + lineIdx * 2;
    return interpolate(f, [start, start + 6], [1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };

  // New code type-in (each line staggered)
  const newLineOpacity = (lineIdx: number) => {
    const start = typeNewStart + lineIdx * 4;
    return interpolate(f, [start, start + 4], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };

  // Server border color transition
  const srvColor = f < dissolveStart ? RED
    : f < typeNewEnd ? AMBER
    : GREEN;

  // Evolving label
  const evolvingVisible = f >= dissolveStart && f < typeNewEnd + 4;
  const evolvingOpacity = evolvingVisible ? interpolate(
    f % 12, [0, 6, 12], [1, 0.4, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) : 0;

  // Second server (api-gateway) — healthy throughout
  const srv2Color = GREEN;

  // Third server spawn
  const spawnSpring = spawnVisible ? spring({
    frame: f - spawnStart, fps, config: { damping: 200 },
  }) : 0;

  // P99 metric
  const p99 = interpolate(f, [typeNewEnd, typeNewEnd + 15], [340, 38], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const p99Color = p99 > 200 ? RED : p99 > 100 ? AMBER : GREEN;

  // Layout positions (vertical stack for mobile)
  const boxW = 420;
  const boxH = 220;
  const centerX = 540;
  const gap = 28;

  // Server box component with code visible inside
  const ServerWithCode: React.FC<{
    y: number; name: string; color: string;
    codeLines: { text: string; color: string; opacity: number }[];
    badge?: string;
    statusLabel: string;
  }> = ({ y, name, color, codeLines, badge, statusLabel }) => {
    const dotPulse = color === AMBER
      ? interpolate(frame % 10, [0, 5, 10], [1, 0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return (
      <div style={{
        position: 'absolute',
        left: centerX - boxW / 2,
        top: y,
        width: boxW,
        height: boxH,
        border: `2px solid ${color}`,
        borderRadius: 14,
        backgroundColor: `${color}0a`,
        overflow: 'hidden',
        boxShadow: color === GREEN ? `0 0 20px ${GREEN}22` : color === RED ? `0 0 20px ${RED}22` : 'none',
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: `1px solid ${color}33`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: 5,
              backgroundColor: color, opacity: dotPulse,
            }} />
            <span style={{ fontSize: 15, color: TEXT, fontWeight: 600, fontFamily: FONT }}>{name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {badge && (
              <span style={{
                fontSize: 11, color: CYAN, fontFamily: FONT,
                padding: '2px 8px', borderRadius: 4,
                border: `1px solid ${CYAN}44`, backgroundColor: `${CYAN}11`,
              }}>{badge}</span>
            )}
            <span style={{ fontSize: 12, color, fontFamily: FONT }}>{statusLabel}</span>
          </div>
        </div>
        {/* Code visible inside */}
        <div style={{ padding: '12px 16px', fontFamily: FONT, fontSize: 13, lineHeight: 1.7 }}>
          {codeLines.map((line, i) => (
            <div key={i} style={{ color: line.color, opacity: line.opacity, transition: 'none' }}>
              {line.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Build code lines for cache-layer
  const cacheCodeLines = f < dissolveStart
    ? oldCode.map((text, i) => ({ text, color: RED, opacity: 1 }))
    : f < typeNewStart
    ? oldCode.map((text, i) => ({ text, color: RED, opacity: oldLineOpacity(i) }))
    : newCode.map((text, i) => ({ text, color: GREEN, opacity: newLineOpacity(i) }));

  // Static code for api-gateway
  const apiCodeLines = [
    { text: 'handler = sdk.handler({', color: TEXT_DIM, opacity: 1 },
    { text: '  trigger: "http.request",', color: TEXT_DIM, opacity: 1 },
    { text: '  match: "/api/v1/*" });', color: TEXT_DIM, opacity: 1 },
  ];

  // Code for new rate-limiter (types itself)
  const rateLimiterCode = [
    { text: 'handler = sdk.handler({', color: CYAN, opacity: spawnVisible ? interpolate(f - spawnStart, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0 },
    { text: '  trigger: "traffic.spike",', color: CYAN, opacity: spawnVisible ? interpolate(f - spawnStart, [4, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0 },
    { text: '  action: "rate_limit" });', color: CYAN, opacity: spawnVisible ? interpolate(f - spawnStart, [8, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0 },
  ];

  const y1 = 180;
  const y2 = y1 + boxH + gap;
  const y3 = y2 + boxH + gap;

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      fontFamily: FONT, backgroundColor: BG,
    }}>
      {/* Server 1: cache-layer — evolves */}
      <ServerWithCode
        y={y1}
        name="cache-layer"
        color={srvColor}
        codeLines={cacheCodeLines}
        badge={serverRecovered ? 'v2' : evolvingVisible ? 'evolving...' : 'v1'}
        statusLabel={f < dissolveStart ? 'CrashLoop' : f < typeNewEnd ? 'Evolving' : 'Running'}
      />

      {/* Evolving indicator */}
      {evolvingVisible && (
        <div style={{
          position: 'absolute',
          left: centerX - boxW / 2 - 4,
          top: y1,
          width: boxW + 8,
          height: boxH,
          borderRadius: 16,
          border: `2px solid ${AMBER}`,
          opacity: evolvingOpacity * 0.5,
          pointerEvents: 'none',
          boxShadow: `0 0 30px ${AMBER}44`,
        }} />
      )}

      {/* Server 2: api-gateway — healthy */}
      <ServerWithCode
        y={y2}
        name="api-gateway"
        color={srv2Color}
        codeLines={apiCodeLines}
        badge="v3"
        statusLabel="Running"
      />

      {/* Server 3: rate-limiter — spawns from nothing */}
      {spawnVisible && (
        <div style={{
          opacity: spawnSpring,
          transform: `scale(${interpolate(spawnSpring, [0, 1], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
        }}>
          <ServerWithCode
            y={y3}
            name="rate-limiter"
            color={CYAN}
            codeLines={rateLimiterCode}
            badge="new"
            statusLabel="Spawned"
          />
        </div>
      )}

      {/* Connection lines between servers */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line x1={centerX} y1={y1 + boxH} x2={centerX} y2={y2}
          stroke={srvColor} strokeWidth={1.5} opacity={0.3} />
        <line x1={centerX} y1={y2 + boxH} x2={centerX} y2={y3}
          stroke={CYAN} strokeWidth={1.5} opacity={spawnSpring * 0.3} />
      </svg>

      {/* P99 metric at bottom */}
      {f >= typeNewEnd && (
        <div style={{
          position: 'absolute', bottom: 120, width: '100%', textAlign: 'center',
          fontSize: 28, color: p99Color, fontWeight: 700, fontFamily: FONT,
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

          {/* Cut 2-3: Code evolves inside servers */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: montageCutOpacity(CUT2_START, CUT2_END),
            }}
          >
            <MontageEvolve frame={frame} fps={fps} />
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
