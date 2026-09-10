import {
  StudentProfile,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  AchievementItem,
  CompetitionItem,
  CertificateDocument,
  Opportunity,
  InstitutionalNotification,
  AdminActivityLog,
  InstitutionSettings
} from '../types';

export const INITIAL_INSTITUTION_SETTINGS: InstitutionSettings = {
  institution_name: 'Indian Institute of Management Guwahati (IIMG)',
  tagline: 'Where Knowledge Flows, Leadership Rises',
  allowed_email_domains: ['iimg.ac.in', 'institution.edu'],
  max_file_upload_mb: 10,
  enable_public_profiles: false,
  contact_email: 'placement@iimg.ac.in',
  placement_cell_head: 'Office of Placement & Corporate Relations',
  admin_emails: ['p26nikhil@iimg.ac.in', 'admin@iimg.ac.in', 'admin@institution.edu'],
};

export const INITIAL_TAGS: string[] = [
  'Technical',
  'Leadership',
  'Cultural Head',
  'Placement Representative',
  'Club Coordinator',
  'Student Representative',
  'Sports',
  'Entrepreneurship',
  'Volunteer',
  'Research Scholar'
];

export const DEMO_STUDENTS: StudentProfile[] = [];

export const DEMO_EDUCATIONS: Record<string, EducationItem[]> = {};

export const DEMO_EXPERIENCES: Record<string, ExperienceItem[]> = {};

export const DEMO_PROJECTS: Record<string, ProjectItem[]> = {};

export const DEMO_ACHIEVEMENTS: Record<string, AchievementItem[]> = {};

export const DEMO_COMPETITIONS: Record<string, CompetitionItem[]> = {};

export const DEMO_CERTIFICATES: Record<string, CertificateDocument[]> = {};

export const DEMO_OPPORTUNITIES: Opportunity[] = [];

export const DEMO_NOTIFICATIONS: InstitutionalNotification[] = [];

export const DEMO_ACTIVITY_LOGS: AdminActivityLog[] = [];
