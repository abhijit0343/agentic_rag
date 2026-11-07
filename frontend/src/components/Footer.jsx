import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-20 px-6 sm:px-8 bg-ink text-paper paper-grain-dark border-t border-paper/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-paper/10">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-3xl font-normal tracking-editorial text-paper block">
              KARTA
            </span>
            <p className="font-sans text-[13px] text-paper/60 font-light max-w-sm leading-relaxed">
              Quiet luxury in autonomous document intelligence. Designed for counsel, researchers, and financial auditors who require verified citations over ungrounded speculation.
            </p>
            <div className="font-mono text-[11px] text-paper/40 pt-2">
              HOSTED_LOCALLY • OLLAMA_LLAMA_3.2 • CHROMADB
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="md:col-span-2 space-y-3 font-mono text-[11px] uppercase tracking-wider text-paper/70">
            <span className="text-paper/40 block mb-2">Capabilities</span>
            <a href="#how-it-works" className="block hover:text-paper transition-colors">Vector MMR</a>
            <a href="#how-it-works" className="block hover:text-paper transition-colors">Multi-Sheet Table Parse</a>
            <a href="#how-it-works" className="block hover:text-paper transition-colors">Page Citations</a>
            <a href="#how-it-works" className="block hover:text-paper transition-colors">Export Engines</a>
          </div>

          {/* Nav Col 2 */}
          <div className="md:col-span-2 space-y-3 font-mono text-[11px] uppercase tracking-wider text-paper/70">
            <span className="text-paper/40 block mb-2">Governance</span>
            <a href="#security" className="block hover:text-paper transition-colors">Zero Retention</a>
            <a href="#security" className="block hover:text-paper transition-colors">AES-256 Storage</a>
            <a href="#security" className="block hover:text-paper transition-colors">On-Premises Hub</a>
            <a href="#security" className="block hover:text-paper transition-colors">Air-Gap Guide</a>
          </div>

          {/* Nav Col 3 */}
          <div className="md:col-span-3 space-y-3 font-mono text-[11px] uppercase tracking-wider text-paper/70">
            <span className="text-paper/40 block mb-2">Local Runtime</span>
            <div className="p-3 bg-paper/[0.04] rounded-sharp border border-paper/10 text-[10px] space-y-1">
              <div className="text-emerald-400">● FASTAPI BACKEND READY</div>
              <div className="text-paper/50">PORT: 8000 (OLLAMA :11434)</div>
            </div>
          </div>
        </div>

        {/* Large Faded Wordmark */}
        <div className="py-12 overflow-hidden select-none opacity-20 pointer-events-none">
          <span className="font-serif text-[18vw] leading-none text-paper/40 font-light tracking-tighter block text-center">
            KARTA
          </span>
        </div>

        {/* Small Print Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-paper/40">
          <span>© {new Date().getFullYear()} KARTA INTELLIGENCE LABS. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6">
            <span>NO COOKIE TRACKING</span>
            <span>REST API v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

