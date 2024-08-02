import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import axios from '../lib/axios';

interface AuthContextProps {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/auth/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    setUser({ email });
  };

  const signup = async (email: string, password: string) => {
    const response = await axios.post('/auth/signup', { email, password });
    localStorage.setItem('token', response.data.access_token);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const values = useMemo(() => ({ user, login, logout, signup }), [user]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
