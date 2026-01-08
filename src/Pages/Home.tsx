import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import type { ContentSection, PageData } from '../Types/page';
import { useLanguage } from '../contexts/LanguageContext';
import { getImageUrl } from '../utils/imageHelper';

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

  // New section types
  const videos = validSections.find((s: ContentSection) => s.type === 'videos');
  const coaches = validSections.find((s: ContentSection) => s.type === 'coaches' || s.type === 'instructors');
  console.log(coaches);
  const resources = validSections.find((s: ContentSection) => s.type === 'resources' || s.type === 'pdfs');
  const faq = validSections.find((s: ContentSection) => s.type === 'faq');

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
      <section className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: hero.image ? `url('${API_BASE}${hero.image}')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        {/* Overlay for better text readability */}

        {/* Animated Background Circles */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-slate-400 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-slate-300 rounded-full opacity-30 blur-3xl animate-float-reverse"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-2xl animate-pulse-slow"></div>

        <div className="container mx-auto px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              <div className="w-16 h-1 bg-red-600 mb-4 animate-fade-in"></div>

              {hero.title && (
                <h1
                  className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight animate-fade-in-up animation-delay-200"
                  dangerouslySetInnerHTML={{ __html: hero.title }}
                />
              )}

              {hero.subtitle && (
                <p
                  className="text-lg text-slate-700 leading-relaxed max-w-xl animate-fade-in-up animation-delay-400"
                  dangerouslySetInnerHTML={{ __html: hero.subtitle }}
                />
              )}

              {hero.ctaText && (
                <div className="animate-fade-in-up animation-delay-600">
                  <Link
                    to={hero.ctaUrl || '#'}
                    className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-base tracking-wide hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span dangerouslySetInnerHTML={{ __html: hero.ctaText }} />
                  </Link>
                </div>
              )}
            </div>

            {/* Empty div to maintain grid structure on mobile */}
            <div className="lg:hidden"></div>
          </div>
        </div>

        {/* Intro Card - Positioned absolutely relative to section, outside grid */}
        {introCard && (
          <div className="hidden lg:block absolute bottom-8 right-8 z-20 animate-fade-in-up animation-delay-400 max-w-sm">
            <div className="bg-white/95 backdrop-blur-sm border-l-4 border-red-600 shadow-xl rounded-lg p-6 hover:shadow-2xl transition-all duration-300">
              {introCard.greeting && (
                <div
                  className="mb-4 text-slate-900 font-semibold text-lg"
                  dangerouslySetInnerHTML={{ __html: introCard.greeting }}
                />
              )}

              {introCard.description && (
                <div
                  className="leading-relaxed text-sm text-slate-700 mb-4"
                  dangerouslySetInnerHTML={{ __html: introCard.description }}
                />
              )}

              {introCard.name && (
                <>
                  <div
                    className="mt-4 font-bold text-slate-900 text-base"
                    dangerouslySetInnerHTML={{ __html: introCard.name }}
                  />
                  {introCard.title && (
                    <div
                      className="mt-1 text-xs font-medium text-slate-600 uppercase tracking-wide"
                      dangerouslySetInnerHTML={{ __html: introCard.title }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </section>


      {/* Stats Section */}
      {stats && stats.items && stats.items.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-8">
            {stats.title && (
              <div className="text-center mb-12 md:mb-16">
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight"
                  dangerouslySetInnerHTML={{ __html: stats.title }}
                />
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {stats.items.map((stat: any, idx: number) => (
                <div key={idx} className="text-center p-4 md:p-6 bg-white border-t-2 border-red-600 rounded shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="mb-2 text-3xl md:text-4xl lg:text-5xl font-bold text-red-600"
                    dangerouslySetInnerHTML={{ __html: stat.value || stat.Value || '' }}
                  />
                  <div
                    className="text-xs md:text-sm uppercase tracking-wider text-slate-600"
                    dangerouslySetInnerHTML={{ __html: stat.label || stat.Label || '' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos && videos.items && videos.items.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            {videos.title && (
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 text-center mb-3 md:mb-4" dangerouslySetInnerHTML={{ __html: videos.title }} />
            )}
            {videos.subtitle && (
              <p className="text-slate-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4" dangerouslySetInnerHTML={{ __html: videos.subtitle }} />
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {videos.items.map((video: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {(video.thumbnail || video.Thumbnail) && (
                    <a
                      href={video.url || video.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative h-40 md:h-48 bg-slate-100 group"
                    >
                      <img
                        src={getImageUrl(video.thumbnail || video.Thumbnail)}
                        alt={video.title || video.Title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                          <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  )}
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2" dangerouslySetInnerHTML={{ __html: video.title || video.Title || '' }} />
                    <p className="text-sm md:text-base text-slate-600 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: video.description || video.Description || '' }} />
                    {(video.url || video.Url) && (
                      <a href={video.url || video.Url} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 font-medium text-sm md:text-base inline-flex items-center gap-1">
                        Watch Video →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coaches/Instructors Section */}
      {coaches && coaches.items && coaches.items.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-8">
            {coaches.title && (
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 text-center mb-3 md:mb-4" dangerouslySetInnerHTML={{ __html: coaches.title }} />
            )}
            {coaches.subtitle && (
              <p className="text-slate-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4" dangerouslySetInnerHTML={{ __html: coaches.subtitle }} />
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {coaches.items.map((coach: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {(coach.image || coach.Image) && (
                    <div className="h-48 md:h-64 overflow-hidden bg-slate-100">
                      <img
                        src={(coach.image || coach.Image).startsWith('/') ? `${API_BASE}${coach.image || coach.Image}` : (coach.image || coach.Image)}
                        alt={coach.name || coach.Name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-1" dangerouslySetInnerHTML={{ __html: coach.name || coach.Name || '' }} />
                    <p className="text-red-600 font-medium text-sm mb-3" dangerouslySetInnerHTML={{ __html: coach.title || coach.Title || '' }} />
                    <p className="text-sm md:text-base text-slate-600 mb-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: coach.bio || coach.Bio || '' }} />
                    {coach.expertise && (
                      <p className="text-xs text-slate-500 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: coach.expertise || coach.Expertise || '' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources/PDFs Section */}
      {resources && resources.items && resources.items.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            {resources.title && (
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 text-center mb-3 md:mb-4" dangerouslySetInnerHTML={{ __html: resources.title }} />
            )}
            {resources.subtitle && (
              <p className="text-slate-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4" dangerouslySetInnerHTML={{ __html: resources.subtitle }} />
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {resources.items.map((resource: any, idx: number) => (
                <a
                  key={idx}
                  href={resource.fileUrl || resource.FileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-600 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    {(resource.fileType || resource.FileType || 'PDF').substring(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1 text-sm md:text-base" dangerouslySetInnerHTML={{ __html: resource.title || resource.Title || '' }} />
                    <p className="text-xs md:text-sm text-slate-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: resource.description || resource.Description || '' }} />
                  </div>
                  <svg className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faq && faq.items && faq.items.length > 0 && (
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-8">
            {faq.title && (
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 text-center mb-3 md:mb-4" dangerouslySetInnerHTML={{ __html: faq.title }} />
            )}
            {faq.subtitle && (
              <p className="text-slate-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4" dangerouslySetInnerHTML={{ __html: faq.subtitle }} />
            )}
            <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
              {faq.items.map((item: any, idx: number) => (
                <details key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden group">
                  <summary className="px-4 md:px-6 py-3 md:py-4 cursor-pointer hover:bg-slate-50 font-medium text-slate-900 flex items-center justify-between text-sm md:text-base">
                    <span className="flex-1 pr-4" dangerouslySetInnerHTML={{ __html: item.question || item.Question || '' }} />
                    <span className="text-red-600 text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-600 border-t border-slate-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer || item.Answer || '' }} />
                </details>
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
                <h2 className="text-3xl font-light text-slate-900 text-center mb-12" dangerouslySetInnerHTML={{ __html: testimonials.title }} />
              </>
            )}

            {testimonials.items && testimonials.items.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {testimonials.items.map((item: any, idx: number) => {
                  const imgSrc = item.image || item.Image;
                  return (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                      <div className="flex gap-4 items-start">
                        {imgSrc && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-slate-100">
                            <img
                              src={imgSrc.startsWith('/') ? `${API_BASE}${imgSrc}` : imgSrc}
                              alt={item.author || item.Author}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-slate-700 italic mb-3 text-sm" dangerouslySetInnerHTML={{ __html: item.quote || item.Quote || '' }} />
                          <div className="font-semibold text-slate-900" dangerouslySetInnerHTML={{ __html: item.author || item.Author || '' }} />
                          <div className="text-sm text-slate-500">
                            <span dangerouslySetInnerHTML={{ __html: item.role || item.Role || '' }} />
                            {(item.company || item.Company) && (
                              <> • <span dangerouslySetInnerHTML={{ __html: item.company || item.Company || '' }} /></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
