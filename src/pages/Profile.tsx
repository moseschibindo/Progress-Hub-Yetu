import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, ShieldCheck, Camera, Save, Settings, Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    bio: profile?.bio || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-10">
      <header>
        <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white uppercase text-center md:text-left">
          Identity <span className="text-gray-300 dark:text-gray-600">Profile</span>
        </h2>
        <p className="mt-2 text-gray-400 font-medium text-center md:text-left">Manage your collective record</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center shadow-lg relative overflow-hidden group">
            <div className="relative mt-8 mb-6">
              <div className="w-32 h-32 rounded-[2rem] bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-5xl font-black shadow-2xl relative group/avatar overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.name?.[0] || 'U'
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl border-4 border-white dark:border-[#111111] flex items-center justify-center shadow-lg text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-black dark:text-white uppercase mb-1">{profile?.name || 'Authorized User'}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">{profile?.role || 'Member'}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 md:p-12 shadow-sm space-y-10">
            <div>
              <h3 className="text-xl font-black dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                 <Settings className="w-6 h-6" />
                 Information Fields
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Legal Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter legal name"
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.25rem] pl-12 pr-6 py-4 text-sm font-bold text-black dark:text-white focus:ring-2 ring-black/5 dark:ring-white/5 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Communication Rail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled
                      placeholder="personal@record.io"
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.25rem] pl-12 pr-6 py-4 text-sm font-bold text-gray-400 dark:text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Public Biography</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your role within the collective..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.25rem] px-6 py-4 text-sm font-bold text-black dark:text-white focus:ring-2 ring-black/5 dark:ring-white/5 transition-all outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
               <button 
                 type="submit" 
                 disabled={saving}
                 className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
               >
                 {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                 Save Identity
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
