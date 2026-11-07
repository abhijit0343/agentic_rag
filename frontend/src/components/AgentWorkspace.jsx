import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileBox,
  Image as ImageIcon,
  File,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  RotateCcw,
  Square,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatBytes } from '../lib/utils';

export const AgentWorkspace = ({
  files,
  agentSteps,
  messages,
  citations,
  isGenerating,
  onStopAgent,
  onRetryAgent,
  onSendNewQuery,
  activeCitationId,
  setActiveCitationId,
  onResetSession,
}) => {
  const [activeTabMobile, setActiveTabMobile] = useState('center'); // 'left' | 'center' | 'right'
  const [expandedStepId, setExpandedStepId] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(files[0]?.id || null);
  const [newInput, setNewInput] = useState('');
  const [copiedFormat, setCopiedFormat] = useState(null);

  const selectedDoc = files.find((f) => f.id === selectedDocId) || files[0];

  const handleCopy = (format) => {
    const fullText = messages.map((m) => `${m.role.toUpperCase()}:\n${m.content}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleExportDownload = (type) => {
    const fullText = messages.map((m) => `${m.role.toUpperCase()}:\n${m.content}`).join('\n\n');
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KARTA_Synthesis_Export_${Date.now()}.${type === 'markdown' ? 'md' : type === 'csv' ? 'csv' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleStepLogs = (id) => {
    setExpandedStepId(expandedStepId === id ? null : id);
  };

  const getFileIcon = (ext) => {
    const upper = (ext || '').toUpperCase();
    if (['PDF'].includes(upper)) return <FileText className="w-4 h-4 text-ink stroke-[1.2]" />;
    if (['XLSX', 'CSV'].includes(upper)) return <FileSpreadsheet className="w-4 h-4 text-ink stroke-[1.2]" />;
    if (['PPTX'].includes(upper)) return <FileBox className="w-4 h-4 text-ink stroke-[1.2]" />;
    if (['PNG', 'JPG', 'JPEG', 'WEBP'].includes(upper)) return <ImageIcon className="w-4 h-4 text-ink stroke-[1.2]" />;
    return <File className="w-4 h-4 text-ink stroke-[1.2]" />;
  };

  return (
    <section className="bg-paper min-h-screen pt-24 pb-16 px-4 sm:px-8 paper-grain border-b border-ink/10">
      <div className="max-w-[1600px] mx-auto">
        {/* Workspace Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-ink/10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-loose-mono bg-ink text-paper px-2.5 py-1 rounded-sharp">
              Live Session
            </span>
            <span className="font-serif text-2xl text-ink font-normal tracking-editorial">
              Autonomous Document Synthesis
            </span>
            <span className="hidden md:inline text-gray-mid font-mono text-[12px]">
              ({files.length} active documents attached)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetSession}
              className="text-[12px] font-mono uppercase tracking-wider text-gray-mid hover:text-ink px-3 py-1.5 rounded-sharp border border-ink/15 hover:border-ink/40 transition-all"
            >
              Close Session
            </button>
            {isGenerating ? (
              <button
                onClick={onStopAgent}
                className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-wider bg-red-950/10 text-red-700 hover:bg-red-950/20 px-3 py-1.5 rounded-sharp border border-red-500/30 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-red-700" />
                <span>Halt Process</span>
              </button>
            ) : (
              <button
                onClick={onRetryAgent}
                className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-wider bg-ink text-paper hover:bg-ink-soft px-3 py-1.5 rounded-sharp transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Synthesize</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden mb-4 border border-ink/10 rounded-sharp overflow-hidden bg-paper-tint text-[12px] font-mono uppercase">
          <button
            onClick={() => setActiveTabMobile('left')}
            className={`flex-1 py-2 text-center transition-colors ${activeTabMobile === 'left' ? 'bg-ink text-paper font-medium' : 'text-ink/70'}`}
          >
            Sources ({files.length})
          </button>
          <button
            onClick={() => setActiveTabMobile('center')}
            className={`flex-1 py-2 text-center transition-colors ${activeTabMobile === 'center' ? 'bg-ink text-paper font-medium' : 'text-ink/70'}`}
          >
            Synthesis Thread
          </button>
          <button
            onClick={() => setActiveTabMobile('right')}
            className={`flex-1 py-2 text-center transition-colors ${activeTabMobile === 'right' ? 'bg-ink text-paper font-medium' : 'text-ink/70'}`}
          >
            Activity Timeline
          </button>
        </div>

        {/* 3-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMN 1: Document Index & Mock Page Thumbnails (Left) */}
          <div
            className={`lg:col-span-3 bg-paper-tint/60 border border-ink/10 rounded-sharp p-4 lg:block ${
              activeTabMobile === 'left' ? 'block' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-ink/70 font-mono text-[11px] uppercase tracking-loose-mono">
              <span>Attached Corpora</span>
              <span>{files.length} Files</span>
            </div>

            <div className="space-y-2 mb-6">
              {files.map((file) => {
                const isSelected = selectedDoc?.id === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedDocId(file.id)}
                    className={`w-full text-left p-3 rounded-sharp border transition-all ${
                      isSelected
                        ? 'bg-paper border-ink shadow-xs'
                        : 'bg-paper/40 border-ink/5 hover:border-ink/20 hover:bg-paper/80'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-6 h-6 rounded-sharp bg-ink/5 flex items-center justify-center shrink-0">
                        {getFileIcon(file.extension)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[13px] text-ink truncate leading-tight">
                          {file.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-gray-mid">
                          <span>{file.extension}</span>
                          <span>•</span>
                          <span>{formatBytes(file.size)}</span>
                          {file.pageCount && (
                            <>
                              <span>•</span>
                              <span>{file.pageCount} pgs</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Document Thumbnail Preview Deck */}
            {selectedDoc && (
              <div className="pt-4 border-t border-ink/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase text-gray-mid tracking-widest">
                    Page Inspector: {selectedDoc.name.slice(0, 18)}...
                  </span>
                  <span className="font-mono text-[10px] text-ink/60">
                    {selectedDoc.pageCount || 1} pages
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((pg) => {
                    const isCited = citations.some(
                      (c) => c.documentName === selectedDoc.name && c.page === pg
                    );
                    const isCurrentActive = citations.some(
                      (c) => c.id === activeCitationId && c.documentName === selectedDoc.name && c.page === pg
                    );

                    return (
                      <div
                        key={pg}
                        onClick={() => {
                          const matchedCitation = citations.find(
                            (c) => c.documentName === selectedDoc.name && c.page === pg
                          );
                          if (matchedCitation) setActiveCitationId(matchedCitation.id);
                        }}
                        className={`aspect-[3/4] bg-paper rounded-sharp border p-1 flex flex-col justify-between cursor-pointer transition-all ${
                          isCurrentActive
                            ? 'border-amber-accent ring-2 ring-amber-accent shadow-sm'
                            : isCited
                            ? 'border-ink bg-amber-accent/5'
                            : 'border-ink/10 opacity-70 hover:opacity-100 hover:border-ink/30'
                        }`}
                      >
                        <div className="h-1.5 w-1/2 bg-ink/10 rounded-full" />
                        <div className="space-y-1 my-auto">
                          <div className="h-0.5 w-full bg-ink/15" />
                          <div className="h-0.5 w-4/5 bg-ink/10" />
                          <div className="h-0.5 w-full bg-ink/10" />
                        </div>
                        <div className="flex items-center justify-between font-mono text-[8px] text-gray-mid px-0.5">
                          <span>p.{pg}</span>
                          {isCited && <span className="text-amber-accent font-bold">★</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedDoc.summarySnippet && (
                  <p className="mt-3 text-[11px] font-sans text-ink/70 leading-relaxed italic bg-paper p-2.5 rounded-sharp border border-ink/5">
                    "{selectedDoc.summarySnippet}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* COLUMN 2: Synthesis Thread & Citations (Center) */}
          <div
            className={`lg:col-span-6 bg-paper border border-ink/10 rounded-sharp flex flex-col min-h-[620px] shadow-xs lg:block ${
              activeTabMobile === 'center' ? 'block' : 'hidden'
            }`}
          >
            {/* Thread Header */}
            <div className="p-4 border-b border-ink/10 flex items-center justify-between bg-paper-tint/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-loose-mono text-ink">
                  Reasoning Core: Llama 3.2 3B Instruct
                </span>
              </div>
              <span className="font-mono text-[10px] text-gray-mid">
                Deterministic Temperature: 0.0
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[680px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <span className="font-mono text-[10px] uppercase text-gray-mid tracking-widest mb-1.5">
                    {msg.role === 'user' ? 'Instruction Query' : 'Karta Agent Execution'} • {msg.timestamp}
                  </span>

                  <div
                    className={`p-5 rounded-sharp text-[14px] leading-relaxed max-w-2xl ${
                      msg.role === 'user'
                        ? 'bg-paper-tint text-ink border border-ink/15 font-medium'
                        : 'bg-paper text-ink border border-ink/10 shadow-xs'
                    }`}
                  >
                    {/* Render message with interactive citation superscripts */}
                    <div className="whitespace-pre-line font-sans prose-sm">
                      {msg.content.split(/(\[\d+\])/g).map((chunk, i) => {
                        const match = chunk.match(/\[(\d+)\]/);
                        if (match) {
                          const citationId = parseInt(match[1], 10);
                          const citation = citations.find((c) => c.id === citationId);
                          const isHovered = activeCitationId === citationId;

                          return (
                            <button
                              key={i}
                              onMouseEnter={() => setActiveCitationId(citationId)}
                              onClick={() => setActiveCitationId(citationId)}
                              className={`inline-flex items-center justify-center font-mono text-[10px] font-bold px-1 py-0.5 mx-0.5 rounded-sharp border transition-all ${
                                isHovered
                                  ? 'bg-ink text-paper border-ink scale-110'
                                  : 'bg-amber-accent/20 text-ink-deep border-amber-accent/50 hover:bg-amber-accent/40'
                              }`}
                              title={citation ? `${citation.documentName} (p.${citation.page})` : 'Citation anchor'}
                            >
                              {match[0]}
                            </button>
                          );
                        }
                        return chunk;
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-2 p-4 bg-paper-tint/50 border border-ink/10 rounded-sharp text-[13px] text-ink/70 font-mono">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-ink rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-ink rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-ink rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Agent streaming cross-referenced analysis...</span>
                </div>
              )}
            </div>

            {/* Active Citation Inspection Drawer */}
            {activeCitationId && (
              <div className="mx-6 mb-4 p-3.5 bg-amber-accent/10 border border-amber-accent/40 rounded-sharp text-[12px] flex items-start justify-between gap-3 animate-fade-in">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-ink">
                    <span>Anchor [{activeCitationId}] Source:</span>
                    <span className="underline">
                      {citations.find((c) => c.id === activeCitationId)?.documentName}
                    </span>
                    <span>(Page {citations.find((c) => c.id === activeCitationId)?.page})</span>
                  </div>
                  <p className="mt-1 font-sans text-ink/80 italic">
                    "{citations.find((c) => c.id === activeCitationId)?.snippet}"
                  </p>
                </div>
                <button
                  onClick={() => setActiveCitationId(null)}
                  className="text-ink/50 hover:text-ink font-mono text-[11px] shrink-0"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Follow-up Query Input */}
            <div className="p-4 border-t border-ink/10 bg-paper-tint/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newInput.trim()) return;
                  onSendNewQuery(newInput);
                  setNewInput('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newInput}
                  onChange={(e) => setNewInput(e.target.value)}
                  placeholder="Ask a clarifying question or request deeper analysis..."
                  className="flex-1 bg-paper border border-ink/20 rounded-sharp px-3.5 py-2.5 text-[13px] text-ink placeholder-gray-mid focus:outline-none focus:border-ink transition-all"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2.5 bg-ink text-paper rounded-sharp font-mono text-[11px] uppercase tracking-wider hover:bg-ink-soft transition-all disabled:opacity-40"
                >
                  Dispatch
                </button>
              </form>
            </div>
          </div>

          {/* COLUMN 3: Agent Activity Timeline & Execution Logs (Right) */}
          <div
            className={`lg:col-span-3 space-y-6 lg:block ${
              activeTabMobile === 'right' ? 'block' : 'hidden'
            }`}
          >
            {/* Activity Card */}
            <div className="bg-paper-tint/60 border border-ink/10 rounded-sharp p-4">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-ink/10">
                <span className="font-mono text-[11px] uppercase tracking-loose-mono text-ink">
                  Execution Plan
                </span>
                <span className="font-mono text-[10px] text-gray-mid">
                  4 Tasks Scheduled
                </span>
              </div>

              {/* Steps Vertical Timeline */}
              <div className="space-y-4">
                {agentSteps.map((step, idx) => {
                  const isExpanded = expandedStepId === step.id;
                  const isRunning = step.status === 'running';
                  const isDone = step.status === 'done';

                  return (
                    <div
                      key={step.id}
                      className="border-l-2 pl-3 relative transition-all"
                      style={{
                        borderColor: isRunning
                          ? '#C8B27A'
                          : isDone
                          ? '#0A0A0A'
                          : 'rgba(10, 10, 10, 0.15)',
                      }}
                    >
                      {/* Status indicator node */}
                      <div
                        className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${
                          isRunning
                            ? 'bg-amber-accent ring-4 ring-amber-accent/20'
                            : isDone
                            ? 'bg-ink'
                            : 'bg-paper border border-ink/30'
                        }`}
                      />

                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="font-medium text-[13px] text-ink leading-snug">
                            {step.title}
                          </p>
                          <p className="font-sans text-[11px] text-ink/60 mt-0.5">
                            {step.description}
                          </p>
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-gray-mid shrink-0 mt-0.5">
                          {step.status}
                        </span>
                      </div>

                      {/* Expandable Step Logs */}
                      {step.logs && step.logs.length > 0 && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleStepLogs(step.id)}
                            className="inline-flex items-center gap-1 font-mono text-[10px] text-ink/70 hover:text-ink"
                          >
                            <span>{isExpanded ? 'Hide micro-logs' : `Inspect logs (${step.logs.length})`}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-1.5 p-2 bg-paper rounded-sharp border border-ink/10 font-mono text-[10px] space-y-1 max-h-36 overflow-y-auto">
                              {step.logs.map((log, lIdx) => (
                                <div key={lIdx} className="text-ink/80 leading-tight">
                                  <span className="text-gray-mid">[{log.timestamp}]</span> {log.message}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Output & Export Tray */}
            <div className="bg-paper-tint/60 border border-ink/10 rounded-sharp p-4">
              <span className="font-mono text-[11px] uppercase tracking-loose-mono text-ink block mb-3">
                Downloadable Deliverables
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExportDownload('markdown')}
                  className="flex items-center justify-between p-2.5 bg-paper rounded-sharp border border-ink/10 hover:border-ink/40 text-[12px] font-mono text-ink transition-all"
                >
                  <span>Markdown (.md)</span>
                  <Download className="w-3.5 h-3.5 text-gray-mid" />
                </button>

                <button
                  onClick={() => handleExportDownload('docx')}
                  className="flex items-center justify-between p-2.5 bg-paper rounded-sharp border border-ink/10 hover:border-ink/40 text-[12px] font-mono text-ink transition-all"
                >
                  <span>Word (.docx)</span>
                  <Download className="w-3.5 h-3.5 text-gray-mid" />
                </button>

                <button
                  onClick={() => handleExportDownload('pdf')}
                  className="flex items-center justify-between p-2.5 bg-paper rounded-sharp border border-ink/10 hover:border-ink/40 text-[12px] font-mono text-ink transition-all"
                >
                  <span>Report (.pdf)</span>
                  <Download className="w-3.5 h-3.5 text-gray-mid" />
                </button>

                <button
                  onClick={() => handleExportDownload('csv')}
                  className="flex items-center justify-between p-2.5 bg-paper rounded-sharp border border-ink/10 hover:border-ink/40 text-[12px] font-mono text-ink transition-all"
                >
                  <span>Tables (.csv)</span>
                  <Download className="w-3.5 h-3.5 text-gray-mid" />
                </button>
              </div>

              <button
                onClick={() => handleCopy('all')}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 bg-ink text-paper rounded-sharp font-mono text-[11px] uppercase tracking-wider hover:bg-ink-soft transition-all"
              >
                {copiedFormat ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-accent" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Synthesized Output</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

