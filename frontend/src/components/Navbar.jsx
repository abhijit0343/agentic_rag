import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Navbar = ({
  onOpenSignIn,
  onOpenSettings,
  onOpenHistory,
  onNavigateHome,
  activeView,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/85 backdrop-blur-md border-b border-ink/10 py-3 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-8">
          <button
            onClick={onNavigateHome}
            className="group text-left flex items-baseline gap-2 focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl font-normal tracking-editorial text-ink">
              KARTA
            </span>
            <span className="font-mono text-[9px] uppercase tracking-loose-mono text-gray-mid">
              v2.4
            </span>
          </button>

          {/* Editorial Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] tracking-wide text-ink/75 font-normal">
            <a
              href="#how-it-works"
              className="hover:text-ink transition-colors duration-150"
            >
              How it works
            </a>
            <a
              href="#use-cases"
              className="hover:text-ink transition-colors duration-150"
            >
              Applications
            </a>
            <a
              href="#security"
              className="hover:text-ink transition-colors duration-150"
            >
              Privacy & Trust
            </a>
            <a
              href="#pricing"
              className="hover:text-ink transition-colors duration-150"
            >
              Editions
            </a>
            <button
              onClick={onOpenHistory}
              className={`hover:text-ink transition-colors duration-150 ${
                activeView === 'history' ? 'text-ink font-medium underline underline-offset-4' : ''
              }`}
            >
              Archive
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenSettings}
            className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-loose-mono text-gray-mid hover:text-ink transition-colors"
          >
            Preferences
          </button>

          <button
            onClick={onOpenSignIn}
            className="text-[13px] text-ink/80 hover:text-ink tracking-normal font-normal transition-colors"
          >
            Sign in
          </button>

          <button
            onClick={() => {
              const uploadElement = document.getElementById('hero-dropzone');
              if (uploadElement) {
                uploadElement.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigateHome();
              }
            }}
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 text-[12px] uppercase font-mono tracking-wider bg-ink text-paper rounded-sharp border border-ink hover:bg-ink-soft transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-1 focus:ring-amber-accent"
          >
            <span>Start Session</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-paper/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

