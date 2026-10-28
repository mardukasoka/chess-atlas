"""LightRAG local-only ingestion and chunk retrieval integration probe.

Uses deterministic hashed vectors and a stub extractor. This tests integration
and persistence, NOT semantic embeddings, graph extraction, or answer quality.
"""
import asyncio
import hashlib
import json
import re
import tempfile
import time
from pathlib import Path

DIM = 128
ROOT = Path(__file__).parent
fixture = json.loads((ROOT / "fixtures/isotopes-v1.json").read_text())

def embed_one(text):
    import numpy as np
    vector = np.zeros(DIM, dtype=np.float32)
    for token in re.findall(r"[a-z]+|[0-9]+", text.lower()):
        digest = hashlib.sha256(token.encode()).digest()
        index = int.from_bytes(digest[:4], "big") % DIM
        vector[index] += 1 if digest[4] % 2 else -1
    norm = np.linalg.norm(vector)
    return vector / norm if norm else vector

async def main():
    import numpy as np
    from lightrag import LightRAG, QueryParam
    from lightrag.utils import EmbeddingFunc

    calls = {"llm": 0, "embedding": 0}
    async def local_embed(texts):
        calls["embedding"] += len(texts)
        return np.stack([embed_one(t) for t in texts])

    async def extraction_stub(prompt, **kwargs):
        calls["llm"] += 1
        # Deliberately no entities/relationships; prevents fabricated graph evidence.
        return "No entities or relationships extracted."

    with tempfile.TemporaryDirectory(prefix="indigo-lightrag-") as directory:
        start = time.monotonic()
        rag = LightRAG(
            working_dir=directory,
            llm_model_func=extraction_stub,
            embedding_func=EmbeddingFunc(
                embedding_dim=DIM, max_token_size=512, func=local_embed
            ),
        )
        await rag.initialize_storages()
        ingestion = []
        try:
            for doc in fixture["documents"]:
                # Source ID retained in text, not asserted as engine provenance.
                await rag.ainsert("SOURCE_ID: " + doc["id"] + "\n" + doc["text"])
                ingestion.append(doc["id"])
            results = []
            for q in fixture["questions"]:
                context = await rag.aquery(
                    q["question"], param=QueryParam(mode="naive", only_need_context=True)
                )
                results.append({
                    "id": q["id"],
                    "context_nonempty": bool(str(context).strip()),
                    "expected_source_mentioned": (
                        q["source_id"] in str(context) if q["source_id"] else None
                    ),
                    "context_excerpt": str(context)[:500],
                    "answer_correctness": "not_tested",
                    "graph_retrieval": "not_tested",
                    "abstention": "not_tested",
                })
        finally:
            await rag.finalize_storages()
        report = {
            "engine": "lightrag",
            "test_type": "deterministic_local_integration_probe",
            "semantic_retrieval_evaluated": False,
            "graph_retrieval_evaluated": False,
            "generated_answers_evaluated": False,
            "embedding": "deterministic_hash_128_not_semantic",
            "llm": "stub_no_external_inference",
            "ingested_ids": ingestion,
            "calls": calls,
            "elapsed_seconds": round(time.monotonic()-start, 3),
            "results": results,
        }
    Path("reports").mkdir(exist_ok=True)
    Path("reports/lightrag-local-probe.json").write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
    if len(ingestion) != len(fixture["documents"]):
        raise RuntimeError("Incomplete ingestion")

if __name__ == "__main__":
    asyncio.run(main())
