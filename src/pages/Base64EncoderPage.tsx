import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Trash2, ArrowRightLeft, Check, AlertCircle } from 'lucide-react';

interface Base64EncoderPageProps {
  onBack: () => void;
}

type Mode = 'encode' | 'decode';

export default function Base64EncoderPage({ onBack }: Base64EncoderPageProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (err) {
      setError('Invalid Base64 string');
      setOutput('');
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    setInput(output);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold mb-1">Base64 Encoder / Decoder</h1>
              <p className="text-sm text-text-secondary">
                {mode === 'encode' ? 'Encode text to Base64' : 'Decode Base64 strings'}
              </p>
            </div>
            
            <button
              onClick={toggleMode}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-hover border border-border rounded-md text-sm font-medium hover:bg-surface-active transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Switch to {mode === 'encode' ? 'Decode' : 'Encode'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                </label>
                <button
                  onClick={clearAll}
                  className="text-xs text-text-secondary hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text here...' : 'Enter Base64 string here...'}
                className="w-full h-32 bg-background border border-border rounded-md p-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y font-mono"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  Result
                </label>
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="text-xs text-accent hover:text-accent-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Result
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={output}
                placeholder="Result will appear here..."
                className="w-full h-32 bg-surface-hover/50 border border-border rounded-md p-4 text-sm resize-y font-mono text-text-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
