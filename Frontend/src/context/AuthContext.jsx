import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Set axios default header and fetch user
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Cannot connect to server. Please ensure backend is running.';
      
      if (error.response) {
        // Server responded with error
        message = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        message = 'Cannot connect to backend server. Please check:\n1. Backend is running on http://localhost:5000\n2. No firewall blocking the connection';
      } else {
        // Something else happened
        message = error.message || 'An unexpected error occurred';
      }
      
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Register error:', error);
      let message = 'Cannot connect to server. Please ensure backend is running.';
      
      if (error.response) {
        // Server responded with error
        message = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        message = 'Cannot connect to backend server. Please check:\n1. Backend is running on http://localhost:5000\n2. No firewall blocking the connection';
      } else {
        // Something else happened
        message = error.message || 'An unexpected error occurred';
      }
      
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
