"""Pure-Python fixture evaluation, independent of any RAG implementation."""
import unittest

FACTS = {
    "H-1": {"protons": 1, "neutrons": 0},
    "H-2": {"protons": 1, "neutrons": 1},
    "H-3": {"protons": 1, "neutrons": 2},
    "He-4": {"protons": 2, "neutrons": 2},
}

def evaluate(answer, expected, source_ids, allowed_source_ids):
    """Exact-answer diagnostic with explicit provenance requirement."""
    normalized = " ".join(str(answer).strip().lower().split())
    expected_normalized = " ".join(str(expected).strip().lower().split())
    return {
        "exact_match": normalized == expected_normalized,
        "source_valid": bool(source_ids) and set(source_ids).issubset(set(allowed_source_ids)),
    }

class EvaluationTests(unittest.TestCase):
    def test_reference_isotopes(self):
        for name, record in FACTS.items():
            self.assertEqual(record["protons"] + record["neutrons"], int(name.split("-")[1]))

    def test_correct_with_provenance(self):
        self.assertEqual(evaluate("2", "2", ["H-3"], FACTS),
                         {"exact_match": True, "source_valid": True})

    def test_unsupported_claim_is_not_verified(self):
        self.assertFalse(evaluate("2", "2", [], FACTS)["source_valid"])

    def test_wrong_answer_fails(self):
        self.assertFalse(evaluate("3", "2", ["H-3"], FACTS)["exact_match"])

if __name__ == "__main__":
    unittest.main()
