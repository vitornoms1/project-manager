import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

// EyeIcon component remains the same
const EyeIcon = ({ onClick, isVisible }) => (
  <button type="button" onClick={onClick} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
    {isVisible ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .946-3.11 3.522-5.44 6.837-6.108M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.58 4.42a1.5 1.5 0 012.08 2.08L4.5 21.58A1.5 1.5 0 012.42 19.5L17.58 4.42z" /></svg>
    )}
  </button>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="min-h-screen flex">
      {/* Left Column: Form */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-lg animate-slide-in-from-left">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
            TaskFlow<span className="text-indigo-600">✓</span>
          </h1>
          
          <form onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email" // Changed from "Usuário"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
            
            <InputField
              id="password"
              label="Password" // Changed from "Senha"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            >
              <EyeIcon onClick={togglePasswordVisibility} isVisible={isPasswordVisible} />
            </InputField>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Signing In...' : 'SIGN IN'} 
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '} 
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Background Image */}
      <div 
        className="w-1/2 bg-cover bg-center animate-fade-in"
        style={{ animationDelay: '0.2s', backgroundImage: `url(/login-bg.jpg)` }}
      ></div>
    </div>
  );
};

export default LoginPage;