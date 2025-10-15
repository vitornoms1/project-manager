import React from 'react';
import { useAuth } from '../context/AuthContext'; // Importamos para usar a função de logout

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao Dashboard!</h1>
      <p className="text-lg text-gray-600 mb-8">Você está logado com sucesso.</p>
      <button
        onClick={logout}
        className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;