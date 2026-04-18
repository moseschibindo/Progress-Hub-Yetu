import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Book, ChevronDown, Shield, Scale, Gavel, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Article {
  id: string;
  title: string;
  sections: string[];
}

const Constitution: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Rule 1: Joining the Group',
      sections: [
        'Anyone can join if they believe in our mission.',
        'Members must be active and help the group.',
        'New members need to be verified by a leader.'
      ]
    },
    {
      id: '2',
      title: 'Rule 2: Monthly Savings',
      sections: [
        'Members pay a small amount every month.',
        'Once you pay, the money stays in the group safe.',
        'Special grants need approval from our leaders.'
      ]
    },
    {
       id: '3',
       title: 'Rule 3: Staying in Line',
       sections: [
          'Breaking rules will lead to a small fine.',
          'Repeated failures may lead to removal from the group.',
          'You can talk to a leader if you want to appeal a fine.'
       ]
    }
  ]);
  const [expandedId, setExpandedId] = useState<string | null>('1');
  const [loading, setLoading] = useState(false); // Using static fallback but allowing for fetch

  useEffect(() => {
    const fetchConstitution = async () => {
      try {
        const { data } = await supabase.from('constitution').select('*').single();
        if (data && data.content) {
          if (Array.isArray(data.content)) {
            setArticles(data.content);
          } else if (data.content.sections && Array.isArray(data.content.sections)) {
            const transformed = data.content.sections.map((s: any, i: number) => ({
              id: (i + 1).toString(),
              title: s.title || `Rule ${i + 1}`,
              sections: Array.isArray(s.content) ? s.content : [s.content || '']
            }));
            setArticles(transformed);
          }
        }
      } catch (err) {
        console.error('Error fetching constitution:', err);
      }
    };
    fetchConstitution();
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-4xl text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase">
            Group <span className="text-gray-400 dark:text-gray-500">Rules</span>
          </h2>
          <p className="mt-1 text-gray-500 font-medium">The rules that keep Progress Hub Yetu running</p>
        </div>
        <div className="flex gap-4">
           <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black shadow-xl">
              <Scale className="w-6 h-6" />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl">
         {/* Constitution Content */}
         <div className="lg:col-span-3 space-y-4">
            {articles.map((article, index) => (
               <div 
                 key={article.id}
                 className={cn(
                   "bg-white dark:bg-[#111111] border rounded-[2rem] transition-all duration-500 overflow-hidden",
                   expandedId === article.id 
                    ? "border-emerald-500/30 shadow-2xl shadow-emerald-500/5 ring-1 ring-emerald-500/20" 
                    : "border-gray-100 dark:border-gray-800 shadow-sm"
                 )}
               >
                  <button 
                    onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                    className="w-full p-8 flex items-center justify-between text-left"
                  >
                     <div className="flex items-center gap-6">
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">0{index + 1}</span>
                        <h3 className={cn(
                          "text-lg font-black tracking-tight transition-colors uppercase",
                          expandedId === article.id ? "text-emerald-500 dark:text-emerald-400" : "dark:text-white"
                        )}>{article.title}</h3>
                     </div>
                     <ChevronDown className={cn(
                       "w-5 h-5 transition-transform duration-500 text-gray-400",
                       expandedId === article.id && "rotate-180 text-emerald-500"
                     )} />
                  </button>

                  <AnimatePresence>
                    {expandedId === article.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                         <div className="p-8 pt-0 space-y-4">
                            {article.sections.map((section, sIndex) => (
                               <div key={sIndex} className="flex gap-4 group">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform shrink-0"></div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{section}</p>
                               </div>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            ))}
         </div>

         {/* Side Info */}
         <div className="lg:col-span-2 space-y-8">
            <div className="p-10 bg-black rounded-[2.5rem] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 group-hover:scale-[1.7] transition-transform duration-1000">
                  <Shield className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-50 text-white">Agreement</h4>
                  <p className="text-lg font-bold tracking-tight mb-8 text-white">These rules are for everyone. By using this app, you agree to follow them.</p>
                  <button className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                     I Agree
                     <Gavel className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2rem]">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-40">System Audit</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                     <span className="text-gray-400">Total Articles</span>
                     <span className="dark:text-white">{articles.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                     <span className="text-gray-400">Last Revised</span>
                     <span className="dark:text-white">APR 2026</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Constitution;
