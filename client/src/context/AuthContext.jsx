import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria um Hook customizado para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Cria o Provedor (Provider) do Contexto
// Este componente vai "envolver" nossa aplicação e fornecer o estado de autenticação
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token')); // Pega o token do localStorage se existir
  const [user, setUser] = useState(null); // (Opcional) Poderíamos guardar os dados do usuário aqui
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configura uma instância do axios para já incluir o token nos headers
  const api = axios.create({
    baseURL: '/api' // Apenas o caminho relativo para o proxy
  });

  // Função de Registro
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken); // Salva o token no navegador
    } catch (err) {
      // ▼▼▼ TRATAMENTO DE ERRO MELHORADO ▼▼▼
      if (err.response) {
        // O servidor respondeu com um erro (ex: email já existe)
        setError(err.response.data.msg || 'Erro ao registrar.');
      } else if (err.request) {
        // A requisição foi feita, mas não houve resposta (servidor offline)
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else {
        // Outro tipo de erro
        setError('Ocorreu um erro inesperado ao tentar registrar.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função de Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } catch (err) {
      // ▼▼▼ TRATAMENTO DE ERRO MELHORADO ▼▼▼
      if (err.response) {
        // O servidor respondeu com um erro (ex: credenciais inválidas)
        setError(err.response.data.msg || 'Erro ao fazer login.');
      } else if (err.request) {
        // A requisição foi feita, mas não houve resposta (servidor offline)
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else {
        // Outro tipo de erro
        setError('Ocorreu um erro inesperado ao tentar fazer login.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função de Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  // O valor que será compartilhado com todos os componentes filhos
  const value = {
    token,
    user,
    loading,
    error,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}