"""
api.py
------
FastAPI backend for the Agentic RAG system.

Endpoints:
  GET  /              — Root status & available routes
  GET  /health        — Check Ollama + ChromaDB status
  POST /upload        — Upload & index documents (PDF, DOCX, XLSX, CSV, PPTX, TXT, ZIP)
  POST /chat          — Ask a question (streaming or single-pass with source citations)
  GET  /stats         — ChromaDB collection stats
  DELETE /reset       — Clear the ChromaDB collection
  GET  /collections   — List all collections
"""

import os
import sys
import uuid
import shutil
from pathlib import Path
from typing import AsyncGenerator

# Ensure backend and model directories are reliably in sys.path
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR.parent / "model"
sys.path.insert(0, str(MODEL_DIR))
sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# ── Load env ────────────────────────────────────────────────────────────────
load_dotenv(BASE_DIR.parent / ".env")

# ── Import RAG modules ───────────────────────────────────────────────────────
from chroma_db import (
    init_chroma,
    load_chroma,
    add_documents,
    get_collection_stats,
    delete_collection,
    list_collections,
)
from document_loader import load_file
from agentic_rag import AgenticRAG, get_llm

# ── Config ───────────────────────────────────────────────────────────────────
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

SUPPORTED_EXTENSIONS = {
    ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".csv",
    ".pptx", ".txt", ".md", ".json", ".zip"
}
MAX_FILE_SIZE = 64 * 1024 * 1024   # 64 MB
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
LLM_MODEL = os.getenv("LLM_MODEL", "llama3.2")

# ── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Agentic RAG API",
    description="Autonomous document intelligence powered by Llama 3.2 and ChromaDB",
    version="1.1.0",
)

# ── CORS Middleware ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global vector store (lazy-loaded on first use) ───────────────────────────
_vector_store = None

def get_vector_store():
    global _vector_store
    if _vector_store is None:
        try:
            _vector_store = load_chroma()
        except Exception:
            _vector_store = init_chroma()
    return _vector_store


# ── Request / Response models ────────────────────────────────────────────────
class ChatRequest(BaseModel):
    question: str
    stream: bool = False
    chat_history: list[dict] = []

class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = []

class UploadResponse(BaseModel):
    message: str
    filename: str
    chunks_indexed: int

class StatsResponse(BaseModel):
    collection: str
    total_documents: int
    persist_directory: str


# ── Helpers ───────────────────────────────────────────────────────────────────
def _build_chat_history(raw: list[dict]):
    """Convert [{role, content}] dicts to LangChain message objects."""
    from langchain_core.messages import HumanMessage, AIMessage
    history = []
    for msg in raw:
        role = msg.get("role", "")
        content = msg.get("content", "")
        if role == "user":
            history.append(HumanMessage(content=content))
        elif role in ("assistant", "agent"):
            history.append(AIMessage(content=content))
    return history


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/", tags=["System"])
async def root():
    """Root info check."""
    return {
        "status": "online",
        "app": "Agentic RAG API",
        "docs": "/docs",
        "model": LLM_MODEL,
        "ollama_base_url": OLLAMA_BASE_URL
    }


@app.get("/health", tags=["System"])
async def health_check():
    """Verify Ollama and ChromaDB availability."""
    status = {"api": "ok", "ollama": "offline", "chromadb": "ready"}

    # Check Ollama
    try:
        import httpx
        r = httpx.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=2.5)
        if r.status_code == 200:
            models = [m["name"] for m in r.json().get("models", [])]
            status["ollama"] = "ok"
            status["installed_models"] = models
        else:
            status["ollama"] = f"status_code_{r.status_code}"
    except Exception as e:
        status["ollama"] = f"unreachable: {str(e)}"

    # Check ChromaDB
    try:
        db = get_vector_store()
        stats = get_collection_stats(db)
        status["chromadb"] = "ok"
        status["indexed_chunks"] = stats.get("total_documents", 0)
    except Exception as e:
        status["chromadb"] = f"error: {str(e)}"

    return status


