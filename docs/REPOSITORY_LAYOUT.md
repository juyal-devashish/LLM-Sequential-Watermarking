# Repository layout and migration

The cleanup separates reusable Python code, research workflows, historical evidence, and future presentation code. It preserves the `watermarking` import name and the contents of the detection/generation algorithms.

```text
LLM-Sequential-Watermarking/
  pyproject.toml                 # src-layout packaging and dependency groups
  requirements.txt              # convenience editable install
  .python-version               # recommended Python 3.11
  src/watermarking/              # generation, detection, attacks, method implementations
  experiments/
    c4_experiment.py
    instruct_experiment.py
    analyze.py
    instructions/               # existing instruction dataset
    scripts/                    # research sweeps
  examples/legacy_demo/          # original standalone demos, not the future web app
  notebooks/                    # historical exploratory analysis
  results/
    figures/                    # original PNG evidence
    README.md
  reports/                      # existing public report paths retained
  environments/conda-linux-64.txt
  frontend/README.md             # future exhibit brief
  docs/                         # plan, evidence, validation, this migration map
```

## Migration map

| Previous path | Current path |
| --- | --- |
| `watermarking/` | `src/watermarking/` |
| `demo/` | `examples/legacy_demo/` |
| root `*.ipynb` | `notebooks/` |
| `results/*.png` | `results/figures/*.png` |
| `experiments/c4-experiment.py` | `experiments/c4_experiment.py` |
| `experiments/instruct-experiment.py` | `experiments/instruct_experiment.py` |
| old `requirements.txt` | `environments/conda-linux-64.txt` |
| `ProjectReports` | duplicate removed; use `reports/README.md` |

Install the library before running experiments; use `python -m experiments.c4_experiment` from the repository root. Sweep scripts resolve the checkout from their own path and preserve output directories relative to the invoking directory. The instruction runner resolves its JSON input relative to its own file. Notebook inputs/exports resolve relative to the repository rather than the notebook working directory.

Cython `.pyx` sources and homoglyph JSON files are explicitly included in Python distributions. Cython compilation remains on-demand through the existing `pyximport` code. The installed distribution contains the library; experiment modules, reports, examples, and notebooks remain checkout tools.

`results/raw/` is reserved for generated local data and ignored by Git. Future curated, portable exhibit data will live in `results/exhibit/` and may be tracked. Existing figure filenames and report filenames are retained for provenance. Report links remain at their existing locations; figure links have moved.

## Deliberate scope

This pass updates paths, packaging, ignores, and documentation. It does not change statistical formulas, generation behavior, perturbation rates, benchmark defaults, stored PNGs, or embedded notebook outputs. It adds no API server or running frontend. The dependency ranges have not been resolved into a tested lockfile; production readiness requires the validation work listed separately.
