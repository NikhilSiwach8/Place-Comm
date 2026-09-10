export type UserRole = 'student' | 'admin' | 'faculty' | 'placement_cell' | 'coordinator';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  student_id: string; // Institutional ID, e.g. CS2024042
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  
  // Academic
  degree: string; // B.Tech, M.Tech, MBA, etc.
  department: string; // Computer Science, Information Technology, etc.
  specialization?: string;
  batch: string; // 2022-2026
  graduation_year: number;
  current_semester: number;
  cgpa: number; // e.g. 8.92
  
  // Career & Bio
  career_objective?: string;
  skills: string[];
  tags: string[]; // Placed, Technical, Top Performer, etc.
  is_active: boolean;
  is_profile_verified: boolean;
  visibility: 'public' | 'institution_only' | 'private';
  created_at: string;
  updated_at: string;
}

export interface EducationItem {
  id: string;
  student_id?: string;
  institution?: string;
  institution_name?: string;
  degree: string;
  field_of_study: string;
  start_year?: number;
  end_year?: number;
  start_date?: string;
  end_date?: string;
  grade_or_cgpa?: string;
  description?: string;
  highlights?: string[];
}

export interface ExperienceItem {
  id: string;
  student_id?: string;
  role?: string;
  title?: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  bullet_points?: string[];
  technologies?: string[];
}

export interface ProjectItem {
  id: string;
  student_id?: string;
  title: string;
  description: string;
  role?: string;
  start_date?: string;
  end_date?: string;
  technologies?: string[];
  tech_stack?: string[];
  github_url?: string;
  project_url?: string;
  live_url?: string;
  highlights?: string[];
}

export interface AchievementItem {
  id: string;
  student_id: string;
  title: string;
  category: 'Academic' | 'Hackathon' | 'Sports' | 'Leadership' | 'Research' | 'Cultural' | 'Other';
  description: string;
  issue_date: string;
  issuing_organization: string;
  certificate_url?: string;
  document_id?: string;
  created_at: string;
}

export type CompetitionResult = 'Participated' | 'Shortlisted' | 'Finalist' | 'Runner-up' | 'Winner';

export type CompetitionType = 'Hackathon' | 'Coding Contest' | 'Case Competition' | 'Research' | 'Cultural' | 'Other';

export interface CompetitionItem {
  id: string;
  student_id: string;
  competition_name: string;
  organizer: string;
  type?: CompetitionType | string;
  date: string;
  team_or_individual?: 'Team' | 'Individual';
  result: string;
  description: string;
  certificate_url?: string;
  document_id?: string;
  proof_link?: string;
  skills_demonstrated?: string[];
  created_at: string;
}

export type Competition = CompetitionItem;

export interface CaseCompetitionApplication {
  id: string;
  competition_id: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  student_email: string;
  student_batch: string;
  team_name: string;
  team_members: string; // e.g. "Nikhil Sharma (CS2024042), Priya Patel (CS2024018)"
  pitch_deck_url?: string;
  solution_summary?: string;
  status: 'submitted' | 'shortlisted' | 'winner' | 'under_review';
  applied_at: string;
}

export interface CaseCompetition {
  id: string;
  title: string;
  organizer: string; // e.g. "Bain & Company", "HUL", "McKinsey", "Tata Steel"
  theme: string; // e.g. "Strategy & Supply Chain", "FMCG Brand Management", "Private Equity"
  eligible_batches: string[]; // e.g. ["2026-2028"]
  eligible_departments?: string[];
  prize: string; // e.g. "₹10,00,000 + Summer PPI / PPO"
  deadline: string; // e.g. "2026-10-25"
  stage?: 'live' | 'upcoming' | 'closed'; // Live or Upcoming
  starts_at?: string; // e.g. "2026-09-22"
  guidelines: string;
  case_brief_url?: string;
  apply_url?: string; // Direct application link set by admin
  registration_link?: string; // Application / registration portal URL set by admin
  status: 'active' | 'closed' | 'results_announced' | 'upcoming';
  created_at: string;
  created_by_email?: string;
  is_featured?: boolean;
}

export type CertificateType =
  | 'academic'
  | 'professional_certification'
  | 'internship'
  | 'competition'
  | 'leadership'
  | 'course_completion'
  | 'other';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface CertificateDocument {
  id: string;
  student_id: string;
  title: string;
  type?: CertificateType;
  category?: string;
  description?: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  verification_url?: string;
  file_name?: string;
  file_size?: number; // in bytes
  file_type?: string; // 'pdf' | 'jpg' | 'png'
  file_data?: string; // base64 / blob / signed url
  file_url?: string;
  verification_status?: VerificationStatus;
  admin_notes?: string;
  tags?: string[];
  visibility?: 'private' | 'institution_only';
  upload_date?: string;
}

export type Certificate = CertificateDocument;

export type OpportunityType = 'internship' | 'job';
export type JobType = 'Full-time' | 'Part-time' | 'Contract';
export type WorkMode = 'On-site' | 'Remote' | 'Hybrid';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  job_type?: JobType;
  company: string;
  company_logo?: string;
  title: string;
  description: string;
  eligibility?: string;
  requirements?: string[];
  required_skills: string[];
  eligible_departments?: string[];
  department?: string[];
  eligible_batches?: string[];
  min_cgpa?: number;
  location: string;
  work_mode: WorkMode;
  stipend_or_salary?: string;
  duration?: string; // for internships
  start_date?: string;
  deadline: string;
  application_url: string;
  contact_email?: string;
  status: 'active' | 'closed' | 'draft';
  tags?: string[];
  posted_by?: string;
  created_at?: string;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected';

export interface StudentApplication {
  id: string;
  student_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
}

export type NotificationCategory = 'General' | 'Placement' | 'Academic' | 'Event' | 'Competition' | 'Verification';
export type NotificationPriority = 'Normal' | 'Important' | 'Urgent';

export interface InstitutionalNotification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory | string;
  priority: NotificationPriority | string;
  target_departments?: string[];
  target_batches?: string[];
  target_audience?: any;
  action_url?: string;
  external_link?: string;
  publish_date?: string;
  expiry_date?: string;
  status?: string;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id?: string;
  admin_name?: string;
  user_email?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  timestamp?: string;
  created_at?: string;
}

export interface InstitutionSettings {
  institution_name: string;
  tagline: string;
  allowed_email_domains: string[];
  max_file_upload_mb: number;
  enable_public_profiles: boolean;
  contact_email: string;
  placement_cell_head: string;
  admin_emails?: string[];
}
