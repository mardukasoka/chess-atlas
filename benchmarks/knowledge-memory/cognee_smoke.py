"""Bounded Cognee CPU smoke test; no external paid inference."""
import asyncio
import json
import os
from pathlib import Path

os.environ.pop("LLM_API_KEY", None)
os.environ.pop("OPENAI_API_KEY", None)
os.environ.pop("EMBEDDING_API_KEY", None)

FIXTURE_PATH = Path(__file__).parent / "fixtures" / "isotopes-v1.json"
FIXTURE = json.loads(FIXTURE_PATH.read_text())
FACTS = [d["text"] for d in FIXTURE["documents"]]
QUERIES = [q for q in FIXTURE["questions"] if q["expected"] is not None]

async def main():
    import cognee
    # These are fixture statements for a plumbing smoke test, not a scored
    # scientific benchmark. Real benchmark data will be sourced and pinned.
    await cognee.remember(" ".join(FACTS), dataset_name="indigo_nuclides_smoke")
    results = []
    for q in QUERIES:
        found = await cognee.recall(q["question"], datasets=["indigo_nuclides_smoke"])
        text = str(found)
        results.append({
            "question_id": q["id"],
            "question": q["question"],
            "expected_source_id": q["source_id"],
            "expected": q["expected"],
            "retrieved_nonempty": bool(found),
            "expected_in_retrieval": q["expected"].lower() in text.lower(),
            "retrieval_excerpt": text[:500],
        })
    out = {"engine": "cognee", "test_type": "local_model_retrieval_probe",
           "queries": results, "count": len(results),
           "nonempty_count": sum(r["retrieved_nonempty"] for r in results),
           "expected_present_count": sum(r["expected_in_retrieval"] for r in results),
           "note": "Expected-string presence in retrieved passages is a diagnostic, not answer accuracy."}
    Path("reports").mkdir(exist_ok=True)
    Path("reports/cognee-smoke.json").write_text(json.dumps(out, indent=2))
    print(json.dumps({"engine": out["engine"], "count": out["count"],
                      "nonempty": out["nonempty_count"],
                      "expected_present": out["expected_present_count"]}))
    if out["nonempty_count"] == 0:
        raise AssertionError("Cognee returned no passages for any fixture question")

if __name__ == "__main__":
    asyncio.run(main())
