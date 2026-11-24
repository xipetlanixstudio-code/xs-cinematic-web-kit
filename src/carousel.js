/** Native horizontal carousel with opt-in timed cycling and explicit pause. */
export function mountCarousel(track, {previous, next, toggle, autoplay=false, interval=6000, loop=false} = {}) {
  const doc=track.ownerDocument, win=doc.defaultView;
  const media=win.matchMedia('(prefers-reduced-motion: reduce)');
  let playing=Boolean(autoplay && toggle), timer=null, hovering=false, focused=false, touching=false;
  function move(direction) {
    const max=Math.max(0,track.scrollWidth-track.clientWidth);
    const current=track.scrollLeft;
    let target=current+direction*track.clientWidth*.8;
    if(loop && direction>0 && current>=max-2) target=0;
    else if(loop && direction<0 && current<=2) target=max;
    target=Math.max(0,Math.min(max,target));
    track.scrollTo({left:target,behavior:media.matches?'instant':'smooth'});
  }
  function refresh() {
    if(timer!==null) win.clearInterval(timer);
    timer=null;
    if(toggle) { toggle.textContent=playing?'Pause':'Play'; toggle.setAttribute('aria-label',playing?'Pause automatic carousel':'Play automatic carousel'); }
    if(playing && !media.matches && !hovering && !focused && !touching && !doc.hidden) {
      timer=win.setInterval(()=>move(1),Math.max(4000,Number.isFinite(interval)?interval:6000));
    }
  }
  const stop=()=>{playing=false;refresh();};
  const listeners=[
    [previous,'click',()=>{stop();move(-1);}],
    [next,'click',()=>{stop();move(1);}],
    [toggle,'click',()=>{playing=!playing;refresh();}],
    [track,'pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;refresh();}}],
    [track,'pointerleave',()=>{hovering=false;refresh();}],
    [track,'focusin',()=>{focused=true;refresh();}],
    [track,'focusout',e=>{focused=track.contains(e.relatedTarget);refresh();}],
    [track,'pointerdown',()=>{touching=true;refresh();}],
    [win,'pointerup',()=>{touching=false;refresh();}],
    [win,'pointercancel',()=>{touching=false;refresh();}],
    [doc,'visibilitychange',refresh],[media,'change',refresh]
  ];
  for(const [el,event,fn] of listeners) el?.addEventListener(event,fn);
  refresh();
  return ()=>{if(timer!==null)win.clearInterval(timer);for(const [el,event,fn] of listeners)el?.removeEventListener(event,fn);};
}
