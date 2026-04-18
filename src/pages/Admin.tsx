import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { 
  Shield, 
  Settings, 
  Users, 
  Plus, 
  TrendingDown, 
  Gavel, 
  FolderKanban, 
  BookOpen,
  Activity,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Trash2,
  Edit2,
  Globe,
  Image as ImageIcon,
  Coins,
  X,
  UserPlus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Profile, Contribution, Project, AppSettings } from '../types';

const Admin: React.FC = () => {
  const { profile } = useAuth();
  const { appSettings, updateAppSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'app' | 'members' | 'finance' | 'goals' | 'status'>('app');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Common State
  const [members, setMembers] = useState<Profile[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Forms State
  const [appForm, setAppForm] = useState({ name: '', logo: '', currency: '' });
  const [rulesContent, setRulesContent] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  
  // Goal Form State
  const [goalForm, setGoalForm] = useState({ title: '', description: '', budget: '', spent: '', status: 'planned', image_url: '' });
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'members') {
        const { data } = await supabase.from('profiles').select('*').order('name');
        if (data) setMembers(data);
      } else if (activeTab === 'finance') {
        const { data: c } = await supabase.from('contributions').select('*, profiles(name)').order('date', { ascending: false });
        const { data: m } = await supabase.from('profiles').select('id, name').order('name');
        if (c) setContributions(c);
        if (m) setMembers(m);
      } else if (activeTab === 'goals') {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (data) setProjects(data);
      } else if (activeTab === 'app') {
        if (appSettings) {
          setAppForm({ 
            name: appSettings.app_name, 
            logo: appSettings.logo_url || '',
            currency: appSettings.currency || 'Ksh'
          });
        }
        const { data } = await supabase.from('constitution').select('*').single();
        if (data) setRulesContent(JSON.stringify(data.content, null, 2));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAppSettings({ 
        app_name: appForm.name, 
        logo_url: appForm.logo,
        currency: appForm.currency
      });
      showSuccess('App settings updated');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRules = async () => {
    setLoading(true);
    try {
      let content;
      try {
        content = JSON.parse(rulesContent);
      } catch {
        content = rulesContent;
      }
      const { data: existing } = await supabase.from('constitution').select('id').single();
      if (existing) {
        await supabase.from('constitution').update({ content }).eq('id', existing.id);
      } else {
        await supabase.from('constitution').insert({ content });
      }
      showSuccess('Rules updated');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (id: string, newRole: 'admin' | 'member') => {
    try {
      setLoading(true);
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
      if (error) throw error;
      setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
      showSuccess('Member role updated');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await supabase.from('profiles').delete().eq('id', id);
      setMembers(members.filter(m => m.id !== id));
      showSuccess('Member removed');
    } catch (err) {
      console.error(err);
    }
  };

  const addContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !amount) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('contributions').insert({
        profile_id: selectedProfile,
        amount: parseFloat(amount),
        status: 'verified',
        date: new Date().toISOString().split('T')[0]
      });
      if (error) throw error;
      showSuccess('Contribution added');
      setAmount('');
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteContribution = async (id: string) => {
    if (!confirm('Delete this contribution record?')) return;
    try {
      await supabase.from('contributions').delete().eq('id', id);
      setContributions(contributions.filter(c => c.id !== id));
      showSuccess('Contribution deleted');
    } catch (err) {
      console.error(err);
    }
  };

  const upsertGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: goalForm.title,
        description: goalForm.description,
        budget: parseFloat(goalForm.budget),
        spent: parseFloat(goalForm.spent || '0'),
        status: goalForm.status,
        image_url: goalForm.image_url || `https://picsum.photos/seed/${Math.random()}/800/600`
      };

      if (editingGoal) {
        await supabase.from('projects').update(payload).eq('id', editingGoal);
      } else {
        await supabase.from('projects').insert(payload);
      }

      showSuccess(editingGoal ? 'Goal updated' : 'Goal created');
      setEditingGoal(null);
      setGoalForm({ title: '', description: '', budget: '', spent: '', status: 'planned', image_url: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      setProjects(projects.filter(p => p.id !== id));
      showSuccess('Goal deleted');
    } catch (err) {
      console.error(err);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const currency = appSettings?.currency || 'Ksh';

  return (
    <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
      <header className="flex flex-col gap-6 text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white uppercase">
            Admin <span className="text-gray-400 dark:text-gray-500">Terminal</span>
          </h2>
          <p className="mt-1 text-gray-500 font-medium">Full management of Progress Hub Yetu</p>
        </div>
        
        <div className="flex flex-wrap gap-1 p-1 bg-gray-50 dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm w-fit">
           {[
             { id: 'app', label: 'App', icon: Settings },
             { id: 'members', label: 'Users', icon: Users },
             { id: 'finance', label: 'Money', icon: Coins },
             { id: 'goals', label: 'Goals', icon: FolderKanban },
             { id: 'status', label: 'Status', icon: Activity }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                 activeTab === tab.id 
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-lg" 
                  : "text-gray-400 hover:text-black dark:hover:text-white"
               )}
             >
               <tab.icon className="w-3.5 h-3.5" />
               <span className="hidden sm:inline">{tab.label}</span>
             </button>
           ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-emerald-500 rounded-2xl text-white flex items-center gap-4 shadow-xl shadow-emerald-500/10 mb-6"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-10">
         {/* App/Rules Tab */}
         {activeTab === 'app' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold uppercase tracking-tight dark:text-white">App Identity</h3>
                </div>
                <form onSubmit={handleUpdateApp} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">App Name</label>
                    <input 
                      className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                      value={appForm.name}
                      onChange={e => setAppForm({...appForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Logo URL</label>
                    <input 
                      className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                      value={appForm.logo}
                      onChange={e => setAppForm({...appForm, logo: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Currency</label>
                    <input 
                      className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                      value={appForm.currency}
                      onChange={e => setAppForm({...appForm, currency: e.target.value})}
                      placeholder="Ksh, $, etc."
                    />
                  </div>
                  <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                    Save Identity
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold uppercase tracking-tight dark:text-white">Group Rules</h3>
                </div>
                <div className="space-y-4">
                  <textarea 
                    className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-xs font-mono dark:text-white h-[200px]"
                    value={rulesContent}
                    onChange={e => setRulesContent(e.target.value)}
                    placeholder='Edit your rules content (JSON or Text)...'
                  />
                  <button 
                    onClick={handleUpdateRules}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                  >
                    Publish Rules
                  </button>
                </div>
              </div>
           </div>
         )}

         {/* Members Tab */}
         {activeTab === 'members' && (
           <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden">
             <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
               <h3 className="text-lg font-bold uppercase tracking-tight dark:text-white">Member Management</h3>
               <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-bold text-gray-500 uppercase">{members.length} Total</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50/50 dark:bg-black/20 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                     <th className="px-8 py-5">User</th>
                     <th className="px-8 py-5">Role</th>
                     <th className="px-8 py-5">Email</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                   {members.map(m => (
                     <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                       <td className="px-8 py-5 flex items-center gap-4">
                         <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-500 text-xs uppercase">
                           {m.name?.[0] || 'U'}
                         </div>
                         <span className="text-sm font-bold dark:text-white">{m.name}</span>
                       </td>
                       <td className="px-8 py-5">
                          <select 
                            className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-bold uppercase bg-transparent border border-gray-100 dark:border-gray-800 dark:text-white outline-none cursor-pointer",
                              m.role === 'admin' && "bg-black text-white dark:bg-white dark:text-black border-none"
                            )}
                            value={m.role}
                            onChange={(e) => updateMemberRole(m.id, e.target.value as any)}
                            disabled={m.id === profile?.id}
                          >
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                          </select>
                       </td>
                       <td className="px-8 py-5 text-sm font-medium text-gray-400">{m.email}</td>
                       <td className="px-8 py-5 text-right">
                         <button 
                          onClick={() => deleteMember(m.id)}
                          className={cn(
                            "p-2 text-gray-400 hover:text-red-500 transition-colors",
                            m.id === profile?.id && "opacity-20 cursor-not-allowed"
                          )}
                          disabled={m.id === profile?.id}
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {/* Finance Tab */}
         {activeTab === 'finance' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                 <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-3 mb-8">
                       <UserPlus className="w-5 h-5 text-emerald-500" />
                       <h3 className="text-lg font-bold uppercase tracking-tight dark:text-white">Add Contribution</h3>
                    </div>
                    <form onSubmit={addContribution} className="space-y-6 text-left">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Member</label>
                          <select 
                            className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                            value={selectedProfile}
                            onChange={e => setSelectedProfile(e.target.value)}
                            required
                          >
                             <option value="">Select Member</option>
                             {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Amount ({currency})</label>
                          <input 
                            type="number"
                            className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                          />
                       </div>
                       <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                         Record Savings
                       </button>
                    </form>
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
                  <h3 className="text-lg font-bold uppercase tracking-tight dark:text-white">Recent Records</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-gray-50/50 dark:bg-black/20 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                         <th className="px-8 py-5">Member</th>
                         <th className="px-8 py-5">Amount</th>
                         <th className="px-8 py-5">Date</th>
                         <th className="px-8 py-5 text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                        {contributions.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                             <td className="px-8 py-5 text-sm font-bold dark:text-white">{(c as any).profiles?.name}</td>
                             <td className="px-8 py-5 font-bold text-emerald-500">{currency} {Number(c.amount).toLocaleString()}</td>
                             <td className="px-8 py-5 text-xs text-gray-400">{c.date}</td>
                             <td className="px-8 py-5 text-right">
                               <button 
                                onClick={() => deleteContribution(c.id)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              </div>
           </div>
         )}

         {/* Goals Tab */}
         {activeTab === 'goals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sticky top-6">
                     <h3 className="text-lg font-bold uppercase tracking-tight dark:text-white mb-8">
                        {editingGoal ? 'Edit Goal' : 'New Goal'}
                     </h3>
                     <form onSubmit={upsertGoal} className="space-y-6 text-left">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Title</label>
                           <input 
                             className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                             value={goalForm.title}
                             onChange={e => setGoalForm({...goalForm, title: e.target.value})}
                             required
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Budget ({currency})</label>
                              <input 
                                type="number"
                                className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                                value={goalForm.budget}
                                onChange={e => setGoalForm({...goalForm, budget: e.target.value})}
                                required
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Spent ({currency})</label>
                              <input 
                                type="number"
                                className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                                value={goalForm.spent}
                                onChange={e => setFocusGoalSpent(e)}
                              />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Status</label>
                              <select 
                                className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                                value={goalForm.status}
                                onChange={e => setGoalForm({...goalForm, status: e.target.value})}
                                required
                              >
                                 <option value="planned">Planned</option>
                                 <option value="active">Active</option>
                                 <option value="completed">Completed</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Image URL</label>
                              <input 
                                className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                                value={goalForm.image_url}
                                onChange={e => setGoalForm({...goalForm, image_url: e.target.value})}
                                placeholder="https://..."
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Description</label>
                           <textarea 
                             className="w-full bg-gray-50 dark:bg-black border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white resize-none"
                             rows={3}
                             value={goalForm.description}
                             onChange={e => setGoalForm({...goalForm, description: e.target.value})}
                             required
                           />
                        </div>
                        <div className="flex gap-4">
                           <button 
                             type="submit"
                             className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                           >
                             {editingGoal ? 'Update' : 'Create'}
                           </button>
                           {editingGoal && (
                             <button 
                               type="button"
                               onClick={() => { setEditingGoal(null); setGoalForm({ title: '', description: '', budget: '', spent: '', status: 'planned', image_url: '' }) }}
                               className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-400"
                             >
                                <X className="w-4 h-4" />
                             </button>
                           )}
                        </div>
                     </form>
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-4">
                  {projects.map(p => (
                    <div key={p.id} className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex items-center justify-between group text-left">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                             <img src={p.image_url} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm dark:text-white uppercase tracking-tight">{p.title}</h4>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{currency} {Number(p.budget).toLocaleString()} Budget</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingGoal(p.id);
                              setGoalForm({ title: p.title, description: p.description, budget: p.budget.toString(), spent: (p.spent || 0).toString(), status: p.status, image_url: p.image_url || '' });
                            }}
                            className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-emerald-500 transition-colors"
                          >
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteGoal(p.id)}
                            className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         )}

         {/* Status Tab */}
         {activeTab === 'status' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: 'Latency', value: '14ms', icon: Activity },
               { label: 'Uptime', value: '100%', icon: Globe },
               { label: 'Sync', value: '1.2s', icon: FolderKanban },
               { label: 'Cloud', value: 'Ready', icon: Shield }
             ].map(m => (
               <div key={m.label} className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 text-center sm:text-left transition-all hover:scale-105">
                 <m.icon className="w-6 h-6 text-emerald-500 mb-6 mx-auto sm:mx-0" />
                 <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{m.label}</p>
                 <p className="text-2xl font-black dark:text-white uppercase">{m.value}</p>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
  
  function setFocusGoalSpent(e: any) {
    setGoalForm({...goalForm, spent: e.target.value});
  }
};

export default Admin;
