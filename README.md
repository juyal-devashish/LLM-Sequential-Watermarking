# 📌 About This Fork

This repository is a fork of a collaborative research project originally developed by our project group during the **Winter 2025** semester at the University of Michigan, Ann Arbor, as part of **CSE-598: Large Language Models**. You can find the original repository [here](https://github.com/original-org/original-repo).

This fork specifically highlights **my core contributions** to the initial group project and includes ongoing personal improvements, extensions, and further experimentation.

---

## 🔍 Project: Sequential Robust Distortion-free Watermarks for Language Models

This project explores and extends methodologies described in the paper **“Robust Distortion-free Watermarks for Language Models”** (Kuditipudi et al.). The original implementation from that paper can be found [here](https://github.com/kuditipudi/watermark-method).

### 🎯 Motivation & Objectives

- **Goal**: Embed robust, invisible, and efficiently-detectable watermarks into generated text outputs of large language models (LLMs) without compromising naturalness or readability.
- **Challenge**: Traditional Full Permutation testing is reliable but computationally expensive.
- **Our Proposal**: Replace the Full Permutation test with a **Sequential Monte Carlo (SMC)** test structured within a **test-by-betting** framework (inspired by Fischer & Ramadas, 2024).
- **Benefits**:
  - **Faster runtime** (reduced computational complexity)
  - **Maintained or improved statistical power**
  - **Strict control of Type I error** (false positives)
  - **Scalability** for real-time, large-scale deployments

---

## 🚀 Key Contributions & Modifications

1. **SMC-based Detection**  
   - Designed a sequential testing procedure using particle filters and betting-based stopping rules.
2. **Algorithm Integration**  
   - Embedded the SMC test into the original watermark detection pipeline.
3. **Benchmarking & Evaluation**  
   - Compared detection latency, Type I/II error rates, and overall throughput against the Full Permutation baseline.
4. **Code Refactoring & Documentation**  
   - Modularized scripts for ease of extension and reproducibility.

---

## 🧪 Running the Experiments

### Prerequisites

- Python 3.8+
- CUDA‑enabled GPU (optional for large-scale model trials)

### Quick Start

```bash
# 1. Clone this fork
git clone https://github.com/yourusername/watermark-sequential.git
cd watermark-sequential

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run a sample experiment
python experiments/run_watermarking.py \
  --config configs/your_experiment_config.yaml






## 📌 About This Fork

This repository is a fork of a collaborative project originally developed [here](https://github.com/emiliocantuc/watermark-sequential) by our project group over Winter 2025 at Univeristy of Michigan, Ann Arbor for CSE-598: Large Language Models.

This fork reflects both my contributions to the original project and any personal enhancements I continue to make.

# (Sequential) Robust Distortion-free Watermarks for Language Models

Modification of the methods described in [Robust Distortion-free Watermarks for Language Models](https://arxiv.org/abs/2307.15593). Original repo is [here](https://github.com/jthickstun/watermark).

We replace the traditional Full Permutation test in the `detect` algorithm used by Kuditipudi et. al. with a sequential Monte Carlo (in a test-by-betting framework) test inspired by the work of [Fischer and Ramadas](https://arxiv.org/abs/2401.07365) (particularly the mixture strategy). The aim is to make a level alpha the test faster without sacrificing power or Type I error. 
# Running the Experiments

To run the experiments, follow these steps:

1. **Create and activate the environment, and run the experiment scripts:**

   ```bash
   # Create the environment
   conda create --name <env> --file requirement.txt

2. **Activate your new environment**
   ```bash
   # Activate the environment
   conda activate <env>
3. **Run the experiment scripts**
   ```bash
   # Power curve experiments
   ./experiments/scripts/experiment-power-curve.sh <save directory path> facebook/opt-1.3b

   # Deletion perturbation experiments
   ./experiments/scripts/experiment-del.sh <save directory path> facebook/opt-1.3b

   # Insertion perturbation experiments
   ./experiments/scripts/experiment-ins.sh <save directory path> facebook/opt-1.3b

   # Substitution perturbation experiments
   ./experiments/scripts/experiment-sub.sh <save directory path> facebook/opt-1.3b

Here are results that we got, using $\alpha = 0.05$ and (Algorithm 3) $c=0.04$:
<p align="center">
  <img src="results/power and null rejection.png" width="45%"/>
  <img src="results/decision permutations.png" width="45%"/>
</p>

<p align="center">
  <img src="results/avg_pval_by_method.png" width="45%"/>
  <img src="results/avg_power_by_method.png" width="45%"/>
</p>

<p align="center">
  <img src="results/avg_nullrate_by_method.png" width="45%"/>
  <img src="results/avg_perms_by_method.png" width="45%"/>
</p>

<p align="center">
  <img src="results/combined_pval_vs_rate.png" width="45%"/>
  <img src="results/combined_power_vs_rate.png" width="45%"/>
</p>

<p align="center">
  <img src="results/combined_nullrate_vs_rate.png" width="45%"/>
  <img src="results/combined_perms_vs_rate.png" width="45%"/>
</p>



## References
```bib
@article{kuditipudi2023robust,
  title={Robust Distortion-free Watermarks for Language Models},
  author={Kuditipudi, Rohith and Thickstun, John and Hashimoto, Tatsunori and Liang, Percy},
  journal={arXiv preprint arXiv:2307.15593},
  year={2023}
}
```

```bib
@misc{fischer2024sequentialmontecarlotestingbetting,
      title={Sequential Monte-Carlo testing by betting}, 
      author={Lasse Fischer and Aaditya Ramdas},
      year={2024},
      eprint={2401.07365},
      archivePrefix={arXiv},
      primaryClass={stat.ME},
      url={https://arxiv.org/abs/2401.07365}, 
}
```
