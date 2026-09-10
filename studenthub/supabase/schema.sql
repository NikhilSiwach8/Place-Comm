-- =========================================================================
-- StudentHub - Academic, Career & Achievement Portal
-- Comprehensive PostgreSQL Schema with Row Level Security (RLS) for Supabase
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('student', 'admin', 'faculty', 'placement_cell', 'coordinator');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE visibility_level AS ENUM ('private', 'institution_only', 'public');
CREATE TYPE opportunity_type AS ENUM ('internship', 'job');
CREATE TYPE opportunity_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE notification_category AS ENUM ('General', 'Placement', 'Internship', 'Job', 'Competition', 'Academic', 'Important');
CREATE TYPE notification_priority AS ENUM ('Normal', 'Important', 'Urgent');
CREATE TYPE competition_result AS ENUM ('Participated', 'Shortlisted', 'Finalist', 'Runner-up', 'Winner');

-- User Profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  location TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  
  -- Academic
  degree TEXT NOT NULL,
  department TEXT NOT NULL,
  specialization TEXT,
  batch TEXT NOT NULL,
  graduation_year INT NOT NULL,
  current_semester INT NOT NULL DEFAULT 1,
  cgpa NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
  
  -- Career & Settings
  career_objective TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_profile_verified BOOLEAN NOT NULL DEFAULT FALSE,
  visibility visibility_level NOT NULL DEFAULT 'institution_only',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Tags junction table
CREATE TABLE IF NOT EXISTS public.student_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_profile_id, tag_id)
);

-- Student Skills
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'Intermediate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Education History
CREATE TABLE IF NOT EXISTS public.student_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_year INT NOT NULL,
  end_year INT NOT NULL,
  grade_or_cgpa TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Work Experience & Internships
CREATE TABLE IF NOT EXISTS public.student_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  technologies TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Projects
CREATE TABLE IF NOT EXISTS public.student_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  role TEXT,
  start_date DATE,
  end_date DATE,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Achievements
CREATE TABLE IF NOT EXISTS public.student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Academic',
  description TEXT NOT NULL,
  issue_date DATE NOT NULL,
  issuing_organization TEXT NOT NULL,
  certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Competitions
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  competition_name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  date DATE NOT NULL,
  result competition_result NOT NULL DEFAULT 'Participated',
  description TEXT NOT NULL,
  certificate_url TEXT,
  proof_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Certificates & Private Documents Vault
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Course',
  description TEXT,
  issuing_organization TEXT NOT NULL,
  issue_date DATE NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  visibility visibility_level NOT NULL DEFAULT 'private',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Institutional Opportunities (Internships & Jobs)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type opportunity_type NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  eligibility TEXT NOT NULL,
  department TEXT[] NOT NULL DEFAULT '{"All"}',
  location TEXT NOT NULL,
  work_mode TEXT NOT NULL DEFAULT 'On-site',
  stipend_or_salary TEXT,
  duration TEXT,
  start_date DATE,
  deadline DATE NOT NULL,
  application_url TEXT NOT NULL,
  contact_email TEXT,
  status opportunity_status NOT NULL DEFAULT 'active',
  posted_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Applications (Track applications via portal)
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  opportunity_id TEXT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_profile_id TEXT NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied',
  notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(opportunity_id, student_profile_id)
);

-- Institutional Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category notification_category NOT NULL DEFAULT 'General',
  priority notification_priority NOT NULL DEFAULT 'Normal',
  target_type TEXT NOT NULL DEFAULT 'all', -- 'all', 'department', 'batch', 'tag'
  target_value TEXT,
  publish_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMPTZ,
  external_link TEXT,
  attachment_name TEXT,
  attachment_path TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Activity Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Institution Global Settings
CREATE TABLE IF NOT EXISTS public.institution_settings (
  id INT PRIMARY KEY DEFAULT 1,
  institution_name TEXT NOT NULL DEFAULT 'Indian Institute of Management & Technology',
  tagline TEXT DEFAULT 'Your Academic, Career & Achievement Portal',
  allowed_email_domains TEXT[] NOT NULL DEFAULT '{"iimg.ac.in", "institution.edu"}',
  max_file_upload_mb INT NOT NULL DEFAULT 10,
  enable_public_profiles BOOLEAN NOT NULL DEFAULT FALSE,
  contact_email TEXT DEFAULT 'careers@iimg.ac.in',
  placement_cell_head TEXT DEFAULT 'Prof. R. Sengupta',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_student_profiles_email ON public.student_profiles(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_student_id ON public.student_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_name ON public.student_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_student_profiles_department ON public.student_profiles(department);
CREATE INDEX IF NOT EXISTS idx_student_profiles_grad_year ON public.student_profiles(graduation_year);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_notifications_publish_date ON public.notifications(publish_date);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles:
-- Users can view their own profile; Admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Student Profiles:
-- Students can select & update their own record; Admins can read/update all
CREATE POLICY "Students can view own profile or institution" ON public.student_profiles
  FOR SELECT USING (
    user_id = auth.uid() 
    OR public.is_admin() 
    OR (visibility = 'institution_only' AND auth.uid() IS NOT NULL)
    OR (visibility = 'public')
  );

CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- Certificates & Documents:
-- Students can ONLY view/edit/delete their own certificates.
-- Admins can view for verification.
CREATE POLICY "Students manage own certificates" ON public.certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles
      WHERE id = certificates.student_profile_id AND user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Opportunities:
-- Authenticated users can view active opportunities; Admins have full access
CREATE POLICY "Anyone can view active opportunities" ON public.opportunities
  FOR SELECT USING (status = 'active' OR public.is_admin());

CREATE POLICY "Admins manage opportunities" ON public.opportunities
  FOR ALL USING (public.is_admin());

-- Notifications:
-- Authenticated students can read published notifications; Admins have full access
CREATE POLICY "Students view published notifications" ON public.notifications
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- Admin Activity Logs:
-- ONLY Admins can view or insert audit logs
CREATE POLICY "Admins access activity logs" ON public.admin_activity_logs
  FOR ALL USING (public.is_admin());
