import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  BookOpen, 
  FolderKanban, 
  Image as ImageIcon,
  Shield,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  TrendingDown,
  Layout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { appSettings } = useSettings();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Home', path: '/' },
        { icon: Users, label: 'Members', path: '/members' },
      ]
    },
    {
      label: 'Money',
      items: [
        { icon: Wallet, label: 'Savings', path: '/contributions' },
        { icon: TrendingDown, label: 'Safe', path: '/treasury' },
      ]
    },
    {
      label: 'Group',
      items: [
        { icon: BookOpen, label: 'Rules', path: '/constitution' },
        { icon: Shield, label: 'Leaders', path: '/executive' },
        { icon: FolderKanban, label: 'Goals', path: '/projects' },
      ]
    },
    {
      label: 'Files',
      items: [
        { icon: ImageIcon, label: 'Gallery', path: '/resources' },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-[280px] h-full bg-white dark:bg-[#0a0a0a] border-r border-gray-100 dark:border-gray-800 transition-colors duration-300 relative z-40">
      {/* Branding */}
      <div className="p-8">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-500 overflow-hidden">
             {appSettings?.logo_url ? (
               <img src={appSettings.logo_url} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               <Layout className="w-5 h-5 text-white" />
             )}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight dark:text-white uppercase leading-none truncate w-full">
              {appSettings?.app_name || 'Hub Yetu'}
            </h1>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-8 overflow-y-auto no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 pl-2">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 relative",
                    isActive 
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-gray-400"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight className={cn(
                    "w-3 h-3 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0",
                    "-translate-x-1"
                  )} />
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {profile?.role === 'admin' && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 pl-2">Admin</p>
            <NavLink
              to="/admin"
              className={({ isActive }) => cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-black text-white dark:bg-white dark:text-black" 
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-gray-400"
              )}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Settings</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User & Footer */}
      <div className="p-6">
        <div className="p-4 bg-gray-50 dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-gray-800">
           <div className="flex items-center justify-between mb-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-500"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-red-500 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
           </div>
           
           <Link to="/profile" className="flex items-center gap-3 p-1 rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                 {profile?.avatar ? (
                   <img src={profile.avatar} alt="P" className="w-full h-full object-cover rounded-lg" />
                 ) : (
                   <span className="text-xs font-bold text-emerald-500">{profile?.name?.[0] || 'U'}</span>
                 )}
              </div>
              <div className="min-w-0">
                 <p className="text-xs font-bold dark:text-white truncate">{profile?.name || 'User'}</p>
                 <p className="text-[10px] text-gray-400 capitalize">{profile?.role || 'Member'}</p>
              </div>
           </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
