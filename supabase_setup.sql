
-- 1. Create tables
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  phone TEXT UNIQUE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create contributions table
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'failed')),
  type TEXT DEFAULT 'one-time' CHECK (type IN ('subscription', 'one-time', 'grant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Fines table
CREATE TABLE IF NOT EXISTS public.fines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Expenditures table
CREATE TABLE IF NOT EXISTS public.expenditures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Projects (Goals) table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  spent DECIMAL(12, 2) DEFAULT 0,
  budget DECIMAL(12, 2) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('pdf', 'video', 'image', 'link')),
  url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Executive table
CREATE TABLE IF NOT EXISTS public.executive (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  responsibilities TEXT[],
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Constitution table
CREATE TABLE IF NOT EXISTS public.constitution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- App Settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_name TEXT DEFAULT 'Progress Hub Yetu' NOT NULL,
  logo_url TEXT,
  currency TEXT DEFAULT 'Ksh' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenditures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constitution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contributions
CREATE POLICY "Contributions viewable by members" ON public.contributions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Members can log own deposits" ON public.contributions FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins can manage all contributions" ON public.contributions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Activities
CREATE POLICY "Activities viewable by members" ON public.activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Members can log activities" ON public.activities FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Fines
CREATE POLICY "Fines viewable by members" ON public.fines FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage fines" ON public.fines FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Expenditures
CREATE POLICY "Expenditures viewable by members" ON public.expenditures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage expenditures" ON public.expenditures FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects
CREATE POLICY "Projects viewable by members" ON public.projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Resources
CREATE POLICY "Resources viewable by members" ON public.resources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Executive
CREATE POLICY "Executive viewable by members" ON public.executive FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage executive" ON public.executive FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Constitution
CREATE POLICY "Constitution viewable by members" ON public.constitution FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage constitution" ON public.constitution FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- App Settings
CREATE POLICY "Settings viewable by everyone" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.app_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Initial Seeding
-- Seed default settings
INSERT INTO public.app_settings (id, app_name, currency) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Progress Hub Yetu', 'Ksh')
ON CONFLICT (id) DO NOTHING;

-- Seed initial constitution if needed
INSERT INTO public.constitution (content)
VALUES ('{
  "title": "Group Rules & Constitution",
  "sections": [
    {"title": "Membership", "content": "Open to all verified individuals who commit to regular contributions."},
    {"title": "Contributions", "content": "Minimum monthly savings of Ksh 1,000 required by the 5th of every month."},
    {"title": "Benefits", "content": "Members can access emergency loans and group investments after 6 months of active contribution."},
    {"title": "Conduct", "content": "Respect, transparency, and integrity are the core values of our group."}
  ]
}'::jsonb);

-- 5. Helper Function for profile creation (Trigger)
-- This function automatically creates a profile when a user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, username, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    'member'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    username = EXCLUDED.username,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
