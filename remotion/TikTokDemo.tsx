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

const BEAT1_START = 0; // The Page (0-49)
const BEAT1_END = 49;
const BEAT2_START = 50; // Text Overlay (50-89)
const BEAT2_END = 89;
const BEAT3_START = 90; // Dashboard Montage (90-359)
const BEAT3_END = 359;
const BEAT4_START = 360; // Phone Returns (360-449)
const BEAT4_END = 449;
const BEAT5_START = 450; // Brand (450-539)

// Montage cut boundaries
const CUT1_START = 90;  // Discovery: 90 frames (3s)
const CUT1_END = 179;
const CUT2_START = 180; // Self-evolving: 120 frames (4s)
const CUT2_END = 299;
const CUT4_START = 300; // Resolved: 60 frames (2s)
const CUT4_END = 359;

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
    { src: '[Prometheus]', text: 'memory > 2GB, spiking since 14:32', delay: 10 },
    { src: '[Kubernetes]', text: '2 pods in CrashLoopBackOff', delay: 25 },
    { src: '[Git Blame]', text: 'Last change: "Add session caching"', delay: 40 },
    { src: '[Heap Dump]', text: 'Unbounded HashMap in SessionCache', delay: 55 },
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
          fontSize: 24,
          color: TEXT_MUTED,
          marginBottom: 16,
          letterSpacing: 2,
        }}
      >
        KNOT0 AGENT
      </div>
      <div style={{ fontSize: 26, color: CYAN, marginBottom: 32 }}>
        {'\u25D0'} Discovering context...
      </div>
      {lines.map((l, i) => {
        const visible = localFrame >= l.delay;
        return (
          <div
            key={i}
            style={{
              fontSize: 22,
              color: TEXT,
              marginBottom: 16,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-20px)',
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
    { text: 'cache = new HashMap<>();', problem: true },
    { text: 'pool = createPool({ max: 10 });', problem: true },
    { text: 'return cache.get(key);', problem: false },
  ];
  // New code lines (replaces old after evolution)
  const newCode = [
    'cache = new LinkedHashMap<>(',
    '  MAX_SESSIONS, 0.75f, true);',
    'breaker = new CircuitBreaker({',
    '  threshold: 5, reset: 10_000',
    '});',
  ];

  // === PHASE TIMING (120 frames total) ===
  // Phase 1: Show broken code with problem highlighted (0-14)
  // Phase 2: Agent analyzes — "analyzing..." indicator (10-20)
  // Phase 3: Old code gets red highlight + strikethrough, then dissolves (20-40)
  // Phase 4: New code types in with cyan glow (40-70)
  // Phase 5: Recovery ripple + v2 badge (65-80)
  // Phase 6: New actor spawns from api-gateway (85-115)
  const analyzeStart = 10;
  const analyzeEnd = 22;
  const highlightStart = 18;
  const dissolveStart = 25;
  const typeNewStart = 42;
  const typeNewEnd = 70;
  const recoveryFrame = 68;
  const spawnStart = 88;
  const spawnVisible = f >= spawnStart;

  // Problem line highlight (red background glow before dissolve)
  const problemHighlight = (lineIdx: number) => {
    if (!oldCode[lineIdx].problem) return 0;
    return interpolate(f, [highlightStart, highlightStart + 6], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };

  // Old code dissolve (opacity 1 → 0, staggered)
  const oldLineOpacity = (lineIdx: number) => {
    const start = dissolveStart + lineIdx * 5;
    return interpolate(f, [start, start + 10], [1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };

  // New code type-in (staggered, with glow)
  const newLineProgress = (lineIdx: number) => {
    const start = typeNewStart + lineIdx * 6;
    return interpolate(f, [start, start + 6], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };

  // Server border color
  const srvColor = f < highlightStart ? RED
    : f < typeNewEnd ? AMBER
    : GREEN;

  // Recovery ripple (expanding ring at recoveryFrame)
  const rippleActive = f >= recoveryFrame && f < recoveryFrame + 20;
  const rippleProgress = rippleActive ? interpolate(
    f, [recoveryFrame, recoveryFrame + 20], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) : 0;

  // Analyzing indicator
  const analyzingVisible = f >= analyzeStart && f < analyzeEnd;
  const analyzeDots = analyzingVisible ? '.'.repeat(1 + Math.floor((f - analyzeStart) / 4) % 3) : '';

  // Third server spawn — springs from api-gateway position
  const spawnSpring = spawnVisible ? spring({
    frame: f - spawnStart, fps, config: { damping: 15, stiffness: 100 },
  }) : 0;

  // P99 metric
  const p99 = interpolate(f, [typeNewEnd - 5, typeNewEnd + 20], [340, 38], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const p99Color = p99 > 200 ? RED : p99 > 100 ? AMBER : GREEN;

  // Layout
  const boxW = 480;
  const boxH = 260;
  const centerX = 540;
  const gap = 24;
  const y1 = 140;
  const y2 = y1 + boxH + gap;
  const y3 = y2 + boxH + gap;

  // Spawn position interpolation (starts at y2, moves to y3)
  const spawnY = interpolate(spawnSpring, [0, 1], [y2, y3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      fontFamily: FONT, backgroundColor: BG,
    }}>
      {/* ===== SERVER 1: cache-layer — EVOLVES ===== */}
      <div style={{
        position: 'absolute',
        left: centerX - boxW / 2, top: y1,
        width: boxW, height: boxH,
        border: `2px solid ${srvColor}`,
        borderRadius: 14,
        backgroundColor: `${srvColor}08`,
        overflow: 'hidden',
        boxShadow: srvColor === GREEN
          ? `0 0 30px ${GREEN}33`
          : srvColor === RED
          ? `0 0 20px ${RED}22`
          : `0 0 25px ${AMBER}22`,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', borderBottom: `1px solid ${srvColor}33`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 12, height: 12, borderRadius: 6,
              backgroundColor: srvColor,
              boxShadow: `0 0 8px ${srvColor}`,
              opacity: srvColor === AMBER
                ? interpolate(frame % 10, [0, 5, 10], [1, 0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                : 1,
            }} />
            <span style={{ fontSize: 18, color: TEXT, fontWeight: 700, fontFamily: FONT }}>cache-layer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Version badge */}
            <span style={{
              fontSize: 13, fontFamily: FONT, fontWeight: 600,
              padding: '3px 10px', borderRadius: 6,
              color: f >= recoveryFrame ? GREEN : f >= dissolveStart ? AMBER : RED,
              border: `1px solid ${f >= recoveryFrame ? GREEN : f >= dissolveStart ? AMBER : RED}44`,
              backgroundColor: `${f >= recoveryFrame ? GREEN : f >= dissolveStart ? AMBER : RED}11`,
            }}>
              {f >= recoveryFrame ? 'v2' : f >= dissolveStart ? 'evolving...' : 'v1'}
            </span>
            <span style={{ fontSize: 14, color: srvColor, fontFamily: FONT, fontWeight: 600 }}>
              {f < dissolveStart ? 'CrashLoop' : f < typeNewEnd ? 'Evolving' : 'Running'}
            </span>
          </div>
        </div>

        {/* Analyzing indicator */}
        {analyzingVisible && (
          <div style={{
            padding: '8px 18px', fontSize: 14, color: AMBER, fontFamily: FONT,
            backgroundColor: `${AMBER}08`,
          }}>
            {'\u25D0'} analyzing root cause{analyzeDots}
          </div>
        )}

        {/* Code area */}
        <div style={{ padding: '10px 18px', fontFamily: FONT, fontSize: 15, lineHeight: 1.9 }}>
          {f < typeNewStart ? (
            // Old code — with problem highlighting
            oldCode.map((line, i) => {
              const highlight = problemHighlight(i);
              const opacity = f >= dissolveStart ? oldLineOpacity(i) : 1;
              return (
                <div key={`old-${i}`} style={{
                  color: RED,
                  opacity,
                  backgroundColor: highlight > 0 ? `${RED}${Math.round(highlight * 20).toString(16).padStart(2, '0')}` : 'transparent',
                  borderLeft: highlight > 0 ? `3px solid ${RED}` : '3px solid transparent',
                  paddingLeft: 8,
                  marginLeft: -11,
                  textDecoration: f >= dissolveStart + i * 5 ? 'line-through' : 'none',
                }}>
                  {line.text}
                </div>
              );
            })
          ) : (
            // New code — types in with cyan glow
            newCode.map((text, i) => {
              const progress = newLineProgress(i);
              const chars = Math.floor(progress * text.length);
              const isTyping = progress > 0 && progress < 1;
              return (
                <div key={`new-${i}`} style={{
                  color: GREEN,
                  opacity: progress > 0 ? 1 : 0,
                  borderLeft: `3px solid ${progress > 0 ? GREEN : 'transparent'}`,
                  paddingLeft: 8,
                  marginLeft: -11,
                  textShadow: isTyping ? `0 0 12px ${CYAN}` : 'none',
                }}>
                  {text.slice(0, chars)}
                  {isTyping && <span style={{ color: CYAN, opacity: frame % 8 < 4 ? 1 : 0 }}>{'\u258C'}</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recovery ripple */}
      {rippleActive && (
        <div style={{
          position: 'absolute',
          left: centerX - (boxW / 2 + rippleProgress * 40),
          top: y1 - rippleProgress * 20,
          width: boxW + rippleProgress * 80,
          height: boxH + rippleProgress * 40,
          borderRadius: 20,
          border: `2px solid ${GREEN}`,
          opacity: 1 - rippleProgress,
          pointerEvents: 'none',
          boxShadow: `0 0 ${20 + rippleProgress * 30}px ${GREEN}44`,
        }} />
      )}

      {/* ===== SERVER 2: api-gateway — healthy ===== */}
      <div style={{
        position: 'absolute',
        left: centerX - boxW / 2, top: y2,
        width: boxW, height: boxH,
        border: `2px solid ${GREEN}`,
        borderRadius: 14,
        backgroundColor: `${GREEN}08`,
        overflow: 'hidden',
        boxShadow: `0 0 15px ${GREEN}15`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', borderBottom: `1px solid ${GREEN}33`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: GREEN, boxShadow: `0 0 8px ${GREEN}` }} />
            <span style={{ fontSize: 18, color: TEXT, fontWeight: 700, fontFamily: FONT }}>api-gateway</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 13, fontFamily: FONT, fontWeight: 600,
              padding: '3px 10px', borderRadius: 6,
              color: GREEN, border: `1px solid ${GREEN}44`, backgroundColor: `${GREEN}11`,
            }}>v3</span>
            <span style={{ fontSize: 14, color: GREEN, fontFamily: FONT, fontWeight: 600 }}>Running</span>
          </div>
        </div>
        <div style={{ padding: '10px 18px', fontFamily: FONT, fontSize: 15, lineHeight: 1.9, color: TEXT_DIM }}>
          <div>handler = sdk.handler({'{'}</div>
          <div style={{ paddingLeft: 16 }}>trigger: &quot;http.request&quot;,</div>
          <div style={{ paddingLeft: 16 }}>match: &quot;/api/v1/*&quot;</div>
          <div>{'}'});</div>
        </div>
      </div>

      {/* ===== SERVER 3: rate-limiter — SPAWNS from api-gateway ===== */}
      {spawnVisible && (
        <div style={{
          position: 'absolute',
          left: centerX - boxW / 2,
          top: spawnY,
          width: boxW, height: boxH,
          border: `2px solid ${CYAN}`,
          borderRadius: 14,
          backgroundColor: `${CYAN}08`,
          overflow: 'hidden',
          opacity: spawnSpring,
          transform: `scale(${interpolate(spawnSpring, [0, 1], [0.7, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
          boxShadow: `0 0 25px ${CYAN}33`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', borderBottom: `1px solid ${CYAN}33`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
              <span style={{ fontSize: 18, color: TEXT, fontWeight: 700, fontFamily: FONT }}>rate-limiter</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 13, fontFamily: FONT, fontWeight: 600,
                padding: '3px 10px', borderRadius: 6,
                color: CYAN, border: `1px solid ${CYAN}44`, backgroundColor: `${CYAN}11`,
              }}>new</span>
              <span style={{ fontSize: 14, color: CYAN, fontFamily: FONT, fontWeight: 600 }}>Self-assembling</span>
            </div>
          </div>
          {/* Code writing itself from scratch */}
          <div style={{ padding: '10px 18px', fontFamily: FONT, fontSize: 15, lineHeight: 1.9 }}>
            {['handler = sdk.handler({', '  trigger: "traffic.spike",', '  limit: 1000,', '  window: "1m"', '});'].map((text, i) => {
              const lineProgress = interpolate(f - spawnStart, [5 + i * 6, 11 + i * 6], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              const chars = Math.floor(lineProgress * text.length);
              const isTyping = lineProgress > 0 && lineProgress < 1;
              return (
                <div key={i} style={{
                  color: CYAN,
                  opacity: lineProgress > 0 ? 1 : 0,
                  textShadow: isTyping ? `0 0 12px ${CYAN}` : 'none',
                }}>
                  {text.slice(0, chars)}
                  {isTyping && <span style={{ opacity: frame % 8 < 4 ? 1 : 0 }}>{'\u258C'}</span>}
                </div>
              );
            })}
          </div>
          {/* "spawned by" label */}
          <div style={{
            padding: '6px 18px', fontSize: 12, color: TEXT_MUTED, fontFamily: FONT,
            borderTop: `1px solid ${CYAN}22`,
          }}>
            spawned by health-monitor {'\u00B7'} traffic pattern shift detected
          </div>
        </div>
      )}

      {/* Connection lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line x1={centerX} y1={y1 + boxH} x2={centerX} y2={y2}
          stroke={srvColor} strokeWidth={2} opacity={0.4} />
        {spawnVisible && (
          <line x1={centerX} y1={y2 + boxH} x2={centerX} y2={spawnY}
            stroke={CYAN} strokeWidth={2} opacity={spawnSpring * 0.4}
            strokeDasharray={spawnSpring < 1 ? '6 4' : 'none'} />
        )}
      </svg>

      {/* P99 metric */}
      {f >= typeNewEnd - 5 && (
        <div style={{
          position: 'absolute', bottom: 80, width: '100%', textAlign: 'center',
          fontSize: 32, color: p99Color, fontWeight: 700, fontFamily: FONT,
          textShadow: p99 <= 100 ? `0 0 20px ${GREEN}` : `0 0 10px ${RED}`,
        }}>
          p99: {Math.round(p99)}ms {p99 <= 100 ? '\u2713' : '\u2717'}
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
