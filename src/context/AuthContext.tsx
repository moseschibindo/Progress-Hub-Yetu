import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signUp: (params: { name?: string; username: string; email: string; phone: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (phone: string, password: string) => {
    if (!supabase) throw new Error('Supabase not configured');

    const cleanPhone = phone.trim();

    // 1. Look up email associated with phone
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('phone', cleanPhone)
      .single();

    if (profileError || !profileData) {
      throw new Error('No account found with this phone number.');
    }

    // 2. Sign in with email and password
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password,
    });

    if (authError) throw authError;
  };

  const signUp = async (params: { name?: string; username: string; email: string; phone: string; password: string }) => {
    if (!supabase) throw new Error('Supabase not configured');

    const displayName = params.name || params.username;

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        data: {
          full_name: displayName,
          username: params.username.trim(),
          phone: params.phone.trim()
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      // 2. Create profile with upsert to prevent trigger conflicts
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          name: displayName,
          username: params.username.trim(),
          email: params.email.trim(),
          phone: params.phone.trim(),
          role: 'member'
        });

      if (profileError) throw profileError;
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !supabase) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (error) throw error;
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
