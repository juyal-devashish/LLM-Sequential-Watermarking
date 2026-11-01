# Validation before exhibit measurements

These issues were observed by source inspection at the original checkout `c4bc5c2`. They are preserved as explicit follow-up work rather than mixed into a directory reorganization.

## Required before new comparison results

1. **Normalize test results.** In `experiments/c4_experiment.py`, the evaluation loop unpacks `(pval, _, _, tim)` for every selected test. `permutation_test` and `fast_permutation_test` currently return scalar values. Add an explicit shared result with p-value, resamples used, decision, stop reason, and optional trace. Test all three runner branches without model downloads.
2. **Reconcile the fixed-budget baseline.** `src/watermarking/detection.py` currently uses `r / B`; the reports describe `(r + 1) / (B + 1)`. Establish the intended Monte Carlo sampling/tie convention, implement it with tests, and retain original historical results as a separate version. Do not characterize permutation tests generally as invalid based on this implementation's historical plots.
3. **Audit the sequential wealth formula.** Match the binomial tail, iteration indexing, sign flip, and tie treatment to the selected Fischer/Ramdas procedure. Python counts iterations from zero while the report's algorithm starts at one. Check both the upper rejection rule and lower futility rule, validate `0 < c < alpha < 1`, and test against independently calculated small examples. Evaluate a numerically stable survival function instead of subtracting a near-one CDF. Do not assert that the present code has been proved anytime-valid.
4. **Audit null sampling for each method.** The transform branch in the C4 runner hardcodes `null=False` while the gumbel branch forwards the argument. The transform key generator currently ignores `eff_vocab_size`, so the impact requires analysis, not an automatic one-line change. Verify exchangeability, vocabulary handling, and the repeated token permutations.
5. **Use paired experiments.** Generate a fixed collection of null/watermarked texts once. Compare detectors on those same texts and, where compatible, common precomputed null-statistic streams. Separate model/attack RNG from test RNG. Record model revision, tokenizer revision, dataset provenance, all seeds, and source commit.
6. **Make artifacts auditable.** Preserve per-trial p-values, decisions, actual resamples, stop reasons, timings, and selected full traces. Current saved results discard `Ws` and `phis`. Export portable JSON/CSV with finite values; do not load arbitrary pickle files in the browser.
7. **Repair analysis provenance.** Notebooks infer perturbation rates from filename run numbers using a hardcoded 11-rate list. The dedicated attack scripts currently sweep only four rates. Derive rates/methods from recorded arguments and distinguish mean-of-medians from pooled medians. Keep null and watermarked costs separate. Give incomplete runs an explicit status.
8. **Measure validity and efficiency together.** Use repeated null trials and report false-positive counts with uncertainty; empirical power alone cannot justify a detector. Measure wall time separately from resampling counts. Reuse the same hardware/model/settings for comparative timing, exclude generation from detection-only timing, and describe timeout/cap treatment.

## Additional engineering work

- Resolve and lock dependencies for a documented Python/platform combination; test Cython imports and packaged JSON access in a clean environment. Check current dataset availability and model loading separately from unit checks.
- Isolate argument parsing from execution and move model initialization behind `main()` so help/imports and unit tests do not require the entire inference stack.
- Validate zero-length/short text, invalid `k`, empty datasets, all ties, invalid budgets, and failed generation/translation. Report errors instead of silently converting failed translations to empty strings.
- Make instruction-model paths explicit and remove any dependency on a research lab's filesystem.
- Inspect the inherited JavaScript detector before reuse: it fixes vocabulary size at 32000, has its own RNG, and aggregates window alignments by a median while Python uses a minimum. It is not a verified browser equivalent of the sequential detector.
- Check source licenses/attributions before packaging inherited browser code. Keep team credits distinct from individual contributions.

## Completion evidence

The directory-cleanup checks establish source preservation, syntax/path integrity, and distribution contents. They do not establish numerical correctness, reproduction of report results, statistical error control, or portable runtime compatibility. Record actual commands and outcomes in the task handoff; only label new measurements reproduced after the above scientific checks pass.
