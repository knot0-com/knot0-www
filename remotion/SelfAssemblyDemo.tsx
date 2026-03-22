// Input: All dashboard components, Remotion AbsoluteFill/useCurrentFrame/interpolate/spring/useVideoConfig
// Output: Main 900-frame demo composition orchestrating 7 beats of on-call engineer POV dashboard
// Position: Primary composition for Knot0Demo and IncidentResponse

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import {
  BG,
  BORDER,
  FONT,
  AMBER,
  CYAN,
  GREEN,
  RED,
  TEXT,
  TEXT_DIM,
  TEXT_MUTED,
} from './theme';
import { BrowserChrome } from './components/BrowserChrome';
import { StatusBar } from './components/StatusBar';
import { ServiceCards } from './components/ServiceCards';
import type { ServiceInfo } from './components/ServiceCards';
import { AgentFeed } from './components/AgentFeed';
import type { FeedItem } from './components/AgentFeed';
import { PagerDutyAlert } from './components/PagerDutyAlert';
import { DiffView } from './components/DiffView';
import { RunnerCards } from './components/RunnerCards';
import type { RunnerInfo } from './components/RunnerCards';
import { EvolutionLog } from './components/EvolutionLog';
import { SLOBar } from './components/SLOBar';
import { BrandCard } from './components/BrandCard';

// ---------------------------------------------------------------------------
// Constants: beat boundaries
// ---------------------------------------------------------------------------

const BEAT1_START = 0;
const BEAT1_END = 89;
const BEAT2_START = 90;
const BEAT2_END = 179;
const BEAT3_START = 180;
const BEAT3_END = 299;
const BEAT4_START = 300;
const BEAT4_END = 449;
const BEAT5_START = 450;
const BEAT5_END = 599;
const BEAT6_START = 600;
const BEAT6_END = 749;
const BEAT7_START = 750;

// ---------------------------------------------------------------------------
// Feed items data
// ---------------------------------------------------------------------------

const FEED_ITEMS: FeedItem[] = [
  // Beat 3: Knot0 responds
  {
    icon: '\u276F',
    color: AMBER,
    lines: ['knot0 ~'],
  },
  {
    icon: '\u26A0',
    color: RED,
    lines: ['INCIDENT ALERT', '  PagerDuty: cache-layer OOMKilled in production'],
    lineColors: [RED, TEXT_DIM],
  },
  {
    icon: '\u25D0',
    color: CYAN,
    lines: ['Discovering context...'],
  },
  {
    icon: ' ',
    color: CYAN,
    lines: ['\u2192 [Prometheus] memory_usage > 2GB, spiking since 14:32'],
    lineColors: [TEXT],
  },
  {
    icon: ' ',
    color: CYAN,
    lines: ['\u2192 [Kubernetes] 2 pods in CrashLoopBackOff'],
    lineColors: [TEXT],
  },
  {
    icon: ' ',
    color: CYAN,
    lines: ['\u2192 [Git Blame] Last change: "Add session caching"'],
    lineColors: [TEXT],
  },
  {
    icon: ' ',
    color: CYAN,
    lines: ['\u2192 [Heap Dump] Unbounded HashMap in SessionCache'],
    lineColors: [TEXT],
  },
  // Beat 4: Writing fix
  {
    icon: '\u270E',
    color: CYAN,
    lines: ['Writing fix...'],
  },
  // Beat 4: Approval prompt
  {
    icon: '?',
    color: AMBER,
    lines: [
      'Apply hotfix to payment-svc',
      '  1 file ready \u00B7 rollback available',
      '  [Y] approve    [N] deny',
    ],
    lineColors: [AMBER, TEXT_DIM, TEXT_MUTED],
  },
  // Beat 4: Auto-approved
  {
    icon: '\u25B6',
    color: AMBER,
    lines: ['Deploying to 2 runners...'],
  },
  // Beat 6: Resolved
  {
    icon: '\u2713',
    color: GREEN,
    lines: [
      'Incident resolved',
      '  2 pods patched \u00B7 0 downtime \u00B7 MTTR: 47 seconds',
    ],
    lineColors: [GREEN, TEXT_MUTED],
  },
];

// ---------------------------------------------------------------------------
// Diff lines
// ---------------------------------------------------------------------------

