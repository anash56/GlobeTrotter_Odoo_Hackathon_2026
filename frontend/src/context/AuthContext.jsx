import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
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

  const loginUser = (user) => {
    setCurrentUser(user);
  };

  const logoutUser = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        initializing,
        loginUser,
        logoutUser,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
