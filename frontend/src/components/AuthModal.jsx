import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-paper rounded-sharp border border-ink/20 shadow-2xl p-8 paper-grain">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-mid hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="font-mono text-[10px] uppercase tracking-loose-mono text-gray-mid border border-ink/15 px-2 py-0.5 rounded-full">
            Session Authentication
          </span>
          <h3 className="font-serif text-3xl text-ink font-normal tracking-editorial mt-3">
            {isSignUp ? 'Create your workspace.' : 'Welcome back to Karta.'}
          </h3>
          <p className="font-sans text-[13px] text-ink/70 mt-1">
            Access past multi-file archives and custom prompts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-gray-mid mb-1">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="counsel@chambers.com"
              className="w-full bg-paper border border-ink/20 rounded-sharp px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink transition-all font-sans"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-gray-mid mb-1">
              Passphrase
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-paper border border-ink/20 rounded-sharp px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink transition-all font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-ink text-paper rounded-sharp font-mono text-[12px] uppercase tracking-wider hover:bg-ink-soft transition-all flex items-center justify-center gap-2 font-medium"
          >
            <span>{submitted ? 'Authenticating...' : isSignUp ? 'Generate Key' : 'Enter Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-ink/10 text-center font-mono text-[11px] text-gray-mid">
          {isSignUp ? (
            <span>
              Already possess credentials?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-ink underline hover:opacity-80"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              New to Karta?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-ink underline hover:opacity-80"
              >
                Create complimentary account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

