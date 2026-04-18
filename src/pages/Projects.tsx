import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
  FolderKanban, 
  Target, 
  BarChart3, 
  Calendar, 
  Layers,
  Zap,
  Plus,
  ArrowRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Project } from '../types';

const Projects: React.FC = () => {
  const { profile } = useAuth();
  const { appSettings } = useSettings();
  const currency = appSettings?.currency || 'Ksh';
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Infrastructure Upgrade',
      description: 'Upgrading our digital tools and servers to make everything run faster for everyone.',
      status: 'active',
      spent: 4500,
      budget: 12000,
      image_url: 'https://picsum.photos/seed/tech/800/600',
      created_at: '2026-01-15'
    },
    {
       id: '2',
       title: 'Capital Harvest',
       description: 'Planning long-term investments to make sure the group stays stable and has money for the future.',
       status: 'planned',
       spent: 0,
       budget: 50000,
       image_url: 'https://picsum.photos/seed/finance/800/600',
       created_at: '2026-02-28'
    },
    {
       id: '3',
       title: 'Member Portal',
       description: 'A dedicated help and benefit system for all verified members of our group.',
       status: 'completed',
       spent: 8200,
       budget: 8000,
       image_url: 'https://picsum.photos/seed/health/800/600',
       created_at: '2025-11-10'
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto w-full text-left">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                <Target className="w-4 h-4" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Group Goals</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase">
            Our <span className="text-gray-400 dark:text-gray-500">Goals</span>
          </h2>
          <p className="mt-1 text-gray-500 font-medium font-medium">Tracking our plans and target money</p>
        </div>
        
        {profile?.role === 'admin' && (
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Manage Goals
          </Link>
        )}
      </header>

      <div className="max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {projects.map((project, i) => {
               const progress = Math.min(100, (project.spent / project.budget) * 100);
               return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex flex-col md:flex-row bg-white dark:bg-[#111111] rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                     {/* Card Image */}
                     <div className="md:w-1/2 relative overflow-hidden">
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                           <div className={cn(
                             "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit mb-4",
                             project.status === 'active' && "bg-emerald-500 text-white",
                             project.status === 'planned' && "bg-blue-500 text-white",
                             project.status === 'completed' && "bg-gray-500 text-white"
                           )}>
                              {project.status}
                           </div>
                           <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{project.title}</h3>
                        </div>
                     </div>

                     {/* Card Content */}
                     <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                        <div className="space-y-6">
                           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed text-left">
                              {project.description}
                           </p>

                           <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Money Goal</p>
                                 <p className="text-[10px] font-bold uppercase dark:text-white">{progress.toFixed(0)}% Used</p>
                              </div>
                              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${progress}%` }}
                                   className={cn(
                                     "h-full rounded-full",
                                     progress > 90 ? "bg-red-500" : "bg-emerald-500"
                                   )}
                                 />
                              </div>
                              <div className="flex justify-between items-end pt-2">
                                 <div className="text-left">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Target</p>
                                    <p className="text-xl font-black dark:text-white uppercase tracking-tighter">
                                      {currency} <span className="opacity-40">{Number(project.budget).toLocaleString()}</span>
                                    </p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Current</p>
                                    <p className="text-sm font-bold text-emerald-500 uppercase">
                                      {currency} {Number(project.spent).toLocaleString()}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="pt-8 flex items-center justify-between border-t border-gray-50 dark:border-white/5">
                           <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-[9px] font-bold text-gray-400 uppercase">{project.created_at}</span>
                           </div>
                           <button className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-[10px] hover:gap-4 transition-all">
                              View Details
                              <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default Projects;
