import { Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Tool } from '../data/tools';
import { useState } from 'react';

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const IconComponent = Icons[tool.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-lg p-5 hover:border-border-hover hover:bg-surface-hover transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-accent/10 rounded-md">
          {IconComponent && <IconComponent className="w-5 h-5 text-accent" />}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="p-1 hover:bg-background rounded transition-colors"
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : 'text-text-secondary'
            }`}
          />
        </button>
      </div>

      <h3 className="text-base font-medium text-text-primary mb-1.5">{tool.name}</h3>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{tool.description}</p>

      <span className="inline-block px-2.5 py-1 bg-background text-text-secondary text-xs rounded-md border border-border">
        {tool.category}
      </span>
    </div>
  );
}
