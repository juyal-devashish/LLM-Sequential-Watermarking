#!/bin/sh

# Get power curves by varying the amount of permutations each test can perform
# ran with: nohup sh experiments/scripts/experiment-power-curve.sh results/power facebook/opt-1.3b &
save=$1
model=$2
batch=50
n=256
seed=1
T=200

export PYTHONPATH="."
mkdir -p $save

run=0
for n_runs in 10 25 50 75 100 200 500 1000 2000 3000 5000 10000;do
    for seed in 0 1 2; do
        run=$((run+1)); echo run $run
        python3 experiments/c4-experiment.py --save $save/run-$run-trst-fast.p --test fast --T $T --n_runs $n_runs --batch_size $batch --model $model --seed $seed
        python3 experiments/c4-experiment.py --save $save/run-$run-trst-full.p --test permutation --T $T --n_runs $n_runs --batch_size $batch --model $model --seed $seed
        python3 experiments/c4-experiment.py --save $save/run-$run-trst-seq.p --test sequential_mc --T $T --n_runs $n_runs --batch_size $batch  --model $model --seed $seed
    done
done