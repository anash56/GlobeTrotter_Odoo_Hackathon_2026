import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { authService } from './services/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'auth'

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authService.getMe();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveView('landing');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveView('landing');
  };

  if (initializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F8F5' }}>
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#0F766E' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto', borderColor: 'rgba(15,118,110,0.2)', borderTopColor: '#0F766E' }} />
          <p style={{ fontWeight: 600 }}>Loading GlobeTrotter...</p>
        </div>
      </div>
    );
  }

  if (activeView === 'auth') {
    return (
      <div>
        <div style={{ position: 'fixed', top: '1.2rem', left: '1.5rem', zIndex: 300 }}>
          <button
            type="button"
            onClick={() => setActiveView('landing')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            ← Back to Home
          </button>
        </div>
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <LandingPage
      currentUser={currentUser}
      onOpenAuth={() => setActiveView('auth')}
      onLogout={handleLogout}
    />
  );
}

export default App;
