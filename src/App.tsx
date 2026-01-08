import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { LanguageProvider } from './contexts/LanguageContext';
import LogoImage from '../public/know-how-logo.png';
import { ChevronLeft } from 'lucide-react';

// ADMIN PAGES
import { AdminPagesList } from './Admin/pages/AdminPagesList';
import { EditHome } from './Admin/Pages/EditHome';
import { useState } from 'react';
import { EditorProvider, useEditor } from './contexts/EditorContext';
import { AdminSidebar } from './Admin/Components/AdminSidebar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Login Page
const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@knowhow.com');
  const [password, setPassword] = useState('demo');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('adminToken', 'demo-token');
    navigate('/admin/pages', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <img
            src={LogoImage}
            alt='know-how-logo'
            width={'100px'}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
            KnowHow Admin
          </h1>
          <p className="text-slate-300 text-sm">demo@knowhow.com / demo</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl shadow-xl transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// Admin Layout with Right Sidebar
const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen } = useEditor(); // Now works because EditorProvider wraps this component

  const canGoBack = location.pathname !== '/admin/pages';

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Main Content - Adjusts based on sidebar width */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'mr-80' : 'mr-16'
          }`}
      >
        {/* Top Bar with Back Button */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              {canGoBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-200 rounded-lg transition-colors font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  navigate('/admin/login');
                }}
                className="bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
              >
                <span>👤</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Right Sidebar */}
      <AdminSidebar />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Routes with Layout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <EditorProvider>
                      <AdminLayout />
                    </EditorProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="pages" replace />} />
                <Route path="pages" element={<AdminPagesList />} />
                <Route path="pages/:id/edit" element={<EditHome />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </BrowserRouter>
        </QueryClientProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
