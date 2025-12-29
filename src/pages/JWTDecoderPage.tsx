import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, AlertCircle, Check, Code, ChevronDown } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import ExplainModePanel from '../components/ExplainModePanel';
import InfoPanel from '../components/InfoPanel';

interface JWTDecoderPageProps {
  onBack: () => void;
}

const EXAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const TOOL_METADATA = {
  usedBy: ['Frontend', 'Backend', 'DevOps'],
  securityNote: 'Never share JWTs containing sensitive data. This tool runs client-side only.',
  productionTip: 'Always validate tokens server-side. Never trust client-decoded tokens for authorization.',
};

type CodeFormat = 'javascript' | 'python' | 'curl';

const generateCodeSnippet = (token: string, format: CodeFormat): string => {
  switch (format) {
    case 'javascript':
      return `// Using jsonwebtoken library
const jwt = require('jsonwebtoken');

const token = '${token}';
const decoded = jwt.decode(token);

console.log('Header:', jwt.decode(token, { complete: true })?.header);
console.log('Payload:', decoded);`;

    case 'python':
      return `# Using PyJWT library
import jwt

token = '${token}'
decoded = jwt.decode(token, options={"verify_signature": False})

print("Payload:", decoded)`;

    case 'curl':
      return `# Using the token in API requests
curl -X GET "https://api.example.com/protected" \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json"`;

    default:
      return '';
  }
};

export default function JWTDecoderPage({ onBack }: JWTDecoderPageProps) {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<object | null>(null);
  const [payload, setPayload] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setError(null);
      setErrorHint(null);
      return;
    }

    try {
      const decodedPayload = jwtDecode(token);
      const decodedHeader = jwtDecode(token, { header: true });
      
      setPayload(decodedPayload as object);
      setHeader(decodedHeader as object);
      setError(null);
      setErrorHint(null);
    } catch (err) {
      // Enhanced error messages with hints
      const parts = token.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format');
        setErrorHint(`JWT should have 3 parts separated by dots (header.payload.signature). Your input has ${parts.length} part${parts.length !== 1 ? 's' : ''}.`);
      } else {
        setError('Invalid JWT Token');
        setErrorHint('The token appears malformed. Check if the Base64 encoding is correct.');
      }
      setHeader(null);
      setPayload(null);
    }
  }, [token]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAsCode = (format: CodeFormat) => {
    const snippet = generateCodeSnippet(token, format);
    navigator.clipboard.writeText(snippet);
    setCopied(`code-${format}`);
    setShowCodeDropdown(false);
    setTimeout(() => setCopied(null), 2000);
  };

  const useExample = () => {
    setToken(EXAMPLE_TOKEN);
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
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-text-primary mb-1">
                  JWT Decoder
                </h1>
                <p className="text-sm text-text-secondary">
                  Decode and inspect JSON Web Tokens securely (client-side only)
                </p>
              </div>
              <div className="relative">
                <InfoPanel metadata={TOOL_METADATA} />
              </div>
            </div>

            {/* Explain Mode */}
            <div className="mb-6">
              <ExplainModePanel title="What is JWT? Learn the basics">
                <div className="space-y-3">
                  <p>
                    <strong className="text-text-primary">JSON Web Token (JWT)</strong> is a compact, URL-safe way of representing claims between two parties.
                  </p>
                  <div>
                    <strong className="text-text-primary">Structure:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li><span className="text-red-400 font-mono">Header</span> - Algorithm & token type</li>
                      <li><span className="text-purple-400 font-mono">Payload</span> - Claims (user data, expiry, etc.)</li>
                      <li><span className="text-blue-400 font-mono">Signature</span> - Verifies token integrity</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-text-primary">Common Use Cases:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Authentication & Authorization</li>
                      <li>API access tokens</li>
                      <li>Single Sign-On (SSO)</li>
                    </ul>
                  </div>
                </div>
              </ExplainModePanel>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">
                  Encoded Token
                </label>
                {!token && (
                  <button
                    onClick={useExample}
                    className="text-xs text-accent hover:text-accent-hover transition-colors"
                  >
                    Use example token
                  </button>
                )}
              </div>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                className="w-full h-32 bg-background border border-border rounded-md p-4 text-text-primary font-mono text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-y"
                spellCheck={false}
              />
              
              {/* Empty state hint */}
              {!token && (
                <div className="flex items-center gap-2 text-text-secondary text-xs bg-surface-hover/50 p-3 rounded-md border border-border/50">
                  <span>💡</span>
                  <span>Tip: Paste a JWT token or <button onClick={useExample} className="text-accent hover:underline">try an example</button> to see how it works.</span>
                </div>
              )}

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

                {/* Copy as Code Snippet */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <h3 className="font-medium text-text-primary mb-4 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Copy as Code
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowCodeDropdown(!showCodeDropdown)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-border rounded-md text-sm text-text-primary hover:bg-surface-hover transition-colors"
                    >
                      <span>Select format...</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCodeDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCodeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg overflow-hidden z-10">
                        {(['javascript', 'python', 'curl'] as CodeFormat[]).map((format) => (
                          <button
                            key={format}
                            onClick={() => copyAsCode(format)}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-text-primary hover:bg-surface-hover transition-colors border-b border-border/50 last:border-0"
                          >
                            <span className="capitalize">{format}</span>
                            {copied === `code-${format}` && (
                              <span className="text-green-500 text-xs flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Copied!
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-2">
                    Copy the token usage in your preferred language
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
