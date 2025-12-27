import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, AlertCircle, Check } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface JWTDecoderPageProps {
  onBack: () => void;
}

export default function JWTDecoderPage({ onBack }: JWTDecoderPageProps) {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<object | null>(null);
  const [payload, setPayload] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setError(null);
      return;
    }

    try {
      const decodedPayload = jwtDecode(token);
      const decodedHeader = jwtDecode(token, { header: true });
      
      setPayload(decodedPayload as object);
      setHeader(decodedHeader as object);
      setError(null);
    } catch (err) {
      setError('Invalid JWT Token format');
      setHeader(null);
      setPayload(null);
    }
  }, [token]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const JSONDisplay = ({ data, title }: { data: object; title: string }) => (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-hover/50 border-b border-border">
        <h3 className="font-medium text-text-primary">{title}</h3>
        <button
          onClick={() => copyToClipboard(JSON.stringify(data, null, 2), title)}
          className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 text-xs"
        >
          {copied === title ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm bg-background/50">
        <code className="text-text-primary">
          {JSON.stringify(data, null, 2)}
        </code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h1 className="text-xl font-semibold text-text-primary mb-1">
              JWT Decoder
            </h1>
            <p className="text-sm text-text-secondary mb-6">
              Decode and inspect JSON Web Tokens securely (client-side only)
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Encoded Token
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                className="w-full h-32 bg-background border border-border rounded-md p-4 text-text-primary font-mono text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y"
                spellCheck={false}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {(header || payload) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {header && <JSONDisplay data={header} title="Header" />}
                {payload && <JSONDisplay data={payload} title="Payload" />}
              </div>
              
              <div className="space-y-6">
                <div className="bg-surface border border-border rounded-lg p-6">
                  <h3 className="font-medium text-text-primary mb-4">Token Info</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-text-secondary">Algorithm</dt>
                      <dd className="font-mono text-text-primary">{(header as any)?.alg || 'Unknown'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-text-secondary">Type</dt>
                      <dd className="font-mono text-text-primary">{(header as any)?.typ || 'JWT'}</dd>
                    </div>
                    {(payload as any)?.exp && (
                      <div className="flex justify-between">
                        <dt className="text-text-secondary">Expires</dt>
                        <dd className="text-text-primary text-right">
                          {new Date((payload as any).exp * 1000).toLocaleString()}
                        </dd>
                      </div>
                    )}
                    {(payload as any)?.iat && (
                      <div className="flex justify-between">
                        <dt className="text-text-secondary">Issued At</dt>
                        <dd className="text-text-primary text-right">
                          {new Date((payload as any).iat * 1000).toLocaleString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
