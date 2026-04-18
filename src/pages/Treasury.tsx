import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Receipt,
  PieChart,
  Calendar,
  Loader2,
  TrendingDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Expenditure, Contribution, Fine } from '../types';

import { useSettings } from '../context/SettingsContext';

const Treasury: React.FC = () => {
  const { appSettings } = useSettings();
  const currency = appSettings?.currency || 'Ksh';
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [balanceData, setBalanceData] = useState({
    savings: 0,
    fines: 0,
    expenditures: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Savings (Verified)
        const { data: savings } = await supabase
          .from('contributions')
          .select('amount')
          .eq('status', 'verified');
        
        // Fetch Paid Fines
        const { data: fines } = await supabase
          .from('fines')
          .select('amount')
          .eq('status', 'paid');

        // Fetch Expenditures
        const { data: exps } = await supabase
          .from('expenditures')
          .select('*')
          .order('date', { ascending: false });

        const totalSavings = (savings as any[])?.reduce((sum, s) => sum + Number(s.amount), 0) || 0;
        const totalFines = (fines as any[])?.reduce((sum, f) => sum + Number(f.amount), 0) || 0;
        const totalExps = (exps as any[])?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

        setBalanceData({
          savings: totalSavings,
          fines: totalFines,
          expenditures: totalExps,
        });

        if (exps) setExpenditures(exps);
      } catch (err) {
        console.error('Error fetching treasury data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const netBalance = balanceData.savings + balanceData.fines - balanceData.expenditures;

  return (
    <div className="p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase">
            The <span className="text-gray-400 dark:text-gray-500">Safe</span>
          </h2>
          <p className="mt-1 text-gray-500 font-medium">Tracking group savings and spending</p>
        </div>
      </header>

      {/* Main Balance Card */}
      <div className="relative overflow-hidden bg-black dark:bg-white rounded-[3rem] p-10 md:p-14 text-white dark:text-black">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-64 h-64 -mr-20 -mt-20" />
         </div>

             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Total Balance</p>
                   <h3 className="text-6xl font-black tracking-tight mb-4">{currency} {netBalance.toLocaleString()}<span className="text-2xl opacity-40">.00</span></h3>
                   <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                      <TrendingUp className="w-4 h-4" />
                      Money is safe
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Savings</p>
                      <p className="text-xl font-bold">{currency} {(balanceData.savings + balanceData.fines).toLocaleString()}</p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Spent</p>
                      <p className="text-xl font-bold text-red-400">-{currency} {balanceData.expenditures.toLocaleString()}</p>
                   </div>
                </div>
             </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Categories Summary */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 dark:text-white flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-emerald-500" />
                  Money Layout
               </h3>
               
               <div className="space-y-6">
                  {[
                    { label: 'Member Savings', amount: balanceData.savings, color: 'bg-emerald-500' },
                    { label: 'Group Fines', amount: balanceData.fines, color: 'bg-orange-500' },
                    { label: 'Spending', amount: balanceData.expenditures, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                       <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black uppercase text-gray-400">{item.label}</p>
                          <p className="text-xs font-bold dark:text-white">{currency} {item.amount.toLocaleString()}</p>
                       </div>
                       <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={cn("h-full", item.color)} style={{ width: `${Math.min(100, (item.amount / (netBalance || 1)) * 100)}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Expenditure List */}
         <div className="lg:col-span-2 bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex items-center justify-between">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] dark:text-white flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Recent Spending
               </h3>
               <button className="p-2.5 rounded-xl glass text-gray-400 hover:text-black dark:hover:text-white transition-all">
                  <Calendar className="w-4 h-4" />
               </button>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-900 text-left">
               {loading ? (
                 <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-gray-300" /></div>
               ) : expenditures.length > 0 ? expenditures.map((exp, i) => (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all flex items-center justify-between gap-6"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500">
                           <ArrowDownLeft className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-bold text-sm dark:text-white uppercase tracking-tight">{exp.title}</h4>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{exp.category} • {exp.date}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-black tracking-tight text-red-500">-{currency} {Number(exp.amount).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                     </div>
                  </motion.div>
               )) : (
                 <div className="p-20 text-center text-gray-400 font-medium">No expenditures recorded.</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Treasury;
