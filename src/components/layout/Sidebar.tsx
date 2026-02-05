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
  SparklesIcon,
} from '@heroicons/react/24/outline';
import logo from '../../assets/images/wealthtracker-logo-horizontal.svg';

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon, 
    description: 'Overview & Analytics',
    color: 'blue'
  },
  { 
    name: 'Transactions', 
    href: '/transactions', 
    icon: CreditCardIcon, 
    description: 'Income & Expenses',
    color: 'green'
  },
  { 
    name: 'Portfolio', 
    href: '/portfolio', 
    icon: ChartPieIcon, 
    description: 'Investment Analysis',
    color: 'purple'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: DocumentTextIcon, 
    description: 'Financial Reports',
    color: 'orange'
  },
  { 
    name: 'Upload Data', 
    href: '/upload', 
    icon: CloudArrowUpIcon, 
    description: 'Import Files',
    color: 'pink'
  },
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
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ease-in-out`}
    >
      
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm0">
        {!isCollapsed ? (
          <>
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img
                src={logo}
                alt="Wealth Tracker"
                className="h-16 w-auto"   // ⬅️ bigger & balanced
              />
            </div>
            <button
              onClick={onToggle}
              className="hidden lg:flex p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Collapse sidebar"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            
            <button
              onClick={onToggle}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Expand sidebar"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* User Profile as Navigation Item */}
      <div className="pt-2 px-3 lg:px-4">
        {!isCollapsed ? (
          <div
            onClick={() => navigate('/profile')}
            className="group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer"
          >
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-900"></div>
              </div>
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate">{user?.username}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 mt-0.5 truncate">
                Personal Account
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => navigate('/profile')}
            className="group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 rounded-xl p-2 mx-auto w-fit relative"
          >
            <div className="relative mx-auto w-fit">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-900"></div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-lg">
              <div className="font-medium">{user?.username}</div>
              <div className="text-gray-300 dark:text-gray-400 text-xs">Personal Account</div>
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`group relative flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              {/* Active indicator */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              
              {/* Icon */}
              <div className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                <item.icon 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  } ${!isCollapsed && 'group-hover:scale-110'}`} 
                />
              </div>
              
              {/* Text content */}
              {!isCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${
                    isActive 
                      ? 'text-blue-100' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}>
                    {item.description}
                  </p>
                </div>
              )}

              {/* Hover tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-lg">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-300 dark:text-gray-400 text-xs">{item.description}</div>
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Version info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Version 1.0.0</span>
            <span>© 2026</span>
          </div>
        </div>
      )}
    </aside>
  );
};

