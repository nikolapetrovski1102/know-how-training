import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../../Contexts/LanguageContext';
import LogoImage from '../../../public/know-how-logo.png';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface NavItem {
  slug: string;
  title: string;
}

// Simple emoji mapping for navigation items
const navEmojis: Record<string, string> = {
  'home': '○',
  'about': 'ℹ',
  'programs': '◆',
  'corporate-programs': '■',
  'coaching': '◉',
  'trainers': '●',
  'gallery': '◇',
  'references': '✓',
  'testimonials': '◐',
  'downloads': '↓',
  'contact': '✉'
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { currentLanguage, setLanguage, languages } = useLanguage();

  // Check if on home page
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/navigation?lang=${currentLanguage}`)
      .then(res => res.json())
      .then(data => {
        setNavItems(data.items || data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load navigation:', err);
        setNavItems([
          { slug: 'home', title: 'Home' },
          { slug: 'about', title: 'About' },
          { slug: 'programs', title: 'Programs' },
          { slug: 'corporate-programs', title: 'Corporate Programs' },
          { slug: 'coaching', title: 'Coaching' },
          { slug: 'trainers', title: 'Trainers' },
          { slug: 'gallery', title: 'Gallery' },
          { slug: 'references', title: 'References' },
          { slug: 'testimonials', title: 'Testimonials' },
          { slug: 'downloads', title: 'Downloads' },
          { slug: 'contact', title: 'Contact' },
        ]);
        setLoading(false);
      });
  }, [currentLanguage]);

  const isActive = (slug: string) => {
    if (slug === 'home') return location.pathname === '/' || location.pathname === '/home';
    return location.pathname === `/${slug}`;
  };

  const getEmoji = (slug: string) => {
    return navEmojis[slug] || '•';
  };

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-down-menu {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        .header-transition {
          transition: all 0.4s ease-in-out;
        }
      `}</style>

      {/* Header - Fixed position, always sticks to top */}
      <header className={`fixed top-0 left-0 right-0 z-50 header-transition ${
        isScrolled ? 'shadow-lg' : 'shadow-none'
      }`}>
        {/* Top Bar - Contact Info */}
        <div className={`border-b header-transition bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-red-600
        } text-white`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 text-sm">
              {/* Left - Contact Details */}
              <div className="hidden md:flex items-center gap-6">
                <a 
                  href="tel:+38970123456" 
                  className="flex items-center gap-2 hover:text-red-400 transition-colors group"
                >
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>+389 70 123 456</span>
                </a>
                <div className="w-px h-4 bg-slate-600"></div>
                <a 
                  href="mailto:info@knowhow-training.com" 
                  className="flex items-center gap-2 hover:text-red-400 transition-colors group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline">info@knowhow-training.com</span>
                  <span className="lg:hidden">Email Us</span>
                </a>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span className="hidden lg:inline">Mon - Fri: 9:00 - 17:00</span>
                  <span className="lg:hidden">9:00 - 17:00</span>
                </div>
              </div>

              {/* Mobile Contact - Condensed */}
              <div className="flex md:hidden items-center gap-3">
                <a href="tel:+38970123456" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs">+389 70 123 456</span>
                </a>
              </div>

              {/* Right - Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                    isScrolled || !isHomePage
                      ? 'bg-slate-700/50 hover:bg-slate-700'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium">{currentLang.code.toUpperCase()}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsLangOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-slate-200 shadow-xl py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                            currentLanguage === lang.code 
                              ? 'bg-red-100 text-red-700 font-semibold' 
                              : 'text-slate-700 bg-slate-50'
                          }`}
                        >
                          <span>{lang.name}</span>
                          {currentLanguage === lang.code && (
                            <span className="text-red-600 text-lg">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav className={`header-transition ${
          isScrolled 
            ? 'bg-white border-b border-slate-200' 
            : isHomePage
              ? 'bg-white/40 backdrop-blur-xl border-b border-white/20'
              : 'bg-white border-b border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between lg:justify-center h-20 relative">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group lg:absolute lg:left-4">
                <img 
                  src={LogoImage}
                  alt='know-how-logo'
                  className="h-12 w-auto transition-transform group-hover:scale-105"
                />
                <div className="hidden sm:block">
                  <h1 className={`text-xl font-bold transition-colors ${
                    isScrolled || !isHomePage ? 'text-slate-900' : 'text-slate-900'
                  } group-hover:text-red-600`}>
                    KnowHow Training
                  </h1>
                  <p className={`text-xs font-medium tracking-wide ${
                    isScrolled || !isHomePage ? 'text-slate-500' : 'text-slate-700'
                  }`}>
                    Leadership Excellence
                  </p>
                </div>
              </Link>

              {/* Center: Burger Menu */}
              <div className="flex items-center gap-3">
                <Link
                  to="/contact"
                  className="hidden sm:flex lg:absolute lg:right-16 items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden md:inline">Get In Touch</span>
                  <span className="md:hidden">Contact</span>
                </Link>

                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2.5 rounded-lg transition-colors border hover:border-red-600 bg-white`}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="w-10 h-10 text-slate-700" />
                  ) : (
                    <Menu className="w-10 h-10 text-slate-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Menu Overlay - Only for mobile */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}
      
      {/* Mobile Menu - Side Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl animate-slide-in-right">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <div>
                <h2 className="text-lg font-bold">Navigation</h2>
                <p className="text-xs text-slate-300 mt-0.5">Explore our services</p>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 bg-slate-50">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.slug}
                      to={item.slug === 'home' ? '/' : `/${item.slug}`}
                      className={`group flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold text-sm transition-all ${
                        isActive(item.slug)
                          ? 'bg-slate-900 text-white shadow-lg scale-[1.02]'
                          : 'text-slate-700 bg-white hover:bg-red-50 hover:text-red-600 hover:scale-[1.01] shadow-sm'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className={`text-xl font-light ${isActive(item.slug) ? 'text-red-400' : 'text-slate-400'}`}>
                        {getEmoji(item.slug)}
                      </span>
                      <span className="flex-1">{item.title}</span>
                      {isActive(item.slug) && (
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            <div className="p-4 border-t border-slate-200 bg-white">
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <Mail className="w-5 h-5" />
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Mega Menu */}
      {isMenuOpen && (
        <div className="hidden lg:block fixed inset-x-0 top-32 z-50 animate-slide-down-menu">
          <div className="bg-white shadow-2xl border-b-2 border-slate-200">
            <div className="max-w-7xl mx-auto px-8 py-10">
              <nav>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.slug}
                        to={item.slug === 'home' ? '/' : `/${item.slug}`}
                        className={`group flex items-center gap-4 px-6 py-5 rounded-xl font-semibold text-sm transition-all ${
                          isActive(item.slug)
                            ? 'bg-slate-900 text-white shadow-xl scale-105'
                            : 'text-slate-700 bg-slate-50 hover:bg-red-50 hover:text-red-600 hover:shadow-lg hover:scale-105'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className={`text-3xl font-light ${
                          isActive(item.slug) ? 'text-red-400' : 'text-slate-400 group-hover:text-red-500'
                        }`}>
                          {getEmoji(item.slug)}
                        </span>
                        <span className="flex-1">{item.title}</span>
                        {isActive(item.slug) && (
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 bg-white rounded flex items-center justify-center">
                  <span className="text-lg font-semibold text-slate-900">K</span>
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">KnowHow Training</h3>
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed max-w-md text-sm">
                Transforming leaders and organizations through proven coaching and training programs.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">Programs</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/programs" className="hover:text-red-400 transition-colors">Training Programs</Link></li>
                <li><Link to="/coaching" className="hover:text-red-400 transition-colors">Individual Coaching</Link></li>
                <li><Link to="/corporate" className="hover:text-red-400 transition-colors">Corporate Solutions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
                <li><Link to="/testimonials" className="hover:text-red-400 transition-colors">Testimonials</Link></li>
                <li><Link to="/contact" className="hover:text-red-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2025 KnowHow Training. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-red-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-red-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
