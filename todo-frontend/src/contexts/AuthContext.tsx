import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import axios from '../lib/axios';

interface User {
  email: string;
}

interface AuthContextProps {
  loading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  loading: false,
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          setLoading(true);
          const response = await axios.get('/auth/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({ email: response.data.email });
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        } finally {
          setLoading(false);
        }
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    setUser({ email });
  };

  const signup = async (email: string, password: string) => {
    const response = await axios.post('/auth/signup', { email, password });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    setUser({ email });
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const values = useMemo(
    () => ({ user, loading, login, logout, signup }),
    [user, loading],
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
