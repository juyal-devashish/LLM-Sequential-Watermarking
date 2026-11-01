# Project exhibit

The live exhibit is deployed via GitHub Pages from `main`:
https://juyal-devashish.github.io/LLM-Sequential-Watermarking/

Run `node frontend/build.mjs` to build the static site into `dist/`, then serve that directory with a static HTTP server. The build copies original figures and the final report from the repository. GitHub Actions runs the build and publishes it on each push to `main`.

The interactive lab uses a seeded teaching simulation, not the research detector. The original figures are labeled historical. See `../docs/EVIDENCE.md` and `../docs/VALIDATION.md` for provenance and outstanding scientific validation.

## Frontend review (2026-11-01)

The redesign follows `docs/FRONTEND_DESIGN.md`: a finance-inspired research workspace, an interactive monitor, and a focused original-figure explorer. Static HTML/CSS/JavaScript remain dependency-free at runtime.

Verified in a real browser:
- Desktop (1280px), mobile (390px), and narrow mobile (320px); no horizontal page overflow at these widths.
- Scenario switching, step/reset, play/pause, keyboard scrubbing, final-state replay label, and disabled stepping at the stopping point.
- Strong and weak paths stop at 9 and 45 comparisons; the chance-like example crosses the toy threshold at 37, explicitly demonstrating the absence of an error guarantee for this animation.
- Detection, computation, and robustness views; metric/grouping selection updates figure, title, caption, and original-image link.
- Mobile monitor and results controls; loaded original figures retain their source images.

Figure changes hide the previous image until the requested image loads, avoiding a mismatched image/title during loading. Failures show an explanation and retain the full-size link. The monitor starts paused at comparison 32 of the weak scenario; it never autoplays. Reduced-motion users can complete a run instantly or step manually (implemented; OS preference not toggled during this review).

Research reproduction limitations remain in `docs/VALIDATION.md`; this frontend review does not close that empirical backlog.
