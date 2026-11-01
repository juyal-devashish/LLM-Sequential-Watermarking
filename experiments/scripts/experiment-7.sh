#!/bin/sh
set -eu

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 SAVE_DIRECTORY" >&2
    exit 2
fi
mkdir -p "$1"
output_dir=$(CDPATH= cd -- "$1" && pwd)
repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$repo_root"

save=$output_dir
gamma_tr=0.4
gamma_gu=0.0
n=256
T=200
seed=1

run=0

run=$((run+1)); echo run $run
python -u -m experiments.instruct_experiment --save "$save/run-$run-gued.p" --n $n --gamma $gamma_gu --edit --method gumbel --T $T --seed $seed
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki10.p" --method kirchenbauer --kirch_delta 1.0 --T $T --seed $seed
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki15.p" --method kirchenbauer --kirch_delta 1.5 --T $T --seed $seed
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki20.p" --method kirchenbauer --kirch_delta 2.0 --T $T --seed $seed

run=$((run+1)); echo run $run
python -u -m experiments.instruct_experiment --save "$save/run-$run-gued.p" --n $n --gamma $gamma_gu --edit --method gumbel --T $T --seed $seed --rt_translate --language french
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki10.p" --method kirchenbauer --kirch_delta 1.0 --T $T --seed $seed --rt_translate --language french
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki15.p" --method kirchenbauer --kirch_delta 1.5 --T $T --seed $seed --rt_translate --language french
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki20.p" --method kirchenbauer --kirch_delta 2.0 --T $T --seed $seed --rt_translate --language french

run=$((run+1)); echo run $run
python -u -m experiments.instruct_experiment --save "$save/run-$run-gued.p" --n $n --gamma $gamma_gu --edit --method gumbel --T $T --seed $seed --rt_translate --language russian
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki10.p" --method kirchenbauer --kirch_delta 1.0 --T $T --seed $seed --rt_translate --language russian
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki15.p" --method kirchenbauer --kirch_delta 1.5 --T $T --seed $seed --rt_translate --language russian
python -u -m experiments.instruct_experiment --save "$save/run-$run-ki20.p" --method kirchenbauer --kirch_delta 2.0 --T $T --seed $seed --rt_translate --language russian
