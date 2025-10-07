import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'Developer',
    email: 'dev@example.com',
    isAuthenticated: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In development mode, automatically set user as authenticated
    setLoading(false);
  }, []);

  const register = async (email, password, username) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate registration success
      const userData = {
        id: 1,
        username: username,
        email: email,
        isAuthenticated: true
      };
      
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError('Registration failed');
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate login success
      const userData = {
        id: 1,
        username: 'Developer',
        email: email,
        isAuthenticated: true
      };
      
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError('Login failed');
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // In development mode, just clear the user state
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 