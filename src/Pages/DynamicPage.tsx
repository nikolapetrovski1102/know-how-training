import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import type { PageData, ContentSection } from '../Types/page';
import { useLanguage } from '../Contexts/LanguageContext';
import { PageContentRenderer } from '../Components/PageContentRenderer';
import { apiFetch } from '../Utils/fetchWrapper';
import { IntroCard } from '../Components/Sections/IntroCard';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

export const DynamicPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentLanguage } = useLanguage();

    useEffect(() => {
        console.log("slug", slug);
        if (!slug) return;

        const endpoint = `${API_BASE}/api/pages/${slug}?lang=${currentLanguage}`;

        setLoading(true);
        apiFetch(endpoint)
            .then(res => {
                if (!res.ok) throw new Error('Page not found');
                return res.json();
            })
            .then(apiResponse => {
                console.log('Page API Response:', apiResponse);

                const sectionsJson = apiResponse.contentSections || apiResponse.contentSectionsJson;

                const transformedData: PageData = {
                    id: apiResponse.id,
                    slug: apiResponse.slug,
                    isPublished: apiResponse.isPublished,
                    languageCode: apiResponse.languageCode,

                    seoTitle: apiResponse.seoTitle,
                    seoDescription: apiResponse.seoDescription,

                    heroTitle: apiResponse.heroTitle,
                    heroSubtitle: apiResponse.heroSubtitle,
                    heroCtaText: apiResponse.heroCtaText,
                    heroCtaUrl: apiResponse.heroCtaUrl,
                    heroImage: apiResponse.heroImage,

                    contentSectionsJson: sectionsJson,

                    programs: apiResponse.programs || []
                };

                setData(transformedData);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Failed to load page ${slug}:`, err);
                setLoading(false);
                setData(null);
            });
    }, [slug, currentLanguage]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
                    <p className="text-slate-600 mb-6">Page not found</p>
                    <Link to="/" className="text-red-600 hover:text-red-700 font-medium">
                        Go back home
                    </Link>
                </div>
            </div>
        );
    }

    const { heroTitle, heroSubtitle, heroCtaText, heroCtaUrl, heroImage, seoTitle, seoDescription } = data;

    // Parse sections
    let sections: ContentSection[] = [];
    try {
        const rawSections = data.contentSectionsJson ? JSON.parse(data.contentSectionsJson) : [];
        if (Array.isArray(rawSections)) {
            sections = rawSections.map((s: any) => ({
                type: (s.Type || s.type || '').toLowerCase(),
                title: s.Title || s.title,
                subtitle: s.Subtitle || s.subtitle,
                greeting: s.Greeting || s.greeting,
                name: s.Name || s.name,
                description: s.Description || s.description,
                items: s.Items || s.items,
                logos: s.Logos || s.logos,
                ...s
            })).filter((s: ContentSection) => s.type && s.type.trim() !== '');
        }
    } catch (e) {
        console.error("Failed to parse sections", e);
    }

    const introCard = sections.find((s: any) => s.type === 'intro-card');
    const mainSections = sections.filter((s: any) => s.type !== 'intro-card');

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{seoTitle}</title>
                {seoDescription && <meta name="description" content={seoDescription} />}
            </Helmet>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.08); }
          66% { transform: translate(25px, -25px) scale(0.92); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-reverse { animation: floatReverse 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 8s ease-in-out infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
        .animation-delay-400 { animation-delay: 0.4s; opacity: 0; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
      `}</style>

            {/* Default Hero Section */}
            <section className="relative min-h-[60vh] h-[100vh] flex items-center overflow-hidden"
                style={{
                    backgroundImage: heroImage ? `url('${API_BASE}${heroImage}')` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Animated Background Circles */}
                <div className="absolute top-20 right-10 w-96 h-96 bg-slate-400 rounded-full opacity-20 blur-3xl animate-float"></div>
                <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-slate-300 rounded-full opacity-30 blur-3xl animate-float-reverse"></div>
                <div className="absolute top-40 right-32 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-2xl animate-pulse-slow"></div>

                <div className="container px-8 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="w-16 h-1 bg-red-600 mb-4 animate-fade-in"></div>

                            {heroTitle && (
                                <h1
                                    className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight animate-fade-in-up animation-delay-200"
                                    dangerouslySetInnerHTML={{ __html: heroTitle }}
                                />
                            )}

                            {heroSubtitle && (
                                <p
                                    className="text-lg text-slate-700 leading-relaxed max-w-xl animate-fade-in-up animation-delay-400"
                                    dangerouslySetInnerHTML={{ __html: heroSubtitle }}
                                />
                            )}

                            {heroCtaText && (
                                <div className="animate-fade-in-up animation-delay-600">
                                    <Link
                                        to={heroCtaUrl || '#'}
                                        className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-base tracking-wide hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: heroCtaText }} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="hidden lg:block"></div>
                    </div>
                </div>

                {introCard && <IntroCard {...introCard} />}
            </section>

            {/* Main Content Sections */}
            <PageContentRenderer sections={mainSections} programs={data.programs} />

        </div>
    );
};
