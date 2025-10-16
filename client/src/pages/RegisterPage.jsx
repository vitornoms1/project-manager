import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

const EyeIcon = ({ onClick, isVisible }) => (
  <button type="button" onClick={onClick} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">{isVisible ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .946-3.11 3.522-5.44 6.837-6.108M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.58 4.42a1.5 1.5 0 012.08 2.08L4.5 21.58A1.5 1.5 0 012.42 19.5L17.58 4.42z" /></svg>}</button>
);

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const validateForm = () => {
    const errors = {};
    
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };
  
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-lg animate-slide-in-from-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              TaskFlow<span className="text-indigo-600">✓</span>
            </h2>
            <h1 className="text-3xl font-semibold text-gray-700">
              Create Your Account 
            </h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <InputField id="name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            <InputField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required />
            
            <InputField id="password" label="Password" type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required>
              <EyeIcon onClick={togglePasswordVisibility} isVisible={isPasswordVisible} />
            </InputField>
            {formErrors.password && <p className="text-red-500 text-sm -mt-3 mb-4 ml-1">{formErrors.password}</p>}

            <InputField id="confirmPassword" label="Confirm Password" type={isPasswordVisible ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required>
               <EyeIcon onClick={togglePasswordVisibility} isVisible={isPasswordVisible} />
            </InputField>
            {formErrors.confirmPassword && <p className="text-red-500 text-sm -mt-3 mb-4 ml-1">{formErrors.confirmPassword}</p>}
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-400">
              {loading ? 'Creating account...' : 'SIGN UP'} 
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-semibold">
              Log in here
            </Link>
          </p>
        </div>
      </div>
      <div className="w-1/2 bg-cover bg-center animate-fade-in" style={{ animationDelay: '0.2s', backgroundImage: `url(/login-bg.jpg)` }}></div>
    </div>
  );
};

export default RegisterPage;