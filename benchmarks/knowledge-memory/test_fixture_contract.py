"""Validate shared benchmark fixtures and abstention requirements, without AI calls."""
import json
import unittest
from pathlib import Path

PATH = Path(__file__).parent / "fixtures" / "isotopes-v1.json"

class FixtureContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(PATH.read_text())

    def test_document_ids_unique(self):
        ids = [d["id"] for d in self.data["documents"]]
        self.assertEqual(len(ids), len(set(ids)))

    def test_questions_refer_to_existing_sources(self):
        ids = {d["id"] for d in self.data["documents"]}
        for q in self.data["questions"]:
            self.assertEqual(q["expected"] is None, q["source_id"] is None)
            if q["source_id"]:
                self.assertIn(q["source_id"], ids)

    def test_abstention_case_present(self):
        self.assertTrue(any(q["expected"] is None for q in self.data["questions"]))

    def test_fixture_is_not_claimed_to_be_verified_science(self):
        self.assertIn("Synthetic", self.data["description"])

if __name__ == "__main__":
    unittest.main()
