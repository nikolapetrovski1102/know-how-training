import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImageUpload } from '../Components/ImageUpload';
import { useEditor } from '../../contexts/EditorContext';

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
    contentSectionsJson?: string;
}

// Simple ContentEditable component that doesn't lose focus
const ContentEditable: React.FC<{
    html: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}> = ({ html, onChange, placeholder, className }) => {
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    return (
        <div
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: html }}
            className={`outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-2 py-1 min-h-[30px] ${className || ''}`}
            data-placeholder={placeholder}
            style={{
                wordBreak: 'break-word'
            }}
        />
    );
};

export const EditPage: React.FC = () => {
    const { isSidebarOpen } = useEditor();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<PageData | null>(null);
    const [edits, setEdits] = useState<EditableContent[]>([]);
    const [imageEdits, setImageEdits] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    // Hero State
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [heroCtaText, setHeroCtaText] = useState('');
    const [heroCtaUrl, setHeroCtaUrl] = useState('');

    // Sections state
    const [sections, setSections] = useState<any[]>([]);
    const [originalSections, setOriginalSections] = useState<string>('');

    // Load languages
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
            })
            .catch(() => {
                setLanguages([
                    { id: 1, code: 'en', name: 'English', flag: '🇬🇧' },
                    { id: 2, code: 'mk', name: 'Македонски', flag: '🇲🇰' }
                ]);
            });
    }, []);

    // Load page data
    useEffect(() => {
        if (!id) {
            toast.error("Invalid page ID");
            setLoading(false);
            return;
        }

        const url = `${API_BASE}/api/admin/pages/edit/${id}?lang=${selectedLanguage}`;

        setLoading(true);
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(apiResponse => {
                console.log('📥 Full API Response:', apiResponse);

                // Extract language data from nested structure
                let languageData = apiResponse;

                if (apiResponse.languages && Array.isArray(apiResponse.languages)) {
                    const langData = apiResponse.languages.find((l: any) => l.languageCode === selectedLanguage);
                    if (langData) {
                        languageData = {
                            id: apiResponse.id,
                            slug: apiResponse.slug,
                            isPublished: apiResponse.isPublished,
                            languageCode: langData.languageCode,
                            seoTitle: langData.seoTitle,
                            seoDescription: langData.seoDescription,
                            heroTitle: langData.heroTitle,
                            heroSubtitle: langData.heroSubtitle,
                            heroCtaText: langData.heroCtaText,
                            heroCtaUrl: langData.heroCtaUrl,
                            heroImage: langData.heroImage,
                            contentSectionsJson: langData.contentSectionsJson
                        };
                    }
                }

                console.log('📋 Extracted Data:', languageData);

                setData(languageData);

                // Set hero state
                setHeroTitle(languageData.heroTitle || '');
                setHeroSubtitle(languageData.heroSubtitle || '');
                setHeroCtaText(languageData.heroCtaText || '');
                setHeroCtaUrl(languageData.heroCtaUrl || '');

                // Parse sections
                const sectionsJson = languageData.contentSectionsJson;
                if (sectionsJson) {
                    try {
                        const parsed = typeof sectionsJson === 'string' ? JSON.parse(sectionsJson) : sectionsJson;
                        console.log('✅ Sections parsed:', parsed);
                        setSections(Array.isArray(parsed) ? parsed : []);
                        setOriginalSections(JSON.stringify(parsed));
                    } catch (e) {
                        console.error('❌ Parse error:', e);
                        setSections([]);
                        setOriginalSections('[]');
                    }
                } else {
                    console.warn('⚠️ No sections found');
                    setSections([]);
                    setOriginalSections('[]');
                }

                setLoading(false);
                setEdits([]);
                setImageEdits({});
            })
            .catch(err => {
                console.error('❌ Load error:', err);
                toast.error(`Failed to load page`);
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
        trackEdit(path, '', newUrl);
    }, [trackEdit]);

    // Update section field
    const updateSectionField = (index: number, field: string, value: string) => {
        setSections(prev => {
            const newSections = [...prev];
            const capField = field.charAt(0).toUpperCase() + field.slice(1);
            newSections[index] = {
                ...newSections[index],
                [field]: value,
                [capField]: value
            };

            // Track the change
            trackEdit('contentSections', originalSections, JSON.stringify(newSections));
            return newSections;
        });
    };

    // Update section item
    const updateSectionItem = (sectionIndex: number, itemIndex: number, field: string, value: string) => {
        setSections(prev => {
            const newSections = [...prev];
            const section = { ...newSections[sectionIndex] };
            const items = [...(section.Items || section.items || [])];
            const capField = field.charAt(0).toUpperCase() + field.slice(1);

            items[itemIndex] = {
                ...items[itemIndex],
                [field]: value,
                [capField]: value
            };

            section.Items = items;
            section.items = items;
            newSections[sectionIndex] = section;

            trackEdit('contentSections', originalSections, JSON.stringify(newSections));
            return newSections;
        });
    };

    // Add item
    const addItem = (sectionIndex: number, type: string) => {
        setSections(prev => {
            const newSections = [...prev];
            const section = { ...newSections[sectionIndex] };
            const items = [...(section.Items || section.items || [])];

            let newItem: any = {};

            if (type === 'stats') {
                newItem = {
                    Value: '<span style="font-size: 48px; font-weight: 700; color: #dc2626;">0</span>',
                    Label: '<span style="font-size: 14px; color: #64748b;">New Stat</span>'
                };
            } else if (type === 'videos') {
                newItem = {
                    Title: '<span style="font-weight: 600;">New Video</span>',
                    Description: '<span style="color: #64748b;">Description</span>',
                    Url: 'https://youtube.com/watch?v=example'
                };
            } else if (type === 'faq') {
                newItem = {
                    Question: '<span style="font-weight: 500;">Question?</span>',
                    Answer: '<span style="color: #64748b;">Answer</span>'
                };
            } else if (type === 'testimonials') {
                newItem = {
                    Quote: '<span style="color: #1e293b; font-style: italic;">Quote</span>',
                    Author: '<span style="font-weight: 600;">Name</span>',
                    Role: '<span style="color: #64748b;">Role</span>'
                };
            } else if (type === 'coaches') {
                newItem = {
                    Name: '<span style="font-weight: 600;">Coach Name</span>',
                    Title: '<span style="color: #dc2626; font-weight: 500;">Position</span>',
                    Bio: '<span style="color: #64748b;">Biography</span>'
                };
            } else if (type === 'resources') {
                newItem = {
                    Title: '<span style="font-weight: 600;">Resource</span>',
                    Description: '<span style="color: #64748b;">Description</span>',
                    FileUrl: '/uploads/file.pdf',
                    FileType: 'PDF'
                };
            }

            items.push(newItem);
            section.Items = items;
            section.items = items;
            newSections[sectionIndex] = section;

            trackEdit('contentSections', originalSections, JSON.stringify(newSections));
            return newSections;
        });
        toast.success('Item added');
    };

    // Remove item
    const removeItem = (sectionIndex: number, itemIndex: number) => {
        setSections(prev => {
            const newSections = [...prev];
            const section = { ...newSections[sectionIndex] };
            const items = [...(section.Items || section.items || [])];

            items.splice(itemIndex, 1);
            section.Items = items;
            section.items = items;
            newSections[sectionIndex] = section;

            trackEdit('contentSections', originalSections, JSON.stringify(newSections));
            return newSections;
        });
        toast.success('Item removed');
    };

    const handleLanguageChange = (langCode: string) => {
        if (edits.length > 0 && !window.confirm(`Discard ${edits.length} unsaved changes?`)) {
            return;
        }
        setSelectedLanguage(langCode);
    };

    const saveChanges = async () => {
        if (!data?.slug || !id) {
            toast.error("Missing data");
            return;
        }

        try {
            const url = `${API_BASE}/api/admin/pages/${data.slug}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    pageId: parseInt(id),
                    language: selectedLanguage,
                    changes: edits
                })
            });

            if (!response.ok) throw new Error('Save failed');

            toast.success(`✓ Saved (${selectedLanguage.toUpperCase()})`);
            setEdits([]);
            setImageEdits({});
            window.location.reload();
        } catch (err: any) {
            console.error('Save error:', err);
            toast.error(`Save failed`);
        }
    };

    const getField = (obj: any, field: string) => {
        const upper = field.charAt(0).toUpperCase() + field.slice(1);
        return obj[upper] || obj[field.toLowerCase()] || '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="text-center">
                    <p className="text-slate-900 font-medium mb-4">Page not found</p>
                    <button onClick={() => navigate('/admin/pages')} className="bg-slate-900 text-white px-6 py-2 rounded">
                        Back
                    </button>
                </div>
            </div>
        );
    }

    const hero = { image: imageEdits['hero.image'] || data.heroImage };
    const currentLang = languages.find(l => l.code === selectedLanguage);
    const introCard = sections.find((s: any) => (s.Type || s.type || '').toLowerCase() === 'intro-card');
    const mainSections = sections.filter((s: any) => {
        const type = (s.Type || s.type || '').toLowerCase();
        return type !== 'intro-card' && type !== 'featured-programs';
    });

    return (
        <div className="min-h-screen bg-white w-full">
            <Helmet>
                <title>Edit {data.slug} - {currentLang?.name}</title>
            </Helmet>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                * { font-family: 'Inter', sans-serif; }

                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #cbd5e1;
                    pointer-events: none;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -30px); }
                    66% { transform: translate(-20px, 20px); }
                }

                @keyframes floatReverse {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(-40px, 30px); }
                    66% { transform: translate(25px, -25px); }
                }

                .animate-float { animation: float 20s ease-in-out infinite; }
                .animate-float-reverse { animation: floatReverse 25s ease-in-out infinite; }
            `}</style>

            {/* Save Bar */}
            {edits.length > 0 && (
                <div className={`fixed top-0 left-0 bg-slate-900 text-white p-3 shadow-lg z-50 ${isSidebarOpen ? 'right-80' : 'right-16'}`}>
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">{edits.length} changes</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => window.location.reload()} className="px-4 py-1.5 text-sm bg-slate-800 rounded">
                                Discard
                            </button>
                            <button onClick={saveChanges} className="px-6 py-1.5 text-sm bg-red-600 rounded font-medium">
                                💾 Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Bar */}
            <div className={`bg-slate-50 border-b p-3 ${edits.length > 0 ? 'mt-12' : ''}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex gap-4 text-xs text-slate-600">
                        <span className="font-mono">{data.slug}</span>
                        <span className={`px-2 py-0.5 rounded ${data.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {data.isPublished ? '✓' : '⚠'} {data.isPublished ? 'Published' : 'Draft'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <select value={selectedLanguage} onChange={(e) => handleLanguageChange(e.target.value)} className="text-sm border rounded px-3 py-1">
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                            ))}
                        </select>
                        <button onClick={() => window.open(`/${data.slug}`, '_blank')} className="text-sm px-4 py-1 bg-slate-800 text-white rounded">
                            👁
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden"
                style={{
                    backgroundImage: hero.image ? `url('${hero.image.startsWith('/') ? `${API_BASE}${hero.image}` : hero.image}')` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute top-20 right-10 w-96 h-96 bg-slate-400 rounded-full opacity-20 blur-3xl animate-float"></div>
                <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-slate-300 rounded-full opacity-30 blur-3xl animate-float-reverse"></div>

                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
                    <ImageUpload currentImageUrl={hero.image || ""} onImageChange={(url) => trackImageChange('hero.image', url)} label="Hero" />
                </div>

                <div className="container mx-auto px-8 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="w-16 h-1 bg-red-600"></div>

                            <ContentEditable
                                html={heroTitle}
                                onChange={(val) => {
                                    setHeroTitle(val);
                                    trackEdit('hero.title', data.heroTitle || '', val);
                                }}
                                placeholder="Hero Title"
                                className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight"
                            />

                            <ContentEditable
                                html={heroSubtitle}
                                onChange={(val) => {
                                    setHeroSubtitle(val);
                                    trackEdit('hero.subtitle', data.heroSubtitle || '', val);
                                }}
                                placeholder="Hero Subtitle"
                                className="text-lg text-slate-700 leading-relaxed max-w-xl"
                            />

                            <div className="space-y-2">
                                <ContentEditable
                                    html={heroCtaText}
                                    onChange={(val) => {
                                        setHeroCtaText(val);
                                        trackEdit('hero.ctaText', data.heroCtaText || '', val);
                                    }}
                                    placeholder="Button"
                                    className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold"
                                />
                                <input
                                    type="text"
                                    value={heroCtaUrl}
                                    onChange={(e) => {
                                        setHeroCtaUrl(e.target.value);
                                        trackEdit('hero.ctaUrl', data.heroCtaUrl || '', e.target.value);
                                    }}
                                    placeholder="/programs"
                                    className="block w-full max-w-md px-3 py-2 border rounded text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intro Card */}
                {introCard && (
                    <div className="absolute bottom-8 right-8 lg:right-16 z-20 max-w-md hidden lg:block">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border">
                            <ContentEditable
                                html={getField(introCard, 'greeting')}
                                onChange={(val) => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    updateSectionField(idx, 'greeting', val);
                                }}
                                placeholder="Greeting"
                                className="text-2xl md:text-3xl font-light text-slate-900 mb-4"
                            />

                            <ContentEditable
                                html={getField(introCard, 'name')}
                                onChange={(val) => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    updateSectionField(idx, 'name', val);
                                }}
                                placeholder="Name"
                                className="text-lg font-semibold text-slate-900 mb-2"
                            />

                            <ContentEditable
                                html={getField(introCard, 'title')}
                                onChange={(val) => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    updateSectionField(idx, 'title', val);
                                }}
                                placeholder="Title"
                                className="text-sm text-slate-600 italic mb-4"
                            />

                            <ContentEditable
                                html={getField(introCard, 'description')}
                                onChange={(val) => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    updateSectionField(idx, 'description', val);
                                }}
                                placeholder="Description"
                                className="text-slate-600 leading-relaxed"
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* Main Sections */}
            <div className="container mx-auto px-8 py-12 space-y-24">
                {mainSections.map((section, idx) => {
                    const actualIndex = sections.findIndex(s => s === section);
                    const type = (section.Type || section.type || '').toLowerCase();
                    const isSlateBg = ['stats', 'faq', 'testimonials'].includes(type);

                    return (
                        <section key={actualIndex} className={`py-16 -mx-8 px-8 ${isSlateBg ? 'bg-slate-50' : ''}`}>
                            {/* Title */}
                            <div className="text-center mb-12">
                                <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
                                <ContentEditable
                                    html={getField(section, 'title')}
                                    onChange={(val) => updateSectionField(actualIndex, 'title', val)}
                                    placeholder="Title"
                                    className="text-3xl md:text-4xl lg:text-5xl font-light mx-auto max-w-4xl mb-4"
                                />
                                {getField(section, 'subtitle') && (
                                    <ContentEditable
                                        html={getField(section, 'subtitle')}
                                        onChange={(val) => updateSectionField(actualIndex, 'subtitle', val)}
                                        placeholder="Subtitle"
                                        className="text-slate-600 mx-auto max-w-2xl"
                                    />
                                )}
                            </div>

                            {/* Stats */}
                            {type === 'stats' && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {(section.Items || section.items || []).map((stat: any, i: number) => (
                                            <div key={i} className="relative text-center p-6 bg-white border-t-2 border-red-600 rounded shadow group">
                                                <button
                                                    onClick={() => removeItem(actualIndex, i)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 text-xs"
                                                >
                                                    ×
                                                </button>

                                                <div dangerouslySetInnerHTML={{ __html: stat.Value || stat.value || '' }} className="text-4xl font-bold text-red-600 mb-2" />
                                                <div dangerouslySetInnerHTML={{ __html: stat.Label || stat.label || '' }} className="text-xs uppercase text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-8">
                                        <button onClick={() => addItem(actualIndex, 'stats')} className="px-6 py-2 bg-red-600 text-white rounded">
                                            + Add Stat
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Videos */}
                            {type === 'videos' && (
                                <>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {(section.Items || section.items || []).map((video: any, i: number) => (
                                            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow group relative">
                                                <button
                                                    onClick={() => removeItem(actualIndex, i)}
                                                    className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                                <div className="aspect-video bg-slate-900"></div>
                                                <div className="p-6 space-y-3">
                                                    <div dangerouslySetInnerHTML={{ __html: video.Title || video.title || '' }} className="font-semibold text-lg" />
                                                    <input
                                                        type="text"
                                                        value={video.Url || video.url || ''}
                                                        onChange={(e) => updateSectionItem(actualIndex, i, 'url', e.target.value)}
                                                        placeholder="Video URL"
                                                        className="w-full px-3 py-2 text-sm border rounded"
                                                    />
                                                    <div dangerouslySetInnerHTML={{ __html: video.Description || video.description || '' }} className="text-slate-600 text-sm" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-8">
                                        <button onClick={() => addItem(actualIndex, 'videos')} className="px-6 py-2 bg-red-600 text-white rounded">
                                            + Add Video
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* FAQ */}
                            {type === 'faq' && (
                                <>
                                    <div className="max-w-3xl mx-auto space-y-4">
                                        {(section.Items || section.items || []).map((faq: any, i: number) => (
                                            <div key={i} className="bg-white border rounded-lg p-6 group relative">
                                                <button
                                                    onClick={() => removeItem(actualIndex, i)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                                <div dangerouslySetInnerHTML={{ __html: faq.Question || faq.question || '' }} className="font-bold text-slate-900 mb-2" />
                                                <div dangerouslySetInnerHTML={{ __html: faq.Answer || faq.answer || '' }} className="text-sm text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-8">
                                        <button onClick={() => addItem(actualIndex, 'faq')} className="px-6 py-2 bg-red-600 text-white rounded">
                                            + Add FAQ
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Testimonials */}
                            {type === 'testimonials' && (
                                <>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {(section.Items || section.items || []).map((test: any, i: number) => (
                                            <div key={i} className="bg-white border rounded-lg p-6 shadow group relative">
                                                <button
                                                    onClick={() => removeItem(actualIndex, i)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                                <div dangerouslySetInnerHTML={{ __html: test.Quote || test.quote || '' }} className="text-slate-900 italic mb-4" />
                                                <div dangerouslySetInnerHTML={{ __html: test.Author || test.author || '' }} className="font-semibold" />
                                                <div dangerouslySetInnerHTML={{ __html: test.Role || test.role || '' }} className="text-sm text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-8">
                                        <button onClick={() => addItem(actualIndex, 'testimonials')} className="px-6 py-2 bg-red-600 text-white rounded">
                                            + Add Testimonial
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Coaches */}
                            {type === 'coaches' && (
                                <>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {(section.Items || section.items || []).map((coach: any, i: number) => (
                                            <div key={i} className="bg-white border rounded-lg p-6 shadow group relative">
                                                <button
                                                    onClick={() => removeItem(actualIndex, i)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                                <div dangerouslySetInnerHTML={{ __html: coach.Name || coach.name || '' }} className="font-semibold text-lg mb-2" />
                                                <div dangerouslySetInnerHTML={{ __html: coach.Title || coach.title || '' }} className="text-red-600 mb-3" />
                                                <div dangerouslySetInnerHTML={{ __html: coach.Bio || coach.bio || '' }} className="text-sm text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-8">
                                        <button onClick={() => addItem(actualIndex, 'coaches')} className="px-6 py-2 bg-red-600 text-white rounded">
                                            + Add Coach
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Resources */}
                            {type === 'resources' && (
                                <>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {(section.Items || section.items || []).map((resource: any, i: number) => (
                                            <div key={i} className="bg-white border rounded-lg p-6 shadow group relative">
                                                <button
                                                    onClick={() => removeItem(actualIndex, i)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                                <div dangerouslySetInnerHTML={{ __html: resource.Title || resource.title || '' }} className="font-semibold mb-2" />
                                                <div dangerouslySetInnerHTML={{ __html: resource.Description || resource.description || '' }} className="text-sm text-slate-600 mb-3" />
                                                <div className="text-xs text-slate-500">{resource.FileType || 'PDF'}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-8">
                                        <button onClick={() => addItem(actualIndex, 'resources')} className="px-6 py-2 bg-red-600 text-white rounded">
                                            + Add Resource
                                        </button>
                                    </div>
                                </>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
};
