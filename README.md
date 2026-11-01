# Sequential Watermarking of Language Models

Research on replacing a fixed-budget watermark permutation test with a sequential Monte Carlo test that can stop once enough evidence has accumulated. The project combines distortion-free watermark generation with testing by betting and evaluates detection power, false positives, and resampling cost under token edits.

This is a University of Michigan CSE 598 Winter 2025 group project, forked from [the original group repository](https://github.com/emiliocantuc/watermark-sequential). The underlying watermark implementations build on [Kuditipudi et al.](https://github.com/jthickstun/watermark). Project-level work is collaborative; individual contributions are recorded in the final report.

Explore the [live project exhibit](https://juyal-devashish.github.io/LLM-Sequential-Watermarking/). The research implementation still has known validation gaps. See the [exhibit plan](docs/EXHIBIT_PLAN.md) and [validation backlog](docs/VALIDATION.md).

## Repository map

| Location | Contents |
| --- | --- |
| `src/watermarking/` | Importable generation, detection, attacks, and watermark methods |
| `experiments/` | C4 and instruction experiment runners, sweeps, and instruction inputs |
| `examples/legacy_demo/` | Original standalone Python/JavaScript demonstrations |
| `notebooks/` | Exploratory analysis with historical embedded outputs |
| `results/figures/` | Original saved project plots |
| `reports/` | Original midterm report, final report, and slides |
| `environments/` | Historical Linux/CUDA Conda package export |
| `docs/` | Architecture, evidence inventory, validation work, and exhibit plan |
| `frontend/` | Static exhibit, teaching simulation, and build script |

See [the migration map](docs/REPOSITORY_LAYOUT.md) for renamed paths.

## Local setup

Use Python 3.11 and a C compiler for the Cython alignment modules. The new dependency manifest is a starting point for portable setup, not a verified reproduction lockfile.

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[experiments,analysis]'
```

`requirements.txt` delegates to this editable install. The former Conda export is preserved verbatim at `environments/conda-linux-64.txt`; it is Linux/CUDA specific and should not be used directly on macOS. PyTorch device selection currently uses CUDA when available and CPU otherwise; Apple MPS support has not been added.

## Research entry points

Run these from the repository root after installation:

```bash
python -m experiments.c4_experiment --help
python -m experiments.instruct_experiment --help
python -m experiments.analyze --help
```

A small C4 sequential experiment, after the validation issues have been addressed:

```bash
mkdir -p results/raw/smoke
python -m experiments.c4_experiment \
  --save results/raw/smoke/sequential.p \
  --model facebook/opt-1.3b --test sequential_mc \
  --T 2 --batch_size 1 --m 20 --n_runs 100
```

Experiments download models/datasets and may take substantial time on CPU. The instruction runner retains a historical local model default and needs an explicit accessible `--model`. Full research sweeps are in `experiments/scripts/`; they have portable paths, but their scientific behavior is pending the checks in [VALIDATION.md](docs/VALIDATION.md). The fixed and fast output shapes are adapted by the runner, but full experiment execution and statistical validation remain pending.

The notebooks resolve the repository root automatically when opened from the repository or `notebooks/`. They require raw `results/exp-del`, `results/exp-sub`, and `results/exp-ins` data, which are not included. Their old outputs are preserved and have not been recomputed.

## Reports and evidence

- [Final report](reports/Final%20Report.pdf)
- [Midterm report](reports/Midterm%20Report.pdf)
- [Project slides](reports/Project%20Slides.pdf)
- [Additional write-up supplied by the author](https://drive.google.com/file/d/1KNR2OcLC9Ueuu13OQ-wDDC5eKqOUWkYq/view)
- [Evidence inventory](docs/EVIDENCE.md)

Saved figures are historical results. The current checkout has no raw per-trial experiment files or saved detection traces. No new performance claim follows from the directory cleanup.

## Research references

- Kuditipudi et al., [Robust Distortion-free Watermarks for Language Models](https://arxiv.org/abs/2307.15593).
- Fischer and Ramdas, [Sequential Monte-Carlo Testing by Betting](https://arxiv.org/abs/2401.07365).

Upstream attribution and notices embedded in the source are retained. This reorganization does not assign a new license to inherited code.

## Exhibit development

Run `node frontend/build.mjs` to assemble the site in `frontend/dist/`. Serve that directory with a local static server. GitHub Actions builds and deploys the site to GitHub Pages on pushes to `main`. The lab is a labeled teaching simulation; historical figures have not been reproduced from raw trial data.
