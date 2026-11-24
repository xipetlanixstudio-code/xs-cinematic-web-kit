/** Return normalized viewport traversal progress (0–1). */
export function scrollProgress(top, height, viewportHeight) {
  if (![top, height, viewportHeight].every(Number.isFinite) || height < 0 || viewportHeight <= 0) {
    throw new RangeError('Invalid geometry');
  }
  return Math.max(0, Math.min(1, (viewportHeight - top) / (viewportHeight + height)));
}
