import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Container } from '../ui/Container';

interface NavItem {
  slug: string;
  title: string;
}

const NAV_ITEMS: NavItem[] = [
  { slug: 'home', title: 'Home' },
  { slug: 'about', title: 'About' },
  { slug: 'programs', title: 'Programs' },
  { slug: 'coaching', title: 'Coaching' },
  { slug: 'corporate', title: 'Corporate' },
  { slug: 'testimonials', title: 'Testimonials' },
  { slug: 'contact', title: 'Contact' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (slug: string) => location.pathname === `/${slug}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <Container>
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-white">K</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text">
                  KnowHow Training
                </h1>
                <p className="text-sm text-slate-500 font-medium">Leadership Excellence</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.slug}
                  to={`/${item.slug}`}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActive(item.slug)
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Right side: Language + Mobile menu */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors md:hidden">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
              <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">EN</span>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}
      
      <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform md:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <nav className="space-y-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.slug}
                to={`/${item.slug}`}
                className={`block px-6 py-4 rounded-2xl font-semibold transition-all ${
                  isActive(item.slug)
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-32 bg-gradient-to-t from-slate-900 to-slate-800 text-white">
        <Container>
          <div className="py-20 grid md:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">K</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black">KnowHow Training</h3>
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Transforming leaders and organizations through proven coaching and training programs.
              </p>
            </div>

            {/* Navigation Columns */}
            <div>
              <h4 className="text-lg font-bold mb-6">Programs</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/programs" className="hover:text-white transition-colors">Training Programs</Link></li>
                <li><Link to="/coaching" className="hover:text-white transition-colors">Individual Coaching</Link></li>
                <li><Link to="/corporate" className="hover:text-white transition-colors">Corporate Solutions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 pb-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2025 KnowHow Training. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};
