import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      axios.get(`${API_BASE_URL}/api/auth/me`)
        .then(r => setUser(r.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    localStorage.setItem('token', r.data.token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + r.data.token;
    setUser(r.data.user);
    return r.data.user;
  };

  const register = async (name, email, password, role) => {
    const r = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password, role });
    localStorage.setItem('token', r.data.token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + r.data.token;
    setUser(r.data.user);
    return r.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
