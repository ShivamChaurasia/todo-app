import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import AppLogo from '../components/AppLogo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-3xl shadow-md lg:w-[500px]">
        <AppLogo />
        <h2 className="text-2xl mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isValid={isEmailValid}
            placeholder="Enter your email"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <div className="flex items-center justify-between flex-col gap-2">
            <button
              className={`w-full bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!isEmailValid ? 'opacity-65' : ''}`}
              type="submit"
              disabled={!isEmailValid}
            >
              Sign In
            </button>
            <span className="block text-center mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-800">
                Sign Up
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
