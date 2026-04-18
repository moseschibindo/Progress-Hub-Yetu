import React from 'react';
import { motion } from 'motion/react';
import { Bell, Info, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Notifications: React.FC = () => {
  const notifications = [
    { id: 1, type: 'alert', title: 'Security Protocol Updated', message: 'System wide security parameters have been refreshed. Please review rules.', time: '10m ago', read: false },
    { id: 2, type: 'success', title: 'Transfer Completed', message: 'Your contribution of $120.00 has been verified and logged.', time: '2h ago', read: true },
    { id: 3, type: 'info', title: 'New Member Detected', message: 'Marcus Thorne has joined the organization as a Junior Associate.', time: '5h ago', read: false },
    { id: 4, type: 'warning', title: 'Storage Limit Warning', message: 'Your archive storage is at 85% capacity. Consider upgrading tier.', time: 'Yesterday', read: true },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white uppercase">
            Message <span className="text-gray-300 dark:text-gray-600">Stream</span>
          </h2>
          <p className="mt-2 text-gray-400 font-medium">Monitoring communication channels</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-black dark:hover:bg-white text-black dark:text-white hover:text-white dark:hover:text-black rounded-2xl border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest transition-all">
          <Trash2 className="w-4 h-4" />
          Clear Log
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-300 group cursor-pointer",
              notif.read ? "bg-white dark:bg-[#111111] border-gray-100 dark:border-gray-800" : "bg-gray-50 dark:bg-gray-900 border-black/10 dark:border-white/10 shadow-lg"
            )}
          >
            <div className="flex items-start gap-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md",
                notif.type === 'alert' && "bg-black dark:bg-white text-white dark:text-black",
                notif.type === 'success' && "bg-emerald-500 text-white",
                notif.type === 'info' && "bg-blue-500 text-white",
                notif.type === 'warning' && "bg-orange-500 text-white",
              )}>
                {notif.type === 'alert' && <AlertTriangle className="w-6 h-6" />}
                {notif.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                {notif.type === 'info' && <Info className="w-6 h-6" />}
                {notif.type === 'warning' && <Bell className="w-6 h-6" />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold tracking-tight text-black dark:text-white uppercase text-sm">{notif.title}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{notif.message}</p>
              </div>

              {!notif.read && (
                <div className="w-3 h-3 bg-black dark:bg-white rounded-full absolute top-6 right-6 shadow-[0_0_10px_rgba(0,0,0,0.3)]"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
