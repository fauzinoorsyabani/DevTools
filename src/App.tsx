import { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import CategoryTabs from './components/CategoryTabs';
import ToolCard from './components/ToolCard';
import { tools, categories } from './data/tools';
import QRGeneratorPage from './pages/QRGeneratorPage';
import ColorContrastCheckerPage from './pages/ColorContrastCheckerPage';
import JWTDecoderPage from './pages/JWTDecoderPage';
import UrlEncoderPage from './pages/UrlEncoderPage';
import CronCalculatorPage from './pages/CronCalculatorPage';
import Base64EncoderPage from './pages/Base64EncoderPage';
import JSONFormatterPage from './pages/JSONFormatterPage';
import UUIDGeneratorPage from './pages/UUIDGeneratorPage';

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
    return (
      <ThemeProvider>
        <QRGeneratorPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  if (activeTool === 'color-contrast') {
    return (
      <ThemeProvider>
        <ColorContrastCheckerPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  if (activeTool === 'jwt-decoder') {
    return (
      <ThemeProvider>
        <JWTDecoderPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  if (activeTool === 'url-encoder') {
    return (
      <ThemeProvider>
        <UrlEncoderPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  if (activeTool === 'cron-calculator') {
    return (
      <ThemeProvider>
        <CronCalculatorPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  if (activeTool === 'base64-encoder') {
    return (
      <ThemeProvider>
        <Base64EncoderPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  if (activeTool === 'json-formatter') {
    return (
      <ThemeProvider>
        <JSONFormatterPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  if (activeTool === 'uuid-generator') {
    return (
      <ThemeProvider>
        <UUIDGeneratorPage onBack={() => setActiveTool(null)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              A Developer-Centric Toolbox Built with{' '}
              <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                Product Thinking
              </span>
            </h2>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
              Not just utilities — but explanations, best practices, and real-world context.
            </p>
          </div>
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
    </ThemeProvider>
  );
}

export default App;

