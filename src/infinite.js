/** Normalize a cyclic offset, including negative offsets. */
export function wrapOffset(offset, period) {
  if (!Number.isFinite(offset) || !Number.isFinite(period) || period <= 0) throw new RangeError('Invalid cycle');
  return ((offset % period) + period) % period;
}
/** A continuous decorative rail. The original group must contain static, non-interactive items. */
export function mountInfiniteRail(track, {previous,next,toggle,speed=24,autoplay=false}={}) {
  if (!Number.isFinite(speed) || speed <= 0 || speed > 120) throw new RangeError('Speed must be 0–120 px/s');
  if (autoplay && !toggle) throw new Error('Autoplay requires a pause control');
  const group=track.firstElementChild;
  if (!group || track.children.length !== 1 || group.querySelector('a,button,input,select,textarea,[tabindex],[contenteditable],audio,video,iframe,details,[id]') || group.id) throw new Error('Expected one static group without interactive items or IDs');
  const doc=track.ownerDocument, win=doc.defaultView, media=win.matchMedia('(prefers-reduced-motion: reduce)');
  const originalScroll=track.scrollLeft;
  let before=null,after=null,period=0,playing=Boolean(autoplay),frame=null,last=null,position=0,hover=false,focus=false,pointer=false,disposed=false;
  const listeners=[];
  function on(el,event,fn,opts){if(el){el.addEventListener(event,fn,opts);listeners.push([el,event,fn,opts]);}}
  function stopFrame(){if(frame!==null)win.cancelAnimationFrame(frame);frame=null;last=null;}
  function canPlay(){return !disposed && playing && period>0 && !media.matches && !hover && !focus && !pointer && !doc.hidden;}
  function tick(now){
    frame=null;
    if(!canPlay()){last=null;return;}
    if(last!==null){position=wrapOffset(position+speed*Math.min(now-last,50)/1000,period);track.scrollLeft=period+position;}
    last=now;
    frame=win.requestAnimationFrame(tick);
  }
  function refresh(){
    if(toggle){toggle.disabled=!period||media.matches;toggle.textContent=playing?'Pause':'Play';toggle.setAttribute('aria-label',playing?'Pause continuous rail':'Play continuous rail');}
    if(canPlay()){if(frame===null){position=wrapOffset(track.scrollLeft-period,period);last=null;frame=win.requestAnimationFrame(tick);}}
    else stopFrame();
  }
  function removeClones(){before?.remove();after?.remove();before=after=null;}
  function clone(){const el=group.cloneNode(true);el.setAttribute('aria-hidden','true');el.setAttribute('inert','');return el;}
  function measure(){
    if(disposed)return;
    const old=period?wrapOffset(track.scrollLeft-period,period):track.scrollLeft;
    stopFrame();removeClones();period=0;
    const width=group.getBoundingClientRect().width;
    if(!media.matches && track.clientWidth>0 && width>track.clientWidth+1){
      before=clone();after=clone();track.prepend(before);track.append(after);
      period=group.offsetLeft-before.offsetLeft;
      if(period>0){position=wrapOffset(old,period);track.scrollLeft=period+position;}
      else{removeClones();period=0;}
    }
    if(!period)track.scrollLeft=old;
    refresh();
  }
  function move(direction){
    playing=false;refresh();
    const step=track.clientWidth*.6;
    if(period){position=wrapOffset(track.scrollLeft-period+direction*step,period);track.scrollLeft=period+position;}
    else track.scrollBy({left:direction*step,behavior:media.matches?'instant':'smooth'});
  }
  on(previous,'click',()=>move(-1));on(next,'click',()=>move(1));
  on(toggle,'click',()=>{playing=!playing;refresh();});
  on(track,'pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;refresh();}});
  on(track,'pointerleave',()=>{hover=false;refresh();});
  on(track,'focusin',()=>{focus=true;refresh();});
  on(track,'focusout',e=>{focus=track.contains(e.relatedTarget);refresh();});
  on(track,'pointerdown',()=>{pointer=true;playing=false;refresh();});
  on(win,'pointerup',()=>{pointer=false;refresh();});
  on(win,'pointercancel',()=>{pointer=false;refresh();});
  on(track,'wheel',()=>{playing=false;refresh();},{passive:true});
  on(track,'keydown',()=>{playing=false;refresh();});
  on(track,'scroll',()=>{if(period && frame===null && !pointer){const x=track.scrollLeft;if(x<period*.5||x>=period*2.5)track.scrollLeft=period+wrapOffset(x-period,period);}},{passive:true});
  on(doc,'visibilitychange',refresh);on(media,'change',measure);
  on(win,'resize',measure);
  const observer=win.ResizeObserver?new win.ResizeObserver(measure):null;
  observer?.observe(track);observer?.observe(group);
  measure();
  return ()=>{disposed=true;stopFrame();observer?.disconnect();for(const [el,event,fn,opts] of listeners)el.removeEventListener(event,fn,opts);removeClones();track.scrollLeft=originalScroll;};
}
