import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  BookOpen, 
  FolderKanban 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const BottomNav: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Wallet, label: 'Safe', path: '/treasury' },
    { icon: Users, label: 'Members', path: '/members' },
    { icon: FolderKanban, label: 'Goals', path: '/projects' },
    { icon: BookOpen, label: 'Rules', path: '/constitution' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md md:hidden">
      <nav className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-3xl p-1.5 flex items-center justify-between shadow-2xl relative">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative flex flex-col items-center justify-center py-2 px-3 transition-all duration-300 z-10 rounded-2xl",
              isActive ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
