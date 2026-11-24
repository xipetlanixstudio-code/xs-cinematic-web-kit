# XS Cinematic Web Kit

Early-stage MIT-licensed browser motion toolkit by Xipetlanix Studio.

## Features / Características
- Normalized scroll progress / Progreso normalizado.
- Scroll-driven parallax and reveal / Parallax y revelación.
- Native horizontal carousel controls / Carrusel horizontal.
- Reduced-motion support / Movimiento reducido.

## Run locally / Ejecutar localmente

With Node.js 20+ and Python 3:

```sh
npm test
python3 -m http.server 8000
```

Open http://localhost:8000 to explore the demo.

## Usage / Uso

Load src/motion.css and import mountMotion and mountCarousel from src/index.js. Mark sections with data-xs-motion="reveal" or data-xs-motion="parallax" (with a child data-xs-layer). Call mountMotion(), then add xs-enhanced to the document element. Both mounting functions return cleanup callbacks.

See [the demo](index.html), [getting started](docs/getting-started.md) and [contributing](CONTRIBUTING.md).

## Status / Estado

Experimental v0.1.0. Browser validation and npm publication are pending. No external runtime dependencies. Contributions welcome.

MIT license.
