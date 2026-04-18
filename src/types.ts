export interface Profile {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
  bio?: string;
}

export interface Contribution {
  id: string;
  profile_id: string;
  amount: number;
  date: string;
  status: 'verified' | 'pending' | 'failed';
  type: 'subscription' | 'one-time' | 'grant';
  profiles?: {
    name: string;
  }
}

export interface Activity {
  id: string;
  profile_id: string;
  type: string;
  content: string;
  created_at: string;
  profiles?: {
    name: string;
  }
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'active' | 'completed';
  spent: number;
  budget: number;
  image_url?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'link';
  url: string;
  category: string;
}

export interface Fine {
  id: string;
  profile_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'paid';
  date: string;
  profiles?: {
    name: string;
  }
}

export interface Expenditure {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Executive {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
  avatar?: string;
}

export interface AppSettings {
  id: string;
  app_name: string;
  logo_url?: string;
  currency: string;
  updated_at: string;
}
