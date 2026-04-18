import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Moon, Sun, Bell, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { appSettings } = useSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 md:hidden">
      <div className="h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
            {appSettings?.logo_url ? (
              <img src={appSettings.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Layout className="w-4 h-4 text-white" />
            )}
          </div>
          <h1 className="text-sm font-bold tracking-tight dark:text-white uppercase truncate max-w-[120px]">
            {appSettings?.app_name || 'Hub Yetu'}
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <Link to="/profile" className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="P" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs uppercase">
                {profile?.name?.[0] || 'U'}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
