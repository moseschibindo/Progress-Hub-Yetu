import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';

const SplashScreen: React.FC = () => {
  const { settings } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 150, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-500/30 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -120, 0],
            y: [0, 150, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.6, 1],
            x: [0, 80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-[20%] left-[20%] w-[45%] h-[45%] rounded-full bg-rose-500/25 blur-[110px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-[40%] left-[40%] w-[35%] h-[35%] rounded-full bg-amber-400/20 blur-[90px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.2 
          }}
          className="relative mb-8"
        >
          {/* Multi-color Logo Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-blue-500 to-purple-500 blur-3xl opacity-50 rounded-full animate-pulse" />
          
          {settings.app_logo ? (
            <img 
              src={settings.app_logo} 
              alt="Logo" 
              className="w-32 h-32 rounded-[40px] shadow-2xl relative z-10 border border-white/20" 
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-[40px] flex items-center justify-center text-white text-5xl font-black shadow-2xl relative z-10 border border-white/20">
              {settings.app_name?.charAt(0) || 'L'}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          className="text-center px-6"
        >
          <h1 className="text-6xl font-black tracking-tighter text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
              {settings.app_name}
            </span>
          </h1>
          <p className="text-xl font-bold text-white/50 tracking-[0.2em] uppercase text-[12px] animate-pulse">
            {settings.app_slogan}
          </p>
        </motion.div>

        {/* Dynamic Colorful Loading Indicator */}
        <div className="mt-20 flex space-x-3">
          {[
            'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]', 
            'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]', 
            'bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.8)]',
            'bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.8)]'
          ].map((colorClass, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className={cn("w-2.5 h-2.5 rounded-full", colorClass)}
            />
          ))}
        </div>
      </div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </motion.div>
  );
};

export default SplashScreen;
