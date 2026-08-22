import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TravelShowcase } from '../components/TravelShowcase';
import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { ResetPasswordModal } from '../components/ResetPasswordModal';
import { ToastContainer } from '../components/Toast';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export function AuthPage({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Sync active tab with current URL route
  const isSignupPath = location.pathname === '/signup';
  const [activeTab, setActiveTab] = useState(isSignupPath ? 'signup' : 'login');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveTab('signup');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Detect resetToken in URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('resetToken') || params.get('token');
    if (token) {
      setResetToken(token);
      setIsResetOpen(true);
    }
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle Login Submit -> authenticate & redirect to dashboard
  const handleLogin = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      addToast(response.message || `Welcome back, ${response.user.name}!`, 'success');
      
      // Update global auth state (triggers automatic redirect to /dashboard via PublicRoute/ProtectedRoute)
      loginUser(response.user);

      if (onLoginSuccess) {
        onLoginSuccess(response.user);
      }
    } catch (err) {
      addToast(err.message || 'Failed to sign in. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup Submit -> switch to login tab with success notice
  const handleSignup = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(userData);
      addToast('Account created successfully! Please sign in with your email and password.', 'success');
      
      // Clear token so user logs in cleanly
      authService.logout();

      // Automatically navigate to login form
      setActiveTab('login');
      navigate('/login');
    } catch (err) {
      addToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      addToast(response.message || `Reset link dispatched to ${email}`, 'info');
      return true;
    } catch (err) {
      addToast(err.message || 'Failed to send reset link. Please try again.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetPassword = async ({ token, password, confirmPassword }) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({ token, password, confirmPassword });
      addToast(response.message || 'Password updated successfully! Please sign in.', 'success');
      // Clean query parameter from browser address bar
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    } catch (err) {
      addToast(err.message || 'Failed to update password. Link may be invalid or expired.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Background Animated Gradient Orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* Main Split-Screen Container */}
      <div className="auth-wrapper">
        {/* Left Side: Travel Showcase */}
        <TravelShowcase />

        {/* Right Side: Authentication Forms */}
        <div className="auth-section">
          {/* Header */}
          <div className="auth-header">
            <h2 className="auth-title">
              {activeTab === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
            </h2>
            <p className="auth-subtitle">
              {activeTab === 'login'
                ? 'Sign in to access your saved itineraries and personalized travel plans.'
                : 'Join GlobeTrotter today to discover, plan, and share your next dream trip.'}
            </p>
          </div>

          {/* Login / Sign Up Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                navigate('/login');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                navigate('/signup');
              }}
            >
              Create Account
            </button>
          </div>

          {/* Active Form */}
          {activeTab === 'login' ? (
            <LoginForm
              onSubmit={handleLogin}
              onForgotPassword={() => setIsForgotOpen(true)}
              onSwitchToSignup={() => {
                setActiveTab('signup');
                navigate('/signup');
              }}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              onSwitchToLogin={() => {
                setActiveTab('login');
                navigate('/login');
              }}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />

      {/* Reset Password Modal (Triggered via Brevo Email Link) */}
      <ResetPasswordModal
        isOpen={isResetOpen}
        token={resetToken}
        onClose={() => {
          setIsResetOpen(false);
          setResetToken(null);
          setActiveTab('login');
        }}
        onSubmit={handleResetPassword}
        isLoading={isLoading}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

