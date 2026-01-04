import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Container } from '../UI/Container';
import { useLanguage } from '../../Contexts/LanguageContext';
import LogoImage from '../../../public/know-how-logo.png';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface NavItem {
  slug: string;
  title: string;
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { currentLanguage, setLanguage, languages } = useLanguage();

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
          { slug: 'contact', title: 'Contact' },
        ]);
        setLoading(false);
      });
  }, [currentLanguage]);

  const isActive = (slug: string) => {
    if (slug === 'home') return location.pathname === '/' || location.pathname === '/home';
    return location.pathname === `/${slug}`;
  };

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo with Red Accent */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={LogoImage}
                alt='know-how-logo'
                width={'100px'}
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-slate-900">
                  KnowHow Training
                </h1>
                <p className="text-xs text-slate-500">Leadership Excellence</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {loading ? (
                <div className="text-sm text-slate-400">Loading...</div>
              ) : (
                navItems.map((item) => (
                  <Link
                    key={item.slug}
                    to={item.slug === 'home' ? '/' : `/${item.slug}`}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors relative ${
                      isActive(item.slug)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.title}
                    {/* Red underline for active state */}
                    {isActive(item.slug) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                    )}
                  </Link>
                ))
              )}
            </nav>

            {/* Right side: Language + Mobile menu */}
            <div className="flex items-center gap-3">
              {/* Language Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-slate-50 transition-colors border border-slate-200 hover:border-red-600"
                >
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline text-sm font-medium text-slate-700">
                    {currentLang.code.toUpperCase()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsLangOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded border border-slate-200 shadow-lg py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm bg-slate-50 transition-colors ${
                            currentLanguage === lang.code ? 'bg-red-50 text-red-700 font-medium' : 'text-slate-700'
                          }`}
                        >
                          <span>{lang.name}</span>
                          {currentLanguage === lang.code && (
                            <span className="ml-auto text-red-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded hover:bg-slate-50 transition-colors md:hidden"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}
      
      <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform md:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded hover:bg-slate-50"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.slug}
                to={item.slug === 'home' ? '/' : `/${item.slug}`}
                className={`block px-4 py-3 rounded font-medium text-sm transition-colors relative ${
                  isActive(item.slug)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
                {isActive(item.slug) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Language Selector */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Language</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentLanguage === lang.code 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-32 bg-slate-900 text-white relative overflow-hidden">
        {/* Red accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
        
        <Container>
          <div className="py-16 grid md:grid-cols-4 gap-12">
            {/* Logo & Description */}
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

            {/* Navigation Columns */}
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

          {/* Bottom Bar */}
          <div className="py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2025 KnowHow Training. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-red-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-red-400 transition-colors">Terms</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};
