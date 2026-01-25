import { useState } from 'react';
import Wizard from './components/Wizard';
import FeatureSelector from './components/FeatureSelector';
import ReverseGapFlow from './components/ReverseGapFlow';
import Background from './components/Background';
import Login from './components/Login';
import ThemeToggle from './components/ThemeToggle';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Power, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <>
      <Background />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative">
        {/* Theme Toggle and Logout Button in Top Right */}
        <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && (
            <>
              {selectedFeature && (
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="p-2 md:p-3 rounded-full border bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl backdrop-blur-md"
                  title="Go to Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              )}
              <AnimatePresence>
                {showLogout && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => { localStorage.removeItem('auth_token'); window.location.reload(); }}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-500 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg backdrop-blur-md"
                  >
                    Logout
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                onClick={() => setShowLogout(!showLogout)}
                className={`p-2 md:p-3 rounded-full border transition-all duration-300 shadow-xl backdrop-blur-md ${showLogout
                  ? 'bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Power className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </>
          )}
        </div>

        <div className="text-center mb-6 md:mb-10 z-10 w-full px-2">
          <h1 className="text-4xl md:text-6xl font-black mb-1 md:mb-3 tracking-tight" style={{ color: 'var(--text-auth-primary)' }}>
            Insurance <span className="text-brand-accent">Simplified</span>
          </h1>
          <p className="text-sm md:text-lg font-medium opacity-80" style={{ color: 'var(--text-auth-muted)' }}>No jargon. Just answers. (MVP v0.3)</p>
        </div>

        {!isAuthenticated ? (
          <Login />
        ) : !selectedFeature ? (
          <FeatureSelector onSelectFeature={setSelectedFeature} />
        ) : selectedFeature === 'wizard' ? (
          <Wizard onBack={() => setSelectedFeature(null)} />
        ) : (
          <ReverseGapFlow onBack={() => setSelectedFeature(null)} />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
