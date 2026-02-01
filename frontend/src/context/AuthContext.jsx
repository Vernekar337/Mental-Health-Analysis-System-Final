import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const JWT_KEY =
  import.meta.env.VITE_JWT_STORAGE_KEY || 'mental_health_jwt';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Bootstrap auth state from localStorage ONLY.
   * Do NOT call /auth/me unless backend guarantees it.
   */
  useEffect(() => {
    const token = localStorage.getItem(JWT_KEY);

    if (token) {
      // Token exists → assume logged in
      // User will be refreshed naturally by API calls
      setLoading(false);
    } else {
      setUser(null);
      setRole(null);
      setLoading(false);
    }
  }, []);

  /**
   * Login
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      const {
        token,
        _id,
        name,
        email: userEmail,
        role,
      } = response.data;

      const userData = {
        _id,
        name,
        email: userEmail,
        role,
      };

      localStorage.setItem(JWT_KEY, token);
      setUser(userData);
      setRole(role);

      return { success: true, role };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  /**
   * Register (NO auto-login unless backend explicitly returns token)
   */
  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem(JWT_KEY);
    setUser(null);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
