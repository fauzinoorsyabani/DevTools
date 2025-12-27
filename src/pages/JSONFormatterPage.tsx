import { useState } from 'react';
import { ArrowLeft, Copy, Check, AlertCircle, Minimize2, Maximize2 } from 'lucide-react';

interface JSONFormatterPageProps {
  onBack: () => void;
}

export default function JSONFormatterPage({ onBack }: JSONFormatterPageProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    if (!input.trim()) {
      setError('Please enter JSON to format');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) {
      setError('Please enter JSON to minify');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
              <h1 className="text-xl font-semibold mb-1">JSON Formatter</h1>
              <p className="text-sm text-text-secondary">Format, validate, and minify JSON data</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-text-secondary">Indent:</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="bg-background border border-border rounded px-2 py-1 text-xs"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>
              
              <button
                onClick={formatJSON}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                Format
              </button>
              
              <button
                onClick={minifyJSON}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-hover border border-border rounded-md text-sm font-medium hover:bg-surface-active transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
                Minify
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Input JSON</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"example": "Paste your JSON here..."}'
                className="w-full h-96 bg-background border border-border rounded-md p-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y font-mono"
                spellCheck={false}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">Output</label>
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
                      Copy
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={output}
                placeholder="Formatted JSON will appear here..."
                className="w-full h-96 bg-surface-hover/50 border border-border rounded-md p-4 text-sm resize-y font-mono text-text-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
