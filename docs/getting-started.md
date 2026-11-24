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

## Continuous rail / Banda continua

Use one group of static non-interactive items inside a native horizontal scroll container:

```html
<div data-xs-rail tabindex="0" aria-label="Motion samples">
  <div data-xs-rail-group>
    <!-- Static tiles, enough to exceed the viewport width -->
  </div>
</div>
```

Import mountInfiniteRail from src/index.js. Pass previous, next and toggle buttons via options. Default speed is 24 pixels per second; playback is off unless explicitly enabled. Autoplay requires a pause control. Keep interactive cards in the native mountCarousel implementation instead. Clones are inert and hidden from assistive technology. Reduced motion disables continuous cycling and removes clones. Call the returned cleanup function on unmount.

For a crossfade, import crossfade(progress, start, end) and apply its outgoing and incoming weights to decorative layers. Keep meaningful text available in the normal document flow.

En español: la banda continua admite elementos estáticos, navegación manual y reproducción opcional lenta. No clones enlaces, formularios ni controles. La transición crossfade interpola dos capas decorativas. Ambos módulos son experimentales.
