import { useState } from 'react';
import { Info, X, Shield, Zap, Users } from 'lucide-react';

interface ToolMetadata {
  usedBy: string[];
  securityNote?: string;
  productionTip?: string;
}

interface InfoPanelProps {
  metadata: ToolMetadata;
}

export default function InfoPanel({ metadata }: InfoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-md hover:bg-surface-hover border border-transparent hover:border-border transition-colors"
        title="Tool information"
      >
        <Info className="w-4 h-4 text-text-secondary" />
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-hover/50 border-b border-border">
        <span className="text-sm font-medium text-text-primary">Tool Information</span>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded hover:bg-surface-active transition-colors"
        >
          <X className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>
      
      <div className="p-4 space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-text-primary mb-1">Used by</div>
            <div className="flex flex-wrap gap-1.5">
              {metadata.usedBy.map((user) => (
                <span 
                  key={user}
                  className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs font-medium"
                >
                  {user}
                </span>
              ))}
            </div>
          </div>
        </div>

        {metadata.securityNote && (
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-text-primary mb-1">Security Note</div>
              <p className="text-text-secondary leading-relaxed">{metadata.securityNote}</p>
            </div>
          </div>
        )}

        {metadata.productionTip && (
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-text-primary mb-1">Production Tip</div>
              <p className="text-text-secondary leading-relaxed">{metadata.productionTip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
