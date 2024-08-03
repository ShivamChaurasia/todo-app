import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AppLogo from '../components/AppLogo';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Topbar: React.FC = () => {
  const { logout, user } = useContext(AuthContext);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      toast.error('Failed to logout');
    }
  }

  return (
    <header className="bg-primary-200 text-white p-4 flex justify-between items-center shadow">
      <AppLogo />
      <div className="flex items-center space-x-4">
        <span className="text-lg text-primary-500">{user?.email}</span>
        {user && <Button type="button" text="Logout" onClick={handleLogout} />}
      </div>
    </header>
  );
};

export default Topbar;
