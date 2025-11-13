import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

console.log("AuthContext: Script loaded"); // Log 1: Arquivo carregado?

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("AuthProvider: Rendering, initial loading state:", loading); // Log 2: Provider renderizando?

  useEffect(() => {
    console.log("AuthContext useEffect: Starting token check..."); // Log 3: useEffect iniciou?
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      console.log("AuthContext useEffect: Found token in localStorage?", !!token); // Log 4: Achou token?
      if (token) {
        try {
          console.log("AuthContext useEffect: Setting auth header with token..."); // Log 5: Configurando header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log("AuthContext useEffect: Attempting to fetch user (/auth/me)..."); // Log 6: Tentando buscar /auth/me
          const response = await api.get('/auth/me');
          console.log("AuthContext useEffect: /auth/me successful, user data:", response.data); // Log 7: Sucesso no /auth/me
          setUser(response.data);
        } catch (err) {
          console.error("AuthContext useEffect: Error validating token or fetching user.", err); // Log 8: Erro ao validar token
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } else {
         console.log("AuthContext useEffect: No token found."); // Log 9: Sem token
      }
    };

    loadUserFromToken().finally(() => {
      console.log("AuthContext useEffect: FINALLY block reached, setting loading to false."); // Log 10: Finally alcançado?
      setLoading(false);
    });

  }, []);

  const login = async (email, password) => {
    console.log("AuthContext login: Attempting login for:", email); // Log 11: Tentando login
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      console.log("AuthContext login: Login successful, received token and user.", user); // Log 12: Login sucesso
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Credenciais inválidas ou erro no servidor.';
      console.error("AuthContext login: Login failed.", err, "Error message:", errorMsg); // Log 13: Login falhou
      setError(errorMsg);
      setUser(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw err;
    } finally {
      console.log("AuthContext login: FINALLY block reached, setting loading to false."); // Log 14: Finally do login
      setLoading(false);
    }
  };
  
  const register = async (name, email, password) => {
    console.log("AuthContext register: Attempting registration for:", email); // Log 15: Tentando registro
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      console.log("AuthContext register: Registration successful, received token and user.", user); // Log 16: Registro sucesso
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Erro ao registrar ou erro no servidor.';
      console.error("AuthContext register: Registration failed.", err, "Error message:", errorMsg); // Log 17: Registro falhou
      setError(errorMsg);
      setUser(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw err;
    } finally {
      console.log("AuthContext register: FINALLY block reached, setting loading to false."); // Log 18: Finally do registro
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("AuthContext logout: Logging out user."); // Log 19: Logout
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    authLoading: loading, 
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  console.log("AuthProvider: Rendering children? Loading state:", loading); // Log 20: Renderizando filhos?

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}