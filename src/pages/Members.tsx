import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Search, Filter, MoreHorizontal, UserPlus, Mail, Shield, Loader2, FolderKanban, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const Members: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setMembers(data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase transition-all">
            Group <span className="text-gray-400 dark:text-gray-500">Members</span>
          </h2>
          <p className="mt-1 text-gray-500 font-medium">Meet the people in Progress Hub Yetu</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all">
             <UserPlus className="w-4 h-4" />
             Add Member
           </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a member..." 
            className="w-full bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-3xl pl-16 pr-8 py-4 text-sm font-semibold placeholder:text-gray-300 dark:text-white outline-none focus:ring-4 ring-emerald-500/5 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-6 border-b border-gray-50 dark:border-gray-900">
           <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</div>
           <div className="col-span-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</div>
           <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</div>
           <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Verified</div>
           <div className="col-span-1 text-right"></div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-900">
          {loading ? (
            <div className="p-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : filteredMembers.length > 0 ? filteredMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-10 py-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="col-span-1 flex items-center justify-center md:justify-start">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
              </div>

              <div className="col-span-5 flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-black dark:text-white font-black uppercase transition-all group-hover:scale-110 overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : member.name[0]}
                 </div>
                 <div className="text-left">
                    <h4 className="font-bold text-sm dark:text-white uppercase tracking-tight">{member.name}</h4>
                    <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                       <Mail className="w-3 h-3" />
                       {member.email}
                    </p>
                 </div>
              </div>

              <div className="col-span-3 flex items-center">
                 <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {member.role}
                 </div>
              </div>

              <div className="col-span-2 flex items-center">
                 <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-gray-400">Verified</span>
                 </div>
              </div>

              <div className="col-span-1 flex items-center justify-end">
                 <button className="p-2 text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          )) : (
            <div className="p-20 text-center text-gray-400 font-medium">No personnel records found matching search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
