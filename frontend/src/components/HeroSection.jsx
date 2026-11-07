import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FileText,
  FileSpreadsheet,
  FileBox,
  Image as ImageIcon,
  File,
  X,
  Upload,
  AlertCircle,
  Check,
  CornerDownRight
} from 'lucide-react';
import { formatBytes } from '../lib/utils';
import { SUGGESTION_PROMPTS } from '../data/mockData';

export const HeroSection = ({
  files,
  onAddFiles,
  onRemoveFile,
  onSubmitSession,
  isProcessing,
}) => {
  const [prompt, setPrompt] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [copiedPasteNotice, setCopiedPasteNotice] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      setValidationError(null);
      if (fileRejections && fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        setValidationError(
          firstError.code === 'file-too-large'
            ? 'Exceeds per-document limit of 64MB.'
            : 'Unsupported file format.'
        );
      }
      if (acceptedFiles && acceptedFiles.length > 0) {
        onAddFiles(acceptedFiles);
      }
    },
    [onAddFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 64 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/zip': ['.zip'],
    },
  });

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      onAddFiles(pastedFiles);
      setCopiedPasteNotice(true);
      setTimeout(() => setCopiedPasteNotice(false), 2500);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (files.length === 0) {
      setValidationError('Please upload at least one document to proceed.');
      return;
    }
    const finalPrompt = prompt.trim() || 'Synthesize executive summary, analyze risks, and extract key action items.';
    onSubmitSession(finalPrompt);
  };

  const getFileIcon = (ext) => {
    const upper = (ext || '').toUpperCase();
    if (['PDF'].includes(upper)) return <FileText className="w-4 h-4 text-paper/80 stroke-[1.2]" />;
    if (['XLSX', 'CSV'].includes(upper)) return <FileSpreadsheet className="w-4 h-4 text-paper/80 stroke-[1.2]" />;
    if (['PPTX'].includes(upper)) return <FileBox className="w-4 h-4 text-paper/80 stroke-[1.2]" />;
    if (['PNG', 'JPG', 'JPEG', 'WEBP'].includes(upper)) return <ImageIcon className="w-4 h-4 text-paper/80 stroke-[1.2]" />;
    return <File className="w-4 h-4 text-paper/80 stroke-[1.2]" />;
  };

  return (
    <section
      id="hero-dropzone"
      onPaste={handlePaste}
      className="relative pt-32 pb-24 px-6 sm:px-8 bg-ink-deep text-paper paper-grain-dark radial-vignette min-h-[92vh] flex flex-col justify-center border-b border-paper/10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow Label */}
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-loose-mono text-amber-accent/90 border border-amber-accent/30 px-2.5 py-0.5 rounded-full">
            Autonomous Document Operations
          </span>
          <span className="text-paper/40 font-mono text-[11px]">—</span>
          <span className="text-paper/50 font-mono text-[11px]">No prompt engineering required</span>
        </div>

        {/* Hero Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[84px] font-normal tracking-editorial leading-[0.98] text-paper">
              Drop in a contract.
              <br />
              <span className="text-paper/60 italic font-light">Get the clauses that matter.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 pb-2">
            <p className="font-sans text-[15px] sm:text-[16px] text-paper/70 font-light leading-relaxed">
              Karta reads complete files, generates verifiable execution steps, and produces audit-ready executive briefs with precise citations.
            </p>
          </div>
        </div>

        {/* Tactile Dropzone Container */}
        <div className="relative bg-[#141414]/90 backdrop-blur-md rounded-sharp border border-paper/15 shadow-2xl p-6 sm:p-8 transition-all">
          {/* Corner Crop Marks for Editorial Feel */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-paper/40" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-paper/40" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-paper/40" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-paper/40" />

          {/* Drag and Drop Zone */}
          <div
            {...getRootProps()}
            className={`group cursor-pointer border border-dashed rounded-sharp p-8 sm:p-12 text-center transition-all duration-300 relative ${
              isDragActive
                ? 'border-amber-accent bg-paper/5 ring-1 ring-amber-accent'
                : 'border-paper/20 hover:border-paper/40 hover:bg-paper/[0.02]'
            }`}
          >
            <input {...getInputProps()} />

            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 mx-auto rounded-sharp border border-paper/20 flex items-center justify-center bg-paper/[0.04] group-hover:border-paper/50 transition-colors">
                <Upload className="w-5 h-5 text-paper/70 stroke-[1.2] group-hover:text-paper" />
              </div>

              <div>
                <p className="font-serif text-2xl sm:text-3xl text-paper font-normal">
                  {isDragActive ? 'Release to deposit documents' : 'Drag documents here, or click to browse'}
                </p>
                <p className="font-sans text-[13px] text-paper/50 mt-2 font-light">
                  Support for PDF, DOCX, XLSX, CSV, PPTX, TXT, images or ZIP up to 64MB each
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="font-mono text-[10px] text-paper/40 uppercase tracking-widest border border-paper/10 px-2 py-0.5 rounded-sharp">
                  Clipboard paste enabled (Ctrl+V)
                </span>
                {copiedPasteNotice && (
                  <span className="font-mono text-[10px] text-amber-accent flex items-center gap-1">
                    <Check className="w-3 h-3" /> Pasted from clipboard
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Validation Notice */}
          {validationError && (
            <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded-sharp flex items-center gap-2 text-[13px] text-red-200 font-sans">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* File Queue List */}
          {files.length > 0 && (
            <div className="mt-6 pt-6 border-t border-paper/10">
              <div className="flex items-center justify-between mb-3 text-paper/60 font-mono text-[11px] uppercase tracking-loose-mono">
                <span>Staged Documents ({files.length})</span>
                <span>Ready for parsing</span>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-paper/[0.03] border border-paper/10 rounded-sharp hover:border-paper/20 transition-all text-[13px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-sharp bg-paper/10 flex items-center justify-center shrink-0">
                        {getFileIcon(file.extension)}
                      </div>
                      <div className="truncate">
                        <p className="text-paper truncate font-medium">{file.name}</p>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-paper/50">
                          <span>{file.extension}</span>
                          <span>•</span>
                          <span>{formatBytes(file.size)}</span>
                          {file.pageCount && (
                            <>
                              <span>•</span>
                              <span>{file.pageCount} pages</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-3">
                      <div className="w-20 hidden sm:block">
                        <div className="h-1 w-full bg-paper/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-accent/80 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>

                      <span className="font-mono text-[10px] uppercase text-paper/60">
                        {file.status}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFile(file.id);
                        }}
                        className="text-paper/40 hover:text-paper hover:bg-paper/10 p-1 rounded-sharp transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Instruction & Suggestions Bar */}
          <div className="mt-6 pt-6 border-t border-paper/10">
            <label className="block font-mono text-[11px] uppercase tracking-loose-mono text-paper/60 mb-2">
              Agent Objective
            </label>

            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="What should the agent analyze, extract, or formulate from these files?"
                  className="w-full bg-paper/[0.05] border border-paper/20 rounded-sharp px-4 py-3 text-[14px] text-paper placeholder-paper/40 focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent font-sans transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-paper text-ink rounded-sharp font-mono text-[12px] uppercase tracking-wider hover:bg-paper-tint active:scale-[0.99] transition-all disabled:opacity-50 shrink-0 font-medium"
              >
                <span>{isProcessing ? 'Synthesizing...' : 'Initialize Agent'}</span>
                <CornerDownRight className="w-3.5 h-3.5 text-ink" />
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-paper/40 uppercase tracking-widest mr-1">
                Suggestions:
              </span>
              {SUGGESTION_PROMPTS.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(suggestion)}
                  className="font-sans text-[11px] text-paper/70 hover:text-paper bg-paper/[0.03] hover:bg-paper/[0.08] border border-paper/10 rounded-sharp px-2.5 py-1 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Supported File Type Glyphs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-paper/40 font-mono text-[11px] uppercase tracking-loose-mono pt-4 border-t border-paper/5">
          <div className="flex flex-wrap items-center gap-4">
            <span>Encrypted local workspace</span>
            <span>•</span>
            <span>Zero retention training policy</span>
            <span>•</span>
            <span>Direct vector MMR extraction</span>
          </div>
          <div>
            <span>Format support: PDF • DOCX • XLSX • CSV • PPTX • TXT • PNG • ZIP</span>
          </div>
        </div>
      </div>
    </section>
  );
};

