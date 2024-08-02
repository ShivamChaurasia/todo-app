import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import InputField from '../components/InputField';

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
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-3xl shadow-md lg:w-[500px]">
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
              className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!isEmailValid ? 'opacity-65' : ''}`}
              type="submit"
              disabled={!isEmailValid}
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline text-sm text-blue-600 hover:text-blue-800"
              href="/signup"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
