import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, Check, RefreshCw } from 'lucide-react';

export const SecuritySection = () => {
  const [purged, setPurged] = useState(false);
  const [retentionDays, setRetentionDays] = useState(7);

  const handlePurge = () => {
    setPurged(true);
    setTimeout(() => setPurged(false), 3000);
  };

  return (
    <section id="security" className="py-28 px-6 sm:px-8 bg-ink-deep text-paper paper-grain-dark radial-vignette border-b border-paper/10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-loose-mono text-amber-accent border border-amber-accent/30 px-2.5 py-0.5 rounded-full">
              Trust & Data Governance
            </span>
            <span className="text-paper/30 font-mono text-[11px]">—</span>
            <span className="text-paper/60 font-mono text-[11px]">Sovereign execution</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-paper font-normal tracking-editorial">
            Your documents belong to you.
            <br />
            <span className="text-paper/60 italic font-light">Never used for training.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Plain Language Guarantees */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl text-paper font-normal">
                Air-tight encryption in transit and at rest
              </h3>
              <p className="font-sans text-[14px] text-paper/70 leading-relaxed font-light">
                All payloads are encrypted with AES-256 at rest and TLS 1.3 in transit. Document vectors in ChromaDB are segregated by session token and cryptographic user boundaries.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl text-paper font-normal">
                Strict Zero-Training Pledge
              </h3>
              <p className="font-sans text-[14px] text-paper/70 leading-relaxed font-light">
                Neither your raw files, generated text fragments, nor embeddings will ever be used to fine-tune or train foundation models. When run with local Ollama, not a single byte leaves your localhost.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl text-paper font-normal">
                Automated TTL Expiration
              </h3>
              <p className="font-sans text-[14px] text-paper/70 leading-relaxed font-light">
                Every uploaded batch carries an automatic time-to-live policy. Once expired, Chroma indices, vector graphs, and cached session logs are hard deleted.
              </p>
            </div>
          </div>

          {/* Interactive Delete-My-Data Control Mockup */}
          <div className="lg:col-span-5 bg-paper/[0.04] border border-paper/15 rounded-sharp p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-paper/10 mb-5">
              <span className="font-mono text-[11px] uppercase tracking-loose-mono text-paper/80">
                Data Sovereignty Controls
              </span>
              <span className="font-mono text-[10px] text-amber-accent">
                SESSION_EPHEMERAL
              </span>
            </div>

            <div className="space-y-4 font-mono text-[12px]">
              <div>
                <label className="text-paper/60 text-[11px] block mb-1.5 uppercase">
                  Automatic Purge Schedule:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 7, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setRetentionDays(d)}
                      className={`py-2 px-3 rounded-sharp border text-center transition-all ${
                        retentionDays === d
                          ? 'border-amber-accent bg-paper/10 text-paper font-medium'
                          : 'border-paper/10 text-paper/50 hover:border-paper/30 hover:text-paper'
                      }`}
                    >
                      {d} Day{d > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-paper/[0.02] border border-paper/10 rounded-sharp text-[11px] text-paper/70 font-sans">
                Stored records will automatically be purged after {retentionDays} day{retentionDays > 1 ? 's' : ''} unless manually removed prior.
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePurge}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/30 hover:bg-red-950/50 text-red-200 border border-red-500/30 rounded-sharp uppercase tracking-wider text-[11px] transition-all"
                >
                  {purged ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-red-400" />
                      <span>All Vectors Purged</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge All Active Corpora Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

