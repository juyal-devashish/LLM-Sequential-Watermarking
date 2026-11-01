#!/bin/sh
set -eu

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 SAVE_DIRECTORY MODEL" >&2
    exit 2
fi
mkdir -p "$1"
output_dir=$(CDPATH= cd -- "$1" && pwd)
repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$repo_root"

# Get power curves by varying the amount of permutations each test can perform
# ran with: nohup sh experiments/scripts/experiment-power-curve.sh results/power facebook/opt-1.3b &
save=$output_dir
model=$2
batch=50
n=256
seed=1
T=200

mkdir -p "$save"

run=0
for n_runs in 10 25 50 75 100 200 500 1000 2000 3000 5000 10000;do
    for seed in 0 1 2; do
        run=$((run+1)); echo run $run
        python -u -m experiments.c4_experiment --save "$save/run-$run-trst-fast.p" --test fast --T $T --n_runs $n_runs --batch_size $batch --model "$model" --seed $seed
        python -u -m experiments.c4_experiment --save "$save/run-$run-trst-full.p" --test permutation --T $T --n_runs $n_runs --batch_size $batch --model "$model" --seed $seed
        python -u -m experiments.c4_experiment --save "$save/run-$run-trst-seq.p" --test sequential_mc --T $T --n_runs $n_runs --batch_size $batch  --model "$model" --seed $seed
    done
done
