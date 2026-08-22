import React, { useState } from 'react';
import { Mail, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export function ForgotPasswordModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    const res = await onSubmit(email);
    if (res) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleReset}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleReset} aria-label="Close modal">
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-navy-deep)' }}>
              Reset Password
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Enter the email address linked to your GlobeTrotter account and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="forgot-email">
                  Registered Email
                </label>
                <div className="input-container">
                  <input
                    id="forgot-email"
                    type="email"
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="alex@globetrotter.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={isLoading}
                  />
                  <Mail className="input-icon" size={18} />
                </div>
                {error && (
                  <div className="field-error">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner" /> Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem auto',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-navy-deep)', marginBottom: '0.6rem' }}>
              Check Your Inbox
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.8rem', lineHeight: '1.5' }}>
              We have dispatched a password recovery link to <strong style={{ color: 'var(--color-navy-deep)' }}>{email}</strong>.
            </p>
            <button type="button" className="btn-primary" onClick={handleReset}>
              Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
