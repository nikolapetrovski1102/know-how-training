import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import type { ContentSection, PageData } from '../Types/page';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

export const Home: React.FC = () => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    fetch(`${API_BASE}/api/pages/home?lang=${currentLanguage}`)
      .then(res => res.json())
      .then(apiResponse => {
        console.log('Home API Response:', apiResponse); // DEBUG
        
        // Support both contentSections and contentSectionsJson
        const sectionsJson = apiResponse.contentSections || apiResponse.contentSectionsJson;
        
        const transformedData: PageData = {
          id: apiResponse.id,
          slug: apiResponse.slug,
          isPublished: apiResponse.isPublished,
          languageCode: apiResponse.languageCode,
          
          content: {
            hero: {
              title: apiResponse.heroTitle,
              subtitle: apiResponse.heroSubtitle,
              ctaText: apiResponse.heroCtaText,
              ctaUrl: apiResponse.heroCtaUrl,
              image: apiResponse.heroImage
            },
            seo: {
              title: apiResponse.seoTitle,
              description: apiResponse.seoDescription
            },
            sections: sectionsJson
              ? JSON.parse(sectionsJson)
              : []
          },
          
          programs: apiResponse.programs || []
        };

        setData(transformedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load home page:', err);
        setLoading(false);
      });
  }, [currentLanguage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!data?.content?.hero) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-slate-600">Content not available</p>
      </div>
    );
  }

  const { hero, seo, sections } = data.content;

  let validSections: ContentSection[] = [];
  
  if (Array.isArray(sections)) {
    validSections = sections.map((s: any) => ({
      type: (s.Type || s.type || '').toLowerCase(),
      title: s.Title || s.title,
      subtitle: s.Subtitle || s.subtitle,
      greeting: s.Greeting || s.greeting,
      name: s.Name || s.name,
      description: s.Description || s.description,
      items: s.Items || s.items,
      logos: s.Logos || s.logos
    })).filter((s: ContentSection) => s.type && s.type.trim() !== '');
  }

  const introCard = validSections.find((s: ContentSection) => s.type === 'intro-card');
  const stats = validSections.find((s: ContentSection) => s.type === 'stats');
  const featuredSection = validSections.find((s: ContentSection) => s.type === 'featured-programs');
  const testimonials = validSections.find((s: ContentSection) => s.type === 'testimonials');

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{seo?.title}</title>
        {seo?.description && <meta name="description" content={seo.description} />}
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        @keyframes floatReverse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-40px, 30px) scale(1.08);
          }
          66% {
            transform: translate(25px, -25px) scale(0.92);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: floatReverse 25s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 8s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white">
        
        {/* Animated Background Circles */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-slate-100 rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-slate-50 rounded-full opacity-40 blur-3xl animate-float-reverse"></div>
        
        {/* Red accent circle */}
        <div className="absolute top-40 right-32 w-32 h-32 bg-red-600 rounded-full blur-2xl animate-pulse-slow"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-slate-100 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '5s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-slate-50 rounded-full opacity-25 blur-3xl animate-float-reverse" style={{ animationDelay: '3s' }}></div>
        
        {/* Hero Image */}
        {hero.image && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
            <img
              src={hero.image.startsWith('/') ? `${API_BASE}${hero.image}` : hero.image}
              alt=""
              className="w-auto h-[90vh] object-contain opacity-80"
              style={{
                mixBlendMode: 'multiply'
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 10%, transparent 20%, transparent 80%, rgba(255,255,255,0.8) 90%, rgba(255,255,255,1) 100%)'
              }}
            />
          </div>
        )}

        <div className="container mx-auto px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content - REMOVED color/size classes to allow inline styles */}
            <div className="space-y-8">
              <div className="w-16 h-1 bg-red-600 mb-4 animate-fade-in"></div>
              
              {hero.title && (
                <h1 
                  className="leading-tight tracking-tight animate-fade-in-up animation-delay-200"
                  dangerouslySetInnerHTML={{ __html: hero.title }}
                />
              )}

              {hero.subtitle && (
                <p 
                  className="leading-relaxed max-w-xl animate-fade-in-up animation-delay-400"
                  dangerouslySetInnerHTML={{ __html: hero.subtitle }}
                />
              )}

              {hero.ctaText && (
                <div className="animate-fade-in-up animation-delay-600">
                  <Link
                    to={hero.ctaUrl || '#'}
                    className="inline-block bg-red-600 text-white px-8 py-3 rounded font-medium text-sm tracking-wide hover:bg-red-700 transition-all shadow-sm hover:shadow-lg hover:scale-105"
                  >
                    <span dangerouslySetInnerHTML={{ __html: hero.ctaText }} />
                  </Link>
                </div>
              )}
            </div>

            {/* Right Side - Intro Card - REMOVED color/size classes */}
            {introCard && (
              <div className="relative animate-fade-in-up animation-delay-400">
                <div className="bg-white border-l-4 border-red-600 shadow-sm rounded p-8 max-w-sm mx-auto lg:ml-auto hover:shadow-lg transition-shadow">
                  {introCard.greeting && (
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{ __html: introCard.greeting }}
                    />
                  )}
                  
                  {introCard.description && (
                    <div
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: introCard.description }}
                    />
                  )}
                  
                  {introCard.name && (
                    <>
                      <div
                        className="mt-4"
                        dangerouslySetInnerHTML={{ __html: introCard.name }}
                      />
                      {introCard.title && (
                        <div
                          className="mt-1"
                          dangerouslySetInnerHTML={{ __html: introCard.title }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section - REMOVED color/size classes */}
      {stats && stats.items && stats.items.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-8">
            {stats.title && (
              <div className="text-center mb-16">
                <h2
                  className="tracking-tight"
                  dangerouslySetInnerHTML={{ __html: stats.title }}
                />
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.items.map((stat: any, idx: number) => (
                <div key={idx} className="text-center p-6 bg-white border-t-2 border-red-600 rounded shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="mb-2"
                    dangerouslySetInnerHTML={{ __html: stat.value || stat.Value || '' }}
                  />
                  <div
                    className="uppercase tracking-wider"
                    dangerouslySetInnerHTML={{ __html: stat.label || stat.Label || '' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Programs */}
      {data.programs && data.programs.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-8">
            {featuredSection?.title && (
              <>
                <h2 className="text-3xl font-light text-slate-900 text-center mb-4">
                  <span>
                    <span dangerouslySetInnerHTML={{ __html: featuredSection.title }} />
                  </span>
                </h2>
              </>
            )}
            
            {featuredSection?.subtitle && (
              <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: featuredSection.subtitle }} />
            )}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.programs.slice(0, 6).map(program => (
                <Link
                  key={program.id}
                  to={`/programs/${program.slug}`}
                  className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {program.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={program.imageUrl.startsWith('/') ? `${API_BASE}${program.imageUrl}` : program.imageUrl}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {program.categoryName && (
                      <span className="text-xs text-red-600 font-medium uppercase tracking-wider">
                        {program.categoryName}
                      </span>
                    )}
                    
                    {program.durationHours && (
                      <span className="text-xs text-slate-500 ml-3">
                        {program.durationHours}h
                      </span>
                    )}
                    
                    <h3 className="text-xl font-medium text-slate-900 mt-2 mb-3">
                      {program.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {program.shortDescription}
                    </p>
                    
                    <span className="text-red-600 text-sm font-medium group-hover:underline">
                      Learn More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-8">
            {testimonials.title && (
              <>
                <h2 className="text-3xl font-light text-slate-900 text-center mb-12">
                  {testimonials.title}
                </h2>
              </>
            )}
            
            {testimonials.logos && testimonials.logos.length > 0 && (
              <div className="flex flex-wrap justify-center items-center gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                {testimonials.logos.map((logo: any, idx: number) => (
                  <div key={idx} className="h-12">
                    <img
                      src={logo.image}
                      alt={logo.name}
                      className="h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
