# AI research exhibit design

Design guidance: [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design). The user's clarified direction is a **clean AI research website**, superseding the earlier finance theme.

## Direction

Lead with the research itself: descriptive project title, full team, university, report/code/demo links, and a concise abstract. Put the interactive explanation after the abstract, followed by method, historical experimental results, and contributors/resources.

- Palette: white `#ffffff`, charcoal `#20242d`, secondary text `#606673`, subtle rules `#e1e4eb`, restrained blue `#385bd6`.
- Type: Avenir Next with humanist system fallbacks; a clear research title, modest section headings, readable paragraphs, and tabular chart values.
- Layout: centered paper-style project header and author line; narrow abstract; left-aligned explanations and figures below. Whitespace separates the research narrative.
- Components: light interactive illustration, quiet figure controls, original full-size figure links, and explicit source attribution.
- Motion: user-triggered playback only, with manual stepping and reduced-motion handling.

## Review

Remove the financial dashboard treatment: no dark monitor, market-style logo, promotional question as the page title, or finance terminology. Preserve the useful interactions and scientific provenance. The demo is explicitly synthetic, the original images remain historical, and the course project is not presented as a peer-reviewed publication.

## Validation

Reviewed the project header and light demo in a real browser, including 390px and 320px widths with no horizontal page overflow. Verified step advancement and robustness metric selection after the restyle. Research simulation behavior and empirical limitations remain unchanged; see `frontend/README.md` and `docs/VALIDATION.md`.
