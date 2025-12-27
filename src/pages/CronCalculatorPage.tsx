import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertCircle, Calendar } from 'lucide-react';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';

interface CronCalculatorPageProps {
  onBack: () => void;
}

const PRESETS = [
  { label: 'Every Minute', value: '* * * * *' },
  { label: 'Every 5 Minutes', value: '*/5 * * * *' },
  { label: 'Hourly', value: '0 * * * *' },
  { label: 'Daily', value: '0 0 * * *' },
  { label: 'Weekly', value: '0 0 * * 0' },
  { label: 'Monthly', value: '0 0 1 * *' },
];

export default function CronCalculatorPage({ onBack }: CronCalculatorPageProps) {
  const [expression, setExpression] = useState('*/5 * * * *');
  const [description, setDescription] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expression.trim()) {
      setDescription('');
      setNextRuns([]);
      setError(null);
      return;
    }

    try {
      // Get human readable description
      const desc = cronstrue.toString(expression);
      setDescription(desc);

      // Calculate next 5 runs
      const interval = (parser as any).parseExpression(expression);
      const runs = [];
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toString());
      }
      setNextRuns(runs);
      setError(null);
    } catch (err) {
      setError('Invalid cron expression');
      setDescription('');
      setNextRuns([]);
    }
  }, [expression]);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h1 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Cron Calculator
              </h1>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Cron Expression
                  </label>
                  <input
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-4 py-3 text-lg font-mono focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                    placeholder="* * * * *"
                  />
                </div>

                {error ? (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                ) : description ? (
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-md">
                    <p className="text-lg font-medium text-accent">
                      "{description}"
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Next Scheduled Dates */}
            {nextRuns.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-text-secondary" />
                  Next Scheduled Dates
                </h2>
                <div className="space-y-2">
                  {nextRuns.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background rounded-md border border-border/50"
                    >
                      <span className="text-sm font-mono text-text-secondary">
                        {index + 1}.
                      </span>
                      <span className="font-medium text-text-primary">
                        {new Date(date).toLocaleString()}
                      </span>
                      <span className="text-xs text-text-secondary">
                         ({Object.keys(PRESETS).find(k => PRESETS[k as any]?.value === expression) ? 'Preset' : 'Custom'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Presets */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                Quick Presets
              </h3>
              <div className="space-y-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setExpression(preset.value)}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm transition-colors border ${
                      expression === preset.value
                        ? 'bg-accent text-white border-accent'
                        : 'bg-background hover:bg-surface-hover border-border text-text-primary'
                    }`}
                  >
                    <div className="font-medium">{preset.label}</div>
                    <div className={`text-xs mt-1 font-mono ${
                      expression === preset.value ? 'text-white/80' : 'text-text-secondary'
                    }`}>
                      {preset.value}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
