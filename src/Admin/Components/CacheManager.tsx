import { useState } from 'react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

export const CacheManager: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const clearAllCache = async () => {
    if (!confirm('Clear ALL cache? This will affect all pages and languages.')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/cache/clear`, {
        method: 'DELETE'
      });
      const data = await response.json();
      toast.success('✅ All cache cleared!');
      console.log('Cache cleared:', data);
    } catch (error) {
      toast.error('❌ Failed to clear cache');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearPageCache = async (slug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/cache/page/${slug}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      toast.success(`✅ Cache cleared for ${slug}`);
      console.log('Page cache cleared:', data);
    } catch (error) {
      toast.error('❌ Failed to clear page cache');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const warmCache = async () => {
    setLoading(true);
    toast.loading('🔥 Warming cache...');
    try {
      const response = await fetch(`${API_BASE}/api/admin/cache/warm`, {
        method: 'POST'
      });
      const data = await response.json();
      toast.dismiss();
      toast.success(`✅ Cache warmed: ${data.warmedCount} entries in ${data.duration.toFixed(0)}ms`);
      console.log('Cache warmed:', data);
    } catch (error) {
      toast.dismiss();
      toast.error('❌ Failed to warm cache');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <span className="text-4xl">🗄️</span>
        Cache Management
      </h2>

      <div className="space-y-4">
        {/* Clear All Cache */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ Clear All Cache</h3>
          <p className="text-red-700 mb-4">
            Removes all cached pages and navigation. Use with caution!
          </p>
          <button
            onClick={clearAllCache}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            🗑️ Clear All Cache
          </button>
        </div>

        {/* Clear Specific Pages */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-2">📄 Clear Page Cache</h3>
          <p className="text-blue-700 mb-4">
            Remove cache for specific pages (all languages)
          </p>
          <div className="flex flex-wrap gap-2">
            {['home', 'about', 'programs', 'contact'].map(slug => (
              <button
                key={slug}
                onClick={() => clearPageCache(slug)}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                Clear {slug}
              </button>
            ))}
          </div>
        </div>

        {/* Warm Cache */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-900 mb-2">🔥 Warm Cache</h3>
          <p className="text-green-700 mb-4">
            Pre-load frequently accessed pages for better performance
          </p>
          <button
            onClick={warmCache}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            🔥 Warm Cache
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-slate-600 mt-2">Processing...</p>
        </div>
      )}
    </div>
  );
};
