/** Clamp a finite value to the unit interval. */
export function clamp01(value) {
  if (!Number.isFinite(value)) throw new RangeError('Expected finite progress');
  return Math.max(0, Math.min(1, value));
}
/** Progress through a sticky scene, from top alignment to bottom alignment. */
export function sceneProgress(top, height, viewport) {
  if (![top,height,viewport].every(Number.isFinite) || viewport <= 0 || height <= viewport) throw new RangeError('Scene must exceed viewport');
  return clamp01(-top / (height - viewport));
}
/** Interpolate numeric keyframes with strictly increasing positions in [0,1]. */
export function sampleTimeline(frames, progress) {
  const p = clamp01(progress);
  if (!Array.isArray(frames) || !frames.length || frames.some((f,i) => !f || !Number.isFinite(f.at) || !Number.isFinite(f.value) || f.at < 0 || f.at > 1 || (i && f.at <= frames[i-1].at))) throw new RangeError('Invalid keyframes');
  if (p <= frames[0].at) return frames[0].value;
  for (let i=1;i<frames.length;i++) {
    const a=frames[i-1], b=frames[i];
    if (p <= b.at) return a.value + (b.value-a.value)*(p-a.at)/(b.at-a.at);
  }
  return frames.at(-1).value;
}
