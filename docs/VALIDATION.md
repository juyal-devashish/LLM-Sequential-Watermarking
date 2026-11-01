# Validation status — 2026-11-01

The first exhibit displays historical figures and a labeled illustration. This pass corrects and tests the numerical detector; it does not reproduce the original OPT-1.3B/C4 experiments.

## Completed engineering and numerical checks

- Fixed the finite-budget test to `(losses + 1) / (B + 1)`, counting ties conservatively. Applied the same finite-reference correction to the fast reference test; its validity still requires an appropriate independent reference distribution.
- Corrected sequential indexing to `binom.sf(losses, B + 1, c) / c`, with `B` counting comparisons from one. This matches Fischer/Ramdas Proposition 5.2. A direct finite binomial sum and the paper's 39-comparison zero-loss example are regression checks. Running-max p-values include initial wealth one. Futility is reported separately from rejection.
- Replaced repeated text permutations with fixed-text, fresh-key comparisons using the same statistic for observed and null keys. This removes compressed-vocabulary discrepancies. The transform key ignores the optimization parameter, so forcing compressed token ranks would change its statistic; no such optimization is used. Tests preserve tokens and global RNG state.
- Added finite score, budget, vocabulary, parameter, and window validation. The C4 runner rejects the unimplemented Kirchenbauer key-randomization comparison explicitly; it needs the dedicated z-score detector.
- Made both experiment runners import-safe, with parsing before heavyweight imports. Instruction models must be supplied explicitly. Translation failures raise errors rather than silently returning empty text.
- Added per-trial JSON sidecars to C4 runs: tokens, labels, p-values, resamples, stop reasons, detection-only seconds, sequential wealth/scores, run settings, source commit, environment, and available model/tokenizer revisions. Dataset revision is explicitly unknown.
- Notebook attack rates and method labels now come from recorded arguments. Historical embedded outputs remain preserved and must be regenerated before comparison with corrected code.
- Installed the research/analysis environment on macOS arm64 CPython 3.11 and recorded exact resolved package versions in `environments/validated-macos-py311.txt`. Python 3.12 hits an old tokenizer source-build requirement. The local Cython compilation required Xcode's compiler/linker and the explicit MacOSX26.5 SDK; no global machine settings were changed.
- Both Cython alignment extensions compile and execute. Twelve tests pass locally, covering formula/indexing, ties, invalid inputs, deterministic key sampling, RNG isolation, and result adapters. GitHub CI runs the research checks separately from frontend build and gates deployment on both.

Primary formula reference: https://arxiv.org/html/2401.07365v4 (Sections 1 and 5.2, Remark 1, Proposition 5.2). The guarantee is conditional on exchangeable observed/null statistics; numerical tests do not prove every watermark implementation meets this assumption.

## Calibration evidence

`results/exhibit/calibration.json` records 5,000 paired Uniform(0,1) null-score trials with seed 20261101 and a 100-comparison budget. Both tests use the same streams. Sequential rejection rate: 0.0326 (Wilson 95% interval 0.0280–0.0379); fixed-budget rate: 0.0492 (0.0435–0.0555). Median sequential resamples: 3, including futility stops. This validates synthetic score behavior only, not LLM accuracy, runtime, or robustness. Reproduce with `python scripts/validate_calibration.py`.

## Remaining empirical work and limits

- The original raw OPT/C4 trials are absent. Corrected-code figures need new paired runs or recovered data, with fixed model/tokenizer/dataset revisions and known generation/test seeds. Historical PNGs remain labeled historical.
- Full model/dataset download, end-to-end inference, all attack configurations, power estimates, wall-clock comparison, and failure coverage have not been run. CI's numerical checks do not replace these experiments.
- A shared per-test result object exists in `test_scores`; legacy wrappers preserve old return conventions. C4 captures its full trace, but the instruction runner still uses its historical result format.
- Dependency versions are recorded for one tested platform; this is not a universal cross-platform lock. Package resource inclusion was checked in the earlier wheel build; a clean installed-wheel runtime test remains useful.
- The old browser detector is excluded from the exhibit. It differs in vocabulary handling and alignment aggregation and has not been certified equivalent. Embedded attribution remains; no new license is assigned to inherited code.
- New notebook plots and confidence intervals across watermark-method/attack groups require raw observations. Metadata inference has been repaired, but original aggregations have not been scientifically reinterpreted from missing data.

These limits are not marked complete. The website does not present new real-text performance or a universal AI-text detector claim.
