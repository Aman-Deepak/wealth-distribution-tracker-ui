// src/components/layout/AppLayout.tsx
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile sidebar overlay */}
      {!sidebarCollapsed && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setSidebarCollapsed(true)}
          />
          <div className="relative">
            <Sidebar 
              isCollapsed={false} 
              onToggle={() => setSidebarCollapsed(true)} 
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
