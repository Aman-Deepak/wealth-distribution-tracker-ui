// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  BellIcon, 
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Mobile menu toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Wealth Tracker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Financial Management Dashboard
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 relative transition-colors">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Account Settings
                </p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user?.id}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <CogIcon className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-600" />
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
