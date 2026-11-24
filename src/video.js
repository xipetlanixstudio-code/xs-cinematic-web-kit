import { clamp01 } from './timeline.js';
/** Opt-in paused video scrubbing. Caller owns video playback and scene lifecycle. */
export function createVideoScrubber(video) {
  const win = video.ownerDocument.defaultView;
  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0;
  let disposed = false;
  function seek() {
    if (disposed || media.matches || !Number.isFinite(video.duration) || video.duration <= 0 || video.seeking) return;
    video.pause();
    const target = progress * video.duration;
    if (Math.abs(video.currentTime-target) > .04) video.currentTime=target;
  }
  video.addEventListener('loadedmetadata',seek);
  video.addEventListener('seeked',seek);
  media.addEventListener('change',seek);
  return {
    update(p) { progress=clamp01(p); seek(); },
    destroy() { disposed=true; video.removeEventListener('loadedmetadata',seek); video.removeEventListener('seeked',seek); media.removeEventListener('change',seek); }
  };
}
