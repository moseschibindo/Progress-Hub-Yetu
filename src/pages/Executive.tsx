import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  ShieldCheck, 
  Linkedin, 
  Twitter, 
  Mail, 
  ArrowRight,
  Loader2,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Executive as ExecutiveType } from '../types';

const Executive: React.FC = () => {
  const [executives, setExecutives] = useState<ExecutiveType[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'Operations',
      responsibilities: ['Group Planning', 'Checking Progress', 'New Members'],
      avatar: 'https://picsum.photos/seed/sarah/400/400'
    },
    {
      id: '2',
      name: 'Marcus Thorne',
      role: 'Money Manager',
      responsibilities: ['Money Flow', 'Project Funding', 'Managing Savings'],
      avatar: 'https://picsum.photos/seed/marcus/400/400'
    },
    {
       id: '3',
       name: 'Elena Vance',
       role: 'Tech Lead',
       responsibilities: ['App Building', 'Managing Goals', 'Security'],
       avatar: 'https://picsum.photos/seed/elena/400/400'
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const { data } = await supabase.from('executive').select('*').order('created_at');
        if (data && data.length > 0) setExecutives(data);
      } catch (err) {
        console.error('Error fetching executives:', err);
      }
    };
    fetchExecutives();
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto w-full text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase">
            Our <span className="text-gray-400 dark:text-gray-500">Leaders</span>
          </h2>
          <p className="mt-1 text-gray-500 font-medium">The people who help manage Progress Hub Yetu</p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
           <ShieldCheck className="w-5 h-5 text-emerald-500" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Verified Leaders</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executives.map((exec, i) => (
               <motion.div
                 key={exec.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="group relative"
               >
                  <div className="bg-white dark:bg-[#111111] rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 pt-0 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                     {/* Glass Overlay Effect */}
                     <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
                     
                     {/* Avatar Area */}
                     <div className="flex justify-center -translate-y-12 relative">
                        <div className="w-32 h-32 rounded-[2.5rem] border-8 border-gray-50 dark:border-[#0a0a0a] overflow-hidden shadow-2xl relative">
                           <img src={exec.avatar} alt={exec.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                     </div>

                     {/* Info */}
                     <div className="text-center -mt-6 mb-8">
                        <h3 className="text-xl font-black tracking-tight dark:text-white uppercase">{exec.name}</h3>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">{exec.role}</p>
                        
                        <div className="flex items-center justify-center gap-4">
                           <button className="p-2.5 rounded-xl glass text-gray-400 hover:text-black dark:hover:text-white transition-all"><Linkedin className="w-4 h-4" /></button>
                           <button className="p-2.5 rounded-xl glass text-gray-400 hover:text-black dark:hover:text-white transition-all"><Twitter className="w-4 h-4" /></button>
                           <button className="p-2.5 rounded-xl glass text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all"><Mail className="w-4 h-4" /></button>
                        </div>
                     </div>

                     {/* Responsibilities */}
                     <div className="space-y-3 pb-4">
                        <p className="text-[9px] font-black uppercase text-gray-300 dark:text-gray-600 tracking-[0.2em] mb-4 text-center">Core Directives</p>
                        {exec.responsibilities.map((resp, idx) => (
                           <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black/50 rounded-xl border border-transparent hover:border-emerald-500/10 transition-all">
                              <ArrowRight className="w-3 h-3 text-emerald-500" />
                              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">{resp}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

      {/* Recruitment Teaser */}
      <div className="max-w-4xl mx-auto w-full py-20 text-center">
         <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="space-y-6"
         >
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-emerald-500" />
               </div>
            </div>
            <h4 className="text-2xl font-bold tracking-tight dark:text-white uppercase leading-none">Want to <span className="text-gray-400">Lead?</span></h4>
            <p className="text-sm font-medium text-gray-500 max-w-lg mx-auto leading-relaxed">Leaders are chosen based on their experience and how much they help the group.</p>
            <button className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95">
               Talk to us
            </button>
         </motion.div>
      </div>
    </div>
  );
};

export default Executive;
