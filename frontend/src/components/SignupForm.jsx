import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export function SignupForm({ onSubmit, onSwitchToLogin, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const passwordEval = evaluatePasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Terms of Service to create an account';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Full Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-name">
          Full Name
        </label>
        <div className="input-container">
          <input
            id="signup-name"
            type="text"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Alex Morgan"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
          <User className="input-icon" size={18} />
        </div>
        {errors.name && (
          <div className="field-error">
            <AlertCircle size={14} /> {errors.name}
          </div>
        )}
      </div>

      {/* Email Input */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-email">
          Email Address
        </label>
        <div className="input-container">
          <input
            id="signup-email"
            type="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="alex@globetrotter.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Mail className="input-icon" size={18} />
        </div>
        {errors.email && (
          <div className="field-error">
            <AlertCircle size={14} /> {errors.email}
          </div>
        )}
      </div>

      {/* Password Input & Strength Meter */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-password">
          Password
        </label>
        <div className="input-container">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
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

        {/* Live Password Strength Visualizer */}
        {formData.password && (
          <div className="password-strength">
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
                {passwordEval.checks?.length ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 8+ Characters
              </div>
              <div className={`rule-item ${passwordEval.checks?.number ? 'valid' : ''}`}>
                {passwordEval.checks?.number ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Contains Number
              </div>
              <div className={`rule-item ${passwordEval.checks?.uppercase ? 'valid' : ''}`}>
                {passwordEval.checks?.uppercase ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Uppercase Letter
              </div>
              <div className={`rule-item ${passwordEval.checks?.special ? 'valid' : ''}`}>
                {passwordEval.checks?.special ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Special Symbol
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

      {/* Confirm Password */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-confirm-password">
          Confirm Password
        </label>
        <div className="input-container">
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            className={`form-input ${
              errors.confirmPassword
                ? 'error'
                : formData.confirmPassword && formData.confirmPassword === formData.password
                ? 'success'
                : ''
            }`}
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
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

      {/* Terms Agreement Checkbox */}
      <div className="form-group">
        <label className="custom-checkbox">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
          />
          <span className="checkbox-box">
            {formData.agreeTerms && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <span>
            I agree to GlobeTrotter's <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-navy-deep)', fontWeight: 700, textDecoration: 'underline' }}>Terms of Service</a> & Privacy Policy
          </span>
        </label>
        {errors.agreeTerms && (
          <div className="field-error">
            <AlertCircle size={14} /> {errors.agreeTerms}
          </div>
        )}
      </div>

      {/* Submit CTA */}
      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="spinner" /> Creating Account...
          </>
        ) : (
          <>
            Create GlobeTrotter Account <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Switch to Login Link */}
      <div className="auth-switch">
        Already have an account?
        <button type="button" className="auth-switch-btn" onClick={onSwitchToLogin}>
          Sign In
        </button>
      </div>
    </form>
  );
}
