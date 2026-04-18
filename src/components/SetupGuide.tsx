import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ExternalLink, Key, Database, Globe } from 'lucide-react';

const SetupGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-6 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-[#111111] rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-gray-800 text-left"
      >
        <div className="flex items-center gap-4 mb-10 overflow-hidden">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white uppercase leading-none">
              Configuration <span className="text-gray-300 dark:text-gray-600 font-light italic">Required</span>
            </h2>
            <p className="text-gray-400 font-medium mt-2">Supabase credentials are missing from your environment.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Step 01: API Credentials</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-transparent hover:border-black/5 transition-all">
                   <Key className="w-5 h-5 mb-4 text-emerald-500" />
                   <p className="text-xs font-bold dark:text-white uppercase mb-1">VITE_SUPABASE_URL</p>
                   <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Found in Project Settings &gt; API &gt; Project URL</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-transparent hover:border-black/5 transition-all">
                   <Database className="w-5 h-5 mb-4 text-blue-500" />
                   <p className="text-xs font-bold dark:text-white uppercase mb-1">VITE_SUPABASE_ANON_KEY</p>
                   <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Found in Project Settings &gt; API &gt; anon/public API key</p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Step 02: Database Schema</h3>
             <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white dark:bg-black rounded-xl">
                      <Globe className="w-5 h-5 text-gray-400" />
                   </div>
                   <div>
                      <p className="text-xs font-bold dark:text-white uppercase">Run SQL Setup</p>
                      <p className="text-[10px] text-gray-400 font-medium">Execute contents of supabase_setup.sql in your SQL Editor.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
             Open the <span className="text-black dark:text-white">Secrets</span> panel in AI Studio to add variables.
           </p>
           <a 
             href="https://supabase.com/dashboard" 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all active:scale-95 shrink-0"
           >
             Supabase Console
             <ExternalLink className="w-4 h-4" />
           </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupGuide;
