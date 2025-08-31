// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  CreditCardIcon,
  ChartPieIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, description: 'Overview & Analytics' },
  { name: 'Transactions', href: '/transactions', icon: CreditCardIcon, description: 'Income & Expenses' },
  { name: 'Portfolio', href: '/portfolio', icon: ChartPieIcon, description: 'Investment Analysis' },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon, description: 'Financial Reports' },
  { name: 'Upload Data', href: '/upload', icon: CloudArrowUpIcon, description: 'Import Files' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
      
      {/* Top: Logo and Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">WealthTracker</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage Finances</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User Info (clickable) */}
      {!isCollapsed && (
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => navigate('/profile')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Personal Account</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              {!isCollapsed && (
                <div className="ml-3">
                  <span>{item.name}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom spacing */}
      <div className="flex-0 h-6" />
    </div>
  );
};
