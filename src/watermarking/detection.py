"""Conditional key-randomization tests; lower alignment scores favor a watermark."""
from dataclasses import dataclass, asdict
import math
import torch
from scipy.stats import binom


@dataclass
class TestResult:
    pvalue: float
    resamples: int
    rejected: bool
    stop_reason: str
    wealth: list
    statistics: list

    def to_dict(self):
        return asdict(self)


def test_scores(observed, null_scores, alpha=0.05, c=0.04, sequential=True):
    """Test a fixed observed score using a stream of exchangeable null scores.

    Uniform-mixture wealth: Fischer/Ramdas Proposition 5.2. Ties count as
    losses (conservative). Futility is not evidence that the null is true.
    """
    if not 0 < c < alpha < 1:
        raise ValueError("Require 0 < c < alpha < 1")
    observed = float(observed)
    if not math.isfinite(observed):
        raise ValueError("Scores must be finite")
    wealth, statistics, losses = [1.0], [observed], 0
    reason = "budget_exhausted"
    for b, score in enumerate(null_scores, 1):
        score = float(score)
        if not math.isfinite(score):
            raise ValueError("Scores must be finite")
        statistics.append(score)
        losses += score <= observed
        w = float(binom.sf(losses, b + 1, c) / c)
        wealth.append(w)
        if sequential and (w >= 1 / alpha or w < alpha):
            reason = "rejected" if w >= 1 / alpha else "futility"
            break
    b = len(statistics) - 1
    if not b:
        raise ValueError("At least one null score is required")
    pvalue = 1 / max(wealth) if sequential else (losses + 1) / (b + 1)
    rejected = pvalue <= alpha
    return TestResult(pvalue, b, rejected, reason if sequential else "fixed_budget", wealth, statistics)

# Do not let pytest treat this public function as a test case.
test_scores.__test__ = False


def _scores(tokens, vocab_size, n, k, seed, test_stat, n_runs, max_seed):
    if n_runs < 1 or max_seed < 1:
        raise ValueError("Budget and seed range must be positive")
    if tokens.ndim != 1 or len(tokens) < k or not 1 <= k or n < 1:
        raise ValueError("Require nonempty 1D tokens, 1 <= k <= len(tokens), n >= 1")
    if vocab_size < 1 or bool(((tokens < 0) | (tokens >= vocab_size)).any()):
        raise ValueError("Token outside vocabulary")
    generator = torch.Generator().manual_seed(int(seed))
    observed = test_stat(tokens=tokens, n=n, k=k, generator=generator, vocab_size=vocab_size)
    # Independent local RNG: testing does not change generation or attack RNG state.
    rng = torch.Generator().manual_seed((int(seed) + 1) % (2**32))
    def stream():
        for _ in range(n_runs):
            generator.manual_seed(int(torch.randint(max_seed, (1,), generator=rng).item()))
            # Keep text and statistic identical; only the watermark key varies.
            yield test_stat(tokens=tokens, n=n, k=k, generator=generator,
                            vocab_size=vocab_size, null=False)
    return observed, stream()


def seq_mc_permutation_test(tokens,vocab_size,n,k,seed,test_stat,n_runs=100,max_seed=2**32,alpha=0.05,c=0.04):
    observed, scores = _scores(tokens,vocab_size,n,k,seed,test_stat,n_runs,max_seed)
    result = test_scores(observed,scores,alpha,c)
    # Legacy tuple preserves the sign convention of historical caller traces.
    return result.pvalue, result.wealth, [-x for x in result.statistics], result.resamples


def permutation_test(tokens,vocab_size,n,k,seed,test_stat,n_runs=100,max_seed=2**32):
    observed, scores = _scores(tokens,vocab_size,n,k,seed,test_stat,n_runs,max_seed)
    return test_scores(observed,scores,sequential=False).pvalue


def fast_permutation_test(tokens,vocab_size,n,k,seed,test_stat,null_results):
    if len(null_results) == 0:
        raise ValueError("Null reference must not be empty")
    if not bool(torch.isfinite(null_results).all()) or not bool((null_results[1:] >= null_results[:-1]).all()):
        raise ValueError("Null reference must be finite and sorted")
    generator = torch.Generator().manual_seed(int(seed))
    score = test_stat(tokens=tokens,n=n,k=k,generator=generator,vocab_size=vocab_size)
    return (torch.searchsorted(null_results,score,right=True).item() + 1) / (len(null_results) + 1)

def phi(tokens,n,k,generator,key_func,vocab_size,dist,null=False,normalize=False):
    if null:
        tokens = torch.unique(tokens, return_inverse=True,sorted=False)[1]
        eff_vocab_size = torch.max(tokens) + 1
    else:
        eff_vocab_size = vocab_size

    xi,pi = key_func(generator,n,vocab_size,eff_vocab_size)
    tokens = torch.argsort(pi)[tokens]
    if normalize:
        tokens = tokens.float() / vocab_size
    
    A = adjacency(tokens,xi,dist,k)
    closest = torch.min(A,axis=1)[0]

    return torch.min(closest)

def adjacency(tokens,xi,dist,k):
    m = len(tokens)
    n = len(xi)
    if not 1 <= k <= m or n < 1:
        raise ValueError("Require 1 <= k <= token count and a nonempty key")

    A = torch.empty(size=(m-(k-1),n))
    for i in range(m-(k-1)):
        for j in range(n):
            A[i][j] = dist(tokens[i:i+k],xi[(j+torch.arange(k))%n])

    return A
