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

save=$output_dir
model=$2
batch=50
n=256
seed=1

run=0
for m in 3 5 7 10 15 20 25 30 35 40
do
    run=$((run+1)); echo run $run
    python -u -m experiments.c4_experiment --save "$save/run-$run-trst.p" --n $n --batch_size $batch --m $m --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/run-$run-gust.p" --n $n --method gumbel --batch_size $batch --m $m --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/run-$run-ki10.p" --method kirchenbauer --batch_size $batch --m $m --kirch_delta 1.0 --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/run-$run-ki15.p" --method kirchenbauer --batch_size $batch --m $m --kirch_delta 1.5 --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/run-$run-ki20.p" --method kirchenbauer --batch_size $batch --m $m --kirch_delta 2.0 --model "$model" --seed $seed
done
