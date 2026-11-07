import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const NotFoundView = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 paper-grain">
      <div className="max-w-md text-center space-y-6">
        <span className="font-mono text-[11px] uppercase tracking-loose-mono text-gray-mid border border-ink/15 px-2.5 py-0.5 rounded-full">
          Error 404 — Document Missing
        </span>
        <h1 className="font-serif text-6xl text-ink font-normal tracking-editorial">
          Untracked Corridor.
        </h1>
        <p className="font-sans text-[14px] text-ink/70 font-light leading-relaxed">
          The requested analytical record or route has either been purged under automated data retention or never existed in the local corpus index.
        </p>
        <div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-sharp font-mono text-[12px] uppercase tracking-wider hover:bg-ink-soft transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Index</span>
          </button>
        </div>
      </div>
    </div>
  );
};

