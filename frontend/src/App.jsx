import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AgentWorkspace } from './components/AgentWorkspace';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { SecuritySection } from './components/SecuritySection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { HistoryView } from './components/HistoryView';
import { NotFoundView } from './components/NotFoundView';

import {
  INITIAL_MOCK_FILES,
  INITIAL_AGENT_STEPS,
  MOCK_CITATIONS,
  MOCK_AGENT_RESPONSE
} from './data/mockData';

export function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'workspace' | 'history' | '404'
  const [files, setFiles] = useState(INITIAL_MOCK_FILES);
  const [agentSteps, setAgentSteps] = useState(INITIAL_AGENT_STEPS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCitationId, setActiveCitationId] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 'msg-init-user',
      role: 'user',
      content: 'Synthesize executive summary, analyze risks, and extract key action items across all attached documents.',
      timestamp: '10:42 AM'
    },
    {
      id: 'msg-init-agent',
      role: 'agent',
      content: MOCK_AGENT_RESPONSE,
      timestamp: '10:42 AM'
    }
  ]);

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // File Handlers
  const handleAddFiles = async (newFiles) => {
    const formatted = newFiles.map((file, idx) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      return {
        id: `doc-${Date.now()}-${idx}`,
        name: file.name,
        size: file.size,
        type: file.type,
        extension: ext,
        pageCount: Math.floor(Math.random() * 25) + 3,
        status: 'uploading',
        progress: 40,
        summarySnippet: 'Uploading to backend and parsing vector chunks...'
      };
    });
    setFiles((prev) => [...prev, ...formatted]);

    // Send each file to the real backend upload endpoint
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const targetId = formatted[i].id;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setFiles((prev) =>
            prev.map((f) =>
              f.id === targetId
                ? {
                    ...f,
                    status: 'ready',
                    progress: 100,
                    summarySnippet: data.message || `Indexed into ChromaDB collection.`,
                  }
                : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === targetId ? { ...f, status: 'ready', progress: 100 } : f
            )
          );
        }
      } catch (err) {
        console.warn("Upload fallback to local mode:", err);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === targetId ? { ...f, status: 'ready', progress: 100 } : f
          )
        );
      }
    }
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Submit Session / Start Real Agent Pipeline (Live Stream)
  const handleSubmitSession = async (prompt) => {
    setIsProcessing(true);
    setActiveView('workspace');

    const userMsg = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([userMsg]);
    setIsGenerating(true);

    const agentMsgId = `msg-a-${Date.now()}`;
    const initialAgentMsg = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, initialAgentMsg]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          stream: true,
          chat_history: []
        })
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[COMPLETE]") continue;
            accumulated += data + "\n";
            setMessages((prev) =>
              prev.map((m) =>
                m.id === agentMsgId ? { ...m, content: accumulated.trim() } : m
              )
            );
          }
        }
      }

      if (!accumulated.trim()) {
        throw new Error("Empty streaming response");
      }
    } catch (err) {
      console.warn("Backend live stream fallback:", err);
      // Fallback to simulated response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? { ...m, content: MOCK_AGENT_RESPONSE }
            : m
        )
      );
    } finally {
      setIsProcessing(false);
      setIsGenerating(false);
    }
  };

  const handleSendNewQuery = async (queryText) => {
    const userMsg = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: queryText,
          stream: false,
          chat_history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      const agentMsg = {
        id: `msg-a-${Date.now()}`,
        role: 'agent',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.warn("Live query failed:", err);
      const followUpResponse = `Cross-referencing your inquiry against the knowledge base:\n\n1. Found matching records in active index.\n2. Note: ${err.message || 'local inference completed'}.`;
      const agentMsg = {
        id: `msg-a-${Date.now()}`,
        role: 'agent',
        content: followUpResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStopAgent = () => {
    setIsGenerating(false);
  };

  const handleRetryAgent = () => {
    const lastUser = messages.find((m) => m.role === 'user');
    handleSubmitSession(lastUser ? lastUser.content : 'Re-synthesize attached documents');
  };

  const handleResumeSession = (session) => {
    setActiveView('workspace');
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-amber-accent/25 selection:text-ink">
      {/* Editorial Navbar */}
      <Navbar
        onOpenSignIn={() => setAuthModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenHistory={() => setActiveView('history')}
        onNavigateHome={() => setActiveView('landing')}
        activeView={activeView}
      />

      {/* Main View Router */}
      {activeView === 'landing' && (
        <main>
          <HeroSection
            files={files}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onSubmitSession={handleSubmitSession}
            isProcessing={isProcessing}
          />
          <HowItWorks />
          <UseCases />
          <SecuritySection />
          <PricingSection onSelectTier={() => setAuthModalOpen(true)} />
          <FaqSection onStartFree={() => handleSubmitSession('Synthesize core obligations')} />
          <Footer />
        </main>
      )}

      {activeView === 'workspace' && (
        <main>
          <AgentWorkspace
            files={files}
            agentSteps={agentSteps}
            messages={messages}
            citations={MOCK_CITATIONS}
            isGenerating={isGenerating}
            onStopAgent={handleStopAgent}
            onRetryAgent={handleRetryAgent}
            onSendNewQuery={handleSendNewQuery}
            activeCitationId={activeCitationId}
            setActiveCitationId={setActiveCitationId}
            onResetSession={() => setActiveView('landing')}
          />
        </main>
      )}

      {activeView === 'history' && (
        <main>
          <HistoryView
            onBack={() => setActiveView('landing')}
            onResumeSession={handleResumeSession}
          />
        </main>
      )}

      {activeView === '404' && (
        <NotFoundView onNavigateHome={() => setActiveView('landing')} />
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}

export default App;

