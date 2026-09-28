import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App load hone pe localStorage se user nikalo
  useEffect(() => {
    const storedUser = localStorage.getItem('bazario_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('bazario_user');
      }
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data);
    localStorage.setItem('bazario_user', JSON.stringify(data));
    return data;
  };

  // Register
  const register = async (name, email, password, role = 'user') => {
    const data = await authService.register({ name, email, password, role });
    setUser(data);
    localStorage.setItem('bazario_user', JSON.stringify(data));
    return data;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bazario_user');
  };

  // Update profile
  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem('bazario_user', JSON.stringify(data));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};