import { scrollProgress } from './scroll-progress.js';

/** Attach scroll-driven motion to explicitly marked elements. Returns cleanup. */
export function mountMotion(root = document) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...root.querySelectorAll('[data-xs-motion]')];
  let frame = null;
  function render() {
    frame = null;
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const p = scrollProgress(rect.top, rect.height, window.innerHeight);
      el.style.setProperty('--xs-progress', String(p));
      el.style.setProperty('--xs-offset', media.matches ? '0px' : ((p - .5) * 80) + 'px');
      el.toggleAttribute('data-xs-visible', media.matches || (rect.top < window.innerHeight * .9 && rect.bottom > 0));
    }
  }
  function schedule() { if (frame === null) frame = requestAnimationFrame(render); }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  media.addEventListener('change', schedule);
  schedule();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    media.removeEventListener('change', schedule);
    if (frame !== null) cancelAnimationFrame(frame);
    for (const el of elements) {
      el.style.removeProperty('--xs-progress');
      el.style.removeProperty('--xs-offset');
      el.removeAttribute('data-xs-visible');
    }
  };
}
