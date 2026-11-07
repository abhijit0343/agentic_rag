"""
agentic_rag.py
--------------
Agentic RAG pipeline powered by Llama 3.2 (via Ollama).

Flow:
  User Query
      │
      ▼
  Router Agent  ──► Vector Store (ChromaDB)  ◄── chroma_db.py
      │                    │
      │               Retrieved Docs
      │                    │
      ▼                    ▼
  LLM (Llama 3.2) ◄── Context Assembly
      │
      ▼
  Final Answer
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ── LangChain imports ───────────────────────────────────────────────────────
from langchain_ollama import ChatOllama
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.tools.retriever import create_retriever_tool

# ── ChromaDB module (handles all vector store operations) ───────────────────
from chroma_db import (
    init_chroma,
    load_chroma,
    add_documents,
    get_embeddings,
)

# ── Load environment variables ──────────────────────────────────────────────
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
LLM_MODEL       = os.getenv("LLM_MODEL", "llama3.2")

# ── 1. LLM ─────────────────────────────────────────────────────────────────
def get_llm(temperature: float = 0.0) -> ChatOllama:
    """Return a ChatOllama instance backed by Llama 3.2."""
    return ChatOllama(
        model=LLM_MODEL,
        base_url=OLLAMA_BASE_URL,
        temperature=temperature,
    )


# ── 2. Vector Store helpers (thin wrappers around chroma_db.py) ─────────────
def build_vector_store(documents: list[Document]) -> Chroma:
    """Chunk, embed, and persist documents via chroma_db.py."""
    return add_documents(documents)


def load_vector_store() -> Chroma:
    """Load an already-persisted ChromaDB collection via chroma_db.py."""
    return load_chroma()


# ── 4. Retriever Tool ───────────────────────────────────────────────────────
def get_retriever_tool(vector_store: Chroma):
    """Wrap the vector store as a LangChain Tool the agent can call."""
    retriever = vector_store.as_retriever(
        search_type="mmr",           # Maximum Marginal Relevance for diversity
        search_kwargs={"k": 5, "fetch_k": 20},
    )
    return create_retriever_tool(
        retriever,
        name="document_retriever",
        description=(
            "Search and retrieve relevant information from the knowledge base. "
            "Use this tool whenever the user asks a question that requires "
            "factual context from the uploaded documents."
        ),
    )


# ── 5. Agent Prompt ─────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are an intelligent RAG (Retrieval-Augmented Generation) assistant
powered by Llama 3.2.

Your job:
1. Understand the user's question carefully.
2. Use the `document_retriever` tool to fetch relevant context from the knowledge base
   when needed.
3. Synthesise a clear, concise, and accurate answer using the retrieved context.
4. If the knowledge base does not contain the answer, say so honestly — do NOT hallucinate.

Always cite the source document name when using retrieved context.
"""

agent_prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    MessagesPlaceholder("chat_history", optional=True),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])


# ── 6. Agentic RAG Pipeline ─────────────────────────────────────────────────
class AgenticRAG:
    """
    Full agentic RAG pipeline.

    Usage
    -----
    >>> rag = AgenticRAG(vector_store)
    >>> answer = rag.invoke("What is the refund policy?")
    >>> print(answer)
    """

    def __init__(self, vector_store: Chroma, temperature: float = 0.0):
        self.llm = get_llm(temperature)
        self.tools = [get_retriever_tool(vector_store)]

        agent = create_tool_calling_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=agent_prompt,
        )
        self.executor = AgentExecutor(
            agent=agent,
            tools=self.tools,
            verbose=True,
            return_intermediate_steps=True,
            max_iterations=5,
            handle_parsing_errors=True,
        )

    def invoke(self, query: str, chat_history: list | None = None) -> str:
        """
        Run the agentic RAG pipeline for a single query.

        Parameters
        ----------
        query        : The user's question.
        chat_history : Optional list of previous (HumanMessage, AIMessage) pairs.

        Returns
        -------
        str : Final answer from the agent.
        """
        result = self.invoke_with_sources(query, chat_history)
        return result["output"]

    def invoke_with_sources(self, query: str, chat_history: list | None = None) -> dict:
        """
        Run the agentic RAG pipeline and extract source citations in a single pass.

        Returns
        -------
        dict : {"output": str, "sources": list[str]}
        """
        response = self.executor.invoke({
            "input": query,
            "chat_history": chat_history or [],
        })
        sources = []
        for step in response.get("intermediate_steps", []):
            if len(step) > 1 and hasattr(step[1], "__iter__"):
                for doc in step[1]:
                    src = getattr(doc, "metadata", {}).get("source", "")
                    if src and src not in sources:
                        sources.append(src)
        return {
            "output": response.get("output", ""),
            "sources": sources,
        }


