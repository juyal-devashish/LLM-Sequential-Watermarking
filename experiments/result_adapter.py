"""Normalize legacy detector outputs for experiment reporting."""


def result_for_experiment(method, result, budget):
    """Return p-value and per-text resamples; fast calibration is shared setup."""
    if method == "sequential_mc":
        pvalue, _wealth, _statistics, resamples = result
        return pvalue, resamples
    if method == "permutation":
        return result, budget
    if method == "fast":
        return result, 0
    raise ValueError(f"Unknown test method: {method}")