const DIFF_LINES = [
  '--- a/SessionCache.java',
  '+++ b/SessionCache.java',
  '@@ -8,7 +8,14 @@',
  '-  private Map<String, Session> cache = new HashMap<>();',
  '+  // Fix: Use LRU cache with max size',
  '+  private static final int MAX_SESSIONS = 1000;',
  '+  private Map<String, Session> cache = new LinkedHashMap<>(',
  '+    MAX_SESSIONS, 0.75f, true',
  '+  ) {',
  '+    @Override',
  '+    protected boolean removeEldestEntry(Entry e) {',
  '+      return size() > MAX_SESSIONS;',
  '+    }',
  '+  };',
];

// ---------------------------------------------------------------------------
// Helpers: compute derived state from frame
// ---------------------------------------------------------------------------

function computeVisibleFeedItems(frame: number): number {
  if (frame < BEAT3_START) return 0;

  // Beat 3: items 0-6 appear sequentially
  if (frame < BEAT4_START) {
    // item 0 at 180, item 1 at 195, item 2 at 200, item 3 at 215, 4 at 245, 5 at 260, 6 at 275
    const triggers = [180, 195, 200, 215, 245, 260, 275];
    let count = 0;
    for (const t of triggers) {
      if (frame >= t) count++;
    }
    return count;
  }

  // Beat 4: items 7-9
  if (frame < BEAT5_START) {
    let count = 7; // all Beat 3 items
    if (frame >= 300) count = 8; // "Writing fix..."
    if (frame >= 400) count = 9; // Approval prompt
    if (frame >= 430) count = 10; // "Deploying to 2 runners..."
    return count;
  }

  // Beat 5: hold at 10
  if (frame < BEAT6_START) return 10;

  // Beat 6: add resolved item
  if (frame >= BEAT6_START) return 11;

  return 10;
}

