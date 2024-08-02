import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import InputField from '../components/InputField';
import { AuthContext } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signup } = useContext(AuthContext);

  const checkEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsEmailValid(checkEmail(newEmail));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signup(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsDisabled(!(name && isEmailValid && password));
  }, [name, isEmailValid, password]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-3xl shadow-md lg:w-[500px]">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            isValid={isEmailValid}
            placeholder="Enter your email"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className={`w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 ${isDisabled || isLoading ? 'opacity-65' : ''}`}
            disabled={isDisabled || isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <span className="block text-center mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Sign In
            </a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;