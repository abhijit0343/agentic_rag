# KARTA — Editorial Agentic Document Intelligence (Frontend)

Quiet luxury, tactile, editorial AI frontend for autonomous multi-document synthesis and risk extraction. Built strictly with **React + Vite + JavaScript / JSX + Tailwind CSS + Lucide Icons**.

---

## 🎨 Design System

- **Palette**: Paper off-white (`#F7F5F0`), Deep Ink Black (`#0A0A0A`), subtle paper tints, and a warm highlight accent (`#C8B27A`) used sparingly for citations and focus.
- **Typography**: 
  - Serif headlines: *Fraunces* (tight editorial tracking)
  - UI text: *Inter Tight* (clean grotesque)
  - Metadata & Execution logs: *JetBrains Mono* (monospaced)
- **Texture**: Built-in SVG `feTurbulence` tactile paper grain overlay (`.paper-grain` and `.paper-grain-dark`).
- **Borders**: 1px hairlines (`rgba(10,10,10,0.08)`) with sharp `2px` corners on panels.

---

## 📁 Component Structure (All .jsx / .js)

```
frontend/src/
├── components/
│   ├── Navbar.jsx           # Sticky blurred wordmark navigation + modals trigger
│   ├── HeroSection.jsx      # Dark tactile dropzone (PDF, DOCX, XLSX, CSV, PPTX, scans, ZIP) + paste
│   ├── AgentWorkspace.jsx   # 3-column layout:
│   │                        #   Left: Staged document list & page thumbnail viewer
│   │                        #   Center: Typewriter chat stream with interactive citations [1]
│   │                        #   Right: Execution timeline + expandable micro-logs + export tray
│   ├── HowItWorks.jsx       # Asymmetric 01, 02, 03 editorial process rows with UI fragments
│   ├── UseCases.jsx         # Legal, Finance, Research, Students, Ops before/after tabs
│   ├── SecuritySection.jsx  # Plain-language privacy guarantee + purge data control
│   ├── PricingSection.jsx   # Research, Professional (inverted), Enterprise Sovereign
│   ├── FaqSection.jsx       # Accordion questions + final session CTA
│   ├── Footer.jsx           # Editorial index + large faded background wordmark
│   ├── AuthModal.jsx        # Sign in / Sign up dialog
│   ├── SettingsModal.jsx    # FastAPI + Ollama endpoint tester and preference config
│   ├── HistoryView.jsx      # Past document runs archive with search
│   └── NotFoundView.jsx     # Editorial 404 page
├── data/
│   └── mockData.js          # Realistic mock files, multi-step agent actions, citations, FAQs
├── lib/
│   └── utils.js             # cn() tailwind merger & formatBytes()
├── App.jsx                  # Main application state and view router
├── main.jsx                 # Entrypoint
└── index.css                # Hairlines, film grain, and custom fonts
```

---

## 🚀 Running the Frontend

```bash
cd "d:\agentic ai\agentic_rag\frontend"

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

The app will be accessible at: **`http://localhost:5173`**

---

## 🔌 Connecting to your FastAPI Backend (`backend/api.py`)

In `src/App.jsx`, you can wire the simulated agent delays directly to your running FastAPI backend:

### 1. File Upload (`POST /upload`)
```javascript
// In src/App.jsx handleAddFiles:
const formData = new FormData();
formData.append("file", file);
const res = await fetch("http://localhost:8000/upload", {
  method: "POST",
  body: formData,
});
const data = await res.json();
```

### 2. Chat / Agent Query (`POST /chat`)
```javascript
// In src/App.jsx handleSubmitSession or handleSendNewQuery:
const res = await fetch("http://localhost:8000/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    question: prompt,
    stream: false,
    chat_history: messages.map(m => ({ role: m.role, content: m.content }))
  })
});
const data = await res.json();
// data.answer contains the response with citations
```
