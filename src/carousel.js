/** Enhance a native horizontal scrolling region with optional controls. */
export function mountCarousel(track, {previous, next} = {}) {
  const move = direction => track.scrollBy({left: direction * track.clientWidth * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  const back = () => move(-1), forward = () => move(1);
  previous?.addEventListener('click', back);
  next?.addEventListener('click', forward);
  return () => { previous?.removeEventListener('click', back); next?.removeEventListener('click', forward); };
}
