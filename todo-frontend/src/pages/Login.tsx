import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Sign In">
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
          <Button
            type="submit"
            isDisabled={!isEmailValid}
            isLoading={isLoading}
            text="Sign In"
          />
          <span className="block text-center mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-primary-500 hover:text-primary-400"
            >
              Sign Up
            </a>
          </span>
        </div>
      </form>
    </Card>
  );
};

export default Login;
