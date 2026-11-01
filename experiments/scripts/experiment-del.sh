#!/bin/sh
set -eu

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 SAVE_DIRECTORY [MODEL] [TOKEN_LENGTH]" >&2
    exit 2
fi
mkdir -p "$1"
output_dir=$(CDPATH= cd -- "$1" && pwd)
repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$repo_root"

save=$output_dir
model=${2:-facebook/opt-1.3b}  # 默认模型
m=${3:-80}                     # 默认生成 token 数
batch=20
gamma_tr=0.4
gamma_gu=0.0
n=256
T=200
buffer=100
seed=1

run=0
for eps in 0.05 0.1 0.15 0.2
do
    run=$((run+1)); echo run $run
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-trst.p" --n $n --batch_size $batch --m $m --deletion $eps --model "$model" --buffer_tokens $buffer --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-gust.p" --n $n --method gumbel --batch_size $batch  --m $m --deletion $eps --model "$model" --buffer_tokens $buffer --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-tred.p" --n $n --gamma $gamma_tr --edit --batch_size $batch --m $m --deletion $eps --model "$model" --buffer_tokens $buffer --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-gued.p" --n $n --gamma $gamma_gu --edit --method gumbel --batch_size $batch  --m $m --deletion $eps --model "$model" --buffer_tokens $buffer --seed $seed
    python -u -m experiments.c4_experiment --save "$save/m$m-run-$run-ki10.p" --method kirchenbauer --batch_size $batch --m $m --kirch_delta 1.0 --deletion $eps --model "$model" --buffer_tokens $buffer --seed $seed
    
done
