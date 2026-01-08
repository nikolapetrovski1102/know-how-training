import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImageUpload } from '../Components/ImageUpload';
import { RichTextEditor } from '../Components/RichTextEditor';
import { useEditor } from '../../contexts/EditorContext';
import { FileUpload } from '../Components/FileUpload';

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
  const { isSidebarOpen } = useEditor();
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

  // Videos Section state
  const [videosTitle, setVideosTitle] = useState('');
  const [videosSubtitle, setVideosSubtitle] = useState('');
  const [videosItems, setVideosItems] = useState<Array<{ title: string; description: string; url: string; thumbnail?: string }>>([]);

  // Coaches/Instructors Section state
  const [coachesTitle, setCoachesTitle] = useState('');
  const [coachesSubtitle, setCoachesSubtitle] = useState('');
  const [coachesItems, setCoachesItems] = useState<Array<{ name: string; title: string; bio: string; image?: string; expertise?: string }>>([]);

  // Resources/PDFs Section state
  const [resourcesTitle, setResourcesTitle] = useState('');
  const [resourcesSubtitle, setResourcesSubtitle] = useState('');
  const [resourcesItems, setResourcesItems] = useState<Array<{ title: string; description: string; fileUrl: string; fileType?: string }>>([]);

  // Testimonials Section state
  const [testimonialsTitle, setTestimonialsTitle] = useState('');
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState('');
  const [testimonialsItems, setTestimonialsItems] = useState<Array<{ quote: string; author: string; role: string; company?: string; image?: string }>>([]);

  // FAQ Section state
  const [faqTitle, setFaqTitle] = useState('');
  const [faqSubtitle, setFaqSubtitle] = useState('');
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>([]);

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

        // Videos section
        const videos = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'videos');
        if (videos) {
          setVideosTitle(videos.Title || videos.title || '');
          setVideosSubtitle(videos.Subtitle || videos.subtitle || '');
          setVideosItems(videos.Items || videos.items || []);
        }

        // Coaches section
        const coaches = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'coaches' || (s.Type || s.type || '').toLowerCase() === 'instructors');
        if (coaches) {
          setCoachesTitle(coaches.Title || coaches.title || '');
          setCoachesSubtitle(coaches.Subtitle || coaches.subtitle || '');
          setCoachesItems(coaches.Items || coaches.items || []);
        }

        // Resources section
        const resources = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'resources' || (s.Type || s.type || '').toLowerCase() === 'pdfs');
        if (resources) {
          setResourcesTitle(resources.Title || resources.title || '');
          setResourcesSubtitle(resources.Subtitle || resources.subtitle || '');
          setResourcesItems(resources.Items || resources.items || []);
        }

        // Testimonials section
        const testimonials = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'testimonials');
        if (testimonials) {
          setTestimonialsTitle(testimonials.Title || testimonials.title || '');
          setTestimonialsSubtitle(testimonials.Subtitle || testimonials.subtitle || '');
          setTestimonialsItems(testimonials.Items || testimonials.items || []);
        }

        // FAQ section
        const faq = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'faq');
        if (faq) {
          setFaqTitle(faq.Title || faq.title || '');
          setFaqSubtitle(faq.Subtitle || faq.subtitle || '');
          setFaqItems(faq.Items || faq.items || []);
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

  // Videos Section helpers
  const addVideoItem = () => {
    const newItem = {
      title: 'New Video',
      description: 'Video description',
      url: 'https://youtube.com/watch?v=...',
      thumbnail: ''
    };
    const newItems = [...videosItems, newItem];
    setVideosItems(newItems);
    const originalVideos = validSections.find(s => s.type === 'videos');
    trackEdit('videos.items', JSON.stringify(originalVideos?.items || []), JSON.stringify(newItems));
    toast.success('Video added - Click Save to apply changes');
  };

  const removeVideoItem = (index: number) => {
    if (videosItems.length <= 1) {
      toast.error('Must have at least one video');
      return;
    }
    const newItems = videosItems.filter((_, idx) => idx !== index);
    setVideosItems(newItems);
    const originalVideos = validSections.find(s => s.type === 'videos');
    trackEdit('videos.items', JSON.stringify(originalVideos?.items || []), JSON.stringify(newItems));
    toast.success('Video removed');
  };

  // Coaches Section helpers
  const addCoachItem = () => {
    const newItem = {
      name: 'New Coach',
      title: 'Expert Trainer',
      bio: 'Coach biography',
      image: '',
      expertise: ''
    };
    const newItems = [...coachesItems, newItem];
    setCoachesItems(newItems);
    const originalCoaches = validSections.find(s => s.type === 'coaches' || s.type === 'instructors');
    trackEdit('coaches.items', JSON.stringify(originalCoaches?.items || []), JSON.stringify(newItems));
    toast.success('Coach added');
  };

  const removeCoachItem = (index: number) => {
    const newItems = coachesItems.filter((_, idx) => idx !== index);
    setCoachesItems(newItems);
    const originalCoaches = validSections.find(s => s.type === 'coaches' || s.type === 'instructors');
    trackEdit('coaches.items', JSON.stringify(originalCoaches?.items || []), JSON.stringify(newItems));
    toast.success('Coach removed');
  };

  // Resources Section helpers
  const addResourceItem = () => {
    const newItem = {
      title: 'New Resource',
      description: 'Resource description',
      fileUrl: '/uploads/resource.pdf',
      fileType: 'PDF'
    };
    const newItems = [...resourcesItems, newItem];
    setResourcesItems(newItems);
    const originalResources = validSections.find(s => s.type === 'resources' || s.type === 'pdfs');
    trackEdit('resources.items', JSON.stringify(originalResources?.items || []), JSON.stringify(newItems));
    toast.success('Resource added');
  };

  const removeResourceItem = (index: number) => {
    const newItems = resourcesItems.filter((_, idx) => idx !== index);
    setResourcesItems(newItems);
    const originalResources = validSections.find(s => s.type === 'resources' || s.type === 'pdfs');
    trackEdit('resources.items', JSON.stringify(originalResources?.items || []), JSON.stringify(newItems));
    toast.success('Resource removed');
  };

  // Testimonials Section helpers
  const addTestimonialItem = () => {
    const newItem = {
      quote: 'Great training program!',
      author: 'Student Name',
      role: 'Graduate',
      company: 'Company Name',
      image: ''
    };
    const newItems = [...testimonialsItems, newItem];
    setTestimonialsItems(newItems);
    const originalTestimonials = validSections.find(s => s.type === 'testimonials');
    trackEdit('testimonials.items', JSON.stringify(originalTestimonials?.items || []), JSON.stringify(newItems));
    toast.success('Testimonial added');
  };

  const removeTestimonialItem = (index: number) => {
    const newItems = testimonialsItems.filter((_, idx) => idx !== index);
    setTestimonialsItems(newItems);
    const originalTestimonials = validSections.find(s => s.type === 'testimonials');
    trackEdit('testimonials.items', JSON.stringify(originalTestimonials?.items || []), JSON.stringify(newItems));
    toast.success('Testimonial removed');
  };

  // FAQ Section helpers
  const addFaqItem = () => {
    const newItem = {
      question: 'New Question?',
      answer: 'Answer to the question'
    };
    const newItems = [...faqItems, newItem];
    setFaqItems(newItems);
    const originalFaq = validSections.find(s => s.type === 'faq');
    trackEdit('faq.items', JSON.stringify(originalFaq?.items || []), JSON.stringify(newItems));
    toast.success('FAQ added');
  };

  const removeFaqItem = (index: number) => {
    const newItems = faqItems.filter((_, idx) => idx !== index);
    setFaqItems(newItems);
    const originalFaq = validSections.find(s => s.type === 'faq');
    trackEdit('faq.items', JSON.stringify(originalFaq?.items || []), JSON.stringify(newItems));
    toast.success('FAQ removed');
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
        <div className={`fixed top-0 left-0 bg-slate-900 text-white p-3 shadow-lg z-50 border-b border-slate-700 transition-all duration-300 ${isSidebarOpen ? 'right-80' : 'right-16'}`}>
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
                          // Track the entire stats array to ensure saving works
                          const originalStats = validSections.find(s => s.type === 'stats');
                          trackEdit('stats.items', JSON.stringify(originalStats?.items || []), JSON.stringify(newItems));
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
                          // Track the entire stats array to ensure saving works
                          const originalStats = validSections.find(s => s.type === 'stats');
                          trackEdit('stats.items', JSON.stringify(originalStats?.items || []), JSON.stringify(newItems));
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

      {/* Videos Section - Editable */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
            <RichTextEditor
              value={videosTitle}
              onChange={(value) => {
                setVideosTitle(value);
                trackEdit('videos.title', '', value);
              }}
              className="text-3xl font-light tracking-tight rounded p-2 inline-block mb-4"
              placeholder="Videos Section Title"
            />
            <RichTextEditor
              value={videosSubtitle}
              onChange={(value) => {
                setVideosSubtitle(value);
                trackEdit('videos.subtitle', '', value);
              }}
              className="text-slate-600 rounded p-2 inline-block"
              placeholder="Videos Section Subtitle"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videosItems.map((video: any, idx: number) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden hover:border-red-400 transition-border relative group">
                <button
                  onClick={() => removeVideoItem(idx)}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove video"
                >
                  ×
                </button>

                <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                  <ImageUpload
                    currentImageUrl={video.thumbnail || video.Thumbnail || ''}
                    onImageChange={(value) => {
                      const newItems = [...videosItems];
                      newItems[idx] = { ...newItems[idx], thumbnail: value };
                      setVideosItems(newItems);
                      trackEdit(`videos.items.${idx}.thumbnail`, '', value);
                    }}
                    label="Video Thumbnail"
                    aspectRatio="16/9"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <RichTextEditor
                    value={video.title || video.Title || ''}
                    onChange={(value) => {
                      const newItems = [...videosItems];
                      newItems[idx] = { ...newItems[idx], title: value };
                      setVideosItems(newItems);
                      trackEdit(`videos.items.${idx}.title`, '', value);
                    }}
                    className="font-semibold text-lg"
                    placeholder="Video Title"
                  />

                  <RichTextEditor
                    value={video.description || video.Description || ''}
                    onChange={(value) => {
                      const newItems = [...videosItems];
                      newItems[idx] = { ...newItems[idx], description: value };
                      setVideosItems(newItems);
                      trackEdit(`videos.items.${idx}.description`, '', value);
                    }}
                    className="text-slate-600 text-sm"
                    placeholder="Video Description"
                  />

                  <RichTextEditor
                    value={video.url || video.Url || ''}
                    onChange={(value) => {
                      const newItems = [...videosItems];
                      newItems[idx] = { ...newItems[idx], url: value };
                      setVideosItems(newItems);
                      trackEdit(`videos.items.${idx}.url`, '', value);
                    }}
                    className="text-red-600 text-sm"
                    placeholder="Video URL"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={addVideoItem}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="text-xl">+</span>
              Add New Video
            </button>
          </div>
        </div>
      </section>

      {/* Coaches Section - Editable */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
            <RichTextEditor
              value={coachesTitle}
              onChange={(value) => {
                setCoachesTitle(value);
                trackEdit('coaches.title', '', value);
              }}
              className="text-3xl font-light tracking-tight rounded p-2 inline-block mb-4"
              placeholder="Coaches Section Title"
            />
            <RichTextEditor
              value={coachesSubtitle}
              onChange={(value) => {
                setCoachesSubtitle(value);
                trackEdit('coaches.subtitle', '', value);
              }}
              className="text-slate-600 rounded p-2 inline-block"
              placeholder="Coaches Section Subtitle"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coachesItems.map((coach: any, idx: number) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden hover:border-red-400 transition-border relative group">
                <button
                  onClick={() => removeCoachItem(idx)}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove coach"
                >
                  ×
                </button>

                <div className="relative h-64 bg-slate-100 flex items-center justify-center">
                  <ImageUpload
                    currentImageUrl={coach.image || coach.Image || ''}
                    onImageChange={(value) => {
                      const newItems = [...coachesItems];
                      newItems[idx] = { ...newItems[idx], image: value };
                      setCoachesItems(newItems);
                      trackEdit(`coaches.items.${idx}.image`, '', value);
                    }}
                    label="Coach Photo"
                    aspectRatio="3/4"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <RichTextEditor
                    value={coach.name || coach.Name || ''}
                    onChange={(value) => {
                      const newItems = [...coachesItems];
                      newItems[idx] = { ...newItems[idx], name: value };
                      setCoachesItems(newItems);
                      trackEdit(`coaches.items.${idx}.name`, '', value);
                    }}
                    className="font-semibold text-lg"
                    placeholder="Coach Name"
                  />

                  <RichTextEditor
                    value={coach.title || coach.Title || ''}
                    onChange={(value) => {
                      const newItems = [...coachesItems];
                      newItems[idx] = { ...newItems[idx], title: value };
                      setCoachesItems(newItems);
                      trackEdit(`coaches.items.${idx}.title`, '', value);
                    }}
                    className="text-red-600 font-medium text-sm"
                    placeholder="Coach Title/Position"
                  />

                  <RichTextEditor
                    value={coach.bio || coach.Bio || ''}
                    onChange={(value) => {
                      const newItems = [...coachesItems];
                      newItems[idx] = { ...newItems[idx], bio: value };
                      setCoachesItems(newItems);
                      trackEdit(`coaches.items.${idx}.bio`, '', value);
                    }}
                    className="text-slate-600 text-sm"
                    placeholder="Coach Bio"
                  />

                  <RichTextEditor
                    value={coach.expertise || coach.Expertise || ''}
                    onChange={(value) => {
                      const newItems = [...coachesItems];
                      newItems[idx] = { ...newItems[idx], expertise: value };
                      setCoachesItems(newItems);
                      trackEdit(`coaches.items.${idx}.expertise`, '', value);
                    }}
                    className="text-xs text-slate-500"
                    placeholder="Coach Expertise"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={addCoachItem}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="text-xl">+</span>
              Add New Coach
            </button>
          </div>
        </div>
      </section>

      {/* Resources Section - Editable */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
            <RichTextEditor
              value={resourcesTitle}
              onChange={(value) => {
                setResourcesTitle(value);
                trackEdit('resources.title', '', value);
              }}
              className="text-3xl font-light tracking-tight rounded p-2 inline-block mb-4"
              placeholder="Resources Section Title"
            />
            <RichTextEditor
              value={resourcesSubtitle}
              onChange={(value) => {
                setResourcesSubtitle(value);
                trackEdit('resources.subtitle', '', value);
              }}
              className="text-slate-600 rounded p-2 inline-block"
              placeholder="Resources Section Subtitle"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesItems.map((resource: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 hover:border-red-400 transition-border relative group">
                <button
                  onClick={() => removeResourceItem(idx)}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove resource"
                >
                  ×
                </button>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <RichTextEditor
                      value={resource.fileType || resource.FileType || 'PDF'}
                      onChange={(value) => {
                        const newItems = [...resourcesItems];
                        newItems[idx] = { ...newItems[idx], fileType: value };
                        setResourcesItems(newItems);
                        trackEdit(`resources.items.${idx}.fileType`, '', value);
                      }}
                      className="text-white font-bold text-xs text-center"
                      placeholder="PDF"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <RichTextEditor
                      value={resource.title || resource.Title || ''}
                      onChange={(value) => {
                        const newItems = [...resourcesItems];
                        newItems[idx] = { ...newItems[idx], title: value };
                        setResourcesItems(newItems);
                        trackEdit(`resources.items.${idx}.title`, '', value);
                      }}
                      className="font-semibold text-slate-900"
                      placeholder="Resource Title"
                    />

                    <RichTextEditor
                      value={resource.description || resource.Description || ''}
                      onChange={(value) => {
                        const newItems = [...resourcesItems];
                        newItems[idx] = { ...newItems[idx], description: value };
                        setResourcesItems(newItems);
                        trackEdit(`resources.items.${idx}.description`, '', value);
                      }}
                      className="text-sm text-slate-600"
                      placeholder="Resource Description"
                    />

                    <FileUpload
                      currentFileUrl={resource.fileUrl || resource.FileUrl || ''}
                      onFileChange={(value) => {
                        const newItems = [...resourcesItems];
                        newItems[idx] = { ...newItems[idx], fileUrl: value };
                        // Auto-detect type if possible logic could go here, or just let user edit type
                        setResourcesItems(newItems);
                        trackEdit(`resources.items.${idx}.fileUrl`, '', value);
                      }}
                      label="Document File"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={addResourceItem}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="text-xl">+</span>
              Add New Resource
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Editable */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
            <RichTextEditor
              value={testimonialsTitle}
              onChange={(value) => {
                setTestimonialsTitle(value);
                trackEdit('testimonials.title', '', value);
              }}
              className="text-3xl font-light tracking-tight rounded p-2 inline-block mb-4"
              placeholder="Testimonials Section Title"
            />
            <RichTextEditor
              value={testimonialsSubtitle}
              onChange={(value) => {
                setTestimonialsSubtitle(value);
                trackEdit('testimonials.subtitle', '', value);
              }}
              className="text-slate-600 rounded p-2 inline-block"
              placeholder="Testimonials Section Subtitle"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonialsItems.map((testimonial: any, idx: number) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-lg p-6 hover:border-red-400 transition-border relative group">
                <button
                  onClick={() => removeTestimonialItem(idx)}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove testimonial"
                >
                  ×
                </button>

                <div className="space-y-4">
                  <RichTextEditor
                    value={testimonial.quote || testimonial.Quote || ''}
                    onChange={(value) => {
                      const newItems = [...testimonialsItems];
                      newItems[idx] = { ...newItems[idx], quote: value };
                      setTestimonialsItems(newItems);
                      trackEdit(`testimonials.items.${idx}.quote`, '', value);
                    }}
                    className="text-slate-900 italic mb-4"
                    placeholder="Testimonial Quote"
                  />

                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <ImageUpload
                        currentImageUrl={testimonial.image || testimonial.Image || ''}
                        onImageChange={(value) => {
                          const newItems = [...testimonialsItems];
                          newItems[idx] = { ...newItems[idx], image: value };
                          setTestimonialsItems(newItems);
                          trackEdit(`testimonials.items.${idx}.image`, '', value);
                        }}
                        label="Photo"
                        aspectRatio="1/1"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <RichTextEditor
                        value={testimonial.author || testimonial.Author || ''}
                        onChange={(value) => {
                          const newItems = [...testimonialsItems];
                          newItems[idx] = { ...newItems[idx], author: value };
                          setTestimonialsItems(newItems);
                          trackEdit(`testimonials.items.${idx}.author`, '', value);
                        }}
                        className="font-semibold"
                        placeholder="Author Name"
                      />

                      <RichTextEditor
                        value={testimonial.role || testimonial.Role || ''}
                        onChange={(value) => {
                          const newItems = [...testimonialsItems];
                          newItems[idx] = { ...newItems[idx], role: value };
                          setTestimonialsItems(newItems);
                          trackEdit(`testimonials.items.${idx}.role`, '', value);
                        }}
                        className="text-sm text-slate-600"
                        placeholder="Role/Position"
                      />

                      <RichTextEditor
                        value={testimonial.company || testimonial.Company || ''}
                        onChange={(value) => {
                          const newItems = [...testimonialsItems];
                          newItems[idx] = { ...newItems[idx], company: value };
                          setTestimonialsItems(newItems);
                          trackEdit(`testimonials.items.${idx}.company`, '', value);
                        }}
                        className="text-xs text-slate-500"
                        placeholder="Company"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={addTestimonialItem}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="text-xl">+</span>
              Add New Testimonial
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section - Editable */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
            <RichTextEditor
              value={faqTitle}
              onChange={(value) => {
                setFaqTitle(value);
                trackEdit('faq.title', '', value);
              }}
              className="text-3xl font-light tracking-tight rounded p-2 inline-block mb-4"
              placeholder="FAQ Section Title"
            />
            <RichTextEditor
              value={faqSubtitle}
              onChange={(value) => {
                setFaqSubtitle(value);
                trackEdit('faq.subtitle', '', value);
              }}
              className="text-slate-600 rounded p-2 inline-block"
              placeholder="FAQ Section Subtitle"
            />
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item: any, idx: number) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden hover:border-red-400 transition-border relative group">
                <button
                  onClick={() => removeFaqItem(idx)}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove FAQ item"
                >
                  ×
                </button>

                <div className="p-6 space-y-3">
                  <RichTextEditor
                    value={item.question || item.Question || ''}
                    onChange={(value) => {
                      const newItems = [...faqItems];
                      newItems[idx] = { ...newItems[idx], question: value };
                      setFaqItems(newItems);
                      trackEdit(`faq.items.${idx}.question`, '', value);
                    }}
                    className="font-medium text-slate-900"
                    placeholder="Question"
                  />

                  <RichTextEditor
                    value={item.answer || item.Answer || ''}
                    onChange={(value) => {
                      const newItems = [...faqItems];
                      newItems[idx] = { ...newItems[idx], answer: value };
                      setFaqItems(newItems);
                      trackEdit(`faq.items.${idx}.answer`, '', value);
                    }}
                    className="text-slate-600"
                    placeholder="Answer"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={addFaqItem}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="text-xl">+</span>
              Add New FAQ
            </button>
          </div>
        </div>
      </section>


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
