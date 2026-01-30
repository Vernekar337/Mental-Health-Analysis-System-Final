import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'mental_health_jwt');
      if (token) {
        try {
          const response = await api.get('/auth/me'); // Assuming /auth/me returns user profile
          if (response.data) {
            setUser(response.data.user); // Adjust based on actual backend response structure
            setRole(response.data.user.role || response.data.role);
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          // If 401, interceptor handles redirect, but we ensures state is cleared
          if (error.response && error.response.status !== 401) {
            // For other errors, maybe keep the user or logout?
            // Safest to logout on auth failure
            setUser(null);
            setRole(null);
            localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'mental_health_jwt');
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'mental_health_jwt', token);
      setUser(userData);
      setRole(userData.role);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Depending on backend, might return token or just success
      // If returns token, auto login
      if (response.data.token) {
        localStorage.setItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'mental_health_jwt', response.data.token);
        setUser(response.data.user);
        setRole(response.data.user.role);
      }
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'mental_health_jwt');
    setUser(null);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
