import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

const EyeIcon = ({ onClick, isVisible }) => (
  
  <button type="button" onClick={onClick} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">{isVisible ? <svg xmlns="http:
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login, loading, error, isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      
      navigate('/dashboard'); 
    } catch (err) {
      
      
      console.error("Falha no login:", err);
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="min-h-screen flex">
      
      <div className="w-1/2 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-lg animate-slide-in-from-left">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
            TaskFlow<span className="text-indigo-600">✓</span>
          </h1>
          
          <form onSubmit={handleSubmit}>
            <InputField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required />
            <InputField id="password" label="Password" type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required>
              <EyeIcon onClick={togglePasswordVisibility} isVisible={isPasswordVisible} />
            </InputField>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-400">
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

      
      <div className="w-1/2 bg-cover bg-center animate-fade-in" style={{ animationDelay: '0.2s', backgroundImage: `url(/login-bg.jpg)` }}></div>
    </div>
  );
};

export default LoginPage;