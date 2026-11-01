import math
import unittest
import torch
from watermarking.detection import test_scores, seq_mc_permutation_test, permutation_test, adjacency

class DetectionTests(unittest.TestCase):
    def test_mixture_tail_against_direct_binomial_sum(self):
        r = test_scores(0, [1]*4, sequential=False)
        for b,w in enumerate(r.wealth[1:],1):
            exact=sum(math.comb(b+1,j)*.04**j*.96**(b+1-j) for j in range(1,b+2))/.04
            self.assertAlmostEqual(w,exact,12)
    def test_paper_zero_loss_stopping_round(self):
        r=test_scores(0,[1]*100)
        self.assertEqual(r.resamples,39)
        self.assertEqual(r.stop_reason,'rejected')
    def test_finite_sample_plus_one(self):
        self.assertEqual(test_scores(0,[1]*9,sequential=False).pvalue,.1)
    def test_all_ties_conservative(self):
        self.assertEqual(test_scores(1,[1]*9,sequential=False).pvalue,1)
        self.assertFalse(test_scores(1,[1]*100).rejected)
    def test_invalid_inputs(self):
        for kwargs in [dict(c=.06),dict(alpha=0),dict(c=0)]:
            with self.assertRaises(ValueError):test_scores(0,[1],**kwargs)
        for scores in [[],[float('nan')]]:
            with self.assertRaises(ValueError):test_scores(0,scores)
    def test_real_key_sampling_does_not_mutate_tokens_or_global_rng(self):
        tokens=torch.tensor([0,1,2]);before=tokens.clone();rng=torch.random.get_rng_state().clone()
        def statistic(**kw):return torch.rand((),generator=kw['generator'])
        args=(tokens,3,2,3,17,statistic)
        first=seq_mc_permutation_test(*args)
        self.assertEqual(first,seq_mc_permutation_test(*args))
        self.assertTrue(torch.equal(tokens,before));self.assertTrue(torch.equal(rng,torch.random.get_rng_state()))
        p=permutation_test(*args,n_runs=9);self.assertGreaterEqual(p,.1)
    def test_window_guard(self):
        with self.assertRaises(ValueError):adjacency(torch.tensor([1]),torch.ones(2),lambda x,y:0,2)
    def test_alignment_extensions_compile(self):
        from watermarking.transform.score import transform_edit_score
        from watermarking.gumbel.score import gumbel_edit_score
        self.assertTrue(math.isfinite(transform_edit_score(torch.tensor([.2,.5]),torch.tensor([[.2],[.5]]))))
        self.assertTrue(math.isfinite(gumbel_edit_score(torch.tensor([0,1]),torch.full((2,2),.5),0)))
