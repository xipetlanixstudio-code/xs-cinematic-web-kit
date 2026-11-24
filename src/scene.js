import { sceneProgress } from './timeline.js';
/** Drive CSS custom properties on a sticky scene. Returns a cleanup function. */
export function mountScene(scene, {onProgress} = {}) {
  const win = scene.ownerDocument.defaultView;
  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  const render = () => {
    frame = null;
    const r = scene.getBoundingClientRect(), viewport = win.innerHeight;
    const p = media.matches || r.height <= viewport || viewport <= 0 ? 0 : sceneProgress(r.top,r.height,viewport);
    scene.style.setProperty('--xs-scene-progress',String(p));
    onProgress?.(p);
  };
  const schedule = () => { if(frame === null) frame=win.requestAnimationFrame(render); };
  win.addEventListener('scroll',schedule,{passive:true});
  win.addEventListener('resize',schedule);
  media.addEventListener('change',schedule);
  const observer = win.ResizeObserver ? new win.ResizeObserver(schedule) : null;
  observer?.observe(scene);
  schedule();
  return () => {
    win.removeEventListener('scroll',schedule); win.removeEventListener('resize',schedule);
    media.removeEventListener('change',schedule); observer?.disconnect();
    if(frame !== null) win.cancelAnimationFrame(frame);
    scene.style.removeProperty('--xs-scene-progress');
  };
}
