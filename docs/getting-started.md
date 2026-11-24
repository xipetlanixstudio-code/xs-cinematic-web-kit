# Getting started / Primeros pasos

Requires Node.js 20+ for tests. No runtime dependencies.

Clone the repository and run `npm test`.

```js
import { scrollProgress } from './src/scroll-progress.js';
const rect = document.querySelector('section').getBoundingClientRect();
const progress = scrollProgress(rect.top, rect.height, window.innerHeight);
```

The function returns a number between zero and one. Use it to drive optional visual effects; honor prefers-reduced-motion.

La función devuelve un número entre cero y uno para sincronizar efectos visuales opcionales con el desplazamiento. Respeta las preferencias de movimiento reducido.

## Scenes, carousel and video / Escenas, carrusel y video

Import `mountScene`, `sampleTimeline`, `mountCarousel` and `createVideoScrubber` from src/index.js.

A scene uses a tall outer element with data-xs-scene and an inner data-xs-sticky element. Mount it with mountScene(scene, {onProgress(p) { /* optional updates */ }}). Progress is 0–1. Reduced motion returns 0 and disables sticky layout. Ensure essential content remains available without animation.

sampleTimeline([{at:0,value:0},{at:1,value:100}], .5) returns 50. Keyframes must be strictly ordered.

mountCarousel(track, {previous, next, toggle, loop:true}) enables manual controls and opt-in cycling with a minimum four-second interval. It pauses during pointer interaction, focus in the track, background tabs and reduced-motion mode. It wraps at the ends; it is not a seamless marquee. Use left-to-right native horizontal scrolling.

createVideoScrubber(video) returns update(progress) and destroy(). Use a muted, seekable video you own or have permission to use; call update from scene progress. Browser decoding and video encoding affect smoothness. No video assets are shipped.

All mount functions return cleanup callbacks. Call them before removing components.

En español: las escenas sincronizan el desplazamiento con una línea temporal; el carrusel permite activar la reproducción manualmente y se detiene durante la interacción. El video necesita un archivo propio. Las APIs son experimentales y aún requieren validación en navegadores.
