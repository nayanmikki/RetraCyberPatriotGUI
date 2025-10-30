'use client';

import { useState } from 'react';
import { AppProvider } from '@/lib/context/AppContext';
import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import DashboardView from '@/components/views/DashboardView';
import ForensicsView from '@/components/views/ForensicsView';
import UsersView from '@/components/views/UsersView';
import PasswordView from '@/components/views/PasswordView';
import SecurityView from '@/components/views/SecurityView';
import ServicesView from '@/components/views/ServicesView';
import CleanupView from '@/components/views/CleanupView';
import LogsView from '@/components/views/LogsView';

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'forensics':
        return <ForensicsView />;
      case 'users':
        return <UsersView />;
      case 'password':
        return <PasswordView />;
      case 'security':
        return <SecurityView />;
      case 'services':
        return <ServicesView />;
      case 'cleanup':
        return <CleanupView />;
      case 'logs':
        return <LogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppProvider>
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
        <ErrorDisplay />
        <TopBar />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          
          <main className="flex-1 overflow-hidden">
            {renderView()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

