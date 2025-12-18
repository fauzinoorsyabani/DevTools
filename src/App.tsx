import { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import CategoryTabs from './components/CategoryTabs';
import ToolCard from './components/ToolCard';
import { tools, categories } from './data/tools';
import QRGeneratorPage from './pages/QRGeneratorPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  if (activeTool === 'qr-generator') {
    return <QRGeneratorPage onBack={() => setActiveTool(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-orange-900/20">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No tools found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => setActiveTool(tool.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
