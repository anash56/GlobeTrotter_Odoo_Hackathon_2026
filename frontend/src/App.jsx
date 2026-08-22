import React, { useState, useEffect } from 'react';
import { AuthPage } from './pages/AuthPage';
import { authService } from './services/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

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

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (initializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EBECFF' }}>
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#06375E' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto', borderColor: 'rgba(6,55,94,0.2)', borderTopColor: '#06375E' }} />
          <p style={{ fontWeight: 600 }}>Loading GlobeTrotter...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-navy-deep)', color: '#fff', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>GlobeTrotter Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-sand-light)' }}>
            Welcome, {currentUser.name}! ({currentUser.role})
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.55rem 1.1rem',
              background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>
      <main>
        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(220, 207, 194, 0.2)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Personal Travel Hub</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            Logged in securely as <strong>{currentUser.email}</strong>. Ready to plan your next journey!
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
