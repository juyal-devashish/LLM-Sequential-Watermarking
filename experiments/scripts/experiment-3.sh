#!/bin/sh
set -eu

if [ "$#" -lt 3 ]; then
    echo "Usage: $0 SAVE_DIRECTORY MODEL TOKEN_LENGTH" >&2
    exit 2
fi
mkdir -p "$1"
output_dir=$(CDPATH= cd -- "$1" && pwd)
repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$repo_root"

save=$output_dir
model=$2
m=$3
batch=50
gamma_tr=0.4
gamma_gu=0.0
n=256
seed=1

run=0
for eps in 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8
do
    run=$((run+1)); echo run $run
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-trst.p" --n $n --batch_size $batch --m $m --substitution $eps --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-gust.p" --n $n --method gumbel --batch_size $batch  --m $m --substitution $eps --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-tred.p" --n $n --gamma $gamma_tr --edit --batch_size $batch --m $m --substitution $eps --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-gued.p" --n $n --gamma $gamma_gu --edit --method gumbel --batch_size $batch  --m $m --substitution $eps --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-ki10.p" --method kirchenbauer --batch_size $batch --m $m --kirch_delta 1.0 --substitution $eps --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-ki15.p" --method kirchenbauer --batch_size $batch --m $m --kirch_delta 1.5 --substitution $eps --model "$model" --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-ki20.p" --method kirchenbauer --batch_size $batch --m $m --kirch_delta 2.0 --substitution $eps --model "$model" --seed $seed
done
