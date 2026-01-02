import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

interface EditableChange {
  path: string;
  original: string;
  edited: string;
}

interface PageData {
  slug: string;
  content: {
    seo: { title: string; description: string };
    hero: {
      title: string;
      subtitle?: string;
      ctaText?: string;
      ctaUrl?: string;
    };
    sections: any[];
  };
}

export const AdminEditPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PageData | null>(null);
  const [changes, setChanges] = useState<EditableChange[]>([]);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load page data
  useEffect(() => {
    fetch(`/api/admin/pages/${slug}?lang=mk`)
      .then(res => res.json())
      .then(setData)
      .catch(() => toast.error('Failed to load page'));
  }, [slug]);

  // Track changes
  const trackChange = (path: string, original: string, edited: string) => {
    setChanges(prev => {
      const existing = prev.findIndex(c => c.path === path);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing].edited = edited;
        return updated;
      }
      return [...prev, { path, original, edited }];
    });
  };

  // Save all changes
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/pages/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes })
      });
      toast.success('✅ Page saved successfully!');
      setChanges([]);
      // Reload data
      const res = await fetch(`/api/admin/pages/${slug}?lang=mk`);
      setData(await res.json());
    } catch {
      toast.error('❌ Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setChanges([]);
    window.location.reload();
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Helmet>
        <title>Edit {data.content.seo.title}</title>
      </Helmet>

      {/* Sticky Save Header */}
      {changes.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 shadow-2xl z-50 border-b-4 border-amber-600">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-bold text-lg">Unsaved Changes ({changes.length})</h3>
                <p className="text-sm text-white/90">Double-click text to edit • Click away to track</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all"
                disabled={saving}
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-white text-amber-600 hover:bg-white/95 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center gap-2"
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '✅ Approve & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editable Preview */}
      <div ref={previewRef} className={`max-w-6xl mx-auto ${changes.length > 0 ? 'pt-24' : ''}`}>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-6 rounded-3xl mb-8 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              {/* Hover Edit Popup */}
              {hoveredPath === 'hero.title' && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-2xl whitespace-nowrap z-40 border border-slate-700 pointer-events-none">
                  ✏️ Double-click to edit
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-slate-900 border-r border-b border-slate-700"></div>
                </div>
              )}
              
              <h1
                data-editable
                data-path="hero.title"
                data-original={data.content.hero.title}
                className="text-5xl font-bold mb-6 cursor-pointer hover:bg-white/20 p-3 rounded-xl transition-all"
                onMouseEnter={() => setHoveredPath('hero.title')}
                onMouseLeave={() => setHoveredPath(null)}
                onDoubleClick={(e) => {
                  const el = e.currentTarget;
                  el.contentEditable = 'true';
                  el.focus();
                  el.style.backgroundColor = 'rgba(251, 191, 36, 0.3)';
                }}
                onBlur={(e) => {
                  const el = e.currentTarget;
                  el.contentEditable = 'false';
                  el.style.backgroundColor = '';
                  trackChange(
                    el.dataset.path!,
                    el.dataset.original!,
                    el.textContent || ''
                  );
                }}
                suppressContentEditableWarning
              >
                {data.content.hero.title}
              </h1>
            </div>

            {data.content.hero.subtitle && (
              <div className="group relative">
                {hoveredPath === 'hero.subtitle' && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-2xl whitespace-nowrap z-40 border border-slate-700 pointer-events-none">
                    ✏️ Double-click to edit
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-slate-900 border-r border-b border-slate-700"></div>
                  </div>
                )}
                
                <p
                  data-editable
                  data-path="hero.subtitle"
                  data-original={data.content.hero.subtitle}
                  className="text-xl text-white/90 cursor-pointer hover:bg-white/20 p-3 rounded-xl transition-all"
                  onMouseEnter={() => setHoveredPath('hero.subtitle')}
                  onMouseLeave={() => setHoveredPath(null)}
                  onDoubleClick={(e) => {
                    const el = e.currentTarget;
                    el.contentEditable = 'true';
                    el.focus();
                    el.style.backgroundColor = 'rgba(251, 191, 36, 0.3)';
                  }}
                  onBlur={(e) => {
                    const el = e.currentTarget;
                    el.contentEditable = 'false';
                    el.style.backgroundColor = '';
                    trackChange(
                      el.dataset.path!,
                      el.dataset.original!,
                      el.textContent || ''
                    );
                  }}
                  suppressContentEditableWarning
                >
                  {data.content.hero.subtitle}
                </p>
              </div>
            )}

            {data.content.hero.ctaText && (
              <button className="mt-8 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                {data.content.hero.ctaText}
              </button>
            )}
          </div>
        </section>

        {/* Sections (placeholder - extend with your actual section components) */}
        <div className="space-y-8">
          {data.content.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all"
            >
              <div className="group relative">
                {hoveredPath === `section.${idx}.title` && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-2xl whitespace-nowrap z-40 border border-slate-700">
                    ✏️ Double-click to edit
                  </div>
                )}
                
                <h2
                  data-editable
                  data-path={`section.${idx}.title`}
                  data-original={section.title || ''}
                  className="text-3xl font-bold text-slate-900 mb-4 cursor-pointer hover:bg-amber-50 p-2 rounded-lg transition-all"
                  onMouseEnter={() => setHoveredPath(`section.${idx}.title`)}
                  onMouseLeave={() => setHoveredPath(null)}
                  onDoubleClick={(e) => {
                    const el = e.currentTarget;
                    el.contentEditable = 'true';
                    el.focus();
                    el.style.backgroundColor = '#fef3c7';
                  }}
                  onBlur={(e) => {
                    const el = e.currentTarget;
                    el.contentEditable = 'false';
                    el.style.backgroundColor = '';
                    trackChange(el.dataset.path!, el.dataset.original!, el.textContent || '');
                  }}
                  suppressContentEditableWarning
                >
                  {section.title || 'Section Title'}
                </h2>
              </div>
              <p className="text-slate-600">Section content (type: {section.type})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/admin/pages')}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all"
        >
          ← Back to Pages
        </button>
      </div>
    </div>
  );
};