function computeServices(frame: number): ServiceInfo[] {
  // Base services
  const apiP99 =
    frame < BEAT2_START
      ? 42
      : frame < BEAT5_START
        ? interpolate(frame, [BEAT2_START, BEAT2_END], [42, 340], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : frame < BEAT5_END
          ? interpolate(frame, [BEAT5_START, BEAT5_END], [340, 38], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          : 38;

  const cacheStatus: 'running' | 'crash' | 'patching' =
    frame < BEAT2_START + 30
      ? 'running'
      : frame < BEAT5_START + 60
        ? 'crash'
        : frame < BEAT5_START + 120
          ? 'patching'
          : 'running';

  return [
    {
      name: 'api-gateway',
      metric: 'p99',
      metricValue: `${Math.round(apiP99)}ms`,
      status: 'running',
    },
    {
      name: 'cache-layer',
      metric: 'hit',
      metricValue: cacheStatus === 'running' ? '94%' : cacheStatus === 'crash' ? '0%' : '67%',
      status: cacheStatus,
    },
    {
      name: 'health-mon',
      metric: 'checks',
      metricValue: 'ok',
      status: 'running',
    },
    {
      name: 'load-balancer',
      metric: 'queue',
      metricValue: '0',
      status: 'running',
    },
  ];
}

function computeSLO(frame: number): { value: number; breached: boolean } {
  if (frame < BEAT2_START) return { value: 42, breached: false };

  if (frame < BEAT5_START) {
    const v = interpolate(frame, [BEAT2_START, BEAT2_END], [42, 340], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { value: v, breached: v > 100 };
  }

  if (frame < BEAT5_END) {
    const v = interpolate(frame, [BEAT5_START, BEAT5_END], [340, 38], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { value: v, breached: v > 100 };
  }

  return { value: 38, breached: false };
}

function computeRunners(frame: number): RunnerInfo[] {
  if (frame < BEAT5_START) return [];

  const localFrame = frame - BEAT5_START;

  const prog1 = interpolate(localFrame, [0, 60], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const prog2 = interpolate(localFrame, [10, 70], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return [
    {
      name: 'prod-k8s-01',
      platform: 'Kubernetes',
      status: prog1 >= 100 ? 'done' : 'deploying',
      progress: prog1,
    },
    {
      name: 'prod-k8s-02',
      platform: 'Kubernetes',
      status: prog2 >= 100 ? 'done' : 'deploying',
      progress: prog2,
    },
  ];
}

function computeVisibleDiffLines(frame: number): number {
  if (frame < BEAT4_START + 15) return 0;
  // ~4 frames per line
  return interpolate(frame, [BEAT4_START + 15, BEAT4_START + 15 + DIFF_LINES.length * 4], [0, DIFF_LINES.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function computeEvolutionLines(frame: number): number {
  if (frame < BEAT6_START + 20) return 0;
  // 1 line every 12 frames
  return interpolate(frame, [BEAT6_START + 20, BEAT6_START + 20 + 5 * 12], [0, 5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// Which right panel to show
type RightPanel = 'services' | 'diff' | 'runners' | 'evolution';

function computeRightPanel(frame: number): RightPanel {
  if (frame < BEAT4_START) return 'services';
  if (frame < BEAT5_START) return 'diff';
  if (frame < BEAT6_START) return 'runners';
  return 'evolution';
}

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

export const SelfAssemblyDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  // Derive all state from frame
  const visibleFeedItems = computeVisibleFeedItems(frame);
  const services = computeServices(frame);
  const slo = computeSLO(frame);
  const runners = computeRunners(frame);
  const visibleDiffLines = computeVisibleDiffLines(frame);
  const evolutionLines = computeEvolutionLines(frame);
  const rightPanel = computeRightPanel(frame);

  // PagerDuty alert: visible frames 90-160
  const pagerVisible = frame >= BEAT2_START && frame <= BEAT2_START + 70;

  // Beat 7: brand card
  const isBeat7 = frame >= BEAT7_START;

  // Dashboard opacity: fade out entering beat 7
  const dashboardOpacity = interpolate(frame, [BEAT7_START, BEAT7_START + 30], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Overall fade-in at start
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Right panel cross-fade helpers
  const rightPanelFade = (panel: RightPanel, start: number): number => {
    if (rightPanel !== panel) return 0;
    return interpolate(frame, [start, start + 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT }}>
      {/* Dashboard layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: fadeIn * dashboardOpacity,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BrowserChrome>
          <StatusBar frame={frame} />

          {/* Main content area */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left panel: Agent feed */}
            <div
              style={{
                width: '50%',
                borderRight: `1px solid ${BORDER}`,
                overflow: 'hidden',
              }}
            >
              <AgentFeed items={FEED_ITEMS} visibleItems={visibleFeedItems} frame={frame} />
            </div>

            {/* Right panel: context-dependent */}
            <div
              style={{
                width: '50%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Services (Beat 1-3) */}
              {(rightPanel === 'services') && (
                <div style={{ opacity: rightPanelFade('services', BEAT1_START) }}>
                  <ServiceCards services={services} frame={frame} />
                </div>
              )}

              {/* Diff (Beat 4) */}
              {rightPanel === 'diff' && (
                <div
                  style={{
                    opacity: rightPanelFade('diff', BEAT4_START),
                    height: '100%',
                  }}
                >
                  <DiffView
                    filename="fix-memory-leak.patch"
                    lines={DIFF_LINES}
                    visibleLines={visibleDiffLines}
                  />
                </div>
              )}

              {/* Runners + recovering services (Beat 5) */}
              {rightPanel === 'runners' && (
                <div
                  style={{
                    opacity: rightPanelFade('runners', BEAT5_START),
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <RunnerCards runners={runners} frame={frame} />
                  <div
                    style={{
                      borderTop: `1px solid ${BORDER}`,
                      flex: 1,
                    }}
                  >
                    <ServiceCards services={services} frame={frame} />
                  </div>
                </div>
              )}

              {/* Evolution log (Beat 6) */}
              {rightPanel === 'evolution' && (
                <div style={{ opacity: rightPanelFade('evolution', BEAT6_START) }}>
                  <EvolutionLog visibleLines={evolutionLines} frame={frame} />
                </div>
              )}
            </div>
          </div>

          <SLOBar value={slo.value} threshold={100} breached={slo.breached} />
        </BrowserChrome>
      </div>

      {/* PagerDuty overlay */}
      <PagerDutyAlert
        visible={pagerVisible}
        frame={frame}
        enterFrame={BEAT2_START}
        title="payment-svc: p99 latency > 200ms"
        subtitle="cache-layer: OOMKilled"
        severity="P1"
      />

      {/* Brand card overlay (Beat 7) */}
      {isBeat7 && <BrandCard frame={frame} localFrame={frame - BEAT7_START} />}

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
