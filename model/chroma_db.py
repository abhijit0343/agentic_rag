"""
chroma_db.py
------------
ChromaDB setup, management, and utility functions for the Agentic RAG pipeline.

Responsibilities:
  - Initialize and persist ChromaDB collections
  - Add / update / delete documents
  - Query the vector store
  - Inspect stored collections
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Suppress ChromaDB telemetry warnings (must be set before chromadb import)
os.environ["ANONYMIZED_TELEMETRY"] = "false"
os.environ["CHROMA_TELEMETRY"] = "false"
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# ── Load environment ────────────────────────────────────────────────────────
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL     = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")
CHROMA_DIR      = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
COLLECTION_NAME = os.getenv("CHROMA_COLLECTION", "agentic_rag_collection")


# ── Embeddings ──────────────────────────────────────────────────────────────
def get_embeddings() -> OllamaEmbeddings:
    """Return Ollama embedding model."""
    return OllamaEmbeddings(
        model=EMBED_MODEL,
        base_url=OLLAMA_BASE_URL,
    )


# ── Initialize / Load ChromaDB ──────────────────────────────────────────────
def init_chroma(collection_name: str = COLLECTION_NAME) -> Chroma:
    """
    Initialize an empty ChromaDB collection (or load if already exists).
    Creates the chroma_db/ folder and SQLite file automatically.

    Returns
    -------
    Chroma : ready-to-use vector store (empty until documents are added)
    """
    db = Chroma(
        collection_name=collection_name,
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_DIR,
    )
    print(f"[ChromaDB] Initialized collection '{collection_name}' at: {CHROMA_DIR}")
    return db


def load_chroma(collection_name: str = COLLECTION_NAME) -> Chroma:
    """Load an existing persisted ChromaDB collection from disk."""
    db = Chroma(
        collection_name=collection_name,
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_DIR,
    )
    count = db._collection.count()
    print(f"[ChromaDB] Loaded '{collection_name}' — {count} documents indexed.")
    return db


# ── Add Documents ───────────────────────────────────────────────────────────
def add_documents(
    documents: list[Document],
    collection_name: str = COLLECTION_NAME,
    chunk_size: int = 512,
    chunk_overlap: int = 64,
) -> Chroma:
    """
    Chunk, embed, and store documents in ChromaDB.

    Parameters
    ----------
    documents     : list of LangChain Document objects
    collection_name : ChromaDB collection to store into
    chunk_size    : characters per chunk
    chunk_overlap : overlap between chunks

    Returns
    -------
    Chroma : the populated vector store
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
    )
    chunks = splitter.split_documents(documents)
    print(f"[ChromaDB] Split {len(documents)} docs → {len(chunks)} chunks")

    db = Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        collection_name=collection_name,
        persist_directory=CHROMA_DIR,
    )
    db.persist()
    print(f"[ChromaDB] ✓ Stored {len(chunks)} chunks in '{collection_name}'")
    return db


# ── Query ───────────────────────────────────────────────────────────────────
def similarity_search(
    query: str,
    db: Chroma,
    k: int = 5,
) -> list[Document]:
    """
    Retrieve top-k most relevant documents for a query.

    Parameters
    ----------
    query : natural language question
    db    : loaded Chroma vector store
    k     : number of results to return

    Returns
    -------
    list[Document] : top-k relevant chunks
    """
    results = db.similarity_search(query, k=k)
    print(f"[ChromaDB] Query: '{query[:60]}...' → {len(results)} results")
    return results


def mmr_search(
    query: str,
    db: Chroma,
    k: int = 5,
    fetch_k: int = 20,
    lambda_mult: float = 0.5,
) -> list[Document]:
    """
    MMR (Maximum Marginal Relevance) search — balances relevance & diversity.

    Parameters
    ----------
    query       : natural language question
    db          : loaded Chroma vector store
    k           : number of results to return
    fetch_k     : candidate pool size before re-ranking
    lambda_mult : 1.0 = pure relevance, 0.0 = pure diversity
    """
    results = db.max_marginal_relevance_search(
        query, k=k, fetch_k=fetch_k, lambda_mult=lambda_mult
    )
    print(f"[ChromaDB] MMR Query: '{query[:60]}' → {len(results)} diverse results")
    return results


# ── Inspect / Manage ────────────────────────────────────────────────────────
def get_collection_stats(db: Chroma) -> dict:
    """Return basic stats about the ChromaDB collection."""
    count = db._collection.count()
    return {
        "collection": db._collection.name,
        "persist_directory": CHROMA_DIR,
        "total_documents": count,
    }


def delete_collection(collection_name: str = COLLECTION_NAME) -> None:
    """
    ⚠️  Permanently delete a ChromaDB collection.
    Use with caution — all embedded documents will be lost.
    """
    import chromadb
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    client.delete_collection(collection_name)
    print(f"[ChromaDB] ⚠️  Deleted collection '{collection_name}'")


def list_collections() -> list[str]:
    """List all collections stored in the ChromaDB persist directory."""
    import chromadb
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    collections = client.list_collections()
    names = [c.name for c in collections]
    print(f"[ChromaDB] Collections: {names}")
    return names


# ── Smoke test ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  ChromaDB Initialization Test")
    print("=" * 55)

    # 1. Init empty collection
    db = init_chroma()

    # 2. Add sample documents
    sample_docs = [
        Document(
            page_content="ChromaDB is an open-source vector database for AI applications.",
            metadata={"source": "intro.txt", "topic": "chromadb"},
        ),
        Document(
            page_content="Llama 3.2 is Meta's open-source LLM that can run locally via Ollama.",
            metadata={"source": "llama.txt", "topic": "llm"},
        ),
        Document(
            page_content="RAG stands for Retrieval-Augmented Generation — it grounds LLMs with real data.",
            metadata={"source": "rag.txt", "topic": "rag"},
        ),
    ]
    db = add_documents(sample_docs)

    # 3. Show stats
    stats = get_collection_stats(db)
    print(f"\n[Stats] {stats}")

    # 4. Run a similarity search
    print("\n[Search Test] Querying: 'What is RAG?' ...")
    results = similarity_search("What is RAG?", db, k=2)
    for i, doc in enumerate(results, 1):
        print(f"  Result {i} [{doc.metadata.get('source')}]: {doc.page_content}")

    # 5. List all collections
    list_collections()

    print("\n[Done] ✓ ChromaDB is working correctly.")
    print(f"        Data saved to: {Path(CHROMA_DIR).resolve()}")

