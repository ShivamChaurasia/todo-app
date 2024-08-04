import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../contexts/AuthContext';
import axios from '../../lib/axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';

// Setup mock for Axios
const mock = new MockAdapter(axios);

// Test Component
const TestComponent: React.FC = () => {
  const { user, loading, login, signup, logout } =
    React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <span>{user.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => login('test@example.com', 'password')}>
            Login
          </button>
          <button onClick={() => signup('test@example.com', 'password')}>
            Signup
          </button>
        </div>
      )}
    </div>
  );
};

// Tests
describe('AuthContext', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('should login and set user', async () => {
    mock
      .onPost('/auth/login')
      .reply(200, { accessToken: 'accessToken', refreshToken: 'refreshToken' });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText('Login'));

    await screen.findByText('test@example.com');
  });

  test('should signup and set user', async () => {
    mock
      .onGet('/auth/verify-token')
      .reply(401, { message: 'Token verification failed' });
    mock
      .onPost('/auth/signup')
      .reply(200, { accessToken: 'accessToken', refreshToken: 'refreshToken' });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    const signupBtn = await screen.findByText('Signup');
    fireEvent.click(signupBtn);

    await screen.findByText('test@example.com');
  });

  test('should logout and clear user', async () => {
    mock
      .onPost('/auth/login')
      .reply(200, { accessToken: 'accessToken', refreshToken: 'refreshToken' });
    mock.onPost('/auth/logout').reply(200);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Trigger login to set user
    const signinBtn = await screen.findByText('Login');
    fireEvent.click(signinBtn);

    await screen.findByText('test@example.com');

    // Trigger logout
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() =>
      expect(screen.queryByText('test@example.com')).toBeNull(),
    );
  });

  test('should handle token verification failure', async () => {
    mock.onGet('/auth/verify-token').reply(401);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByText('test@example.com')).toBeNull(),
    );
  });
});
