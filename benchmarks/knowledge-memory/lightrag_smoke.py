"""LightRAG zero-inference initialization smoke test.

This validates installation and storage lifecycle only. It does NOT test
knowledge ingestion, retrieval quality, or factual accuracy.
"""
import asyncio
import json
from pathlib import Path

async def main():
    from lightrag import LightRAG
    from lightrag.utils import EmbeddingFunc
    import numpy as np

    async def no_inference_llm(prompt, **kwargs):
        raise RuntimeError("LLM calls forbidden in zero-inference smoke test")

    async def no_inference_embed(texts):
        raise RuntimeError("Embedding calls forbidden in zero-inference smoke test")

    folder = Path("reports/lightrag-storage")
    folder.mkdir(parents=True, exist_ok=True)
    rag = LightRAG(
        working_dir=str(folder),
        llm_model_func=no_inference_llm,
        embedding_func=EmbeddingFunc(
            embedding_dim=8, max_token_size=512, func=no_inference_embed
        ),
    )
    await rag.initialize_storages()
    await rag.finalize_storages()
    report = {"engine": "lightrag", "test_type": "zero_inference_storage_smoke",
              "installation": "passed", "storage_lifecycle": "passed",
              "retrieval_evaluated": False, "llm_calls": 0}
    Path("reports/lightrag-smoke.json").write_text(json.dumps(report, indent=2))
    print(json.dumps(report))

if __name__ == "__main__":
    asyncio.run(main())
