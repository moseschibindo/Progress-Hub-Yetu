import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0a0a0a]"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", damping: 10 }}
          className="w-20 h-20 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-6"
        >
          <Zap className="w-10 h-10 text-white dark:text-black fill-current" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold tracking-tighter text-black dark:text-white"
        >
          NEXUS COLLECTIVE
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="h-0.5 bg-black/10 dark:bg-white/10 mt-4 overflow-hidden relative"
        >
          <motion.div
            animate={{ x: [-120, 120] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 w-32 bg-black dark:bg-white"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
