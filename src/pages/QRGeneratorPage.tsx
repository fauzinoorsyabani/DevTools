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
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/qr-generator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ text: inputText }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrImage(data.qr);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-orange-900/20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-400 mb-8">
            Generate QR codes from text or URLs instantly
          </p>

          <div className="space-y-4 mb-8">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError('');
              }}
              placeholder="Enter text or URL..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <button
              onClick={generateQR}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </button>

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>

          {qrImage && (
            <div className="bg-gray-700/20 rounded-lg p-8 flex flex-col items-center gap-6">
              <img src={qrImage} alt="Generated QR Code" className="w-64 h-64" />
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 px-6 py-2 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
