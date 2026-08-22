import React, { useState } from 'react';
import { AuthPage } from './pages/AuthPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <AuthPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-slate-dark)', color: '#fff', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2>GlobeTrotter Dashboard</h2>
        <div>
          <span style={{ marginRight: '1rem', fontWeight: 600 }}>Welcome, {currentUser.name}! ({currentUser.role})</span>
          <button
            onClick={() => setCurrentUser(null)}
            style={{
              padding: '0.5rem 1rem',
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Sign Out
          </button>
        </div>
      </header>
      <main>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px' }}>
          <h3>Your Personal Travel Hub</h3>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
            Logged in as <strong>{currentUser.email}</strong>. Ready to plan your next journey!
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
