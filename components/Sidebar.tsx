import React from 'react';
import { LayoutDashboard, Ticket, BarChart3, Settings, AlertTriangle, LogOut, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, currentPage, onNavigate }) => {
  // Get user info from localStorage
  const getUserName = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.name || 'User';
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
    return 'User';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(role === UserRole.MANAGER ? [{ id: 'analytics', label: 'Risk Analytics', icon: BarChart3 }] : []),
  ];

  return (
    <div className="w-64 bg-space-900/95 backdrop-blur-xl h-screen border-r border-space-border flex flex-col hidden md:flex sticky top-0 z-30">
      <div className="p-6 flex items-center gap-3 border-b border-space-border">
        <div className="bg-brand-500/10 border border-brand-500/20 p-2 rounded-lg shadow-glow">
          <ShieldAlert className="w-6 h-6 text-brand-400" />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg leading-tight tracking-wide">SLA Guard</h1>
          <p className="text-xs text-slate-500">System V.2.0</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-glow'
                : 'text-slate-400 hover:bg-space-800 hover:text-slate-200'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-space-border">
        <div className="mb-4 px-4 py-3 bg-space-800/50 rounded-lg border border-space-border">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
          <p className="text-sm font-medium text-slate-200">{getUserName()}</p>
          <p className="text-xs text-slate-500 capitalize">{role.toLowerCase().replace('_', ' ')}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-space-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;