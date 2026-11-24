import { clamp01 } from './timeline.js';
/** Smoothstep easing over a strictly ordered interval. */
export function transitionProgress(progress,start=0,end=1) {
  if (![start,end].every(Number.isFinite)||start<0||end>1||start>=end) throw new RangeError('Invalid transition interval');
  const t=clamp01((clamp01(progress)-start)/(end-start));
  return t*t*(3-2*t);
}
/** Complementary opacity weights for a decorative two-layer crossfade. */
export function crossfade(progress,start=0,end=1) {
  const t=transitionProgress(progress,start,end);
  return {outgoing:1-t,incoming:t};
}
