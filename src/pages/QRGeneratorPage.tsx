import { useState } from 'react';
import { ArrowLeft, Download, Loader } from 'lucide-react';

interface QRGeneratorPageProps {
  onBack: () => void;
}

export default function QRGeneratorPage({ onBack }: QRGeneratorPageProps) {
  const [inputText, setInputText] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQR = async () => {
    if (!inputText.trim()) {
      setError('Please enter text or URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setQrImage(null);

    try {
      // Generate QR code directly using free QR code API
      const encodedText = encodeURIComponent(inputText.trim());
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
      
      // Verify the QR code URL is accessible
      const response = await fetch(qrUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }
      
      setQrImage(qrUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = async () => {
    if (!qrImage) return;

    try {
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download QR code');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            QR Code Generator
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Generate QR codes from text or URLs instantly
          </p>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError('');
              }}
              placeholder="Enter text or URL..."
              className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />

            <button
              onClick={generateQR}
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </button>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </div>

          {qrImage && (
            <div className="bg-background border border-border rounded-md p-6 flex flex-col items-center gap-4">
              <div className="bg-white p-3 rounded-md">
                <img src={qrImage} alt="Generated QR Code" className="w-48 h-48" />
              </div>
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 border border-border hover:bg-surface-hover text-text-primary px-4 py-2 rounded-md transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
