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
