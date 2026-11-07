import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

export const FaqSection = ({ onStartFree }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-28 px-6 sm:px-8 bg-paper paper-grain border-b border-ink/10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-loose-mono text-gray-mid border border-ink/15 px-2.5 py-0.5 rounded-full">
              Inquiries & Clarifications
            </span>
            <span className="text-ink/30 font-mono text-[11px]">—</span>
            <span className="text-ink/60 font-mono text-[11px]">System details</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal tracking-editorial">
            Frequently answered questions.
          </h2>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none"
                >
                  <span className="font-serif text-xl sm:text-2xl text-ink font-normal group-hover:text-ink/80 transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8 animate-fade-in">
                    <p className="font-sans text-[14px] sm:text-[15px] text-ink/75 leading-relaxed font-light">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final CTA Band */}
        <div className="mt-24 p-8 sm:p-12 bg-ink-deep text-paper rounded-sharp paper-grain-dark radial-vignette border border-paper/15 text-center flex flex-col items-center justify-center space-y-6">
          <h3 className="font-serif text-3xl sm:text-5xl text-paper font-normal tracking-editorial max-w-xl">
            Give your complex documents to an agent built for precision.
          </h3>
          <p className="font-sans text-[14px] text-paper/70 font-light max-w-md">
            No long onboarding, no cloud lock-in. Test with your own files in under two minutes.
          </p>
          <button
            onClick={onStartFree}
            className="inline-flex items-center gap-2 px-6 py-3 bg-paper text-ink rounded-sharp font-mono text-[12px] uppercase tracking-wider hover:bg-paper-tint active:scale-[0.99] transition-all font-medium"
          >
            <span>Begin Free Session</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

