import React from 'react';
import { Layers, Compass, CheckCircle2 } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Deposit any arbitrary format',
      subtitle: 'Native parsing beyond flat text layers',
      body: 'Upload contracts, balance sheets, pitch decks, scans, or zip archives. Karta parses tabular columns, slide hierarchies, and scanned pages with direct layout preservation.',
      fragment: (
        <div className="p-4 bg-paper rounded-sharp border border-ink/15 text-[11px] font-mono space-y-2">
          <div className="flex items-center justify-between text-gray-mid pb-1 border-b border-ink/10">
            <span>INSPECTION_BUFFER</span>
            <span>MMR_READY</span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>PDF: 42 pages parsed (14,280 tokens)</span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>XLSX: 8 sheets reconciled</span>
          </div>
          <div className="flex items-center gap-2 text-gray-mid">
            <span className="w-2 h-2 rounded-full bg-amber-accent" />
            <span>PPTX: 19 slides vector-embedded</span>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      title: 'Autonomous multi-step reasoning',
      subtitle: 'Deterministic planning before formulation',
      body: 'Instead of hallucinating on a single prompt, the agent plans distinct execution phases: parsing, cross-referencing, calculating financial deltas, and stress-testing clauses.',
      fragment: (
        <div className="p-4 bg-paper rounded-sharp border border-ink/15 text-[11px] font-mono space-y-2.5">
          <div className="flex items-center justify-between text-gray-mid pb-1 border-b border-ink/10">
            <span>AGENT_PLAN_GRAPH</span>
            <span>STEP 03/04</span>
          </div>
          <div className="text-ink font-sans font-medium">
            → Cross-checking §14.2 against FY25 Cloud OpEx
          </div>
          <div className="h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-accent w-3/4" />
          </div>
          <div className="text-gray-mid text-[10px]">
            Variance detection threshold: 0.05%
          </div>
        </div>
      ),
    },
    {
      num: '03',
      title: 'Audited output with page citations',
      subtitle: 'Verifiable claims with thumbnail verification',
      body: 'Every conclusion rendered in the final brief links directly to an indexed page number and exact snippet. Export clean deliverables to Markdown, Word, PDF, or CSV tables.',
      fragment: (
        <div className="p-4 bg-paper rounded-sharp border border-ink/15 text-[11px] font-mono space-y-2">
          <div className="flex items-center justify-between text-gray-mid pb-1 border-b border-ink/10">
            <span>SYNTHESIS_EXPORT</span>
            <span>CITATIONS_VERIFIED</span>
          </div>
          <div className="p-2 bg-paper-tint rounded-sharp border border-ink/10 text-ink/90 font-sans text-[12px]">
            "...liability ceiling capped at 12 months billings <span className="text-amber-accent font-mono font-bold">[1]</span>."
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-mid pt-1">
            <span>Source: Master_Agreement.pdf (p.14)</span>
            <span className="text-emerald-700">✓ 100% Match</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-28 px-6 sm:px-8 bg-paper paper-grain border-b border-ink/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-loose-mono text-gray-mid border border-ink/15 px-2.5 py-0.5 rounded-full">
              System Architecture
            </span>
            <span className="text-ink/30 font-mono text-[11px]">—</span>
            <span className="text-ink/60 font-mono text-[11px]">Three-phase execution engine</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-ink font-normal tracking-editorial max-w-2xl">
            How Karta reads, reasons, and executes.
          </h2>
        </div>

        {/* Asymmetric Staggered Rows */}
        <div className="space-y-20">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-2">
                <span className="font-serif text-7xl sm:text-8xl text-ink/15 font-light leading-none select-none">
                  {s.num}
                </span>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-loose-mono text-gray-mid block">
                  {s.subtitle}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug">
                  {s.title}
                </h3>
                <p className="font-sans text-[14px] sm:text-[15px] text-ink/70 leading-relaxed font-light">
                  {s.body}
                </p>
              </div>

              <div className="lg:col-span-5 bg-paper-tint/70 p-6 rounded-sharp border border-ink/10 shadow-xs">
                {s.fragment}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