# ── 7. Simple RAG Chain (non-agentic fallback) ──────────────────────────────
def build_rag_chain(vector_store: Chroma):
    """
    A lightweight, non-agentic RAG chain (stuff documents → LLM).

    Good for quick, single-turn Q&A without tool-calling overhead.
    """
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    llm       = get_llm()

    prompt = ChatPromptTemplate.from_template(
        """Answer the question using ONLY the context below.
If the context does not contain enough information, say "I don't know."

Context:
{context}

Question: {question}

Answer:"""
    )

    def format_docs(docs: list[Document]) -> str:
        return "\n\n".join(
            f"[{d.metadata.get('source', 'unknown')}]\n{d.page_content}"
            for d in docs
        )

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain


# ── 8. Quick smoke-test (run directly: python agentic_rag.py) ───────────────
if __name__ == "__main__":
    print("=" * 60)
    print(f"  Agentic RAG  |  Model: {LLM_MODEL}  |  Ollama: {OLLAMA_BASE_URL}")
    print("=" * 60)

    # --- smoke-test the LLM connection ---
    llm = get_llm()
    print("\n[LLM Test] Pinging Llama 3.2 …")
    try:
        response = llm.invoke("Reply with exactly: 'Llama 3.2 is online.'")
        print(f"[LLM Test] ✓ {response.content}")
    except Exception as exc:
        print(f"[LLM Test] ✗ Could not reach Ollama: {exc}")
        print("  → Make sure Ollama is running:  ollama serve")
        print(f"  → Make sure the model is pulled: ollama pull {LLM_MODEL}")
        raise SystemExit(1)

    # --- build demo index via chroma_db.py (no persist, in-memory) ---
    print("\n[VectorStore] Building demo index via chroma_db.py …")
    sample_docs = [
        Document(
            page_content=(
                "LangChain is an open-source framework for building LLM applications. "
                "It provides tools for chaining prompts, managing memory, and integrating "
                "with external data sources via retrieval-augmented generation (RAG)."
            ),
            metadata={"source": "langchain_intro.txt"},
        ),
        Document(
            page_content=(
                "Llama 3.2 is Meta's latest open-source large language model family. "
                "It includes 1B, 3B, 11B, and 90B variants and can be run locally "
                "using tools like Ollama, llama.cpp, or vLLM."
            ),
            metadata={"source": "llama_overview.txt"},
        ),
        Document(
            page_content=(
                "Agentic RAG extends standard RAG by giving the LLM the ability to "
                "decide when and how to retrieve documents, iterate on retrieval, "
                "and combine multiple tools to answer complex, multi-step questions."
            ),
            metadata={"source": "agentic_rag_intro.txt"},
        ),
    ]

    # Use chroma_db.py add_documents (persists to chroma_db/ folder)
    demo_store = add_documents(sample_docs, collection_name="smoke_test")

    # --- run the agentic pipeline ---
    print("\n[Agent] Starting Agentic RAG …")
    rag = AgenticRAG(demo_store)

    questions = [
        "What is LangChain and what can it do?",
        "How does Agentic RAG differ from standard RAG?",
        "What variants does Llama 3.2 come in?",
    ]

    for q in questions:
        print(f"\n{'─'*60}")
        print(f"Q: {q}")
        answer = rag.invoke(q)
        print(f"A: {answer}")

    print("\n[Done] ✓ Agentic RAG smoke-test complete.")

