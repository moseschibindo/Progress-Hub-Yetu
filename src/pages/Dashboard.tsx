import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Wallet, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

import { useSettings } from '../context/SettingsContext';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { appSettings } = useSettings();
  const currency = appSettings?.currency || 'Ksh';
  const [stats, setStats] = useState([
    { label: 'Total Members', value: '0', icon: Users, color: 'blue', change: '...' },
    { label: 'Group Savings', value: '0', icon: Wallet, color: 'emerald', change: '...' },
    { label: 'Hub Rating', value: '0%', icon: Activity, color: 'orange', change: '...' },
  ]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [netBalance, setNetBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Member Count
        const { count: memberCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch Total Contributions
        const { data: contribData } = await supabase
          .from('contributions')
          .select('amount')
          .eq('status', 'verified');
        
        // Fetch Expenditures for Net Balance
        const { data: expData } = await supabase
          .from('expenditures')
          .select('amount');

        // Fetch Fines
        const { data: fineData } = await supabase
          .from('fines')
          .select('amount')
          .eq('status', 'paid');
        
        const totalSavings = (contribData as any[])?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
        const totalExps = (expData as any[])?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
        const totalFines = (fineData as any[])?.reduce((sum, f) => sum + Number(f.amount), 0) || 0;
        
        setNetBalance(totalSavings + totalFines - totalExps);

        // Fetch Recent Activity
        const { data: activitiesData } = await supabase
          .from('activities')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats([
          { label: 'Total Members', value: (memberCount || 0).toString(), icon: Users, color: 'blue', change: '+0%' },
          { label: 'Active Contributions', value: `${currency} ${totalSavings.toLocaleString()}`, icon: Wallet, color: 'emerald', change: '+0%' },
          { label: 'Pulse Rating', value: '98.2%', icon: Activity, color: 'orange', change: '+1.2%' },
        ]);

        if (activitiesData) {
          setRecentActivities(activitiesData.map(a => ({
            id: a.id,
            user: (a as any).profiles?.name || 'System',
            action: a.content,
            time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: a.type
          })));
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Subscribe to pulse stream
    const activitySubscription = supabase
      .channel('public:activities')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, payload => {
        // Refresh activity feed
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      activitySubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Welcome <span className="text-gray-400 dark:text-gray-500">Back</span>
          </h2>
          <p className="mt-1 text-gray-500 font-medium">Hello, {profile?.name || 'Friend'}</p>
        </div>

        <div className="flex items-center gap-6 px-8 py-5 bg-black dark:bg-white rounded-[1.5rem] text-white dark:text-black shadow-xl">
           <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Group Money</span>
              <span className="text-2xl font-bold tracking-tight">{currency} {netBalance.toLocaleString()}</span>
           </div>
           <div className="w-px h-8 bg-white/10 dark:bg-black/10"></div>
           <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:bg-black dark:hover:bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-white dark:group-hover:bg-black",
                stat.color === 'blue' && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                stat.color === 'emerald' && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                stat.color === 'orange' && "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
              )}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1 text-xs font-black tracking-widest uppercase opacity-60 group-hover:text-white dark:group-hover:text-black">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 group-hover:text-white/50 dark:group-hover:text-black/50">{stat.label}</p>
            <h3 className="text-4xl font-black tracking-tighter text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white dark:text-black fill-current" />
                   </div>
                   <h3 className="text-lg font-bold tracking-tight dark:text-white">Monthly <span className="text-gray-400">Progress</span></h3>
                </div>
              </div>
              <div className="h-64 flex items-end gap-3 justify-between">
                 {[40, 70, 45, 90, 65, 30, 85, 55, 95, 40].map((h, i) => (
                   <div key={i} className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-t-lg"></div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="p-8 bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 h-full">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Activity</h3>
                 <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-8">
                 {recentActivities.length > 0 ? recentActivities.map((item) => (
                   <div key={item.id} className="relative pl-8 pb-8 last:pb-0 border-l border-gray-100 dark:border-gray-800 last:border-0 text-left">
                      <div className="absolute top-0 left-[-5px] w-[10px] h-[10px] bg-black dark:bg-white rounded-full"></div>
                      <div className="flex flex-col gap-1">
                         <div className="flex items-center justify-between">
                            <span className="text-xs font-black dark:text-white uppercase tracking-tight">{item.user}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{item.time}</span>
                         </div>
                         <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.action}</p>
                      </div>
                   </div>
                 )) : (
                   <p className="text-xs text-gray-400 italic">No recent activity detected.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
