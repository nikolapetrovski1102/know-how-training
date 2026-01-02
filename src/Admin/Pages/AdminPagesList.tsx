import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/pages`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch pages');
        return res.json();
      })
      .then(setPages)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800 font-semibold mb-2">❌ Error loading pages</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📄 Pages</h1>
          <p className="text-slate-600 mt-1">{pages.length} total pages</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
          ➕ New Page
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Slug</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Order</th>
              <th className="px-8 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-semibold text-slate-900">{page.slug}</div>
                  <div className="text-sm text-slate-500">ID: {page.id}</div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    page.isPublished 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {page.isPublished ? '✅ Live' : '⏳ Draft'}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm font-mono text-slate-900">{page.sortOrder}</td>
                <td className="px-8 py-6">
                  <div className="flex gap-2 justify-end">
                    {/* ✅ Navigate with ID */}
                    <button
                      onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                      className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => window.open(`/?lang=en`, '_blank')}
                      className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all flex items-center gap-1"
                    >
                      👁️ Preview
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
