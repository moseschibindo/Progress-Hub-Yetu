import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AppSettings } from '../types';

interface SettingsContextType {
  notifications: boolean;
  setNotifications: (val: boolean) => void;
  appSettings: AppSettings | null;
  loading: boolean;
  updateAppSettings: (updates: Partial<AppSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      setAppSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppSettings = async (updates: Partial<AppSettings>) => {
    if (!appSettings) return;
    try {
      const { error } = await supabase
        .from('app_settings')
        .update(updates)
        .eq('id', appSettings.id);
      
      if (error) throw error;
      setAppSettings({ ...appSettings, ...updates });
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      notifications, 
      setNotifications, 
      appSettings, 
      loading, 
      updateAppSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
