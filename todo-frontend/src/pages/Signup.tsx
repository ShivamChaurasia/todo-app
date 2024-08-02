import React, {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  FormEvent,
} from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';

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
    <Card title="Sign Up">
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
          <Button
            type="submit"
            isDisabled={isDisabled}
            isLoading={isLoading}
            text="Sign Up"
          />
          <span className="block text-center mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-primary-500 hover:text-primary-400"
            >
              Sign In
            </a>
          </span>
        </div>
      </form>
    </Card>
  );
};

export default Signup;
