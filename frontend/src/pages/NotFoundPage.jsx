import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="trip-details-error" style={{ minHeight: '80vh' }}>
      <Compass size={48} className="brand-logo" style={{ color: 'var(--color-navy-deep)' }} />
      <h2>404 - Page Not Found</h2>
      <p>The page or trip route you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
}
