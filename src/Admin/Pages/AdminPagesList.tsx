import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../../Utils/fetchWrapper';

interface PageSummary {
  id: number;
  slug: string;
  isPublished: boolean;
  sortOrder: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

export const AdminPagesList: React.FC = () => {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheLoading, setCacheLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`${API_BASE}/api/admin/pages`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch pages');
        return res.json();
      })
      .then(setPages)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleClearAllCache = async () => {
    if (!confirm('Clear all cache?\n\nThis will remove all cached pages and navigation.\n\nContinue?')) {
      return;
    }

    setCacheLoading(true);
    const toastId = toast.loading('Clearing cache...');

    try {
      const response = await apiFetch(`${API_BASE}/api/admin/cache/clear`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to clear cache');
      }

      toast.success('Cache cleared successfully', { id: toastId });
    } catch (error: any) {
      toast.error(`Failed to clear cache: ${error.message}`, { id: toastId });
    } finally {
      setCacheLoading(false);
    }
  };

  const handleClearPageCache = async (slug: string) => {
    setCacheLoading(true);
    const toastId = toast.loading(`Clearing cache for ${slug}...`);

    try {
      const response = await apiFetch(`${API_BASE}/api/admin/cache/page/${slug}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to clear page cache');
      }

      toast.success(`Cache cleared for ${slug}`, { id: toastId });
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setCacheLoading(false);
    }
  };

  const handleClearNavigationCache = async () => {
    setCacheLoading(true);
    const toastId = toast.loading('Clearing navigation cache...');

    try {
      const response = await apiFetch(`${API_BASE}/api/admin/cache/navigation`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to clear navigation cache');
      }

      toast.success('Navigation cache cleared', { id: toastId });
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setCacheLoading(false);
    }
  };

  const handleWarmCache = async () => {
    setCacheLoading(true);
    const toastId = toast.loading('Warming cache...');

    try {
      const response = await apiFetch(`${API_BASE}/api/admin/cache/warm`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to warm cache');
      }

      const data = await response.json();
      toast.success(
        `Cache warmed: ${data.warmedCount} entries in ${Math.round(data.duration)}ms`,
        { id: toastId, duration: 3000 }
      );
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setCacheLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-semibold mb-2">Error loading pages</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pages</h1>
        <p className="text-slate-600 mt-1">{pages.length} total pages</p>
      </div>

      {/* Cache Management */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Cache Management</h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClearAllCache}
            disabled={cacheLoading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-sm font-medium rounded border border-slate-300 transition-colors"
          >
            Clear All Cache
          </button>

          <button
            onClick={handleClearNavigationCache}
            disabled={cacheLoading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-sm font-medium rounded border border-slate-300 transition-colors"
          >
            Clear Navigation
          </button>

          <button
            onClick={handleWarmCache}
            disabled={cacheLoading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-sm font-medium rounded border border-slate-300 transition-colors"
          >
            Warm Cache
          </button>

          {cacheLoading && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded border border-slate-200">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
              <span className="text-sm text-slate-600">Processing...</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Clear cached pages after updates or use warm cache to pre-load frequently accessed pages.
        </p>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{page.slug}</div>
                  <div className="text-xs text-slate-500">ID: {page.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${page.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                    }`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-slate-600">{page.sortOrder}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-800 text-white rounded transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleClearPageCache(page.slug)}
                      disabled={cacheLoading}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded border border-slate-300 transition-colors"
                      title={`Clear cache for ${page.slug}`}
                    >
                      Clear Cache
                    </button>

                    <button
                      onClick={() => window.open(`/${page.slug === 'home' ? '' : page.slug}?lang=en`, '_blank')}
                      className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-300 transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
