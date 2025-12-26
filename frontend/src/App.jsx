import Wizard from './components/Wizard';
import Background from './components/Background';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center mb-10 z-10 w-full">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 tracking-tight">
            Insurance <span className="text-brand-accent">Simplified</span> 🇮🇳
          </h1>
          <p className="text-slate-400 text-lg font-medium opacity-80">No jargon. Just answers. (MVP v0.3)</p>
          {isAuthenticated && (
            <button
              onClick={() => { localStorage.removeItem('auth_token'); window.location.reload(); }}
              className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
        {!isAuthenticated ? <Login /> : <Wizard />}
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
