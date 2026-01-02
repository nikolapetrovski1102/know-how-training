import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';

// ADMIN PAGES
import { AdminPagesList } from './Admin/pages/AdminPagesList';
import { EditHome } from './Admin/pages/EditHome';
import { useState } from 'react';

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
            Know How Admin
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
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-xl transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// Admin Layout with Outlet
const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Fixed Width */}
      <div className="w-64 bg-white shadow-lg border-r border-slate-200 fixed h-screen">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Know How Admin</h2>
        </div>
        <nav className="p-4 space-y-2">
          <a 
            href="/admin/pages" 
            className="flex items-center p-3 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all"
          >
            📄 Pages
          </a>
          <a 
            href="#" 
            className="flex items-center p-3 rounded-xl text-slate-400 cursor-not-allowed"
          >
            📱 Media
          </a>
          <a 
            href="#" 
            className="flex items-center p-3 rounded-xl text-slate-400 cursor-not-allowed"
          >
            👥 Users
          </a>
        </nav>
      </div>

      {/* Main Content - Full Width minus sidebar */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="text-slate-600 hover:text-slate-900 text-xl">🔔</button>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  navigate('/admin/login');
                }}
                className="text-slate-700 hover:text-slate-900 font-medium flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                👤 Admin
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
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
                  <AdminLayout />
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
    </HelmetProvider>
  );
}

export default App;
