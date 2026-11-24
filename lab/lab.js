import {crossfade,sampleTimeline,mountInfiniteRail} from '../src/index.js';
const $=id=>document.getElementById(id);
const value=id=>Number($(id).value);
const write=(id,text)=>{$(id).textContent=text;};
const media=window.matchMedia('(prefers-reduced-motion: reduce)');
function depth(){
  const p=value('depth-progress')/100,d=value('depth-distance');
  const offset=media.matches?0:(p-.5)*d;
  $('depth-back').style.transform='translateY('+offset*.45+'px)';
  $('depth-front').style.transform='translateY('+offset+'px)';
  write('depth-progress-value',Math.round(p*100)+'%');write('depth-distance-value',d+' px');
  write('depth-code',"// p is normalized scroll progress (0–1).\nconst offset = (p - 0.5) * "+d+";\nlayer.style.transform = `translateY(${offset}px)`;\n// Respect prefers-reduced-motion.");
}
function fade(changed){
  let start=value('fade-start'),end=value('fade-end');
  if(start>=end){if(changed==='fade-start'){$('fade-end').value=start+5;end=start+5;}else{$('fade-start').value=end-5;start=end-5;}}
  const p=value('fade-progress')/100,w=crossfade(p,start/100,end/100);
  $('fade-layer').style.opacity=String(w.incoming);
  write('fade-progress-value',Math.round(p*100)+'%');write('fade-start-value',start+'%');write('fade-end-value',end+'%');
  write('fade-weights','Outgoing '+Math.round(w.outgoing*100)+'% · Incoming '+Math.round(w.incoming*100)+'%');
  write('fade-code',"import { crossfade } from './src/index.js';\nconst weights = crossfade(p, "+start/100+", "+end/100+");\n// Keep the outgoing background opaque; overlay incoming.\nincoming.style.opacity = weights.incoming;");
}
function timeline(){
  const p=value('timeline-progress')/100,peak=value('timeline-peak'),frames=[{at:0,value:0},{at:.5,value:peak},{at:1,value:20}],v=sampleTimeline(frames,p);
  $('timeline-line').setAttribute('points','20,110 150,'+(110-peak*.95)+' 280,91');
  $('timeline-dot').setAttribute('cx',String(20+260*p));$('timeline-dot').setAttribute('cy',String(110-v*.95));
  write('timeline-progress-value',Math.round(p*100)+'%');write('timeline-peak-value',peak);write('timeline-result',v.toFixed(1));
  write('timeline-code',"import { sampleTimeline } from './src/index.js';\nconst frames = "+JSON.stringify(frames,null,2)+";\nconst value = sampleTimeline(frames, p);");
}
let cleanupRail;
function rail(){
  cleanupRail?.();
  const speed=value('rail-speed');
  cleanupRail=mountInfiniteRail($('rail'),{previous:$('rail-prev'),next:$('rail-next'),toggle:$('rail-toggle'),speed});
  write('rail-speed-value',speed+' px/s');
  write('rail-code',"import { mountInfiniteRail } from './src/index.js';\nconst cleanup = mountInfiniteRail(track, {\n  previous, next, toggle, speed: "+speed+",\n  autoplay: false\n});\n// Call cleanup() when unmounting.");
}
for(const id of ['depth-progress','depth-distance'])$(id).addEventListener('input',depth);
for(const id of ['fade-progress','fade-start','fade-end'])$(id).addEventListener('input',()=>fade(id));
for(const id of ['timeline-progress','timeline-peak'])$(id).addEventListener('input',timeline);
$('rail-speed').addEventListener('change',rail);
$('rail-speed').addEventListener('input',()=>write('rail-speed-value',value('rail-speed')+' px/s'));
function reset(button,values,render){$(button).addEventListener('click',()=>{for(const [id,v] of Object.entries(values))$(id).value=v;render();});}
reset('depth-reset',{'depth-progress':50,'depth-distance':80},depth);
reset('fade-reset',{'fade-progress':50,'fade-start':20,'fade-end':80},fade);
reset('timeline-reset',{'timeline-progress':50,'timeline-peak':80},timeline);
media.addEventListener('change',depth);
for(const button of document.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText($(button.dataset.copy).textContent);write('status','Example copied.');}catch{write('status','Clipboard unavailable. Select the example text to copy manually.');}});
depth();fade();timeline();rail();
