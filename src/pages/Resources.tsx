import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Download, 
  Search,
  FolderOpen,
  Filter,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Resource } from '../types';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Member Guide',
      description: 'A simple guide to help you understand how our group works.',
      type: 'pdf',
      url: '#',
      category: 'Rules'
    },
    {
       id: '2',
       title: 'Group Progress Video',
       description: 'A quick look at how much we have grown recently.',
       type: 'video',
       url: '#',
       category: 'Progress'
    },
    {
       id: '3',
       title: 'Group Chart',
       description: 'A simple map showing how we are connected.',
       type: 'image',
       url: '#',
       category: 'Tech'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) setResources(data);
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
    };
    fetchResources();
  }, []);

  const filtered = resources.filter(r => 
    (activeTab === 'All' || r.category === activeTab) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  return (
    <div className="p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase">
            Photo <span className="text-gray-400 dark:text-gray-500">Gallery</span>
          </h2>
          <p className="mt-1 text-gray-400 font-medium">Documents and photos from our group</p>
        </div>
      </header>

      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
         <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for files..." 
              className="w-full bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-3xl pl-16 pr-8 py-4 text-sm font-semibold placeholder:text-gray-300 dark:text-white outline-none focus:ring-4 ring-emerald-500/5 transition-all shadow-sm"
            />
         </div>
         <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-gray-800">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === cat ? "bg-black text-white dark:bg-white dark:text-black shadow-lg" : "text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filtered.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative cursor-pointer"
            >
               <div className="flex items-center justify-between mb-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                    resource.type === 'pdf' && "bg-red-50 dark:bg-red-900/20 text-red-500",
                    resource.type === 'video' && "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
                    resource.type === 'image' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500",
                    resource.type === 'link' && "bg-gray-50 dark:bg-gray-900 text-gray-500"
                  )}>
                     {resource.type === 'pdf' && <FileText className="w-7 h-7" />}
                     {resource.type === 'video' && <Video className="w-7 h-7" />}
                     {resource.type === 'image' && <ImageIcon className="w-7 h-7" />}
                     {resource.type === 'link' && <LinkIcon className="w-7 h-7" />}
                  </div>
                  <div className="p-2.5 rounded-xl glass text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                     <Download className="w-5 h-5" />
                  </div>
               </div>

               <div className="space-y-2 mb-8 text-left">
                  <p className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.3em]">{resource.category}</p>
                  <h3 className="text-xl font-black tracking-tight dark:text-white uppercase leading-tight group-hover:text-emerald-500 transition-colors">{resource.title}</h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{resource.description}</p>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-2">
                     <FolderOpen className="w-3 h-3 text-gray-400" />
                     <span className="text-[9px] font-bold text-gray-400 uppercase">Hub Files</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
};

export default Resources;
