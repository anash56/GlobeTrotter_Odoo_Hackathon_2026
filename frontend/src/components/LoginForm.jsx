import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export function LoginForm({ onSubmit, onForgotPassword, onSwitchToSignup, isLoading }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

    // Clear error for edited field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Email Input */}
      <div className="form-group">
        <label className="form-label" htmlFor="login-email">
          Email Address
        </label>
        <div className="input-container">
          <input
            id="login-email"
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

      {/* Password Input */}
      <div className="form-group">
        <label className="form-label" htmlFor="login-password">
          Password
        </label>
        <div className="input-container">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="••••••••••••"
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
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <div className="field-error">
            <AlertCircle size={14} /> {errors.password}
          </div>
        )}
      </div>

      {/* Form Options: Remember Me & Forgot Password */}
      <div className="form-options">
        <label className="custom-checkbox">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span className="checkbox-box">
            {formData.rememberMe && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
          Remember me
        </label>

        <button
          type="button"
          className="forgot-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={onForgotPassword}
        >
          Forgot Password?
        </button>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="spinner" /> Signing in...
          </>
        ) : (
          <>
            Sign In to GlobeTrotter <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Social Login Section */}
      <div className="divider">
        <div className="divider-line" />
        <span className="divider-text">Or continue with</span>
        <div className="divider-line" />
      </div>

      <div className="social-grid">
        <button
          type="button"
          className="btn-social"
          onClick={() => onSubmit({ email: 'google.user@globetrotter.com', password: 'password123', isSocial: true })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
            <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.95z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Switch to Signup Link */}
      <div className="auth-switch">
        Don't have an account?
        <button type="button" className="auth-switch-btn" onClick={onSwitchToSignup}>
          Create One
        </button>
      </div>
    </form>
  );
}
