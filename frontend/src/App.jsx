import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Traveler',
    email: 'traveler@globetrotter.com',
    avatarUrl: '',
  });
  const [activeView, setActiveView] = useState('landing'); // Default view is 'landing'

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveView('landing');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  if (activeView === 'auth') {
    return (
      <div>
        <div style={{ position: 'fixed', top: '1.2rem', left: '1.5rem', zIndex: 300 }}>
          <button
            type="button"
            onClick={() => setActiveView('landing')}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(6, 55, 94, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(220, 207, 194, 0.3)',
              color: '#EBECFF',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.875rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            ← Back to Main Landing Page
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