@app.post("/upload", response_model=UploadResponse, tags=["Documents"])
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    """
    Upload and index a document into ChromaDB.
    Supports: PDF, DOCX, XLSX, CSV, PPTX, TXT, MD, ZIP.
    """
    ext = Path(file.filename or "").suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported format '{ext}'. Allowed: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
        )

    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum allowed size ({MAX_FILE_SIZE // (1024*1024)} MB)"
        )

    safe_name = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    save_path = UPLOAD_DIR / safe_name

    with open(save_path, "wb") as f:
        f.write(contents)

    try:
        docs = load_file(str(save_path))
        if not docs:
            raise ValueError("No readable text content extracted from document.")

        db = add_documents(docs)
        global _vector_store
        _vector_store = db

        # Clean up temporary uploaded file from disk in background
        background_tasks.add_task(lambda: save_path.unlink(missing_ok=True))

        stats = get_collection_stats(db)
        return UploadResponse(
            message=f"Document '{file.filename}' parsed and indexed successfully.",
            filename=file.filename or safe_name,
            chunks_indexed=stats.get("total_documents", 0),
        )
    except Exception as e:
        save_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.post("/chat", tags=["Chat"])
async def chat(req: ChatRequest):
    """
    Dispatch query to Agentic RAG pipeline.
    The agent searches ChromaDB with MMR, assembles context, and reasons with Llama 3.2.
    """
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    db = get_vector_store()
    chat_history = _build_chat_history(req.chat_history)

    # ── Streaming mode ────────────────────────────────────────────────────────
    if req.stream:
        async def event_stream() -> AsyncGenerator[str, None]:
            try:
                rag = AgenticRAG(db)
                for chunk in rag.executor.stream({
                    "input": req.question,
                    "chat_history": chat_history,
                }):
                    if "actions" in chunk:
                        for act in chunk["actions"]:
                            tool_name = getattr(act, "tool", "retriever")
                            tool_input = getattr(act, "tool_input", "")
                            yield f"event: step\ndata: {tool_name}: {tool_input}\n\n"
                    elif "steps" in chunk:
                        yield f"event: step\ndata: Context assembled from vector database.\n\n"
                    elif "output" in chunk:
                        text = str(chunk["output"])
                        yield f"event: message\ndata: {text}\n\n"
                yield "event: done\ndata: [COMPLETE]\n\n"
            except Exception as e:
                yield f"event: error\ndata: {str(e)}\n\n"

        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            },
        )

    # ── Single-pass execution ─────────────────────────────────────────────────
    try:
        rag = AgenticRAG(db)
        result = rag.invoke_with_sources(req.question, chat_history=chat_history)
        return ChatResponse(
            answer=result["output"],
            sources=result["sources"]
        )
    except Exception as e:
        err_msg = str(e)
        if "404" in err_msg and "not found" in err_msg:
            detail = f"Model '{LLM_MODEL}' is missing in Ollama. Run: 'ollama pull {LLM_MODEL}'"
        elif "Connection refused" in err_msg or "Failed to connect" in err_msg:
            detail = f"Cannot reach Ollama at {OLLAMA_BASE_URL}. Ensure 'ollama serve' is active."
        else:
            detail = f"Agent execution error: {err_msg}"
        raise HTTPException(status_code=500, detail=detail)


@app.get("/stats", response_model=StatsResponse, tags=["Documents"])
async def get_stats():
    """Return ChromaDB vector store statistics."""
    try:
        db = get_vector_store()
        stats = get_collection_stats(db)
        return StatsResponse(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/reset", tags=["Documents"])
async def reset_collection():
    """
    Clear all indexed embeddings and reset ChromaDB collection.
    """
    global _vector_store
    try:
        delete_collection()
        _vector_store = init_chroma()
        return {"message": "ChromaDB collection cleared successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/collections", tags=["Documents"])
async def get_collections():
    """List ChromaDB collection names."""
    try:
        return {"collections": list_collections()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Direct invocation ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("  Agentic RAG — FastAPI Backend")
    print(f"  Model       : {LLM_MODEL}")
    print(f"  Ollama URL  : {OLLAMA_BASE_URL}")
    print(f"  API Docs    : http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run(
        "api:app",
        host="127.0.0.1",
        port=8000,
        app_dir=str(BASE_DIR),
        reload=False
    )
