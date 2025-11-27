import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import AddProperty from './pages/AddProperty.jsx';
import EditProperty from './pages/EditProperty.jsx';
import PropertyDetails from './pages/PropertyDetails.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Favorites from "./components/Favorites";
import FavoritesPage from "./pages/FavoritesPage";
import Auth from './pages/Auth.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Profile from './pages/Profile.jsx';
import Footer from './components/Footer.jsx';

const SERVER = 'http://localhost:4000';

/** Error boundary so crashes show instead of white screen */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, err: null }; }
  static getDerivedStateFromError(err) { return { hasError: true, err }; }
  componentDidCatch(err, info) { console.error('ErrorBoundary:', err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: 'system-ui' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#b91c1c' }}>
            {String(this.state.err?.message || this.state.err)}
          </pre>
          <button onClick={() => location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Initials({ name }) {
  const s = (name || '').trim();
  const parts = s.split(/\s+/).slice(0, 2);
  const init = parts.map(p => p[0]?.toUpperCase() || '').join('');
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 grid place-items-center text-xs font-semibold select-none">
      {init || 'U'}
    </div>
  );
}

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="w-4 h-4" {...props}>
      <path
        fill="currentColor"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18 3.172 11.172a4 4 0 010-5.656z"
      />
    </svg>
  );
}

function Header() {
  const { user, logout } = useAuth();
  const serverPort = user?.role === 'TRAVELER' ? '4001' : '4003';
  const avatar = user?.avatarUrl ? `http://localhost:${serverPort}${user.avatarUrl}` : null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="group">
          <span className="font-bold text-2xl text-[#FF385C] tracking-tight group-hover:opacity-80 transition">airbnb</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user?.role === 'TRAVELER' && (
            <Link
              to="/favorites"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 rounded-full transition"
              aria-label="Favorites"
            >
              <HeartIcon />
              <span className="text-sm font-medium">Favorites</span>
            </Link>
          )}

          {user && (
            <Link to="/profile" className="hidden md:flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 rounded-full transition">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Your profile"
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Initials name={user?.name} />
              )}
              <span className="text-sm font-medium">Profile</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 hidden lg:inline">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-5 py-2.5 bg-[#FF385C] text-white rounded-full hover:bg-[#E31C5F] transition font-medium text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2.5 bg-[#FF385C] text-white rounded-full hover:bg-[#E31C5F] transition font-medium text-sm"
            >
              Sign up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

// Component to route based on user role
function RoleBasedHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;

  // Route based on role
  if (user.role === 'OWNER') {
    return <OwnerDashboard />;
  }
  return <Dashboard user={user} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />

            {/* Home - Role-based routing */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RoleBasedHome />
                </ProtectedRoute>
              }
            />

            {/* Owner-only routes */}
            <Route
              path="/property/add"
              element={
                <ProtectedRoute>
                  <AddProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/edit/:id"
              element={
                <ProtectedRoute>
                  <EditProperty />
                </ProtectedRoute>
              }
            />

            {/* Shared routes */}
            <Route
              path="/properties/:id"
              element={
                <ProtectedRoute>
                  <PropertyDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<div className="text-center py-12 text-gray-600">Page not found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
