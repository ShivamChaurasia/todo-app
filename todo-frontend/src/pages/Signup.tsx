import React, {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  FormEvent,
} from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import InputField from '../components/InputField';
import { AuthContext } from '../contexts/AuthContext';
import AppLogo from '../components/AppLogo';

const Signup: React.FC = () => {
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
      const statusCode = (err as AxiosError).response?.status;
      if (statusCode === 409) {
        toast.error('Email already exists');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsDisabled(!(isEmailValid && password));
  }, [isEmailValid, password]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-3xl shadow-md lg:w-[500px]">
        <AppLogo />
        <h2 className="text-2xl mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-between flex-col gap-2">
            <button
              type="submit"
              className={`w-full bg-rose-600 text-white py-2 px-4 rounded hover:bg-rose-700 ${isDisabled || isLoading ? 'opacity-65' : ''}`}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
