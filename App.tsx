import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ManagerDashboard from './pages/ManagerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import UserDashboard from './pages/UserDashboard';
import SeniorTechnicianDashboard from './pages/SeniorTechnicianDashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { UserRole } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.MANAGER);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = (role: UserRole = UserRole.MANAGER) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(UserRole.MANAGER);
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (userRole) {
      case UserRole.MANAGER:
        return <ManagerDashboard />;
      case UserRole.TECHNICIAN:
        return <TechnicianDashboard />;
      case UserRole.SENIOR_TECHNICIAN:
        return <SeniorTechnicianDashboard />;
      case UserRole.USER:
        return <UserDashboard />;
      default:
        return <ManagerDashboard />;
    }
  };

  // Private Layout Wrapper
  const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex min-h-screen bg-space-900 text-slate-200">
      <Sidebar
        role={userRole}
        onLogout={handleLogout}
        currentPage={activePage}
        onNavigate={setActivePage}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute top-0 left-0 h-full bg-space-800 z-40 animate-in slide-in-from-left w-64 border-r border-space-border" onClick={e => e.stopPropagation()}>
            <Sidebar
              role={userRole}
              onLogout={handleLogout}
              currentPage={activePage}
              onNavigate={(page) => {
                setActivePage(page);
                setSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LandingPage onLogin={() => window.location.hash = '#/login'} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <PrivateLayout>
                {renderDashboard()}
              </PrivateLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;