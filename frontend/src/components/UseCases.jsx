import React, { useState } from 'react';
import { USE_CASES_DATA } from '../data/mockData';
import { ArrowRight, FileCheck, AlertTriangle } from 'lucide-react';

export const UseCases = () => {
  const [activeTabId, setActiveTabId] = useState('legal');
  const currentCase = USE_CASES_DATA.find((c) => c.id === activeTabId) || USE_CASES_DATA[0];

  return (
    <section id="use-cases" className="py-28 px-6 sm:px-8 bg-paper-tint/40 paper-grain border-b border-ink/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-loose-mono text-gray-mid border border-ink/15 px-2.5 py-0.5 rounded-full">
              Field Applications
            </span>
            <span className="text-ink/30 font-mono text-[11px]">—</span>
            <span className="text-ink/60 font-mono text-[11px]">Domain-specific rigor</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-ink font-normal tracking-editorial">
            Engineered for high-stakes precision.
          </h2>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-4 mb-10 overflow-x-auto">
          {USE_CASES_DATA.map((item) => {
            const isActive = item.id === activeTabId;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTabId(item.id)}
                className={`px-4 py-2 text-[13px] font-mono uppercase tracking-wider rounded-sharp border transition-all ${
                  isActive
                    ? 'bg-ink text-paper border-ink font-medium shadow-xs'
                    : 'bg-paper text-ink/70 border-ink/10 hover:border-ink/30 hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug">
              {currentCase.title}
            </h3>
            <p className="font-sans text-[15px] text-ink/70 leading-relaxed font-light">
              {currentCase.description}
            </p>
          </div>

          {/* Before & After Interactive Comparison */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Raw Input Card */}
            <div className="bg-paper p-5 rounded-sharp border border-ink/15 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-gray-mid uppercase tracking-widest pb-2 border-b border-ink/10 mb-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-mid" />
                    {currentCase.before.tag}
                  </span>
                  <span>RAW_FILE</span>
                </div>
                <p className="font-mono text-[12px] font-medium text-ink mb-2 truncate">
                  {currentCase.before.title}
                </p>
                <p className="font-sans text-[12px] text-ink/70 leading-relaxed italic bg-paper-tint/50 p-3 rounded-sharp border border-ink/5">
                  "{currentCase.before.text}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-ink/5 flex items-center gap-1.5 font-mono text-[10px] text-gray-mid">
                <span>Unstructured dense syntax</span>
              </div>
            </div>

            {/* Agent Extraction Card */}
            <div className="bg-paper p-5 rounded-sharp border border-amber-accent/50 ring-1 ring-amber-accent/30 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-amber-accent uppercase tracking-widest pb-2 border-b border-ink/10 mb-3">
                  <span className="flex items-center gap-1.5 text-ink font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-accent" />
                    {currentCase.after.tag}
                  </span>
                  <span className="text-ink">SYNTHESIS</span>
                </div>
                <p className="font-mono text-[12px] font-medium text-ink mb-2">
                  {currentCase.after.title}
                </p>
                <div className="font-sans text-[12px] text-ink leading-relaxed whitespace-pre-line bg-amber-accent/5 p-3 rounded-sharp border border-amber-accent/20">
                  {currentCase.after.text}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between font-mono text-[10px] text-emerald-700">
                <span>✓ Verified against original corpus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

