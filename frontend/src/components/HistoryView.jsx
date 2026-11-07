import React, { useState } from 'react';
import { PAST_SESSIONS_MOCK } from '../data/mockData';
import { ArrowLeft, Clock, FileText, ChevronRight, Search } from 'lucide-react';

export const HistoryView = ({ onBack, onResumeSession }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = PAST_SESSIONS_MOCK.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-paper pt-28 pb-20 px-6 sm:px-8 paper-grain">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-ink/70 hover:text-ink font-mono text-[12px] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace</span>
          </button>

          <span className="font-mono text-[11px] text-gray-mid uppercase tracking-widest">
            Session Archive
          </span>
        </div>

        <div className="mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal tracking-editorial">
            Past Document Runs
          </h1>
          <p className="font-sans text-[14px] text-ink/70 mt-2 font-light">
            Search prior executive memos, risk cross-checks, and citation graphs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="w-4 h-4 text-gray-mid absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search through past analyses by keyword or clause..."
            className="w-full bg-paper border border-ink/20 rounded-sharp pl-10 pr-4 py-2.5 text-[14px] text-ink placeholder-gray-mid focus:outline-none focus:border-ink font-sans transition-all"
          />
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-6 bg-paper-tint/40 border border-ink/10 rounded-sharp hover:border-ink/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3 font-mono text-[11px] text-gray-mid">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {session.date}
                  </span>
                  <span>•</span>
                  <span>{session.filesCount} files attached</span>
                </div>

                <h3 className="font-serif text-2xl text-ink font-normal group-hover:text-ink/80 transition-colors">
                  {session.title}
                </h3>

                <p className="font-sans text-[13px] text-ink/75 leading-relaxed">
                  {session.summary}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {session.fileNames.map((fn, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 font-mono text-[10px] bg-paper px-2 py-0.5 rounded-sharp border border-ink/10 text-ink/70"
                    >
                      <FileText className="w-3 h-3 text-gray-mid" />
                      {fn}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => onResumeSession(session)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-paper rounded-sharp font-mono text-[11px] uppercase tracking-wider hover:bg-ink-soft transition-all"
                >
                  <span>Re-open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="p-12 text-center text-gray-mid font-mono text-[13px] border border-dashed border-ink/15 rounded-sharp">
              No matching archival runs located.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

