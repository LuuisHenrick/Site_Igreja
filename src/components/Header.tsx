import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from './ui/Logo';

export const Header: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo variant="main" className="h-12 w-12" />
            <h1 className="text-2xl font-bold text-gray-900">Igreja Comunidade Vida</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            {user && (
              <>
                <img
                  src={user.user_metadata?.avatar_url || "https://via.placeholder.com/32"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-100 text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};