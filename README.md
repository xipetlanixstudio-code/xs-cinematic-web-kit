# XS Cinematic Web Kit

Experimental MIT-licensed browser motion toolkit by Xipetlanix Studio. / Biblioteca experimental de movimiento web.

## Demo / Demostración
[GitHub Pages](https://xipetlanixstudio-code.github.io/xs-cinematic-web-kit/)

## Features / Características
- Scroll progress, parallax layers and reveal effects.
- Sticky scenes and numeric keyframe interpolation.
- Native horizontal carousel and separate continuous decorative rail with opt-in playback, pause and manual controls.
- Smoothstep transitions and complementary crossfade weights.
- Opt-in video scrubbing API (requires your own seekable video).
- Reduced-motion support and cleanup callbacks.

## Local development / Desarrollo local
Requires Node.js 20+ and Python 3.
```sh
npm test
python3 -m http.server 8000
```
Open http://localhost:8000.

## Usage / Uso
Load src/motion.css and import the desired functions from src/index.js.
See [API examples](docs/getting-started.md), [changelog](CHANGELOG.md) and [contributing](CONTRIBUTING.md).

## Status
v0.3.0 experimental. No external runtime dependencies. Browser validation and npm publication pending. The package remains private in package.json to prevent accidental registry publication; the GitHub repository is public.

MIT license.
