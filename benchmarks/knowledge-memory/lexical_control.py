"""Deterministic lexical retrieval control, NOT a LightRAG accuracy test."""
import json
import re
import time
from pathlib import Path

ROOT = Path(__file__).parent
fixture = json.loads((ROOT / "fixtures/isotopes-v1.json").read_text())
def tokens(text):
    return set(re.findall(r"[a-z]+|[0-9]+", text.lower())) - {
        "what", "which", "how", "many", "does", "has", "have", "the",
        "of", "is", "a", "an", "and", "in", "with"
    }
def retrieve(question):
    q = tokens(question)
    ranked = sorted(
        ((len(q & tokens(d["text"])), d["id"], d["text"]) for d in fixture["documents"]),
        key=lambda x: (-x[0], x[1])
    )
    return ranked[0]
started = time.monotonic()
results = []
for item in fixture["questions"]:
    overlap, source, passage = retrieve(item["question"])
    # Source relevance only: do not treat overlap as evidence of an answer.
    correct_source = source == item["source_id"] if item["source_id"] else None
    results.append({
        "question_id": item["id"],
        "retrieved_source_id": source,
        "retrieved_text": passage,
        "lexical_overlap": overlap,
        "expected_source_matched": correct_source,
        "answer_correctness": "not_tested",
        "abstention": "not_tested"
    })
report = {
    "engine": "lexical-control",
    "test_type": "source_retrieval_only",
    "not_lightrag": True,
    "not_semantic_retrieval": True,
    "question_count": len(results),
    "answerable_source_hits": sum(r["expected_source_matched"] is True for r in results),
    "answerable_source_total": sum(q["source_id"] is not None for q in fixture["questions"]),
    "elapsed_seconds": round(time.monotonic() - started, 5),
    "results": results
}
Path("reports").mkdir(exist_ok=True)
Path("reports/lexical-control.json").write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
