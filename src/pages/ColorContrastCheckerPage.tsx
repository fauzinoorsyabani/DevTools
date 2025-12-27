import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRightLeft, Check, X } from 'lucide-react';
import { getContrastRatio, getWCAGScore } from '../utils/colorUtils';

interface ColorContrastCheckerPageProps {
  onBack: () => void;
}

export default function ColorContrastCheckerPage({ onBack }: ColorContrastCheckerPageProps) {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');

  const contrastRatio = useMemo(() => {
    return getContrastRatio(foreground, background);
  }, [foreground, background]);

  const scores = useMemo(() => {
    return getWCAGScore(contrastRatio);
  }, [contrastRatio]);

  const handleSwap = () => {
    setForeground(background);
    setBackground(foreground);
  };

  const ScoreCard = ({ label, pass }: { label: string; pass: boolean }) => (
    <div className={`p-4 rounded-lg border ${pass ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-center justify-between`}>
      <span className="text-text-primary font-medium">{label}</span>
      <div className={`flex items-center gap-2 ${pass ? 'text-green-500' : 'text-red-500'}`}>
        {pass ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        <span className="font-semibold">{pass ? 'Pass' : 'Fail'}</span>
      </div>
    </div>
  );

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Color Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Foreground Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
                      className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm uppercase"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSwap}
                    className="p-2 rounded-full hover:bg-surface-hover border border-border transition-colors"
                    title="Swap Colors"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">Background Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="text-center">
                <p className="text-text-secondary mb-2">Contrast Ratio</p>
                <div className="text-5xl font-bold mb-2">
                  {contrastRatio.toFixed(2)}:1
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  scores.aaNormal ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {scores.aaaNormal ? 'Excellent' : scores.aaNormal ? 'Good' : 'Poor'}
                </div>
              </div>
            </div>
          </div>

          {/* Results & Preview */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Compliance Score</h2>
              <div className="space-y-3">
                <ScoreCard label="AA - Normal Text" pass={scores.aaNormal} />
                <ScoreCard label="AA - Large Text" pass={scores.aaLarge} />
                <ScoreCard label="AAA - Normal Text" pass={scores.aaaNormal} />
                <ScoreCard label="AAA - Large Text" pass={scores.aaaLarge} />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Preview</h2>
              <div 
                className="p-8 rounded-lg border border-border transition-colors"
                style={{ backgroundColor: background, color: foreground }}
              >
                <h3 className="text-2xl font-bold mb-2">Large Heading Text</h3>
                <p className="opacity-90">
                  This is readable body text. The quick brown fox jumps over the lazy dog.
                  Use this preview to judge legibility in context.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
