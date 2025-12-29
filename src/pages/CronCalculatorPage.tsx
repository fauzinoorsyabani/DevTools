import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertCircle, Calendar, HelpCircle } from 'lucide-react';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';
import ExplainModePanel from '../components/ExplainModePanel';
import InfoPanel from '../components/InfoPanel';

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

const CRON_FIELDS = [
  { name: 'Minute', range: '0-59', position: 1 },
  { name: 'Hour', range: '0-23', position: 2 },
  { name: 'Day of Month', range: '1-31', position: 3 },
  { name: 'Month', range: '1-12', position: 4 },
  { name: 'Day of Week', range: '0-6', position: 5 },
];

const TOOL_METADATA = {
  usedBy: ['Backend', 'DevOps', 'CI/CD'],
  securityNote: 'Ensure cron jobs run with minimal privileges. Avoid storing secrets in cron commands.',
  productionTip: 'Use descriptive comments in crontab. Monitor job execution with logging.',
};

export default function CronCalculatorPage({ onBack }: CronCalculatorPageProps) {
  const [expression, setExpression] = useState('*/5 * * * *');
  const [description, setDescription] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);

  useEffect(() => {
    if (!expression.trim()) {
      setDescription('');
      setNextRuns([]);
      setError(null);
      setErrorHint(null);
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
      setErrorHint(null);
    } catch (err) {
      // Enhanced error messages with hints
      const parts = expression.trim().split(/\s+/);
      if (parts.length === 6) {
        setError('Invalid cron expression');
        setErrorHint('You have 6 fields. Standard cron uses 5 fields (min hour day month weekday). Some systems like Quartz use 6 fields (with seconds). Try removing the first field.');
      } else if (parts.length < 5) {
        setError('Incomplete cron expression');
        setErrorHint(`Expected 5 fields but found ${parts.length}. Format: minute hour day-of-month month day-of-week`);
      } else if (parts.length > 6) {
        setError('Too many fields');
        setErrorHint(`Expected 5 fields but found ${parts.length}. Standard format: minute hour day-of-month month day-of-week`);
      } else {
        setError('Invalid cron expression');
        setErrorHint('Check each field value. Use * for any, */n for every n, or specific values separated by commas.');
      }
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
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Cron Calculator
                </h1>
                <div className="relative">
                  <InfoPanel metadata={TOOL_METADATA} />
                </div>
              </div>

              {/* Explain Mode */}
              <div className="mb-6">
                <ExplainModePanel title="How does cron work? Learn the syntax">
                  <div className="space-y-3">
                    <p>
                      <strong className="text-text-primary">Cron</strong> is a time-based job scheduler in Unix-like systems. It uses expressions to define when tasks should run.
                    </p>
                    <div>
                      <strong className="text-text-primary">Standard Format (5 fields):</strong>
                      <div className="mt-2 font-mono text-xs bg-background/50 p-3 rounded border border-border/50 overflow-x-auto">
                        <span className="text-green-400">┌───────────── minute (0-59)</span><br/>
                        <span className="text-green-400">│ ┌────────── hour (0-23)</span><br/>
                        <span className="text-green-400">│ │ ┌─────── day of month (1-31)</span><br/>
                        <span className="text-green-400">│ │ │ ┌──── month (1-12)</span><br/>
                        <span className="text-green-400">│ │ │ │ ┌── day of week (0-6, Sun=0)</span><br/>
                        <span className="text-text-primary">* * * * *</span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-text-primary">Special Characters:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                        <li><code className="text-accent">*</code> - any value</li>
                        <li><code className="text-accent">*/n</code> - every n units</li>
                        <li><code className="text-accent">a-b</code> - range from a to b</li>
                        <li><code className="text-accent">a,b,c</code> - specific values</li>
                      </ul>
                    </div>
                  </div>
                </ExplainModePanel>
              </div>

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

                {/* Field Reference */}
                <div className="flex flex-wrap gap-2">
                  {CRON_FIELDS.map((field, index) => (
                    <div
                      key={field.name}
                      className="group relative"
                    >
                      <span className="text-xs bg-surface-hover px-2 py-1 rounded border border-border/50 text-text-secondary cursor-help flex items-center gap-1">
                        {index + 1}. {field.name}
                        <HelpCircle className="w-3 h-3" />
                      </span>
                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-surface border border-border px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-10">
                        Range: {field.range}
                      </div>
                    </div>
                  ))}
                </div>

                {error ? (
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-md space-y-1">
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">{error}</span>
                    </div>
                    {errorHint && (
                      <p className="text-red-400/80 text-xs pl-6">{errorHint}</p>
                    )}
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
