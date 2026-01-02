import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface PageData {
  content: {
    seo: {
      title?: string;
      description?: string;
    };
    hero: {
      title: string;
      subtitle?: string;
      ctaText?: string;
      ctaUrl?: string;
      image?: string;
    };
    sections: Array<{
      type: string;
      greeting?: string;
      name?: string;
      title?: string;
      subtitle?: string;
      description?: string;
      items?: any[];
      logos?: any[];
    }>;
  };
  programs: Array<{
    id: number;
    slug: string;
    title: string;
    shortDescription?: string;
    imageUrl?: string;
    durationHours?: number;
    categoryName?: string;
  }>;
}

export const Home: React.FC = () => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/pages/home?lang=en`)
      .then(res => res.json())
      .then(response => {
        const pageData = response.data || response;
        setData(pageData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load home page:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data?.content?.hero) {
    return <div className="p-8 text-center">Page not found</div>;
  }

  const { hero, sections, seo } = data.content;
  const validSections = sections.filter(s => s.type && s.type.trim() !== '');
  const introCard = validSections.find(s => s.type === 'intro-card');
  const stats = validSections.find(s => s.type === 'stats');
  const featuredSection = validSections.find(s => s.type === 'featured-programs');
  const testimonials = validSections.find(s => s.type === 'testimonials');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>{seo?.title || 'Home'}</title>
        <meta name="description" content={seo?.description || ''} />
      </Helmet>

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-30px) scale(1.05);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fadeInScale {
          animation: fadeInScale 1.5s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 1s ease-out forwards;
        }
      `}</style>

      {/* Hero Section - Cinematic Floating Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        
        {/* Animated Background Gradient Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* ✅ FLOATING TRANSPARENT IMAGE - CENTERED BEHIND CONTENT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={hero.image ? `${API_BASE}${hero.image}` : '/placeholder.jpg'}
            alt="Coach Floating"
            className="w-auto h-[120vh] max-w-none object-contain opacity-40 animate-float animate-fadeInScale"
            style={{
              filter: 'drop-shadow(0 50px 100px rgba(0, 0, 0, 0.5))',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Vignette Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/80"></div>
        
        <div className="container mx-auto px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content - Animated */}
            <div className="space-y-8 animate-slideInLeft">
              {/* Main Heading with Giant Number */}
              <div className="relative">
                <div className="absolute -left-4 -top-8 text-[200px] font-black text-white/10 leading-none select-none">
                  7
                </div>
                <h1 
                  className="text-6xl lg:text-7xl font-black text-white leading-tight relative z-10 drop-shadow-2xl"
                  dangerouslySetInnerHTML={{ __html: hero.title }}
                />
              </div>

              <p className="text-xl text-slate-200 leading-relaxed max-w-lg drop-shadow-lg">
                {hero.subtitle}
              </p>

              {hero.ctaText && (
                <Link
                  to={hero.ctaUrl || '#'}
                  className="inline-block bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-2xl hover:shadow-white/20"
                >
                  {hero.ctaText}
                </Link>
              )}
            </div>

            {/* Right Side - Intro Card & Download Button (Animated) */}
            <div className="relative animate-slideInRight" style={{ animationDelay: '0.3s' }}>
              
              {/* Intro Card */}
              {introCard ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-sm mx-auto lg:ml-auto transform hover:scale-105 transition-all border-4 border-white/50">
                  <div className="text-6xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                    {introCard.greeting || 'HI'}
                  </div>
                  <p className="text-slate-700 text-lg leading-snug">
                    I am <span className="font-bold text-slate-900">{introCard.name || 'Nikola Petrovski'}</span>,<br />
                    <span className="font-bold text-slate-900">{introCard.title || 'Professional Coach'}</span>
                  </p>
                </div>
              ) : (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-sm mx-auto lg:ml-auto transform hover:scale-105 transition-all border-4 border-white/50">
                  <div className="text-6xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                    HI
                  </div>
                  <p className="text-slate-700 text-lg leading-snug">
                    I am <span className="font-bold text-slate-900">Nikola Petrovski</span>,<br />
                    <span className="font-bold text-slate-900">Professional Coach</span>
                  </p>
                </div>
              )}

              {/* Download Guide Button - Floating */}
              <div className="mt-8 flex justify-center lg:justify-end">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-6 shadow-2xl hover:shadow-purple-500/50 transition-all cursor-pointer group transform hover:scale-110">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
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

        {/* Social Media Icons - Bottom Right with Glass Effect */}
        <div className="absolute bottom-8 right-8 flex gap-4 z-20">
          <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:text-slate-900 text-white transition-all transform hover:scale-110 border border-white/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white text-white transition-all transform hover:scale-110 border border-white/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-blue-400 hover:text-white text-white transition-all transform hover:scale-110 border border-white/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && stats.items && stats.items.length > 0 ? (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
              {stats.title || 'Success by Numbers'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.items.map((stat: any, idx: number) => (
                <div key={idx} className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
                  <div className="text-5xl font-black text-indigo-600 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
              Success by Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '500+', label: 'Clients Coached' },
                { value: '15', label: 'Years Experience' },
                { value: '95%', label: 'Success Rate' },
                { value: '50+', label: 'Programs Delivered' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
                  <div className="text-5xl font-black text-indigo-600 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Programs */}
      {data.programs && data.programs.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-slate-900 mb-4">
                {featuredSection?.title || 'Featured Programs'}
              </h2>
              <p className="text-xl text-slate-600">
                {featuredSection?.subtitle || 'Choose the coaching program that fits your goals'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {data.programs.slice(0, 6).map(program => (
                <Link
                  key={program.id}
                  to={`/programs/${program.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  {program.imageUrl && (
                    <div className="h-48 overflow-hidden bg-slate-200">
                      <img
                        src={`${API_BASE}${program.imageUrl}`}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {program.categoryName && (
                        <span className="text-xs font-semibold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                          {program.categoryName}
                        </span>
                      )}
                      {program.durationHours && (
                        <span className="text-xs text-slate-500">
                          {program.durationHours}h
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {program.shortDescription}
                    </p>
                    <div className="mt-4 text-indigo-600 font-semibold text-sm flex items-center gap-2">
                      Learn More
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials / Logos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-12">
            {testimonials?.title || 'They Write About Me...'}
          </h3>
          <div className="flex items-center justify-center gap-16 opacity-60">
            <div className="text-3xl font-bold text-slate-400">Denvers</div>
            <div className="text-3xl font-bold text-slate-400">ALPHA</div>
          </div>
        </div>
      </section>
    </div>
  );
};
