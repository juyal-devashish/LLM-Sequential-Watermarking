# Exhibit redesign

Design reference: [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design). User brief: engaging finance-inspired project demo, restrained rather than product marketing.

## Direction

A quantitative research workspace: lead with the question and an operable evidence monitor. Keep the historical charts and their provenance easy to inspect. Avoid commercial language, decorative market prices, or implying that watermarking is a finance model.

- Colors: canvas `#edf1f5`, paper `#ffffff`, ink `#172d43`, secondary `#52647a`, signal `#09796b`, threshold `#b35c16`. Monitor uses ink with light cyan and amber for readable chart contrast.
- Typography: Avenir Next with humanist system fallbacks, for headings and body; tabular figures for chart readouts. No serif newspaper styling or decorative uppercase metadata.
- Layout: left-aligned question and compact project explanation beside a larger interactive chart. A shared experiment-settings strip anchors the opening. Below: a short actual three-step method, a large results viewer with contextual metric controls, and contributors/resources.
- Interaction: scenario buttons, run/pause, step, replay, scrubber, explicit final state, chart metric/view controls, original-image links. Motion occurs only after an action. Reduced motion disables animated playback and offers immediate completion.

```text
name                       Explore / Method / Results / Source
question + explanation     interactive evidence monitor
                           scenario / chart / scrub / controls
report model     dataset     text length     significance
method: generate -> compare -> decide
results navigation         large original figure
reading guide              caption + provenance
contributors               report / references
```

## Review before implementation

The prior cream/serif/copper treatment reads as a generic report, and repeated numbered headings add little navigation value. Replace it with a single visually prominent chart, broad cool surfaces, and fewer containers. Keep the finance influence in chart conventions and comparative research, not fake trading chrome. Avoid re-creating a dense terminal; the page must explain the project to a first-time visitor.

Historical PNGs remain original. The demonstration remains explicitly synthetic and is not a p-value, detector, or measured result. No performance claim is inferred from the redesigned graphics.
