import { useState } from 'react';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';

interface UUIDGeneratorPageProps {
  onBack: () => void;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UUIDGeneratorPage({ onBack }: UUIDGeneratorPageProps) {
  const [uuids, setUuids] = useState<string[]>(() => [generateUUID()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuids(newUuids);
  };

  const formatUUID = (uuid: string): string => {
    let formatted = uuid;
    if (noDashes) {
      formatted = formatted.replace(/-/g, '');
    }
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    return formatted;
  };

  const copyToClipboard = (uuid: string) => {
    navigator.clipboard.writeText(formatUUID(uuid));
    setCopied(uuid);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    const allUuids = uuids.map(formatUUID).join('\n');
    navigator.clipboard.writeText(allUuids);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-1">UUID Generator</h1>
          <p className="text-sm text-text-secondary mb-6">Generate universally unique identifiers (UUID v4)</p>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">Count:</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 bg-surface border border-border rounded px-2 py-1 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-text-secondary">Uppercase</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={noDashes}
                onChange={(e) => setNoDashes(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-text-secondary">No dashes</span>
            </label>

            <div className="flex-1" />

            <button
              onClick={generate}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Generate
            </button>
          </div>

          {/* UUIDs List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">{uuids.length} UUID(s)</span>
              {uuids.length > 1 && (
                <button
                  onClick={copyAll}
                  className="text-xs text-accent hover:text-accent-hover flex items-center gap-1"
                >
                  {copied === 'all' ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied all!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy all
                    </>
                  )}
                </button>
              )}
            </div>

            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background rounded-md border border-border group"
              >
                <code className="font-mono text-sm text-text-primary">
                  {formatUUID(uuid)}
                </code>
                <button
                  onClick={() => copyToClipboard(uuid)}
                  className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-accent transition-all flex items-center gap-1 text-xs"
                >
                  {copied === uuid ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
