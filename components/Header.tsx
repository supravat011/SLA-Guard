import React from 'react';
import { Search, Menu } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-space-900/80 backdrop-blur-md border-b border-space-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 text-slate-400 hover:bg-space-800 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand-400 transition-colors" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="pl-9 pr-4 py-2 bg-space-800/50 border border-space-border rounded-lg text-sm text-slate-200 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-64 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <NotificationPanel />
    </header>
  );
};

export default Header;