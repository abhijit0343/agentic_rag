"""
model package — Agentic RAG components

Modules:
  agentic_rag     : Main LLM agent pipeline (Llama 3.2)
  chroma_db       : ChromaDB vector store management
  document_loader : File loaders (PDF, TXT, DOCX)
"""

from .agentic_rag import AgenticRAG, get_llm, build_rag_chain
from .chroma_db import init_chroma, load_chroma, add_documents
from .document_loader import load_file, load_directory, load_files

__all__ = [
    "AgenticRAG",
    "get_llm",
    "build_rag_chain",
    "init_chroma",
    "load_chroma",
    "add_documents",
    "load_file",
    "load_directory",
    "load_files",
]

