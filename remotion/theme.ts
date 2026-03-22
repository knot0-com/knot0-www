// Input: @remotion/fonts loadFont, Remotion staticFile API
// Output: Color constants, FONT string, fadeIn/typewriter animation helpers, font loading promise
// Position: Shared theme module for all Remotion compositions

import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const BG = '#0a0a0a';
export const BG_LIGHT = '#141414';
export const BORDER = '#1f1f1f';
export const AMBER = '#ffb000';
export const CYAN = '#4ecdc4';
export const TEXT = '#e8e8e8';
export const TEXT_DIM = '#a8a8a8';
export const TEXT_MUTED = '#555555';
export const GREEN = '#39ff14';
export const RED = '#ff4444';

// ---------------------------------------------------------------------------
// Font — @remotion/fonts handles delayRender/continueRender internally
// ---------------------------------------------------------------------------

export const FONT = "'JetBrains Mono', monospace";

const _fontLoaded = Promise.all([
  loadFont({
    family: 'JetBrains Mono',
    url: staticFile('fonts/JetBrainsMono-Regular.woff2'),
    weight: '400',
  }),
  loadFont({
    family: 'JetBrains Mono',
    url: staticFile('fonts/JetBrainsMono-Bold.woff2'),
    weight: '700',
  }),
]);

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

/**
 * Returns an opacity value (0..1) that fades in starting at `start` over
 * `duration` frames. Clamped on both sides.
 *
 * Duration tip: express as `seconds * fps` for clarity, e.g. `0.5 * 30`.
 */
export function fadeIn(frame: number, start: number, duration: number): number {
  if (frame < start) return 0;
  if (frame >= start + duration) return 1;
  return (frame - start) / duration;
}

/**
 * Returns the visible portion of `text` as if being typed at `speed`
 * characters per frame, starting at frame 0.
 *
 * After all characters are revealed, a brief pause is held before returning
 * the full string (handles the common "pause after sentence" pattern).
 */
export function typewriter(frame: number, text: string, speed = 2): string {
  const chars = Math.floor(frame * speed);
  return text.slice(0, Math.min(text.length, Math.max(0, chars)));
}
