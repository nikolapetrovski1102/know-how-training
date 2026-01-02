import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImageUpload } from '../components/ImageUpload';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface EditableContent {
  path: string;
  original: string;
  edited: string;
}

export const EditHome: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [edits, setEdits] = useState<EditableContent[]>([]);
  const [imageEdits, setImageEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  console.log("EditHome - ID:", id);

  // Load page data
  useEffect(() => {
    if (!id) {
      toast.error("Invalid page ID");
      setLoading(false);
      return;
    }

    const url = `${API_BASE}/api/admin/pages/edit/${id}`;
    console.log("Fetching from:", url);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Loaded page data:', data);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load page:', err);
        toast.error(`Failed to load page: ${err.message}`);
        setLoading(false);
      });
  }, [id]);

  // Track text edits
  const trackEdit = useCallback((path: string, original: string, edited: string) => {
    if (original === edited) return;
    
    setEdits(prev => {
      const existingIndex = prev.findIndex(e => e.path === path);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].edited = edited;
        return updated;
      }
      return [...prev, { path, original, edited }];
    });
  }, []);

  // Track image changes
  const trackImageChange = useCallback((path: string, newUrl: string) => {
    setImageEdits(prev => ({ ...prev, [path]: newUrl }));
    
    setEdits(prev => {
      const existingIndex = prev.findIndex(e => e.path === path);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].edited = newUrl;
        return updated;
      }
      return [...prev, { path, original: '', edited: newUrl }];
    });
  }, []);

  // Save changes
  const approveChanges = async () => {
    if (!data?.slug || !id) {
      toast.error("Missing page data");
      return;
    }

    try {
      const url = `${API_BASE}/api/admin/pages/${data.slug}`;
      console.log("Saving to:", url, { pageId: parseInt(id), edits });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pageId: parseInt(id),
          language: 'en',
          changes: edits 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Save failed');
      }
      
      toast.success('✅ Changes saved!');
      setEdits([]);
      setImageEdits({});
      
      // Reload page data
      const reloadRes = await fetch(`${API_BASE}/api/admin/pages/edit/${id}`);
      const reloadedData = await reloadRes.json();
      setData(reloadedData);
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(`❌ ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading page {id}...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">❌ Page not found (ID: {id})</p>
          <button 
            onClick={() => navigate('/admin/pages')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
          >
            ← Back to Pages
          </button>
        </div>
      </div>
    );
  }

  const langContent = data.languages?.[0];
  const hero = langContent ? {
    title: langContent.heroTitle,
    subtitle: langContent.heroSubtitle,
    ctaText: langContent.heroCtaText,
    ctaUrl: langContent.heroCtaUrl,
    image: imageEdits['hero.image'] || langContent.heroImage
  } : null;

  const sections = langContent?.contentSectionsJson 
    ? JSON.parse(langContent.contentSectionsJson) 
    : [];

  const validSections = sections.filter((s: any) => s.type && s.type.trim() !== '');
  const introCard = validSections.find((s: any) => s.type === 'intro-card');
  const stats = validSections.find((s: any) => s.type === 'stats');

  return (
    <div className="min-h-screen bg-white w-full">
      <Helmet>
        <title>Edit {langContent?.seoTitle || data.slug}</title>
      </Helmet>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-30px) scale(1.05);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .editable-field {
          transition: all 0.2s;
        }

        .editable-field:hover {
          background: rgba(251, 191, 36, 0.1);
          outline: 2px dashed rgba(251, 191, 36, 0.5);
          outline-offset: 4px;
        }

        .editable-field:focus {
          background: rgba(251, 191, 36, 0.2);
          outline: 2px solid rgba(251, 191, 36, 1);
        }
      `}</style>

      {/* Sticky Save Bar */}
      {edits.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 shadow-2xl z-50 border-b-4 border-amber-600">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-bold text-lg">💾 Unsaved Changes ({edits.length})</h3>
                <p className="text-sm text-white/90">Page ID: {id} • {data.slug} • Click text to edit, click away to save change</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/pages')}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  setEdits([]);
                  setImageEdits({});
                  window.location.reload();
                }}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all"
              >
                ❌ Discard
              </button>
              <button
                onClick={approveChanges}
                className="px-8 py-2.5 bg-white text-amber-600 hover:bg-white/95 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                ✅ Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Info */}
      <div className={`bg-slate-100 border-b border-slate-200 p-4 ${edits.length > 0 ? 'mt-20' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-sm">
          <span className="font-semibold">ID: <span className="font-mono text-indigo-600">{id}</span></span>
          <span>•</span>
          <span className="font-semibold">Slug: <span className="font-mono text-indigo-600">{data.slug}</span></span>
          <span>•</span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${data.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {data.isPublished ? '✅ Published' : '⏳ Draft'}
          </span>
          <span className="ml-auto text-amber-600 font-semibold">✏️ Editing Mode</span>
        </div>
      </div>

      {/* Hero Section - Cinematic Editable */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        
        {/* Animated Background Gradient Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* ✅ FLOATING TRANSPARENT IMAGE - EDITABLE */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative pointer-events-auto">
            <ImageUpload
              currentImageUrl={hero?.image}
              onImageChange={(url) => trackImageChange('hero.image', url)}
              label="Hero Background Image"
              aspectRatio="auto"
            />
            {hero?.image && (
              <img
                src={hero.image ? `${API_BASE}${hero.image}` : '/placeholder.jpg'}
                alt="Coach Floating"
                className="w-auto h-[120vh] max-w-none object-contain opacity-40 animate-float pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 50px 100px rgba(0, 0, 0, 0.5))',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0
                }}
              />
            )}
          </div>
        </div>

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/80 pointer-events-none"></div>
        
        <div className="container mx-auto px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content - Editable */}
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -left-4 -top-8 text-[200px] font-black text-white/10 leading-none select-none pointer-events-none">
                  7
                </div>
                <h1 
                  className="text-6xl lg:text-7xl font-black text-white leading-tight relative z-10 drop-shadow-2xl editable-field rounded-xl p-4"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const edited = e.currentTarget.innerHTML;
                    trackEdit('hero.title', hero?.title || '', edited);
                  }}
                  dangerouslySetInnerHTML={{ __html: hero?.title || 'IMPROVE<br/>YOUR SKILLS' }}
                />
              </div>

              <p
                className="text-xl text-slate-200 leading-relaxed max-w-lg drop-shadow-lg editable-field rounded-xl p-4"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const edited = e.currentTarget.textContent || '';
                  trackEdit('hero.subtitle', hero?.subtitle || '', edited);
                }}
              >
                {hero?.subtitle || 'Transform your career with professional coaching'}
              </p>

              <div
                className="inline-block bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl editable-field"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const edited = e.currentTarget.textContent || '';
                  trackEdit('hero.ctaText', hero?.ctaText || '', edited);
                }}
              >
                {hero?.ctaText || 'See My Services'}
              </div>
            </div>

            {/* Right Side - Intro Card (Editable) */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-sm mx-auto lg:ml-auto border-4 border-white/50">
                <div
                  className="text-6xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 editable-field rounded p-2"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const edited = e.currentTarget.textContent || '';
                    trackEdit('intro.greeting', introCard?.greeting || '', edited);
                  }}
                >
                  {introCard?.greeting || 'HI'}
                </div>
                <p className="text-slate-700 text-lg leading-snug">
                  I am{' '}
                  <span
                    className="font-bold text-slate-900 editable-field rounded px-1"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const edited = e.currentTarget.textContent || '';
                      trackEdit('intro.name', introCard?.name || '', edited);
                    }}
                  >
                    {introCard?.name || 'Nikola Petrovski'}
                  </span>
                  ,<br />
                  <span
                    className="font-bold text-slate-900 editable-field rounded px-1"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const edited = e.currentTarget.textContent || '';
                      trackEdit('intro.title', introCard?.title || '', edited);
                    }}
                  >
                    {introCard?.title || 'Professional Coach'}
                  </span>
                </p>
              </div>

              {/* Download Guide Button */}
              <div className="mt-8 flex justify-center lg:justify-end">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-6 shadow-2xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">Get Now</div>
                      <div className="text-xs text-white/80">Free Guide</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="absolute bottom-8 right-8 flex gap-4 z-20">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section - Editable */}
      {stats && stats.items && stats.items.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8">
            <h2
              className="text-4xl font-bold text-center text-slate-900 mb-12 editable-field rounded-xl p-4 inline-block"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const edited = e.currentTarget.textContent || '';
                trackEdit('stats.title', stats.title || '', edited);
              }}
            >
              {stats.title || 'Success by Numbers'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.items.map((stat: any, idx: number) => (
                <div key={idx} className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
                  <div
                    className="text-5xl font-black text-indigo-600 mb-3 editable-field rounded p-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const edited = e.currentTarget.textContent || '';
                      trackEdit(`stats.items.${idx}.value`, stat.value, edited);
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-sm font-semibold text-slate-600 uppercase tracking-wide editable-field rounded p-2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const edited = e.currentTarget.textContent || '';
                      trackEdit(`stats.items.${idx}.label`, stat.label, edited);
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Help Card */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
            <span className="text-4xl">📝</span>
            Editing Cinematic Home Page #{id}
          </h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🖼️</span>
              <span><strong>Upload Hero Image:</strong> Click the image upload area to change the floating background photo</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✏️</span>
              <span><strong>Edit Text:</strong> Click any text to edit inline (title, subtitle, stats, intro card)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">💾</span>
              <span><strong>Track Changes:</strong> Changes are highlighted in amber when you hover/focus</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span><strong>Save:</strong> Click "Save Changes" in the orange bar to persist to database</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
