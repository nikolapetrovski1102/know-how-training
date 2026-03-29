import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImageUpload } from '../Components/ImageUpload';
import { FileUpload } from '../Components/FileUpload';
import { useEditor } from '../../Contexts/EditorContext';
import { RichTextEditor } from '../Components/RichTextEditor';
import { VideoEmbed } from '../../Components/UI/VideoEmbed';
import { GripVertical, AlignLeft, AlignCenter, AlignRight, Columns } from 'lucide-react';
import { apiFetch } from '../../Utils/fetchWrapper';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((_, index) => `section-${index}` === active.id);
                const newIndex = items.findIndex((_, index) => `section-${index}` === over.id);
                const newSections = arrayMove(items, oldIndex, newIndex);

                // Use a timeout to ensure state is updated before tracking
                setTimeout(() => {
                    trackEdit('sections', originalSections, JSON.stringify(newSections));
                }, 0);

                return newSections;
            });
        }
    };

    // Load languages
    useEffect(() => {
        apiFetch(`${API_BASE}/api/languages`)
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
        apiFetch(url, {
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
                setHeroTitle(languageData.heroTitle || '');
                setHeroSubtitle(languageData.heroSubtitle || '');
                setHeroCtaText(languageData.heroCtaText || '');
                setHeroCtaUrl(languageData.heroCtaUrl || '');

                const sectionsJson = languageData.contentSectionsJson;
                if (sectionsJson) {
                    try {
                        const parsed = typeof sectionsJson === 'string' ? JSON.parse(sectionsJson) : sectionsJson;
                        setSections(Array.isArray(parsed) ? parsed : []);
                        setOriginalSections(JSON.stringify(parsed));
                    } catch (e) {
                        console.error('❌ Parse error:', e);
                        setSections([]);
                        setOriginalSections('[]');
                    }
                } else {
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

    const updateSectionField = (index: number, field: string, value: any) => {
        setSections(prev => {
            const newSections = [...prev];
            const capField = field.charAt(0).toUpperCase() + field.slice(1);
            newSections[index] = {
                ...newSections[index],
                [field]: value,
                [capField]: value
            };
            console.log('newSections', newSections);

            // ✅ Save the entire sections array when any field changes
            // This ensures dynamic sections are correctly persisted without granular path issues
            trackEdit('sections', originalSections, JSON.stringify(newSections));

            return newSections;
        });
    };


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

            // ✅ Save the entire sections array when any item changes
            trackEdit('sections', originalSections, JSON.stringify(newSections));

            return newSections;
        });
    };


    const addItem = (sectionIndex: number, type: string) => {
        setSections(prev => {
            const newSections = [...prev];
            const section = { ...newSections[sectionIndex] };
            const items = [...(section.Items || section.items || [])];

            let newItem: any = {};
            if (type === 'stats') {
                newItem = {
                    Value: '<span style="font-size: 48px; font-weight: 700; color: #dc2626;">0</span>',
                    value: '<span style="font-size: 48px; font-weight: 700; color: #dc2626;">0</span>',
                    Label: '<span style="font-size: 14px; color: #64748b;">New Stat</span>',
                    label: '<span style="font-size: 14px; color: #64748b;">New Stat</span>'
                };
            } else if (type === 'videos') {
                newItem = {
                    Title: '<span style="font-weight: 600;">New Video</span>',
                    title: '<span style="font-weight: 600;">New Video</span>',
                    Description: '<span style="color: #64748b;">Description</span>',
                    description: '<span style="color: #64748b;">Description</span>',
                    Url: '',
                    url: '',
                    Thumbnail: '',
                    thumbnail: ''
                };
            } else if (type === 'faq') {
                newItem = {
                    Question: '<span style="font-weight: 500;">Question?</span>',
                    question: '<span style="font-weight: 500;">Question?</span>',
                    Answer: '<span style="color: #64748b;">Answer</span>',
                    answer: '<span style="color: #64748b;">Answer</span>'
                };
            } else if (type === 'testimonials') {
                newItem = {
                    Quote: '<span style="color: #1e293b; font-style: italic;">Quote</span>',
                    quote: '<span style="color: #1e293b; font-style: italic;">Quote</span>',
                    Author: '<span style="font-weight: 600;">Name</span>',
                    author: '<span style="font-weight: 600;">Name</span>',
                    Role: '<span style="color: #64748b;">Role</span>',
                    role: '<span style="color: #64748b;">Role</span>'
                };
            } else if (type === 'coaches') {
                newItem = {
                    Name: '<span style="font-weight: 600;">Coach Name</span>',
                    name: '<span style="font-weight: 600;">Coach Name</span>',
                    Title: '<span style="color: #dc2626; font-weight: 500;">Position</span>',
                    title: '<span style="color: #dc2626; font-weight: 500;">Position</span>',
                    Bio: '<span style="color: #64748b;">Biography</span>',
                    bio: '<span style="color: #64748b;">Biography</span>',
                    Image: '',
                    image: ''
                };
            } else if (type === 'resources') {
                newItem = {
                    Title: '<span style="font-weight: 600;">Resource</span>',
                    title: '<span style="font-weight: 600;">Resource</span>',
                    Description: '<span style="color: #64748b;">Description</span>',
                    description: '<span style="color: #64748b;">Description</span>',
                    FileUrl: '',
                    fileUrl: '',
                    FileType: 'PDF',
                    fileType: 'PDF'
                };
            }

            items.push(newItem);
            section.Items = items;
            section.items = items;
            // Default layout values for new items
            if (!section.columns) section.columns = 3;
            if (!section.alignment) section.alignment = 'left';

            newSections[sectionIndex] = section;

            trackEdit('sections', originalSections, JSON.stringify(newSections));

            return newSections;
        });
        toast.success('Item added');
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        setSections(prev => {
            const newSections = [...prev];
            const section = { ...newSections[sectionIndex] };
            const items = [...(section.Items || section.items || [])];

            items.splice(itemIndex, 1);
            section.Items = items;
            section.items = items;
            newSections[sectionIndex] = section;

            trackEdit('sections', originalSections, JSON.stringify(newSections));

            return newSections;
        });
        toast.success('Item removed');
    };

    const addSection = (type: string) => {
        setSections(prev => {
            const newSections = [...prev];
            const newSection: any = {
                type: type,
                title: 'New Section Title',
                subtitle: 'Section Subtitle',
                items: [],
                columns: 3,
                alignment: 'left'
            };

            if (type === 'intro-card') {
                newSection.Greeting = 'Hello';
                newSection.Greeting = 'Hello'; // Support both cases
                newSection.Name = 'I am your coach';
                newSection.name = 'I am your coach';
                newSection.Title = 'Expert Mentor';
                newSection.title = 'Expert Mentor';
                newSection.Description = 'Welcome to the journey of transformation.';
                newSection.description = 'Welcome to the journey of transformation.';
            }

            if (type === 'collaborators') {
                newSection.columns = 5;
                newSection.items = [
                    { image: '', name: 'Company 1' },
                    { image: '', name: 'Company 2' },
                    { image: '', name: 'Company 3' },
                    { image: '', name: 'Company 4' },
                    { image: '', name: 'Company 5' }
                ];
            }
            newSections.push(newSection);
            trackEdit('sections', originalSections, JSON.stringify(newSections));
            return newSections;
        });
        toast.success(`Section ${type} added`);
    };

    const removeSection = (index: number) => {
        if (!window.confirm('Delete this entire section?')) return;
        setSections(prev => {
            const newSections = prev.filter((_, i) => i !== index);
            trackEdit('sections', originalSections, JSON.stringify(newSections));
            return newSections;
        });
        toast.success('Section deleted');
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

            const response = await apiFetch(url, {
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

            const refetchUrl = `${API_BASE}/api/admin/pages/edit/${id}?lang=${selectedLanguage}`;
            const refetchResponse = await apiFetch(refetchUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (refetchResponse.ok) {
                const apiResponse = await refetchResponse.json();
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

                setData(languageData);
                setHeroTitle(languageData.heroTitle || '');
                setHeroSubtitle(languageData.heroSubtitle || '');
                setHeroCtaText(languageData.heroCtaText || '');
                setHeroCtaUrl(languageData.heroCtaUrl || '');

                const sectionsJson = languageData.contentSectionsJson;
                if (sectionsJson) {
                    const parsed = typeof sectionsJson === 'string' ? JSON.parse(sectionsJson) : sectionsJson;
                    setSections(Array.isArray(parsed) ? parsed : []);
                    setOriginalSections(JSON.stringify(parsed));
                }
            }
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
                
                [contenteditable] {
                    text-shadow: #834e4eff 0px 0px 1px;
                    position: relative;
                }
                
                [contenteditable]:not(:focus)::after {
                    content: '✏️';
                    position: absolute;
                    right: -24px;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: 0;
                    transition: opacity 0.2s;
                    font-size: 12px;
                }
                
                [contenteditable]:hover:not(:focus)::after {
                    opacity: 0.5;
                }
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

                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <ImageUpload currentImageUrl={hero.image || ""} onImageChange={(url) => trackImageChange('hero.image', url)} label="Hero" />
                </div>

                <div className="container mx-auto px-8 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="w-16 h-1 bg-red-600"></div>

                            <RichTextEditor
                                value={heroTitle}
                                onChange={(val) => {
                                    setHeroTitle(val);
                                    trackEdit('hero.title', data.heroTitle || '', val);
                                }}
                                placeholder="Hero Title"
                                className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight"
                            />

                            <RichTextEditor
                                value={heroSubtitle}
                                onChange={(val) => {
                                    setHeroSubtitle(val);
                                    trackEdit('hero.subtitle', data.heroSubtitle || '', val);
                                }}
                                placeholder="Hero Subtitle"
                                className="text-lg text-slate-700 leading-relaxed max-w-xl"
                            />

                            <div className="space-y-2">
                                <RichTextEditor
                                    value={heroCtaText}
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

                {introCard && (
                    <div className="absolute bottom-8 right-8 lg:right-16 z-20 max-w-md hidden lg:block group/intro">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border relative">
                            <button
                                onClick={() => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    removeSection(idx);
                                }}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover/intro:opacity-100 transition-opacity flex items-center justify-center shadow-lg z-30"
                                title="Delete Intro Card"
                            >
                                ×
                            </button>
                            <RichTextEditor
                                value={getField(introCard, 'greeting')}
                                onChange={(val) => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    updateSectionField(idx, 'greeting', val);
                                }}
                                placeholder="Greeting"
                                className="text-2xl md:text-3xl font-light text-slate-900 mb-4"
                            />

                            <RichTextEditor
                                value={getField(introCard, 'name')}
                                onChange={(val) => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    updateSectionField(idx, 'name', val);
                                }}
                                placeholder="Name"
                                className="text-lg font-semibold text-slate-900 mb-2"
                            />

                            <RichTextEditor
                                value={getField(introCard, 'title')}
                                onChange={(val) => {
                                    const idx = sections.findIndex(s => s === introCard);
                                    updateSectionField(idx, 'title', val);
                                }}
                                placeholder="Title"
                                className="text-sm text-slate-600 italic mb-4"
                            />

                            <RichTextEditor
                                value={getField(introCard, 'description')}
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

            {/* Sections */}
            <div className="container mx-auto px-8 py-12">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={mainSections.map((s) => `section-${sections.indexOf(s)}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-24">
                            {mainSections.map((section) => {
                                const actualIndex = sections.findIndex(s => s === section);
                                const type = (section.Type || section.type || '').toLowerCase();
                                const styleId = section.styleId || section.StyleId || 0;
                                const isSlateBg = ['stats', 'faq', 'testimonials'].includes(type);

                                return (
                                    <DraggableSectionWrapper
                                        key={actualIndex}
                                        id={`section-${actualIndex}`}
                                        isSlateBg={isSlateBg}
                                        onRemove={() => removeSection(actualIndex)}
                                    >
                                        <div className="w-full relative">

                                            {/* Title */}
                                            <div className={`mb-12 ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'}`}>
                                                <div className={`w-16 h-1 bg-red-600 mb-6 ${(section.alignment || section.Alignment) === 'center' ? 'mx-auto' : (section.alignment || section.Alignment) === 'right' ? 'ml-auto' : 'mr-auto'}`}></div>
                                                <RichTextEditor
                                                    value={getField(section, 'title')}
                                                    onChange={(val) => updateSectionField(actualIndex, 'title', val)}
                                                    placeholder="Title"
                                                    className={`text-3xl md:text-4xl lg:text-5xl font-light max-w-4xl mb-4 ${(section.alignment || section.Alignment) === 'center' ? 'mx-auto' : (section.alignment || section.Alignment) === 'right' ? 'ml-auto' : 'mr-auto'}`}
                                                />
                                                {/* Layout Controls for Grid Sections */}
                                                {['stats', 'videos', 'coaches', 'resources', 'faq', 'testimonials', 'featured-programs', 'hero-banner', 'intro-text', 'feature-grid', 'collaborators'].includes(type) && (
                                                    <div className="mt-4 flex justify-center">
                                                        <div className="flex items-center gap-6 bg-white border rounded-lg px-4 py-2 shadow-sm text-xs font-medium text-slate-600">
                                                            <div className="flex items-center gap-2">
                                                                <Columns size={14} className="text-slate-400" />
                                                                <span className="text-[10px] uppercase tracking-wider text-slate-400">Columns</span>
                                                                <select
                                                                    value={section.columns || section.Columns || 3}
                                                                    onChange={(e) => updateSectionField(actualIndex, 'columns', parseInt(e.target.value))}
                                                                    className="bg-slate-50 border-none focus:ring-0 cursor-pointer outline-none rounded p-1"
                                                                >
                                                                    <option value={2}>2 Columns</option>
                                                                    <option value={3}>3 Columns</option>
                                                                    <option value={4}>4 Columns</option>
                                                                    <option value={5}>5 Columns</option>
                                                                    <option value={6}>6 Columns</option>
                                                                </select>
                                                            </div>
                                                            <div className="h-4 w-px bg-slate-200"></div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] uppercase tracking-wider text-slate-400">Alignment</span>
                                                                <div className="flex bg-slate-100 p-1 rounded-md gap-1">
                                                                    {[
                                                                        { id: 'left', icon: AlignLeft },
                                                                        { id: 'center', icon: AlignCenter },
                                                                        { id: 'right', icon: AlignRight }
                                                                    ].map((align) => (
                                                                        <button
                                                                            key={align.id}
                                                                            onClick={() => updateSectionField(actualIndex, 'alignment', align.id)}
                                                                            className={`p-1.5 rounded transition-all ${(section.alignment || section.Alignment || 'left') === align.id ? 'bg-white shadow-sm text-red-600 border border-red-600' : 'text-slate-400 hover:text-slate-600 bg-slate-200'}`}
                                                                            title={`Align ${align.id}`}
                                                                        >
                                                                            <align.icon size={14} />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="h-4 w-px bg-slate-200"></div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] uppercase tracking-wider text-slate-400">Style</span>
                                                                <select
                                                                    value={styleId}
                                                                    onChange={(e) => updateSectionField(actualIndex, 'styleId', parseInt(e.target.value))}
                                                                    className="bg-slate-50 border-none focus:ring-0 cursor-pointer outline-none rounded p-1"
                                                                >
                                                                    <option value={0}>Default</option>
                                                                    <option value={1}>Minimalist</option>
                                                                    <option value={2}>Bordered</option>
                                                                    <option value={3}>Bold Accent</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hero Banner Editing */}
                                            {type === 'hero-banner' && (
                                                <div className={`space-y-6 ${(section.alignment || section.Alignment) === 'left' ? 'text-left' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-center'}`}>
                                                    <div className="relative aspect-[21/9] bg-slate-100 border-2 border-dashed rounded-lg overflow-hidden group/img text-center flex flex-col items-center justify-center">
                                                        <ImageUpload
                                                            currentImageUrl={section.ImageUrl || section.heroImage || ""}
                                                            onImageChange={(url) => updateSectionField(actualIndex, 'ImageUrl', url)}
                                                            label="Banner Image"
                                                        />
                                                        {(section.ImageUrl || section.heroImage) && (
                                                            <div className="absolute inset-0 -z-10 opacity-20">
                                                                <img
                                                                    src={(section.ImageUrl || section.heroImage).startsWith('/') ? `${API_BASE}${section.ImageUrl || section.heroImage}` : (section.ImageUrl || section.heroImage)}
                                                                    className="w-full h-full object-cover"
                                                                    alt="Preview"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CTA Text</label>
                                                                <RichTextEditor
                                                                    value={section.ctaText || ''}
                                                                    onChange={(val) => updateSectionField(actualIndex, 'ctaText', val)}
                                                                    placeholder="Explore Now"
                                                                    className="border rounded p-2 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CTA URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={section.ctaUrl || ''}
                                                                    onChange={(e) => updateSectionField(actualIndex, 'ctaUrl', e.target.value)}
                                                                    placeholder="/programs"
                                                                    className="w-full border rounded p-3 text-sm focus:ring-2 ring-red-500 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Stats */}
                                            {type === 'stats' && (
                                                <>
                                                    <div className={`grid grid-cols-2 md:${(section.columns || section.Columns) === 2 ? 'grid-cols-2' : (section.columns || section.Columns) === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-8 ${styleId === 3 ? 'p-8 bg-red-600 rounded-xl' : ''}`}>
                                                        {(section.Items || section.items || []).map((stat: any, i: number) => (
                                                            <div key={i} className={`relative p-6 group/item ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'} ${styleId === 1 ? 'bg-white' :
                                                                styleId === 2 ? 'bg-white border border-red-200 rounded-lg shadow-sm' :
                                                                    styleId === 3 ? 'bg-red-700/50 rounded-lg border border-white/20' :
                                                                        'bg-white border-t-2 border-red-600 rounded shadow'
                                                                }`}>
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover/item:opacity-100 text-xs z-10"
                                                                >
                                                                    ×
                                                                </button>

                                                                <RichTextEditor
                                                                    value={stat.Value || stat.value || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'value', val)}
                                                                    placeholder="Value"
                                                                    className={`text-4xl font-bold mb-2 ${styleId === 3 ? 'text-white' : 'text-red-600'}`}
                                                                />
                                                                <RichTextEditor
                                                                    value={stat.Label || stat.label || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'label', val)}
                                                                    placeholder="Label"
                                                                    className={`text-xs uppercase ${styleId === 3 ? 'text-red-100' : 'text-slate-600'}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'stats')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                                                            + Add Stat
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Videos */}
                                            {type === 'videos' && (
                                                <>
                                                    <div className={`grid md:grid-cols-2 lg:${(section.columns || section.Columns) === 2 ? 'grid-cols-2' : (section.columns || section.Columns) === 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-8`}>
                                                        {(section.Items || section.items || []).map((video: any, i: number) => (
                                                            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow group/item relative">
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 z-10 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover/item:opacity-100"
                                                                >
                                                                    ×
                                                                </button>
                                                                <div className="aspect-video bg-slate-900 overflow-hidden">
                                                                    <VideoEmbed url={video.Url || video.url || ''} />
                                                                </div>
                                                                <div className={`p-6 space-y-4 ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'}`}>
                                                                    <ImageUpload
                                                                        currentImageUrl={video.Thumbnail || video.thumbnail || ''}
                                                                        onImageChange={(url) => updateSectionItem(actualIndex, i, 'thumbnail', url)}
                                                                        label="Thumbnail (Optional)"
                                                                    />
                                                                    <RichTextEditor
                                                                        value={video.Title || video.title || ''}
                                                                        onChange={(val) => updateSectionItem(actualIndex, i, 'title', val)}
                                                                        placeholder="Title"
                                                                        className="font-semibold text-lg"
                                                                    />
                                                                    <div className="space-y-1">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Video Link</label>
                                                                        <input
                                                                            type="text"
                                                                            value={video.Url || video.url || ''}
                                                                            onChange={(e) => updateSectionItem(actualIndex, i, 'url', e.target.value)}
                                                                            placeholder="https://youtube.com/..."
                                                                            className="w-full px-3 py-2 text-sm border rounded outline-none focus:ring-1 ring-red-500"
                                                                        />
                                                                    </div>
                                                                    <RichTextEditor
                                                                        value={video.Description || video.description || ''}
                                                                        onChange={(val) => updateSectionItem(actualIndex, i, 'description', val)}
                                                                        placeholder="Description"
                                                                        className="text-slate-600 text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'videos')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                                                            + Add Video
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* FAQ */}
                                            {type === 'faq' && (
                                                <>
                                                    <div className={`space-y-4 ${(section.alignment || section.Alignment) === 'center' ? 'mx-auto' : (section.alignment || section.Alignment) === 'right' ? 'ml-auto' : ''}`} style={{ maxWidth: '48rem' }}>
                                                        {(section.Items || section.items || []).map((faq: any, i: number) => (
                                                            <div key={i} className={`group/item relative ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'} ${styleId === 1 ? 'bg-white py-4 border-b border-slate-100' :
                                                                styleId === 2 ? 'bg-white border-2 border-red-500 rounded-xl p-6 mb-4 shadow-sm' :
                                                                    styleId === 3 ? 'bg-red-600 p-6 rounded-lg mb-3 shadow-md border border-white/20' :
                                                                        'bg-white border rounded-lg p-6 mb-3'
                                                                }`}>
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover/item:opacity-100 z-10"
                                                                >
                                                                    ×
                                                                </button>
                                                                <RichTextEditor
                                                                    value={faq.Question || faq.question || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'question', val)}
                                                                    placeholder="Question"
                                                                    className={`font-bold mb-2 ${styleId === 3 ? 'text-white' : 'text-slate-900'}`}
                                                                />
                                                                <RichTextEditor
                                                                    value={faq.Answer || faq.answer || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'answer', val)}
                                                                    placeholder="Answer"
                                                                    className={`text-sm ${styleId === 3 ? 'text-red-50' : 'text-slate-600'}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'faq')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                                                            + Add FAQ
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Testimonials */}
                                            {/* Featured Programs */}
                                            {type === 'featured-programs' && (
                                                <div className="p-8 bg-slate-50 border rounded-lg text-center">
                                                    <p className="text-slate-500 italic">Featured Programs section automatically displays the latest programs.</p>
                                                    <p className="text-xs text-slate-400 mt-2">Use the layout controls above to change columns and alignment.</p>
                                                </div>
                                            )}

                                            {/* Feature Grid */}
                                            {type === 'feature-grid' && (
                                                <>
                                                    <div className={`grid md:grid-cols-2 lg:${(section.columns || section.Columns) === 3 ? 'grid-cols-3' : (section.columns || section.Columns) === 4 ? 'grid-cols-4' : 'grid-cols-2'} gap-8`}>
                                                        {(section.Items || section.items || []).map((feature: any, i: number) => (
                                                            <div key={i} className={`bg-white border rounded-lg p-6 shadow group/item relative ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'}`}>
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover/item:opacity-100"
                                                                >
                                                                    ×
                                                                </button>
                                                                <RichTextEditor
                                                                    value={feature.Icon || feature.icon || '⭐'}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'icon', val)}
                                                                    placeholder="Icon (Emoji)"
                                                                    className="text-4xl mb-4"
                                                                />
                                                                <RichTextEditor
                                                                    value={feature.Title || feature.title || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'title', val)}
                                                                    placeholder="Title"
                                                                    className="font-semibold text-lg mb-2"
                                                                />
                                                                <RichTextEditor
                                                                    value={feature.Description || feature.description || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'description', val)}
                                                                    placeholder="Description"
                                                                    className="text-sm text-slate-600"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'feature-grid')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                                                            + Add Feature
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Intro Text */}
                                            {type === 'intro-text' && (
                                                <div className={`max-w-4xl ${(section.alignment || section.Alignment) === 'center' ? 'mx-auto text-center' : (section.alignment || section.Alignment) === 'right' ? 'ml-auto text-right' : 'text-left'}`}>
                                                    <RichTextEditor
                                                        value={section.Description || section.description || ''}
                                                        onChange={(val) => updateSectionField(actualIndex, 'description', val)}
                                                        placeholder="Main body text..."
                                                        className="text-lg text-slate-700 leading-relaxed"
                                                    />
                                                </div>
                                            )}
                                            {type === 'testimonials' && (
                                                <>
                                                    <div className={`grid md:grid-cols-2 lg:${(section.columns || section.Columns) === 3 ? 'grid-cols-3' : (section.columns || section.Columns) === 4 ? 'grid-cols-4' : 'grid-cols-2'} gap-8`}>
                                                        {(section.Items || section.items || []).map((test: any, i: number) => (
                                                            <div key={i} className={`group/item relative ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'} ${styleId === 1 ? 'bg-white p-6 transition-all' :
                                                                styleId === 2 ? 'bg-white border-l-4 border-red-600 rounded-lg p-6 shadow-sm mb-4' :
                                                                    styleId === 3 ? 'bg-slate-900 p-8 rounded-2xl shadow-xl' :
                                                                        'bg-white border rounded-lg p-6 shadow-sm'
                                                                }`}>
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover/item:opacity-100 z-10"
                                                                >
                                                                    ×
                                                                </button>
                                                                <RichTextEditor
                                                                    value={test.Quote || test.quote || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'quote', val)}
                                                                    placeholder="Quote"
                                                                    className={`italic mb-4 ${styleId === 3 ? 'text-slate-100 text-lg' : 'text-slate-900'}`}
                                                                />
                                                                <RichTextEditor
                                                                    value={test.Author || test.author || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'author', val)}
                                                                    placeholder="Author"
                                                                    className={`font-semibold ${styleId === 3 ? 'text-white' : 'text-slate-900'}`}
                                                                />
                                                                <RichTextEditor
                                                                    value={test.Role || test.role || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'role', val)}
                                                                    placeholder="Role"
                                                                    className={`text-sm ${styleId === 3 ? 'text-red-500 font-medium' : 'text-slate-600'}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'testimonials')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                                                            + Add Testimonial
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Coaches */}
                                            {type === 'coaches' && (
                                                <>
                                                    <div className={`grid md:grid-cols-2 lg:${(section.columns || section.Columns) === 2 ? 'grid-cols-2' : (section.columns || section.Columns) === 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-8`}>
                                                        {(section.Items || section.items || []).map((coach: any, i: number) => (
                                                            <div key={i} className={`group/item relative ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'} ${styleId === 1 ? 'bg-white' :
                                                                styleId === 2 ? 'bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden' :
                                                                    styleId === 3 ? 'bg-slate-800 rounded-lg shadow-xl' :
                                                                        'bg-white border rounded-lg shadow-sm'
                                                                } ${styleId !== 3 && styleId !== 1 ? 'p-6' : ''}`}>
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover/item:opacity-100 z-10"
                                                                >
                                                                    ×
                                                                </button>
                                                                <div className={styleId === 1 ? 'mb-4 p-4' : styleId === 2 || styleId === 3 ? '' : 'mb-4'}>
                                                                    <ImageUpload
                                                                        currentImageUrl={coach.Image || coach.image || ''}
                                                                        onImageChange={(url) => updateSectionItem(actualIndex, i, 'image', url)}
                                                                        label="Coach Photo"
                                                                    />
                                                                </div>
                                                                <div className={styleId === 2 || styleId === 3 ? 'p-6' : ''}>
                                                                    <RichTextEditor
                                                                        value={coach.Name || coach.name || ''}
                                                                        onChange={(val) => updateSectionItem(actualIndex, i, 'name', val)}
                                                                        placeholder="Name"
                                                                        className={`font-semibold text-lg mb-2 ${styleId === 3 ? 'text-white' : 'text-slate-900'}`}
                                                                    />
                                                                    <RichTextEditor
                                                                        value={coach.Title || coach.title || ''}
                                                                        onChange={(val) => updateSectionItem(actualIndex, i, 'title', val)}
                                                                        placeholder="Title"
                                                                        className={`mb-3 ${styleId === 3 ? 'text-red-400' : 'text-red-600'}`}
                                                                    />
                                                                    <RichTextEditor
                                                                        value={coach.Bio || coach.bio || ''}
                                                                        onChange={(val) => updateSectionItem(actualIndex, i, 'bio', val)}
                                                                        placeholder="Bio"
                                                                        className={`text-sm ${styleId === 3 ? 'text-slate-300' : 'text-slate-600'}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'coaches')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                                                            + Add Coach
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Collaborators */}
                                            {type === 'collaborators' && (
                                                <>
                                                    <div className={`grid grid-cols-2 lg:grid-cols-${section.columns || section.Columns || 5} gap-8 ${styleId === 3 ? 'p-8 bg-slate-900 rounded-xl' : styleId === 2 ? 'p-8 bg-slate-50 rounded-xl' : ''}`}>
                                                        {(section.Items || section.items || []).map((collab: any, i: number) => (
                                                            <div key={i} className={`group/item relative p-4 flex flex-col items-center transition-all ${styleId === 1 ? 'bg-white opacity-50 grayscale hover:opacity-100 hover:grayscale-0' :
                                                                styleId === 2 ? 'bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md' :
                                                                    styleId === 3 ? 'bg-slate-800 border border-slate-700 rounded-xl invert brightness-0 hover:brightness-100' :
                                                                        'bg-white border rounded-lg shadow-sm hover:scale-105'
                                                                }`}>
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 z-10 text-xs flex items-center justify-center transform hover:scale-110 transition-transform"
                                                                >
                                                                    ×
                                                                </button>
                                                                <ImageUpload
                                                                    currentImageUrl={collab.Image || collab.image || ''}
                                                                    onImageChange={(url) => updateSectionItem(actualIndex, i, 'image', url)}
                                                                    label="Logo"
                                                                />
                                                                <RichTextEditor
                                                                    value={collab.Name || collab.name || ''}
                                                                    onChange={(val: string) => updateSectionItem(actualIndex, i, 'name', val)}
                                                                    placeholder="Name"
                                                                    className={`mt-2 text-[10px] font-bold uppercase tracking-widest text-center ${styleId === 3 ? 'text-slate-400' : 'text-slate-400'}`}
                                                                />
                                                                <div className="mt-2 w-full">
                                                                    <label className={`text-[9px] uppercase tracking-wider block mb-1 ${styleId === 3 ? 'text-slate-500' : 'text-slate-400'}`}>Custom Width</label>
                                                                    <input
                                                                        type="text"
                                                                        value={collab.Width || collab.width || ''}
                                                                        onChange={(e) => updateSectionItem(actualIndex, i, 'width', e.target.value)}
                                                                        placeholder="e.g. 120px"
                                                                        className={`w-full border rounded p-1 text-[10px] outline-none focus:ring-1 ring-red-500 ${styleId === 3 ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'collaborators')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 shadow-lg transform active:scale-95 transition-all">
                                                            + Add Logo
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Resources */}
                                            {type === 'resources' && (
                                                <>
                                                    <div className={`grid md:grid-cols-2 lg:${(section.columns || section.Columns) === 2 ? 'grid-cols-2' : (section.columns || section.Columns) === 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-8`}>
                                                        {(section.Items || section.items || []).map((resource: any, i: number) => (
                                                            <div key={i} className={`bg-white border rounded-lg p-6 shadow group/item relative ${(section.alignment || section.Alignment) === 'center' ? 'text-center' : (section.alignment || section.Alignment) === 'right' ? 'text-right' : 'text-left'}`}>
                                                                <button
                                                                    onClick={() => removeItem(actualIndex, i)}
                                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover/item:opacity-100"
                                                                >
                                                                    ×
                                                                </button>
                                                                <RichTextEditor
                                                                    value={resource.Title || resource.title || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'title', val)}
                                                                    placeholder="Title"
                                                                    className="font-semibold mb-2"
                                                                />
                                                                <RichTextEditor
                                                                    value={resource.Description || resource.description || ''}
                                                                    onChange={(val) => updateSectionItem(actualIndex, i, 'description', val)}
                                                                    placeholder="Description"
                                                                    className="text-sm text-slate-600 mb-4"
                                                                />
                                                                <FileUpload
                                                                    currentFileUrl={resource.FileUrl || resource.fileUrl || ''}
                                                                    onFileChange={(url) => {
                                                                        updateSectionItem(actualIndex, i, 'fileUrl', url);
                                                                        // Automatically detect file type from extension
                                                                        const ext = url.split('.').pop()?.toUpperCase() || 'PDF';
                                                                        updateSectionItem(actualIndex, i, 'fileType', ext);
                                                                    }}
                                                                    label="Resource File"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center mt-8">
                                                        <button onClick={() => addItem(actualIndex, 'resources')} className="px-6 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                                                            + Add Resource
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </DraggableSectionWrapper>
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>

                {/* Add Section Controls */}
                <div className="py-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-6 bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-widest">Add New Section</h3>
                    <div className="flex flex-wrap justify-center gap-3 max-w-2xl px-8">
                        {['Collaborators', 'Intro-Card', 'Hero-Banner', 'Stats', 'Videos', 'FAQ', 'Testimonials', 'Coaches', 'Resources', 'Intro-Text', 'Featured-Programs'].map(type => (
                            <button
                                key={type}
                                onClick={() => addSection(type.toLowerCase())}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-red-600 hover:text-red-600 transition-all shadow-sm active:scale-95"
                            >
                                + {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

interface DraggableSectionWrapperProps {
    id: string;
    isSlateBg: boolean;
    onRemove: () => void;
    children: React.ReactNode;
}

const DraggableSectionWrapper: React.FC<DraggableSectionWrapperProps> = ({
    id,
    isSlateBg,
    onRemove,
    children
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <section
            ref={setNodeRef}
            style={style}
            className={`py-16 -mx-8 px-8 border-b relative group/section ${isSlateBg ? 'bg-slate-50' : ''} ${isDragging ? 'opacity-50 shadow-2xl border-red-200' : ''}`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 left-4 opacity-0 group-hover/section:opacity-100 flex items-center justify-center w-10 h-10 bg-white border rounded shadow-sm cursor-grab active:cursor-grabbing text-slate-500 hover:text-red-600 transition-all z-20"
                title="Drag to reorder"
            >
                <GripVertical size={20} />
            </div>

            {/* Section Controls */}
            <div className="absolute top-4 right-4 opacity-0 group-hover/section:opacity-100 flex gap-2 z-20">
                <button
                    onClick={onRemove}
                    className="p-2 bg-red-50/80 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 rounded text-xs transition-all font-medium"
                >
                    Delete Section
                </button>
            </div>

            {children}
        </section>
    );
};
