import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // 1. Adicionamos a importação do Link

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">
            SuaLogo<span className="text-yellow-400">#</span>
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">Usuário</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="password" className="block text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          {/* 2. Adicionamos o parágrafo com o link para a página de registro */}
          <p className="text-center text-gray-600 mt-6">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
              Registre-se aqui
            </Link>
          </p>

        </div>
      </div>

      <div 
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(/login-bg.jpg)` }}
      ></div>
    </div>
  );
};

export default LoginPage;