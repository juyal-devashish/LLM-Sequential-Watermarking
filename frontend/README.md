# Project exhibit

The live exhibit is deployed via GitHub Pages from `main`:
https://juyal-devashish.github.io/LLM-Sequential-Watermarking/

Run `node frontend/build.mjs` to build the static site into `dist/`, then serve that directory with a static HTTP server. The build copies original figures and the final report from the repository. GitHub Actions runs the build and publishes it on each push to `main`.

The interactive lab uses a seeded teaching simulation, not the research detector. The original figures are labeled historical. See `../docs/EVIDENCE.md` and `../docs/VALIDATION.md` for provenance and outstanding scientific validation.
