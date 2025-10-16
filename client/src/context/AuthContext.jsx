import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await api.get('/auth/me'); 
          setUser(response.data);
        } catch (err) {
          
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          console.error("Token inválido, fazendo logout.");
        }
      }
      setLoading(false); 
    };

    loadUserFromToken();
  }, []); 

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data; 

      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Credenciais inválidas.');
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Erro ao registrar.');
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user, 
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      
      {!loading && children}
    </AuthContext.Provider>
  );
}