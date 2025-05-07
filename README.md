# About This Fork (contains Reports/Slides with results)

The project contents (like reports, slides and results) can be found [here](https://github.com/juyal-devashish/LLM-Sequential-Watermarking/tree/main/reports)!

This repository is a fork of a collaborative research project originally developed by our project group during the Winter 2025 semester at the University of Michigan, Ann Arbor, as part of CSE-598: Large Language Models. You can find the original repository [here](https://github.com/emiliocantuc/watermark-sequential), this repo in addition to the code also consists of the reports and slides related to this project.

This fork specifically highlights contributions to the initial group project and includes ongoing personal improvements, extensions, and further experimentation.

## Project: Sequential Detection of Watermarks for Language Models

This project explores and extends methodologies described in the paper “Robust Distortion-free Watermarks for Language Models” (Kuditipudi et al.). The paper can be found [here](https://arxiv.org/abs/2307.15593) and it's original repository can be found [here](https://github.com/jthickstun/watermark).

### Objective of the Project

The goal was to replace the traditional Full Permutation test which is reliable but computationally expensive and takes longer to decide on a hypothesis with a Sequential Monte Carlo (SMC) test structured within a test-by-betting framework (inspired by Fischer & Ramadas, the paper can be found [here](https://arxiv.org/abs/2401.07365)) without losing any of the inherent properties of the watermark.
For the duration of the project we designed a sequential testing procedure using betting-based stopping rules, embedded the SMC test into the original watermark detection pipeline, compared detection latency, Type I/II error rates, and overall throughput against the Full Permutation baseline.

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
