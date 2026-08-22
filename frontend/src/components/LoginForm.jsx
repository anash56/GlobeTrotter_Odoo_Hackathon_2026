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
