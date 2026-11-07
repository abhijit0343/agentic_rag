import React from 'react';
import { PRICING_TIERS } from '../data/mockData';
import { Check } from 'lucide-react';

export const PricingSection = ({ onSelectTier }) => {
  return (
    <section id="pricing" className="py-28 px-6 sm:px-8 bg-paper paper-grain border-b border-ink/10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-loose-mono text-gray-mid border border-ink/15 px-2.5 py-0.5 rounded-full">
              Transparent Editions
            </span>
            <span className="text-ink/30 font-mono text-[11px]">—</span>
            <span className="text-ink/60 font-mono text-[11px]">Fair, predictable access</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-ink font-normal tracking-editorial">
            Access calibrated to your workload.
          </h2>
        </div>

        {/* 3 Tiers Table Layout with Hairline Separators */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const isInverted = tier.inverted;

            return (
              <div
                key={tier.name}
                className={`p-8 rounded-sharp border flex flex-col justify-between transition-all duration-300 relative ${
                  isInverted
                    ? 'bg-ink text-paper border-ink shadow-2xl scale-[1.02]'
                    : 'bg-paper-tint/50 text-ink border-ink/15 shadow-xs'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-8">
                    <span className="font-mono text-[9px] uppercase tracking-loose-mono bg-amber-accent text-ink-deep font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {tier.highlight}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-loose-mono text-gray-mid">
                      {tier.name}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="font-serif text-4xl sm:text-5xl font-normal tracking-tight">
                      {tier.price}
                    </span>
                    <span className={`text-[12px] font-mono ml-2 ${isInverted ? 'text-paper/60' : 'text-gray-mid'}`}>
                      / {tier.cadence}
                    </span>
                  </div>

                  <p className={`font-sans text-[13px] leading-relaxed mb-6 font-light ${isInverted ? 'text-paper/70' : 'text-ink/70'}`}>
                    {tier.description}
                  </p>

                  <div className={`pt-6 border-t ${isInverted ? 'border-paper/15' : 'border-ink/10'} space-y-3`}>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gray-mid block mb-2">
                      Capabilities Included:
                    </span>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-[13px] font-sans">
                        <Check className={`w-3.5 h-3.5 mt-1 shrink-0 ${isInverted ? 'text-amber-accent' : 'text-ink'}`} />
                        <span className={isInverted ? 'text-paper/90' : 'text-ink/80'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hairline-ink">
                  <button
                    onClick={() => onSelectTier(tier.name)}
                    className={`w-full py-3 px-4 rounded-sharp font-mono text-[12px] uppercase tracking-wider text-center transition-all ${
                      isInverted
                        ? 'bg-paper text-ink hover:bg-paper-tint font-medium'
                        : 'bg-ink text-paper hover:bg-ink-soft'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

