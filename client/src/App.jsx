import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// O useAuth não é mais necessário aqui para a lógica de rotas, por enquanto
// import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  // A lógica do token foi temporariamente desabilitada
  // const { token } = useAuth(); 

  return (
    <Router>
      <Routes>
        {/* Todas as rotas estão abertas para facilitar o desenvolvimento visual */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Para facilitar, a rota principal redireciona direto para o dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Qualquer outra rota desconhecida também redireciona para o dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;