# Evidence inventory

Inspected on 2026-11-01. The starting source commit was `c4bc5c2`.

## Sources

| Source | What it can support | Limit |
| --- | --- | --- |
| `reports/Final Report.pdf` | Project motivation, original experiment setup, figure interpretations, individual contribution statement on page 9 | Historical report; raw runs are absent |
| `reports/Midterm Report.pdf` | Early method and preliminary experiments | Earlier stage; do not merge its sample counts with the final experiments |
| `reports/Project Slides.pdf` | Explanatory narrative and presentation figures | Some slide shorthand differs from the report; verify settings against runs |
| [Author-supplied Drive write-up](https://drive.google.com/file/d/1KNR2OcLC9Ueuu13OQ-wDDC5eKqOUWkYq/view) | Named authors, narrative, model and corruption setup, additional figure layout | `LLM_Watermarking.pdf`, Drive metadata modified 2025-12-17; a separate version, not silently substituted for the repository report |
| `results/figures/*.png` | Original plotted evidence for a gallery | Images are not raw observations or interactive chart datasets |
| `notebooks/*.ipynb` | Analysis code and preserved historical outputs | Input pickles are not present; not executed during cleanup |
| `src/watermarking/` | Actual implementation at the checked-out version | Known formula/runner/provenance questions in `VALIDATION.md` |

The Drive write-up was read through the connected Google Drive tool. It has the same project title and core experimental story, with different pagination/figure organization. Keep each document's figure numbering local to that document. Its readable text contains unresolved figure references, so captions should use the actual verified image/title rather than copying those references.

## Available figure groups

| Existing filenames in `results/figures/` | Intended exhibit use |
| --- | --- |
| `power and null rejection.png` | Historical power and false-positive comparison |
| `decision permutations.png` | Historical resampling cost, null versus watermarked |
| `combined_pval_vs_rate.png`, `combined_power_vs_rate.png`, `combined_nullrate_vs_rate.png`, `combined_perms_vs_rate.png` | Historical attack-type comparison |
| `avg_pval_by_method.png`, `avg_power_by_method.png`, `avg_nullrate_by_method.png`, `avg_perms_by_method.png` | Historical watermark-method comparison averaged over attacks |

Captions need to verify whether figures use means, medians, or averages of medians. Original PNG bytes are preserved. No plot values have been digitized or invented.

## What the reports say

The final documents describe OPT-1.3B/C4 experiments, text length 80, key length 256, significance level 0.05, betting parameter 0.04, and a robustness experiment with 200 outputs, corruption rates 0.05 to 0.8, and a 5000-resample cap. These are report-described settings, not a newly reproduced benchmark. Some scripts/defaults differ.

The write-ups summarize detection with roughly 40-50 resamples in selected settings and compare it with fixed budgets of 1000 or 5000 in different experiments. Those summaries are not interchangeable denominators and do not establish a wall-clock speedup or a guarantee for arbitrary text. Any numerical headline must identify the exact figure/run, method, perturbation, statistic, and budget first.

## Missing evidence

- Raw per-trial experiment outputs, aggregate JSON/CSV, and original run manifests.
- Full sequential wealth/statistic traces for particular texts.
- Saved generated text/token fixtures with matched null/watermarked examples.
- Paired detection-only timing results and hardware metadata.
- Verified Python-to-browser implementation parity.

Until those exist, the exhibit can display the original figure gallery and clearly labeled teaching simulations. New filterable quantitative plots need recovered data or new validated runs.

## Attribution

The final repository report credits Devashish Juyal with the literature survey, sequential Monte Carlo framework, detection implementation, proposed power/null-rejection experiments, and statistical-validity analysis. It credits Emilio Cantu-Cervini, Zicheng Jin, and Sri Likhita Adru with overlapping implementation, experiments, robustness analysis, and interpretation. Use a short personal contribution paragraph alongside the full team credit; do not imply sole authorship of the research or all experiments.
