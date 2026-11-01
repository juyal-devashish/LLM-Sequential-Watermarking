# Project exhibit plan

Status: proposed implementation, grounded in the repository and the additional Drive write-up inspected on 2026-11-01. Directory cleanup is complete; frontend construction and scientific validation are next.

## The story

**Working headline: "How much evidence is enough to detect a watermark?"**

The project studies a particular bottleneck: a watermark detector can spend a large fixed budget comparing text against randomized keys, even when the decision becomes clear much earlier. A sequential test monitors evidence as resamples arrive and can stop early. The exhibit should let visitors see that decision unfold, then inspect its power, false positives, and computational cost.

This follows the [IRM Stock Prediction exhibit](https://juyal-devashish.github.io/IRM_Stock_Prediction/): a strong opening question/result, an interactive experiment, empirical comparisons, original figures, and reproduction instructions. Use the same restrained visual language: generous whitespace, large readable type, thin chart rules, direct labels, pill controls, and light/dark themes. Avoid replacing the research story with a collection of metric cards.

The important distinction is that the sequence here is **Monte Carlo resamples on a fixed candidate text**. The current experiment is not a token-streaming detector. Label the horizontal axis "resamples evaluated," not "tokens generated" or elapsed seconds.

Do not choose a numerical speedup headline until the exact experiment and denominator are verified. The report's selected 40-50-resample summaries belong beside their original figures and settings, not in an unconditional promise.

## What visitors will see

| Order | Section | Display and interaction | Evidence needed |
| --- | --- | --- | --- |
| 1 | Opening comparison | One matched candidate; fixed-budget progress versus sequential stopping; show decision and actual resamples | Audited saved trace, with a teaching simulation fallback explicitly labeled |
| 2 | Detection lab | Step/play/reset an evidence trace; switch clean watermarked, edited watermarked, unwatermarked, and wrong-key examples | Text/token fixtures and null-statistic traces from offline Python |
| 3 | How the watermark works | Prompt + key -> keyed sampling -> candidate text -> optional edits -> alignment score -> statistical test; show one small alignment example | Source-grounded explanation; tiny illustrative token example |
| 4 | Power, false positives, and cost | Linked plots/table; choose test method and resample budget; distinguish null and watermarked costs | Original figure initially; structured audited runs for interactive plots |
| 5 | What edits do | Choose deletion/insertion/substitution, rate, and watermark method; view power, false-positive rate, and median resamples together | Verified attack data with rate/method metadata |
| 6 | Original figures | Captioned gallery, zoom, source-document links, original versus new labels | Existing 10 PNGs and reports |
| 7 | My contribution and team | Short personal contribution paragraph, full group credit, course context, upstream research | Repository final report contribution statement; author list in supplied write-up |
| 8 | Reproduce and read more | Tested setup commands, small run, downloadable data/manifests, source, write-ups, references | Verified environment and commands |

Suggested navigation: **Lab / Method / Results / Robustness / Figures / Run it / Source**.

## The main interaction: watch a test decide

Show the same candidate and observed alignment score on both sides. Lower alignment costs indicate better key alignment; explain the sign convention before showing the betting trace.

- Plot wealth `W_t` on a log scale, with the rejection threshold `1 / alpha`, the lower futility threshold, and a marked stopping point.
- Offer an alternate view of the running p-value `1 / max(W_0, ..., W_t)` with the significance line. Define a p-value as evidence under the null, not a probability that a person or model wrote the text.
- Display resamples used, configured budget, and stop reason: **evidence for this watermark**, **stopped for futility**, or **budget exhausted**. A failure to reject does not establish human authorship or prove the watermark absent.
- Let visitors step one resample or play at an adjustable visual speed. Animation time is presentation time, not measured detection latency.
- Offer a few vetted fixtures: clean matched-key text; moderately corrupted text; unwatermarked model text; wrong-key text; one hard/capped example. Include method, model, token count, seed identifier, and source version in an expandable details panel.
- Start with saved parameters `alpha=0.05`, `c=0.04`. Advanced controls can replay a full saved null-statistic stream under a different valid parameter choice, or run a seeded teaching simulation. Do not fabricate a measured trace when the fixture lacks the required stream.
- If showing the fixed-budget p-value as it evolves, state that intermediate values are descriptive and that the baseline makes its decision at the preselected budget; do not give it an optional-stopping rule it does not have.

Offer two explicit modes if useful: **Recorded run** and **Teaching simulation**. The simulation should use seeded, documented synthetic scores to explain stopping, with null examples using an exchangeable score construction. It does not run OPT-1.3B or establish real watermark performance. Avoid suggesting that arbitrary Bernoulli streams prove the theorem.

## Results and robustness

Show the three quantities together so saving computation cannot hide lost power or increased false positives:

1. **Power:** fraction of watermarked examples detected, with sample count and uncertainty.
2. **False-positive rate:** fraction of null examples rejected; include the target alpha and uncertainty. Keep a nominal significance level distinct from a measured rate.
3. **Cost:** actual resamples, null and watermarked separately; show cap-hit/futility rates. Add detection-only wall time only after measurement, with hardware and aggregation stated.

Compare fixed-budget permutation and sequential Monte Carlo first. Add the fast empirical-reference test as a secondary baseline after its calibration is documented. For robustness, expose ITS, ITS-edit, EXP, EXP-edit, and the relevant Kirchenbauer setting only when matching data exist. Keep generation method separate from detection-test choice.

Attack controls must select measured rates. Do not interpolate nonexistent experiments or imply all method/attack/budget combinations were run. Each chart should have a table view and a small source/settings link. Averages across attack types must be labeled; an aggregate is not evidence of the same outcome for every attack.

The current PNGs can anchor the first historical gallery. Recover the original per-trial outputs if possible; otherwise run a compact new matrix and label it as a new implementation/version. Do not digitize plot images into apparently exact measurements.

## Technical design

Use a static React + TypeScript + Vite frontend, matching the neighboring IRM exhibit's stack. Use SVG for the trace/summary charts and accessible HTML tables. Consider a small Web Worker only if the teaching simulation affects scrolling responsiveness.

```text
Offline Python experiments
  -> validated per-trial outputs + full selected traces
  -> versioned JSON/CSV and provenance manifest
  -> static frontend charts, trace replay, and downloads

Browser teaching simulator
  -> seeded synthetic scores
  -> the same tested sequential update logic
  -> clearly labeled educational visualization
```

Keep LLM generation, tokenization for recorded experiments, and expensive alignment computations in Python. The first release needs no inference server, API key, sign-in, or GPU in the visitor's browser. An arbitrary-text detector is a later extension requiring a specified key/tokenizer, bounded inputs, and a separately evaluated runtime.

Proposed frontend organization when implementation begins:

```text
frontend/
  src/
    app/                 # page composition/navigation
    lab/                 # trace playback, stopping views, fixture selection
    charts/              # trace/summary SVGs and accessible tables
    data/                # typed loaders and schema validation
    simulation/          # seeded educational score generator and worker
    styles/              # theme tokens, typography, responsive layout
  public/                # curated figures and portable evidence exports
  package.json
  vite.config.ts
results/exhibit/         # canonical audited exports and manifest
scripts/export_exhibit.py
```

Copy curated evidence into the frontend as part of its build; avoid divergent handwritten numeric datasets. Do not reuse `examples/legacy_demo/detect.js` as the sequential engine without an explicit equivalence review. It currently implements a different detector.

## Data contract to build first

Use versioned JSON for metadata/trace playback and CSV for per-trial downloads. Represent missing/nonfinite values explicitly, never as fabricated zeros.

| Artifact | Required fields |
| --- | --- |
| Manifest | schema version, evidence kind, source commit, generation timestamp, environment/hardware, model/tokenizer/dataset revision, source document/figure where applicable |
| Run settings | test method, watermark method, key/window lengths, text length before/after edits, attack/rate, alpha, c, budget, all seeds |
| Trial | run/sample IDs, known null/watermark label, observed statistic, final p-value, reject flag, stop reason, resamples used, optional measured detection time |
| Trace | trial ID, unambiguous round indexing, observed and null statistics, exceedance count, wealth, running-max wealth/p-value, terminal reason |
| Text fixture | trial ID, original/generated text, token IDs, actual edits and edited token IDs/text, tokenizer revision, demonstration-key metadata |
| Summary | grouped settings, trial counts, power/false-positive counts and rates, intervals, median/quantiles of cost, cap-hit/futility rates |

Evidence kinds: **historical report**, **new validated run**, **teaching simulation**. Keep original and corrected algorithm versions distinguishable. If a historical setting is unknown, mark it unknown.

## Build sequence and acceptance gates

### Phase 0: repository preparation — completed in this pass

Separate the library, research tools, notebooks, environment archive, evidence, and frontend brief. Add install metadata and preserve original algorithms/plots/reports. Verify the migration and package contents. This establishes a maintainable layout, not scientific production readiness.

### Phase 1: trustworthy detector and runner

Address `VALIDATION.md`: shared result shape, finite-sample baseline correction, sequential formula/indexing review, null-sampling audit, repeatable RNG, and saved traces. Write small numerical tests and empirical null-calibration tests before reporting new results. Establish a clean environment and lock its dependencies.

**Gate:** all detector branches execute on controlled fixtures; independent formula checks pass; calibration counts/uncertainty are reported; imports/Cython resources work in a clean installation. The first concrete deliverable is a small detector-result contract plus a validated recorded trace.

### Phase 2: evidence exports

Attempt to recover historical outputs; record what is recoverable. Generate a compact paired dataset covering clean null/watermarked examples, each edit type, and a small set of rates. Save hard examples as well as successful detections. Export the data contract and validate every summary against its per-trial rows.

**Gate:** each visible number can be traced to a run or explicitly labeled historical source. Trace replay matches Python, and histogram/table/summary counts agree. No model download is needed to inspect exported evidence.

### Phase 3: exhibit implementation

Build the opening comparison and trace lab first, then the method diagram, linked result views, robustness explorer, figure gallery, credits, and run instructions. Implement mobile layout, dark mode, keyboard controls, reduced motion, chart descriptions, and table alternatives as part of the feature work.

**Gate:** seeded simulator and Python fixture outputs agree where they share an algorithm; fixture switching/reset/stop states work; no missing assets; no unsupported claims; usable on narrow screens and with keyboard/reduced motion.

### Phase 4: review and publish

Review captions/settings against each source document, verify report/figure links and team attribution, run frontend checks/build and browser QA. Recommended destination is GitHub Pages at the repository's project path, analogous to the reference; configure its base path and Actions workflow when implementation is ready. Keep hosting separate from offline experiment execution.

**Gate:** successful build, correct project-path asset URLs, responsive and keyboard QA, verified source links, data downloads, and visible provenance labels. No website is being published during this planning pass.

## First release and later extensions

**First release:** one clear narrative, recorded sequential replay, a modest teaching lab, historical figure gallery, audited compact results if available, contribution credits, and working reproduction instructions.

**Later:** local text-detection CLI/interface, larger benchmark matrix, multiple model families, additional attacks, and optional hosted inference. Add these after the core evidence is reproducible. Unlike the stock exhibit's rolling market evaluation, this project has no natural weekly live-data section; a static, versioned benchmark is the more meaningful equivalent.

## Source pointers

- [Additional write-up](https://drive.google.com/file/d/1KNR2OcLC9Ueuu13OQ-wDDC5eKqOUWkYq/view).
- [Evidence inventory](EVIDENCE.md), including report-described settings and attribution.
- [Validation backlog](VALIDATION.md), including observed implementation discrepancies.
- [Repository migration](REPOSITORY_LAYOUT.md).
