// Input: Remotion staticFile API, FontFace browser API, public/fonts/*.woff2
// Output: Color constants, FONT string, fadeIn/typewriter animation helpers, font loading handle
// Position: Shared theme module for all Remotion compositions

import { staticFile, delayRender, continueRender } from 'remotion';

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
// Font
// ---------------------------------------------------------------------------

export const FONT = "'JetBrains Mono', monospace";

const waitForFont = delayRender('Loading JetBrains Mono fonts');

const regularFont = new FontFace(
  'JetBrains Mono',
  `url('${staticFile('fonts/JetBrainsMono-Regular.woff2')}') format('woff2')`,
  { weight: '400', style: 'normal' },
);

const boldFont = new FontFace(
  'JetBrains Mono',
  `url('${staticFile('fonts/JetBrainsMono-Bold.woff2')}') format('woff2')`,
  { weight: '700', style: 'normal' },
);

Promise.all([regularFont.load(), boldFont.load()])
  .then((loaded) => {
    for (const f of loaded) {
      document.fonts.add(f);
    }
    continueRender(waitForFont);
  })
  .catch((err) => {
    console.error('Font loading failed:', err);
    continueRender(waitForFont);
  });

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

/**
 * Returns an opacity value (0..1) that fades in starting at `start` over
 * `duration` frames. Clamped on both sides.
 */
export function fadeIn(frame: number, start: number, duration: number): number {
  if (frame < start) return 0;
  if (frame >= start + duration) return 1;
  return (frame - start) / duration;
}

/**
 * Returns the visible portion of `text` as if being typed at `speed`
 * characters per frame, starting at frame 0.
 */
export function typewriter(frame: number, text: string, speed = 2): string {
  const chars = Math.floor(frame * speed);
  return text.slice(0, Math.max(0, chars));
}
