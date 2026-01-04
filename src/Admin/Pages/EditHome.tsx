import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImageUpload } from '../components/ImageUpload';
import { RichTextEditor } from '../components/RichTextEditor';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface Language {
  id: number;
  code: string;
  name: string;
  flag: string;
}

interface EditableContent {
  path: string;
  original: string;
  edited: string;
}

interface ContentSection {
  type: string;
  title?: string;
  subtitle?: string;
  greeting?: string;
  name?: string;
  description?: string;
  items?: Array<{ value: string; label: string; Value?: string; Label?: string }>;
  logos?: Array<{ name: string; image?: string }>;
}

interface PageData {
  id: number;
  slug: string;
  isPublished: boolean;
  languageCode: string;
  seoTitle: string;
  seoDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaUrl?: string;
  heroImage?: string;
  contentSections?: string;
  contentSectionsJson?: string;
}

export const EditHome: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PageData | null>(null);
  const [edits, setEdits] = useState<EditableContent[]>([]);
  const [imageEdits, setImageEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  // Local state for editable content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  const [introGreeting, setIntroGreeting] = useState('');
  const [introDescription, setIntroDescription] = useState('');
  const [introName, setIntroName] = useState('');
  const [introTitle, setIntroTitle] = useState('');
  const [statsTitle, setStatsTitle] = useState('');
  const [statsItems, setStatsItems] = useState<Array<{ value: string; label: string }>>([]);
  
  // Featured Programs state
  const [featuredTitle, setFeaturedTitle] = useState('');
  const [featuredSubtitle, setFeaturedSubtitle] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/languages`)
      .then(res => res.json())
      .then(langs => {
        const mappedLangs = langs.map((l: any) => ({
          id: l.id,
          code: l.code,
          name: l.name,
          flag: l.code === 'en' ? '🇬🇧' : l.code === 'mk' ? '🇲🇰' : '🌐'
        }));
        setLanguages(mappedLangs);
        setLoadingLanguages(false);
      })
      .catch(err => {
        console.error('Failed to load languages:', err);
        setLanguages([
          { id: 1, code: 'en', name: 'English', flag: '🇬🇧' },
          { id: 2, code: 'mk', name: 'Македонски', flag: '🇲🇰' }
        ]);
        setLoadingLanguages(false);
      });
  }, []);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid page ID");
      setLoading(false);
      return;
    }

    const url = `${API_BASE}/api/pages/home?lang=${selectedLanguage}`;

    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(apiResponse => {
        console.log('API Response:', apiResponse);
        
        setData(apiResponse);
        
        // Set local state
        setHeroTitle(apiResponse.heroTitle || '');
        setHeroSubtitle(apiResponse.heroSubtitle || '');
        setHeroCtaText(apiResponse.heroCtaText || '');
        
        // Parse sections
        const sectionsJson = apiResponse.contentSections || apiResponse.contentSectionsJson;
        const sections = sectionsJson ? JSON.parse(sectionsJson) : [];
        
        // Intro section
        const intro = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'intro-card');
        if (intro) {
          setIntroGreeting(intro.Greeting || intro.greeting || '');
          setIntroDescription(intro.Description || intro.description || '');
          setIntroName(intro.Name || intro.name || '');
          setIntroTitle(intro.Title || intro.title || '');
        }
        
        // Stats section
        const stats = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'stats');
        if (stats) {
          setStatsTitle(stats.Title || stats.title || '');
          setStatsItems(stats.Items || stats.items || []);
        }
        
        // Featured Programs section
        const featured = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'featured-programs');
        if (featured) {
          setFeaturedTitle(featured.Title || featured.title || '');
          setFeaturedSubtitle(featured.Subtitle || featured.subtitle || '');
        }
        
        setLoading(false);
        setEdits([]);
        setImageEdits({});
      })
      .catch(err => {
        console.error('Failed to load page:', err);
        toast.error(`Failed to load page: ${err.message}`);
        setLoading(false);
      });
  }, [id, selectedLanguage]);

  const trackEdit = useCallback((path: string, original: string, edited: string) => {
    if (original === edited) {
      setEdits(prev => prev.filter(e => e.path !== path));
      return;
    }
    
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

  // Add/Remove functions that properly track the entire stats array
  const addStatItem = () => {
    const newItem = {
      value: '<span style="font-size: 48px; color: #dc2626;">0</span>',
      label: 'New Stat'
    };
    const newItems = [...statsItems, newItem];
    setStatsItems(newItems);
    
    // Track the entire stats array as JSON
    const originalStats = validSections.find(s => s.type === 'stats');
    trackEdit(
      'stats.items', 
      JSON.stringify(originalStats?.items || []), 
      JSON.stringify(newItems)
    );
    
    toast.success('New stat added - Click Save to apply changes');
  };

  const removeStatItem = (index: number) => {
    if (statsItems.length <= 1) {
      toast.error('Must have at least one stat');
      return;
    }
    
    const newItems = statsItems.filter((_, idx) => idx !== index);
    setStatsItems(newItems);
    
    // Track the entire stats array as JSON
    const originalStats = validSections.find(s => s.type === 'stats');
    trackEdit(
      'stats.items', 
      JSON.stringify(originalStats?.items || []), 
      JSON.stringify(newItems)
    );
    
    toast.success('Stat removed - Click Save to apply changes');
  };

  const handleLanguageChange = (langCode: string) => {
    if (edits.length > 0) {
      const confirm = window.confirm(
        `You have ${edits.length} unsaved changes. Switching language will discard them. Continue?`
      );
      if (!confirm) return;
    }
    setSelectedLanguage(langCode);
  };

  const approveChanges = async () => {
    if (!data?.slug || !id) {
      toast.error("Missing page data");
      return;
    }

    const allChanges = [...edits];
    
    console.log('Saving changes:', allChanges);

    try {
      const url = `${API_BASE}/api/admin/pages/${data.slug}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pageId: parseInt(id),
          language: selectedLanguage,
          changes: allChanges 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Save failed');
      }
      
      const result = await response.json();
      
      if (result.message?.includes('created')) {
        toast.success(`New ${selectedLanguage.toUpperCase()} translation created`);
      } else {
        toast.success(`Changes saved for ${selectedLanguage.toUpperCase()}`);
      }
      
      setEdits([]);
      setImageEdits({});
      
      // Reload data
      const reloadRes = await fetch(`${API_BASE}/api/pages/home?lang=${selectedLanguage}`);
      const reloadedData = await reloadRes.json();
      setData(reloadedData);
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(`Failed: ${err.message}`);
    }
  };

  if (loading || loadingLanguages) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Loading page {id}...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <p className="text-slate-900 font-medium mb-4">Page not found</p>
          <button 
            onClick={() => navigate('/admin/pages')}
            className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800"
          >
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  const hero = {
    image: imageEdits['hero.image'] || data.heroImage
  };

  const parseSections = (): ContentSection[] => {
    const rawSectionsJson = data.contentSections || data.contentSectionsJson;
    
    if (!rawSectionsJson) return [];

    try {
      let rawSections: any;
      
      if (typeof rawSectionsJson === 'string') {
        rawSections = JSON.parse(rawSectionsJson);
      } else {
        rawSections = rawSectionsJson;
      }
      
      if (!Array.isArray(rawSections)) return [];
      
      const normalized = rawSections.map((s: any) => ({
        type: (s.Type || s.type || '').toLowerCase(),
        title: s.Title || s.title,
        subtitle: s.Subtitle || s.subtitle,
        greeting: s.Greeting || s.greeting,
        name: s.Name || s.name,
        description: s.Description || s.description,
        items: s.Items || s.items,
        logos: s.Logos || s.logos
      }));
      
      return normalized;
      
    } catch (error) {
      console.error('Failed to parse sections:', error);
      return [];
    }
  };

  const validSections = parseSections();
  const introCard = validSections.find((s: ContentSection) => s.type === 'intro-card');
  const featuredSection = validSections.find((s: ContentSection) => s.type === 'featured-programs');

  const currentLang = languages.find(l => l.code === selectedLanguage);

  return (
    <div className="min-h-screen bg-white w-full">
      <Helmet>
        <title>Edit {data.seoTitle || data.slug} - {currentLang?.name}</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      {/* Sticky Save Bar */}
      {edits.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white p-3 shadow-lg z-50 border-b border-slate-700">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <span className="font-medium text-sm">
                  {edits.length} unsaved change{edits.length !== 1 ? 's' : ''}
                </span>
                <span className="text-slate-400 text-xs ml-3">
                  {data.slug} • {currentLang?.name}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/admin/pages')}
                className="px-4 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setEdits([]);
                  setImageEdits({});
                  window.location.reload();
                }}
                className="px-4 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                Discard
              </button>
              <button
                onClick={approveChanges}
                className="px-6 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 font-medium rounded transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Info Bar */}
      <div className={`bg-slate-50 border-b border-slate-200 p-3 ${edits.length > 0 ? 'mt-12' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>ID: <span className="font-mono text-slate-900">{id}</span></span>
            <span>•</span>
            <span>Slug: <span className="font-mono text-slate-900">{data.slug}</span></span>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${data.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {data.isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="text-red-600 font-medium">Editing Mode</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-sm bg-white border border-slate-300 rounded px-3 py-1 text-slate-900 cursor-pointer hover:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
        
        {/* Subtle Background Circles */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-slate-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-slate-50 rounded-full opacity-40 blur-3xl"></div>
        
        {/* Red accent circle */}
        <div className="absolute top-40 right-32 w-32 h-32 bg-red-600 rounded-full opacity-5 blur-2xl"></div>
        
        {/* Hero Image with Horizontal Fade */}
        {hero.image && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
            }}
          >
            <img
              src={hero.image.startsWith('/') ? `${API_BASE}${hero.image}` : hero.image}
              alt=""
              className="w-auto h-[100vh] object-contain opacity-20"
              style={{
                mixBlendMode: 'multiply',
                filter: 'grayscale(20%)'
              }}
            />
          </div>
        )}

        {/* Image Upload Control */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto">
          <ImageUpload
            currentImageUrl={hero.image || ""}
            onImageChange={(url) => trackImageChange('hero.image', url)}
            label="Hero Image"
            aspectRatio="auto"
          />
        </div>

        <div className="container mx-auto px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content - Editable */}
            <div className="space-y-8">
              {/* Red accent line */}
              <div className="w-16 h-1 bg-red-600 mb-4"></div>
              
              <RichTextEditor
                value={heroTitle}
                onChange={(value) => {
                  setHeroTitle(value);
                  trackEdit('hero.title', data.heroTitle || '', value);
                }}
                className="leading-tight tracking-tight rounded p-2"
              />

              <RichTextEditor
                value={heroSubtitle}
                onChange={(value) => {
                  setHeroSubtitle(value);
                  trackEdit('hero.subtitle', data.heroSubtitle || '', value);
                }}
                className="leading-relaxed max-w-xl rounded p-2"
              />

              <RichTextEditor
                value={heroCtaText}
                onChange={(value) => {
                  setHeroCtaText(value);
                  trackEdit('hero.ctaText', data.heroCtaText || '', value);
                }}
                className="inline-block bg-red-600 text-white px-8 py-3 rounded font-medium text-sm tracking-wide transition-colors"
              />
            </div>

            {/* Right Side - Intro Card Editable */}
            {introCard && (
              <div className="relative">
                <div className="bg-white border-l-4 border-red-600 shadow-sm rounded p-8 max-w-sm mx-auto lg:ml-auto">
                  <RichTextEditor
                    value={introGreeting}
                    onChange={(value) => {
                      setIntroGreeting(value);
                      trackEdit('intro.greeting', introCard.greeting || '', value);
                    }}
                    className="mb-4 rounded p-1"
                  />
                  
                  <div className="leading-relaxed">
                    <RichTextEditor
                      value={introDescription}
                      onChange={(value) => {
                        setIntroDescription(value);
                        trackEdit('intro.description', introCard.description || '', value);
                      }}
                      className="rounded p-1 inline-block w-full"
                    />
                    
                    <br />
                    
                    <RichTextEditor
                      value={introName}
                      onChange={(value) => {
                        setIntroName(value);
                        trackEdit('intro.name', introCard.name || '', value);
                      }}
                      className="font-medium mt-2 inline-block rounded p-1"
                    />
                    
                    <RichTextEditor
                      value={introTitle}
                      onChange={(value) => {
                        setIntroTitle(value);
                        trackEdit('intro.title', introCard.title || '', value);
                      }}
                      className="text-sm block mt-1 rounded p-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section - Editable with Add/Remove */}
      {statsItems.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <RichTextEditor
                value={statsTitle}
                onChange={(value) => {
                  setStatsTitle(value);
                  trackEdit('stats.title', validSections.find(s => s.type === 'stats')?.title || '', value);
                }}
                className="tracking-tight rounded p-2 inline-block"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsItems.map((stat: any, idx: number) => (
                <div 
                  key={idx} 
                  className="relative text-center p-6 bg-white border-t-2 border-red-600 rounded shadow-sm group"
                >
                  {/* Remove button */}
                  {statsItems.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStatItem(idx);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-700 z-10"
                      title="Remove stat"
                    >
                      ✕
                    </button>
                  )}
                  
                  {/* DEBUG INFO */}
                  <div className="absolute top-2 left-2 text-xs text-slate-400">
                    Stat {idx}
                  </div>
                  
                  {/* Value Editor - SIMPLIFIED */}
                  <div className="mb-4 relative z-0">
                    <label className="block text-xs text-slate-500 mb-1">Value (click to edit):</label>
                    <div
                      style={{
                        minHeight: '60px',
                        border: '2px dashed #e2e8f0',
                        padding: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <RichTextEditor
                        value={stat.value || stat.Value || '<span style="font-size: 48px;">0</span>'}
                        onChange={(value) => {
                          console.log(`📝 Stat ${idx} value changed:`, value);
                          const newItems = [...statsItems];
                          newItems[idx] = { 
                            ...newItems[idx], 
                            value: value
                          };
                          setStatsItems(newItems);
                          trackEdit(`stats.items.${idx}.value`, stat.value || stat.Value || '', value);
                        }}
                        className=""
                        placeholder="Click to edit value"
                      />
                    </div>
                  </div>
                  
                  {/* Label Editor - SIMPLIFIED */}
                  <div className="relative z-0">
                    <label className="block text-xs text-slate-500 mb-1">Label (click to edit):</label>
                    <div
                      style={{
                        minHeight: '40px',
                        border: '2px dashed #e2e8f0',
                        padding: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <RichTextEditor
                        value={stat.label || stat.Label || 'Label'}
                        onChange={(value) => {
                          console.log(`📝 Stat ${idx} label changed:`, value);
                          const newItems = [...statsItems];
                          newItems[idx] = { 
                            ...newItems[idx], 
                            label: value
                          };
                          setStatsItems(newItems);
                          trackEdit(`stats.items.${idx}.label`, stat.label || stat.Label || '', value);
                        }}
                        className=""
                        placeholder="Click to edit label"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add New Stat Button */}
            <div className="text-center mt-8">
              <button
                onClick={addStatItem}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <span className="text-xl">+</span>
                Add New Stat
              </button>
            </div>
          </div>
        </section>
      )}


      {/* Featured Programs Section Header - Editable */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-8">
          <div className="text-center mb-8">
            <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
            
            <RichTextEditor
              value={featuredTitle}
              onChange={(value) => {
                setFeaturedTitle(value);
                trackEdit('featured.title', featuredSection?.title || '', value);
              }}
              className="tracking-tight rounded p-2 inline-block mb-4"
              placeholder="Featured Programs Title"
            />
            
            <RichTextEditor
              value={featuredSubtitle}
              onChange={(value) => {
                setFeaturedSubtitle(value);
                trackEdit('featured.subtitle', featuredSection?.subtitle || '', value);
              }}
              className="rounded p-2 inline-block"
              placeholder="Featured Programs Subtitle"
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-6 text-center">
            <p className="text-sm text-blue-800">
              💡 <strong>Programs are managed separately.</strong> Go to <button onClick={() => navigate('/admin/programs')} className="underline hover:text-blue-900">Programs Management</button> to add, edit, or publish programs.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              The first 6 published programs will automatically appear on the home page.
            </p>
          </div>
        </div>
      </section>

      {/* Help Info */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="bg-slate-50 border-l-4 border-red-600 rounded p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Editing Instructions
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• <strong>Edit text:</strong> Click or right-click any text field - formatting toolbar will appear</li>
            <li>• <strong>Format text:</strong> Select text, then use toolbar to change size, color, style</li>
            <li>• <strong>Font size:</strong> Select text, choose size from dropdown</li>
            <li>• <strong>Text color:</strong> Select text, click color picker</li>
            <li>• <strong>Our Impact:</strong> Click + to add stats, hover over stat to see remove button</li>
            <li>• <strong>Programs:</strong> Managed in Programs section - first 6 published will show on home</li>
            <li>• <strong>Change image:</strong> Click "Hero Image" button at top center</li>
            <li>• <strong>Save:</strong> Click "Save Changes" in the top bar</li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Page ID: {id} • Language: {selectedLanguage} • 
              Pending edits: {edits.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
