# KARTA — Autonomous Agentic RAG

> **Editorial Document Intelligence powered by local Llama 3.2, ChromaDB, LangChain, and FastAPI.**

KARTA is a full-stack, air-gapped Agentic Retrieval-Augmented Generation (RAG) platform. Users can drop in complex multi-page files (PDF, DOCX, XLSX, CSV, PPTX, TXT, or ZIP archives) and an autonomous AI agent parses the corpus, plans execution steps, retrieves relevant passages using Maximum Marginal Relevance (MMR), and synthesizes executive answers with verifiable page-level citations.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React + Vite + Tailwind)"]
        UI["Tactile Editorial Interface"]
        DZ["Drag-and-Drop Zone\n(PDF, XLSX, DOCX, PPTX, CSV, ZIP)"]
        Chat["Typewriter Response Stream\n+ Interactive Citations [1]"]
    end

    subgraph Server ["Backend (FastAPI)"]
        API["FastAPI App (:8000)"]
        Loader["Document Loader\n(PyPDF, openpyxl, python-pptx, docx2txt)"]
        Agent["Agentic RAG Engine\n(LangChain AgentExecutor)"]
    end

    subgraph Engine ["Local AI & Vector Core"]
        Chroma["ChromaDB Vector Store\n(Local Disk Persistence)"]
        Ollama["Ollama Daemon (:11434)\n• Llama 3.2 (LLM)\n• nomic-embed-text (Embeddings)"]
    end

    DZ -->|POST /upload| API
    API --> Loader
    Loader --> Chroma
    UI -->|POST /chat (SSE Stream)| API
    API --> Agent
    Agent <-->|MMR Semantic Search| Chroma
    Agent <-->|Tool Calling / Prompt| Ollama
    API -->|Real-time Token Stream| Chat
```

---

## ✨ Features

- **Multi-Format Ingestion**: Native parsing for `.pdf`, `.docx`, `.doc`, `.xlsx`, `.xls`, `.csv`, `.pptx`, `.txt`, `.md`, and `.zip` archives.
- **Agentic Multi-Step Reasoning**: Driven by **Llama 3.2** via LangChain's tool-calling agent framework.
- **Maximum Marginal Relevance (MMR)**: Balances relevance and diversity in vector retrieval.
- **Verifiable Citations**: Interactive numbered superscripts (`[1]`, `[2]`) link directly to document names, page numbers, and original clause snippets.
- **100% Local & Sovereign**: Runs on your machine with **Ollama** and **ChromaDB**. No data leaves your computer.
- **Quiet Luxury, Editorial UI**: Tactile film-grain texture, typography with *Fraunces* (serif) + *Inter Tight* + *JetBrains Mono*, and responsive 3-column workspace.
- **Deliverable Tray**: One-click export to Markdown (`.md`), Word (`.docx`), PDF (`.pdf`), and CSV tables (`.csv`).

---

## 📂 Project Structure

```
agentic_rag/
├── backend/
│   ├── api.py                 # FastAPI server (chat, streaming, upload, stats, reset)
│   └── uploads/               # Ephemeral staging for uploaded documents
├── model/
│   ├── agentic_rag.py         # Agentic RAG pipeline (Llama 3.2 + Retriever Tool)
│   ├── chroma_db.py           # ChromaDB initialization, persistence, and search
│   ├── document_loader.py     # Multi-format document parser
│   └── __init__.py
├── frontend/
│   ├── index.html             # Web entry with custom editorial typography
│   ├── package.json           # React 19, Vite, Tailwind CSS, Lucide icons
│   ├── vite.config.js
│   ├── tailwind.config.js     # Editorial design system palette
│   └── src/
│       ├── App.jsx            # State manager & live SSE streaming reader
│       ├── main.jsx           # Root JSX mount
│       ├── index.css          # SVG feTurbulence grain, hairlines & vignettes
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── HeroSection.jsx
│       │   ├── AgentWorkspace.jsx
│       │   ├── HowItWorks.jsx
│       │   ├── UseCases.jsx
│       │   ├── SecuritySection.jsx
│       │   ├── PricingSection.jsx
│       │   ├── FaqSection.jsx
│       │   ├── Footer.jsx
│       │   ├── AuthModal.jsx
│       │   ├── SettingsModal.jsx
│       │   ├── HistoryView.jsx
│       │   └── NotFoundView.jsx
│       ├── data/
│       │   └── mockData.js
│       └── lib/
│           └── utils.js
├── docs/                      # Sample documents for immediate testing
├── .env.example               # Configuration template
├── .gitignore                 # GitHub ignore rules (Python, Node, Chroma, .env)
├── requirements.txt           # Python dependencies
└── README.md                  # System documentation
```

---

## ⚡ Prerequisites

1. **Python 3.10+**
2. **Node.js v18+ & npm**
3. **[Ollama](https://ollama.com/)** installed and running locally.

---

## 🚀 Quickstart Guide

### 1. Clone & Setup Environment

```bash
git clone https://github.com/YOUR_USERNAME/agentic-rag.git
cd agentic-rag

# Create your local .env configuration
cp .env.example .env
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Pull Local AI Models via Ollama

Make sure Ollama is running (`ollama serve`), then pull the required models:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

## 🖥️ Running the Application

Open two terminal tabs:

### Terminal A: Start the FastAPI Backend
```bash
cd backend
python api.py
```
> The API will start at: **`http://127.0.0.1:8000`**  
> Interactive API Docs (Swagger): **`http://127.0.0.1:8000/docs`**

### Terminal B: Start the Frontend UI
```bash
cd frontend
npm run dev
```
> The web application will open at: **`http://localhost:5173/`**

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root service status and configuration info |
| `GET` | `/health` | Live diagnostic check for Ollama and ChromaDB |
| `POST` | `/upload` | Multipart file upload and automatic vector indexing |
| `POST` | `/chat` | Agentic RAG query endpoint (supports `stream: true` SSE) |
| `GET` | `/stats` | Returns total indexed chunks and collection statistics |
| `DELETE` | `/reset` | Purges all indexed embeddings from ChromaDB |
| `GET` | `/collections`| Lists all ChromaDB collection names |

---

## 🛡️ Privacy & Sovereignty

- **Zero External Calls**: When configured with Ollama, no data leaves your local machine.
- **No Training**: Uploaded documents and vectors are never used for foundation model training.
- **Configurable TTL**: Sessions and documents can be wiped at any time using the UI or the `/reset` API endpoint.

---

## 📄 License

MIT License. Free for personal, research, and commercial usage.

