import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, XCircle, KeyRound } from 'lucide-react';

export function ResetPasswordModal({ isOpen, token, onClose, onSubmit, isLoading }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate Password Strength
  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: '', color: '' };

    const checks = {
      length: pwd.length >= 8,
      number: /\d/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };

    if (checks.length) score += 25;
    if (checks.number) score += 25;
    if (checks.uppercase) score += 25;
    if (checks.special) score += 25;

    let label = 'Weak';
    let color = '#EF4444';

    if (score >= 75) {
      label = 'Strong';
      color = '#10B981';
    } else if (score >= 50) {
      label = 'Medium';
      color = '#F59E0B';
    }

    return { score, label, color, checks };
  };

  const passwordEval = evaluatePasswordStrength(password);

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'New password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your new password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const res = await onSubmit({ token, password, confirmPassword });
      if (res) {
        setIsSuccess(true);
      }
    }
  };

  const handleFinish = () => {
    setIsSuccess(false);
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {!isSuccess ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'rgba(6, 55, 94, 0.1)', 
                  color: 'var(--color-navy-deep)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <KeyRound size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-navy-deep)', margin: 0 }}>
                Set New Password
              </h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Please enter your new secure password below to regain access to your GlobeTrotter account.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* New Password */}
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label" htmlFor="reset-new-password">
                  New Password
                </label>
                <div className="input-container">
                  <input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter new strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    disabled={isLoading}
                  />
                  <Lock className="input-icon" size={18} />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Visualizer */}
                {password && (
                  <div className="password-strength" style={{ marginTop: '0.6rem' }}>
                    <div className="strength-bar-bg">
                      <div
                        className="strength-bar-fill"
                        style={{
                          width: `${passwordEval.score}%`,
                          backgroundColor: passwordEval.color,
                        }}
                      />
                    </div>
                    <div className="strength-text">
                      <span>Password strength</span>
                      <span className="label" style={{ color: passwordEval.color }}>
                        {passwordEval.label}
                      </span>
                    </div>

                    <div className="password-rules">
                      <div className={`rule-item ${passwordEval.checks?.length ? 'valid' : ''}`}>
                        {passwordEval.checks?.length ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 8+ Chars
                      </div>
                      <div className={`rule-item ${passwordEval.checks?.number ? 'valid' : ''}`}>
                        {passwordEval.checks?.number ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Number
                      </div>
                      <div className={`rule-item ${passwordEval.checks?.uppercase ? 'valid' : ''}`}>
                        {passwordEval.checks?.uppercase ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Uppercase
                      </div>
                      <div className={`rule-item ${passwordEval.checks?.special ? 'valid' : ''}`}>
                        {passwordEval.checks?.special ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Symbol
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <div className="field-error">
                    <AlertCircle size={14} /> {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="reset-confirm-password">
                  Confirm New Password
                </label>
                <div className="input-container">
                  <input
                    id="reset-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-input ${
                      errors.confirmPassword
                        ? 'error'
                        : confirmPassword && confirmPassword === password
                        ? 'success'
                        : ''
                    }`}
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    disabled={isLoading}
                  />
                  <Lock className="input-icon" size={18} />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="field-error">
                    <AlertCircle size={14} /> {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner" /> Updating Password...
                  </>
                ) : (
                  <>
                    Update Password <ArrowRight size={18} />
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
              Password Updated!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.8rem', lineHeight: '1.5' }}>
              Your password has been securely updated. You can now sign in with your new credentials.
            </p>
            <button type="button" className="btn-primary" onClick={handleFinish}>
              Sign In to GlobeTrotter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
