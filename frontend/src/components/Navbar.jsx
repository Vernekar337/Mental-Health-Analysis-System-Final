import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MentalHealthSys</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2 capitalize">{role}</span>
              <span className="h-4 w-px bg-gray-300 mx-2"></span>
              <div className="flex items-center font-medium text-gray-900">
                <User className="h-4 w-4 mr-1" />
                {user.name || user.email}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none transition"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
