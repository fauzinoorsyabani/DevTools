import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Trash2, ArrowRightLeft, Check, AlertCircle } from 'lucide-react';
import ExplainModePanel from '../components/ExplainModePanel';
import InfoPanel from '../components/InfoPanel';

interface Base64EncoderPageProps {
  onBack: () => void;
}

type Mode = 'encode' | 'decode';

const TOOL_METADATA = {
  usedBy: ['Frontend', 'Backend', 'API Development'],
  securityNote: 'Base64 is encoding, NOT encryption. Never use it to hide sensitive data.',
  productionTip: 'Consider using Base64URL for URLs and filenames (replaces + and / with - and _).',
};

const EXAMPLES = {
  encode: 'Hello, World! 🌍',
  decode: 'SGVsbG8sIFdvcmxkISDwn4yN',
};

export default function Base64EncoderPage({ onBack }: Base64EncoderPageProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setError(null);
    setErrorHint(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        // Check for invalid characters
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(input)) {
          throw new Error('invalid_chars');
        }
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (err: any) {
      if (err.message === 'invalid_chars') {
        setError('Invalid Base64 characters');
        setErrorHint('Base64 only allows A-Z, a-z, 0-9, +, /, and = (for padding). Check for spaces or special characters.');
      } else {
        setError('Invalid Base64 string');
        setErrorHint('The string length must be a multiple of 4. Try adding = padding at the end.');
      }
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
    setErrorHint(null);
  };

  const useExample = () => {
    setInput(EXAMPLES[mode]);
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
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold mb-1">Base64 Encoder / Decoder</h1>
              <p className="text-sm text-text-secondary">
                {mode === 'encode' ? 'Encode text to Base64' : 'Decode Base64 strings'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <InfoPanel metadata={TOOL_METADATA} />
              </div>
              <button
                onClick={toggleMode}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-hover border border-border rounded-md text-sm font-medium hover:bg-surface-active transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Switch to {mode === 'encode' ? 'Decode' : 'Encode'}</span>
              </button>
            </div>
          </div>

          {/* Explain Mode */}
          <div className="mb-6">
            <ExplainModePanel title="What is Base64? Learn when to use it">
              <div className="space-y-3">
                <p>
                  <strong className="text-text-primary">Base64</strong> is an encoding scheme that converts binary data into ASCII text using 64 printable characters.
                </p>
                <div>
                  <strong className="text-text-primary">Common Use Cases:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>Data URIs</strong> - Embed images directly in HTML/CSS</li>
                    <li><strong>Email attachments</strong> - MIME encoding for binary files</li>
                    <li><strong>API payloads</strong> - Safely transmit binary in JSON</li>
                    <li><strong>Basic Auth</strong> - Encode username:password</li>
                  </ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-amber-600 dark:text-amber-400">
                  ⚠️ <strong>Important:</strong> Base64 is NOT encryption! Anyone can decode it. Never use it to "hide" sensitive data.
                </div>
              </div>
            </ExplainModePanel>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">
                  {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                </label>
                <div className="flex items-center gap-3">
                  {!input && (
                    <button
                      onClick={useExample}
                      className="text-xs text-accent hover:text-accent-hover transition-colors"
                    >
                      Try example
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-text-secondary hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text here...' : 'Enter Base64 string here...'}
                className="w-full h-32 bg-background border border-border rounded-md p-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y font-mono"
              />
              
              {/* Empty state hint */}
              {!input && (
                <div className="flex items-center gap-2 text-text-secondary text-xs bg-surface-hover/50 p-3 rounded-md border border-border/50">
                  <span>💡</span>
                  <span>
                    {mode === 'encode' 
                      ? 'Enter any text including emojis and special characters to encode.'
                      : 'Paste a Base64 string to decode. Valid characters: A-Z, a-z, 0-9, +, /, ='}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced error with hint */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-md space-y-1">
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{error}</span>
                </div>
                {errorHint && (
                  <p className="text-red-400/80 text-xs pl-6">{errorHint}</p>
                )}
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
