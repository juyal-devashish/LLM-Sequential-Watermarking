import unittest

from experiments.result_adapter import result_for_experiment


class ResultAdapterTests(unittest.TestCase):
    def test_fixed_budget_is_recorded(self):
        self.assertEqual(result_for_experiment("permutation", 0.2, 500), (0.2, 500))

    def test_shared_fast_reference_is_not_counted_per_text(self):
        self.assertEqual(result_for_experiment("fast", 0.3, 500), (0.3, 0))

    def test_sequential_uses_actual_stop(self):
        self.assertEqual(result_for_experiment("sequential_mc", (0.04, [1, 25], [2, 3], 42), 500), (0.04, 42))

    def test_unknown_method_is_rejected(self):
        with self.assertRaises(ValueError):
            result_for_experiment("other", 0.3, 500)


if __name__ == "__main__":
    unittest.main()
