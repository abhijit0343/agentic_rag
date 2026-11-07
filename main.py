"""
main.py
-------
Entry point for the Agentic RAG system.

Usage:
  # Index documents and ask a question
  python main.py --ingest ./docs --query "What is the refund policy?"

  # Ask a question (uses existing ChromaDB index)
  python main.py --query "Summarize the uploaded documents"

  # Interactive chat mode
  python main.py --chat
"""

import sys
import argparse
from pathlib import Path

# Add model/ to path so we can import our modules
sys.path.insert(0, str(Path(__file__).parent / "model"))

from document_loader import load_directory, load_files
from chroma_db import init_chroma, load_chroma, add_documents, get_collection_stats
from agentic_rag import AgenticRAG, get_llm


# ── CLI argument parser ──────────────────────────────────────────────────────
def parse_args():
    parser = argparse.ArgumentParser(
        description="🤖 Agentic RAG — Llama 3.2 + ChromaDB"
    )
    parser.add_argument(
        "--ingest", metavar="PATH",
        help="Path to a file or directory to ingest into ChromaDB"
    )
    parser.add_argument(
        "--query", metavar="QUESTION",
        help="Single question to ask the RAG agent"
    )
    parser.add_argument(
        "--chat", action="store_true",
        help="Start interactive multi-turn chat mode"
    )
    parser.add_argument(
        "--stats", action="store_true",
        help="Show ChromaDB collection stats"
    )
    return parser.parse_args()


# ── Ingest documents ─────────────────────────────────────────────────────────
def ingest(path: str):
    p = Path(path)
    if p.is_dir():
        docs = load_directory(str(p))
    elif p.is_file():
        docs = load_files([str(p)])
    else:
        print(f"❌ Path not found: {path}")
        sys.exit(1)

    if not docs:
        print("⚠️  No documents loaded. Check your files.")
        sys.exit(1)

    db = add_documents(docs)
    stats = get_collection_stats(db)
    print(f"\n✅ Ingestion complete! {stats['total_documents']} chunks stored in ChromaDB.")
    return db


# ── Single query ─────────────────────────────────────────────────────────────
def run_query(query: str, db=None):
    if db is None:
        db = load_chroma()
    rag = AgenticRAG(db)
    print(f"\n🔍 Query: {query}")
    print("─" * 60)
    answer = rag.invoke(query)
    print(f"\n💬 Answer:\n{answer}")
    return answer


# ── Interactive chat ─────────────────────────────────────────────────────────
def run_chat(db=None):
    if db is None:
        db = load_chroma()

    rag = AgenticRAG(db)
    chat_history = []

    print("\n" + "=" * 60)
    print("  🤖 Agentic RAG Chat  |  Llama 3.2  |  Type 'exit' to quit")
    print("=" * 60)
    print("💡 Tip: Ask questions about your indexed documents.\n")

    while True:
        try:
            user_input = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\n👋 Goodbye!")
            break

        if not user_input:
            continue
        if user_input.lower() in ("exit", "quit", "q"):
            print("👋 Goodbye!")
            break

        answer = rag.invoke(user_input, chat_history=chat_history)
        print(f"\n🤖 Agent: {answer}\n")

        # Maintain chat history (last 10 turns)
        from langchain_core.messages import HumanMessage, AIMessage
        chat_history.append(HumanMessage(content=user_input))
        chat_history.append(AIMessage(content=answer))
        if len(chat_history) > 20:
            chat_history = chat_history[-20:]


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    args = parse_args()
    db = None

    # Ingest first if requested
    if args.ingest:
        db = ingest(args.ingest)

    # Show stats
    if args.stats:
        try:
            db = db or load_chroma()
            stats = get_collection_stats(db)
            print(f"\n📊 ChromaDB Stats:")
            for k, v in stats.items():
                print(f"   {k}: {v}")
        except Exception as e:
            print(f"⚠️  Could not load ChromaDB: {e}")

    # Single query
    if args.query:
        run_query(args.query, db)

    # Interactive chat
    elif args.chat:
        run_chat(db)

    # No mode selected
    elif not args.ingest and not args.stats:
        print("ℹ️  No mode selected. Use --help to see options.")
        print("\nQuick start:")
        print("  python main.py --ingest ./docs --chat")
        print("  python main.py --query 'What is LangChain?'")
        print("  python main.py --chat")
        print("  python main.py --stats")


if __name__ == "__main__":
    main()

