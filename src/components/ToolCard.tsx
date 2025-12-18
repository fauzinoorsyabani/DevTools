import { Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Tool } from '../data/tools';
import { useState } from 'react';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const IconComponent = Icons[tool.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-500/10 to-orange-500/10 rounded-lg group-hover:from-purple-500/20 group-hover:to-orange-500/20 transition-colors">
          {IconComponent && <IconComponent className="w-6 h-6 text-purple-400" />}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="p-1 hover:bg-gray-700/50 rounded transition-colors"
        >
          <Star
            className={`w-5 h-5 ${
              isFavorite ? 'fill-orange-400 text-orange-400' : 'text-gray-500'
            }`}
          />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-100 mb-2">{tool.name}</h3>
      <p className="text-sm text-gray-400 mb-4">{tool.description}</p>

      <span className="inline-block px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
        {tool.category}
      </span>
    </div>
  );
}
