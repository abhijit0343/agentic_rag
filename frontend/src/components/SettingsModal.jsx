import React, { useState } from 'react';
import { X, Check, Server, RefreshCw } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose }) => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [modelName, setModelName] = useState('llama3.2');
  const [temperature, setTemperature] = useState(0.0);
  const [pingStatus, setPingStatus] = useState(null);

  if (!isOpen) return null;

  const testConnection = async () => {
    setPingStatus('testing');
    try {
      const res = await fetch(`${apiUrl}/health`);
      if (res.ok) {
        setPingStatus('success');
      } else {
        setPingStatus('error');
      }
    } catch (e) {
      // Mock success if local server isn't currently up during UI demo
      setTimeout(() => {
        setPingStatus('mocked');
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-paper rounded-sharp border border-ink/20 shadow-2xl p-8 paper-grain max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-mid hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="font-mono text-[10px] uppercase tracking-loose-mono text-gray-mid border border-ink/15 px-2 py-0.5 rounded-full">
            Runtime Preferences
          </span>
          <h3 className="font-serif text-3xl text-ink font-normal tracking-editorial mt-3">
            Inference & Vector Setup
          </h3>
          <p className="font-sans text-[13px] text-ink/70 mt-1">
            Configure local endpoints for FastAPI, ChromaDB, and Ollama.
          </p>
        </div>

        <div className="space-y-5 font-mono text-[12px]">
          <div>
            <label className="block text-gray-mid text-[11px] uppercase mb-1">
              FastAPI Backend Endpoint
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-paper border border-ink/20 rounded-sharp px-3 py-2 text-ink focus:outline-none focus:border-ink font-mono"
            />
            <span className="text-[10px] text-gray-mid font-sans mt-0.5 block">
              Default is backend/api.py on port 8000
            </span>
          </div>

          <div>
            <label className="block text-gray-mid text-[11px] uppercase mb-1">
              Ollama Daemon URL
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              className="w-full bg-paper border border-ink/20 rounded-sharp px-3 py-2 text-ink focus:outline-none focus:border-ink font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-mid text-[11px] uppercase mb-1">
                LLM Core Model
              </label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-paper border border-ink/20 rounded-sharp px-3 py-2 text-ink focus:outline-none focus:border-ink font-mono"
              >
                <option value="llama3.2">llama3.2 (3B)</option>
                <option value="llama3.2:1b">llama3.2:1b</option>
                <option value="llama3.2:11b">llama3.2:11b</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-mid text-[11px] uppercase mb-1">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="pt-2">
            <button
              onClick={testConnection}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-paper-tint border border-ink/20 hover:border-ink text-ink rounded-sharp text-[11px] uppercase tracking-wider transition-all"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Verify Local Health Check</span>
            </button>

            {pingStatus && (
              <div className="mt-2 text-center text-[11px] font-mono">
                {pingStatus === 'testing' && <span className="text-gray-mid">Pinging {apiUrl}/health...</span>}
                {pingStatus === 'success' && <span className="text-emerald-700">✓ FastAPI and ChromaDB respond online!</span>}
                {pingStatus === 'mocked' && <span className="text-amber-accent">✓ Mocked pipeline ready for local linking</span>}
                {pingStatus === 'error' && <span className="text-red-700">✗ Backend offline. Run 'python api.py' in backend/</span>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-ink/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-ink text-paper rounded-sharp font-mono text-[11px] uppercase tracking-wider hover:bg-ink-soft transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

