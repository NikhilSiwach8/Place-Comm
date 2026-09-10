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
  InstitutionSettings,
  StudentApplication,
  VerificationStatus,
  CaseCompetition,
  CaseCompetitionApplication,
} from '../types';
import {
  DEMO_STUDENTS,
  DEMO_EDUCATIONS,
  DEMO_EXPERIENCES,
  DEMO_PROJECTS,
  DEMO_ACHIEVEMENTS,
  DEMO_COMPETITIONS,
  DEMO_CERTIFICATES,
  DEMO_OPPORTUNITIES,
  DEMO_NOTIFICATIONS,
  DEMO_ACTIVITY_LOGS,
  INITIAL_INSTITUTION_SETTINGS,
  INITIAL_TAGS
} from './demoData';

const STORAGE_KEYS = {
  STUDENTS: 'studenthub_students',
  EDUCATIONS: 'studenthub_educations',
  EXPERIENCES: 'studenthub_experiences',
  PROJECTS: 'studenthub_projects',
  ACHIEVEMENTS: 'studenthub_achievements',
  COMPETITIONS: 'studenthub_competitions',
  CERTIFICATES: 'studenthub_certificates',
  OPPORTUNITIES: 'studenthub_opportunities',
  NOTIFICATIONS: 'studenthub_notifications',
  LOGS: 'studenthub_logs',
  SETTINGS: 'studenthub_settings',
  TAGS: 'studenthub_tags',
  READ_NOTIFS: 'studenthub_read_notifications',
  BOOKMARKS: 'studenthub_bookmarked_opps',
  APPLICATIONS: 'studenthub_applications',
  CASE_COMPETITIONS: 'studenthub_case_competitions',
  CASE_APPLICATIONS: 'studenthub_case_applications',
  CREDENTIALS: 'studenthub_credentials',
};

const INITIAL_CASE_COMPETITIONS: CaseCompetition[] = [
  {
    id: 'case-comp-hul-lime',
    title: 'HUL L.I.M.E. Season 16 (Lessons in Marketing Excellence)',
    organizer: 'Hindustan Unilever Limited (HUL)',
    theme: 'FMCG Brand Renaissance, Omnichannel Strategy & Consumer Tech',
    eligible_batches: ['2026-2028'],
    prize: '₹10,00,000 Cash Prize + Summer PPO / PPI Direct Shortlists',
    deadline: '2026-10-25',
    stage: 'live',
    guidelines: 'Premier inter-B-school marketing and corporate strategy challenge. Teams of 3. Submissions require a 3-slider executive deck addressing modern FMCG distribution bottlenecks.',
    case_brief_url: 'https://unstop.com/competitions/hul-lime-season-16-hindustan-unilever-limited-1135402',
    apply_url: 'https://unstop.com/competitions/hul-lime-season-16-hindustan-unilever-limited-1135402',
    registration_link: 'https://unstop.com/competitions/hul-lime-season-16-hindustan-unilever-limited-1135402',
    status: 'active',
    created_at: '2026-09-01T10:00:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
  {
    id: 'case-comp-bain-brainwars',
    title: 'Bain & Company BrAINWARS Consulting Challenge 2026',
    organizer: 'Bain & Company',
    theme: 'Private Equity Value Creation & Cross-Border M&A Advisory',
    eligible_batches: ['2026-2028'],
    prize: '₹5,00,000 + Fast-Track Associate Consultant PPIs',
    deadline: '2026-10-30',
    stage: 'live',
    guidelines: 'Solve an intensive turnaround scenario for an enterprise SaaS conglomerate facing post-merger integration risks. Teams of 2 to 3 members. National finalists present directly to Bain Senior Partners.',
    case_brief_url: 'https://unstop.com/competitions/bain-brainwars-consulting-challenge-2026-bain-company-1142100',
    apply_url: 'https://unstop.com/competitions/bain-brainwars-consulting-challenge-2026-bain-company-1142100',
    registration_link: 'https://unstop.com/competitions/bain-brainwars-consulting-challenge-2026-bain-company-1142100',
    status: 'active',
    created_at: '2026-09-02T11:30:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
  {
    id: 'case-comp-mckinsey-nextgen',
    title: 'McKinsey & Company NextGen Strategy Sprint 2026',
    organizer: 'McKinsey & Company',
    theme: 'Supply Chain Decarbonization & Clean Energy Transition',
    eligible_batches: ['2026-2028'],
    prize: 'Mentorship with McKinsey Global Practice Leaders + Direct Summer PPIs',
    deadline: '2026-11-08',
    stage: 'live',
    guidelines: 'Devise a high-impact carbon-neutral blueprint for heavy industrial manufacturing in India. Open to Batch 2026-2028 students. Individual or 2-member submissions.',
    case_brief_url: 'https://www.mckinsey.com/careers/students',
    apply_url: 'https://www.mckinsey.com/careers/students',
    registration_link: 'https://www.mckinsey.com/careers/students',
    status: 'active',
    created_at: '2026-09-03T14:00:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
  {
    id: 'case-comp-tata-steelathon',
    title: 'Tata Steel-a-thon Season 11',
    organizer: 'Tata Steel',
    theme: 'Value Chain Optimization, Digital Mining & People Strategy',
    eligible_batches: ['2026-2028'],
    prize: '₹3,50,000 + Pre-Placement Offers (PPOs) for Summer Interns',
    deadline: '2026-11-15',
    stage: 'live',
    guidelines: 'Corporate business challenge across 4 business tracks: Marketing & Sales, Supply Chain & Operations, Human Resources, and Finance. Teams of 2 to 4 members.',
    case_brief_url: 'https://unstop.com/competitions/tata-steel-a-thon-season-11-tata-steel-1148900',
    apply_url: 'https://unstop.com/competitions/tata-steel-a-thon-season-11-tata-steel-1148900',
    registration_link: 'https://unstop.com/competitions/tata-steel-a-thon-season-11-tata-steel-1148900',
    status: 'active',
    created_at: '2026-09-04T09:15:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
  {
    id: 'case-comp-loreal-brandstorm',
    title: "L'Oréal Brandstorm 2027 (Reinventing Beauty Tech)",
    organizer: "L'Oréal Group",
    theme: 'AI, Augmented Reality & Sustainable Luxury Beauty Ecosystems',
    eligible_batches: ['2026-2028'],
    prize: 'All-Expenses-Paid Global Finals in Paris + Station F Intrapreneurship + Direct PPIs',
    starts_at: '2026-09-22',
    deadline: '2026-12-10',
    stage: 'upcoming',
    guidelines: 'National & Global B-School Innovation Challenge. Problem statement drops Sep 22, 2026. Teams of 3 must build a consumer tech concept bridging AI personalization and circular packaging.',
    case_brief_url: 'https://brandstorm.loreal.com/en',
    apply_url: 'https://brandstorm.loreal.com/en',
    registration_link: 'https://brandstorm.loreal.com/en',
    status: 'upcoming',
    created_at: '2026-09-06T08:00:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
  {
    id: 'case-comp-amazon-ace',
    title: 'Amazon ACE Challenge 2026 (Customer Excellence)',
    organizer: 'Amazon',
    theme: 'Quick Commerce Logistics, Drone Automation & Micro-Fulfillment Hubs',
    eligible_batches: ['2026-2028'],
    prize: '₹4,00,000 Cash Prize + Summer PPIs for Operations & Product Management',
    starts_at: '2026-09-28',
    deadline: '2026-12-05',
    stage: 'upcoming',
    guidelines: 'Teams of 3 to 4. Case problem releases on September 28. Campus shortlist round followed by national presentation to Amazon VP and Director council.',
    case_brief_url: 'https://www.amazon.jobs/en/landing_pages/ace-challenge',
    apply_url: 'https://www.amazon.jobs/en/landing_pages/ace-challenge',
    registration_link: 'https://www.amazon.jobs/en/landing_pages/ace-challenge',
    status: 'upcoming',
    created_at: '2026-09-06T10:30:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
  {
    id: 'case-comp-itc-interrobang',
    title: 'ITC Interrobang Season 14 (Campus Engagement)',
    organizer: 'ITC Limited',
    theme: 'Agri-Business Sustainability, D2C Scale & FMCG Value Chains',
    eligible_batches: ['2026-2028'],
    prize: '₹3,00,000 + Fast-Track PPIs for Summer Internship Programme (SIP)',
    starts_at: '2026-10-05',
    deadline: '2026-12-15',
    stage: 'upcoming',
    guidelines: 'Corporate business case challenge featuring 3 specialized functional streams: Marketing, Supply Chain, and Human Resources. Opens early October for Batch 2026-2028.',
    case_brief_url: 'https://www.itcportal.com/careers/campus-engagement.aspx',
    apply_url: 'https://www.itcportal.com/careers/campus-engagement.aspx',
    registration_link: 'https://www.itcportal.com/careers/campus-engagement.aspx',
    status: 'upcoming',
    created_at: '2026-09-07T08:00:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
  {
    id: 'case-comp-bcg-strategy-cup',
    title: 'BCG Strategy Cup 2026 (Fintech & AI)',
    organizer: 'Boston Consulting Group (BCG)',
    theme: 'Generative AI Architecture & Digital Banking Transformation',
    eligible_batches: ['2026-2028'],
    prize: 'Fast-Track Summer Associate PPIs + Exclusive 1-on-1 Partner Mentorship',
    starts_at: '2026-10-12',
    deadline: '2026-12-20',
    stage: 'upcoming',
    guidelines: 'Tackle a live enterprise transformation scenario for a leading pan-Asian financial institution. Open exclusively to select tier-1 B-Schools.',
    case_brief_url: 'https://www.bcg.com/careers/students',
    apply_url: 'https://www.bcg.com/careers/students',
    registration_link: 'https://www.bcg.com/careers/students',
    status: 'upcoming',
    created_at: '2026-09-07T09:00:00.000Z',
    created_by_email: 'placement@iimg.ac.in',
  },
];

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`Error loading key ${key} from storage:`, err);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving key ${key} to storage:`, err);
  }
}

class StoreService {
  private students: StudentProfile[];
  private educations: Record<string, EducationItem[]>;
  private experiences: Record<string, ExperienceItem[]>;
  private projects: Record<string, ProjectItem[]>;
  private achievements: Record<string, AchievementItem[]>;
  private competitions: Record<string, CompetitionItem[]>;
  private certificates: Record<string, CertificateDocument[]>;
  private opportunities: Opportunity[];
  private notifications: InstitutionalNotification[];
  private activityLogs: AdminActivityLog[];
  private settings: InstitutionSettings;
  private tags: string[];
  private readNotificationIds: string[];
  private bookmarkedOpportunityIds: string[];
  private applications: Record<string, StudentApplication[]>;
  private caseCompetitions: CaseCompetition[];
  private caseApplications: CaseCompetitionApplication[];

  constructor() {
    // Purge legacy demo data from prior sessions to ensure clean state
    const DEMO_PURGE_FLAG = 'studenthub_demo_purged_v2';
    if (typeof window !== 'undefined' && !localStorage.getItem(DEMO_PURGE_FLAG)) {
      Object.values(STORAGE_KEYS).forEach(k => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });
      try {
        localStorage.removeItem('studenthub_auth_user');
        localStorage.setItem(DEMO_PURGE_FLAG, 'true');
      } catch {}
    }

    this.students = getFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENTS, []).map(s => ({
      ...s,
      batch: '2026-2028',
      graduation_year: 2028,
    }));
    this.educations = getFromStorage<Record<string, EducationItem[]>>(STORAGE_KEYS.EDUCATIONS, {});
    this.experiences = getFromStorage<Record<string, ExperienceItem[]>>(STORAGE_KEYS.EXPERIENCES, {});
    this.projects = getFromStorage<Record<string, ProjectItem[]>>(STORAGE_KEYS.PROJECTS, {});
    this.achievements = getFromStorage<Record<string, AchievementItem[]>>(STORAGE_KEYS.ACHIEVEMENTS, {});
    this.competitions = getFromStorage<Record<string, CompetitionItem[]>>(STORAGE_KEYS.COMPETITIONS, {});
    this.certificates = getFromStorage<Record<string, CertificateDocument[]>>(STORAGE_KEYS.CERTIFICATES, {});
    this.opportunities = getFromStorage<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, []);
    this.notifications = getFromStorage<InstitutionalNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    this.activityLogs = getFromStorage<AdminActivityLog[]>(STORAGE_KEYS.LOGS, []);
    const loadedSettings = getFromStorage<InstitutionSettings>(STORAGE_KEYS.SETTINGS, INITIAL_INSTITUTION_SETTINGS);
    this.settings = {
      ...INITIAL_INSTITUTION_SETTINGS,
      ...loadedSettings,
      allowed_email_domains:
        Array.isArray(loadedSettings?.allowed_email_domains) && loadedSettings.allowed_email_domains.length > 0
          ? loadedSettings.allowed_email_domains
          : INITIAL_INSTITUTION_SETTINGS.allowed_email_domains || ['iimg.ac.in', 'institution.edu'],
    };
    this.tags = getFromStorage<string[]>(STORAGE_KEYS.TAGS, INITIAL_TAGS);
    this.readNotificationIds = getFromStorage<string[]>(STORAGE_KEYS.READ_NOTIFS, []);
    this.bookmarkedOpportunityIds = getFromStorage<string[]>(STORAGE_KEYS.BOOKMARKS, []);
    this.applications = getFromStorage<Record<string, StudentApplication[]>>(STORAGE_KEYS.APPLICATIONS, {});
    this.caseCompetitions = getFromStorage<CaseCompetition[]>(STORAGE_KEYS.CASE_COMPETITIONS, INITIAL_CASE_COMPETITIONS);
    if (!this.caseCompetitions || this.caseCompetitions.length === 0) {
      this.caseCompetitions = [...INITIAL_CASE_COMPETITIONS];
      saveToStorage(STORAGE_KEYS.CASE_COMPETITIONS, this.caseCompetitions);
    } else {
      // Auto-merge new live and upcoming competitions from master catalog
      const existingIds = new Set(this.caseCompetitions.map(c => c.id));
      let hasChanges = false;
      INITIAL_CASE_COMPETITIONS.forEach(initComp => {
        if (!existingIds.has(initComp.id)) {
          this.caseCompetitions.push(initComp);
          hasChanges = true;
        } else {
          // If existing item lacks stage/starts_at, sync them
          const existing = this.caseCompetitions.find(c => c.id === initComp.id);
          if (existing && !existing.stage && initComp.stage) {
            existing.stage = initComp.stage;
            existing.starts_at = initComp.starts_at;
            hasChanges = true;
          }
          if (existing && initComp.apply_url && (!existing.apply_url || existing.registration_link === 'https://unstop.com' || existing.registration_link === 'https://bain.com')) {
            existing.apply_url = initComp.apply_url;
            existing.registration_link = initComp.apply_url;
            hasChanges = true;
          }
        }
      });
      if (hasChanges) {
        saveToStorage(STORAGE_KEYS.CASE_COMPETITIONS, this.caseCompetitions);
      }
    }
    this.caseApplications = getFromStorage<CaseCompetitionApplication[]>(STORAGE_KEYS.CASE_APPLICATIONS, []);

    // Asynchronously synchronize with Supabase PostgreSQL if configured
    this.syncFromSupabase();
  }

  // --- Clear All Stored Data ---
  public clearAllData(): void {
    this.students = [];
    this.educations = {};
    this.experiences = {};
    this.projects = {};
    this.achievements = {};
    this.competitions = {};
    this.certificates = {};
    this.opportunities = [];
    this.notifications = [];
    this.activityLogs = [];
    this.settings = INITIAL_INSTITUTION_SETTINGS;
    this.tags = INITIAL_TAGS;
    this.readNotificationIds = [];
    this.bookmarkedOpportunityIds = [];
    this.applications = {};

    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  }

  /**
   * Sync with Supabase PostgreSQL tables if available
   */
  public async syncFromSupabase(): Promise<void> {
    try {
      const { SupabaseDataService } = await import('./supabaseData');
      const remoteStudents = await SupabaseDataService.fetchStudents();
      if (remoteStudents && remoteStudents.length > 0) {
        // Merge without losing local demo credentials
        const existingIds = new Set(this.students.map(s => s.id));
        remoteStudents.forEach(remote => {
          if (!existingIds.has(remote.id)) {
            this.students.push(remote);
          }
        });
        saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
      }

      const remoteOpps = await SupabaseDataService.fetchOpportunities();
      if (remoteOpps && remoteOpps.length > 0) {
        const existingIds = new Set(this.opportunities.map(o => o.id));
        remoteOpps.forEach(remote => {
          if (!existingIds.has(remote.id)) {
            this.opportunities.push(this.normalizeOpportunity(remote));
          }
        });
        saveToStorage(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
      }
    } catch {
      // Supabase is optional; gracefully proceed
    }
  }

  // --- Students ---
  public getAllStudents(): StudentProfile[] {
    // Ensure Nikhil is present if looking up students
    this.getStudentByEmail('p26nikhil@iimg.ac.in');
    return [...this.students];
  }

  public getStudentById(id: string): StudentProfile | undefined {
    let student = this.students.find(s => s.id === id);
    if (!student && (id === 'student-nikhil-p' || id === 'user-admin-nikhil')) {
      student = this.initNikhilStudentProfile();
    }
    return student;
  }

  public getStudentByEmail(email: string): StudentProfile | undefined {
    if (!email) return undefined;
    const clean = email.toLowerCase().trim();
    let student = this.students.find(s => s.email.toLowerCase() === clean);
    if (!student && clean === 'p26nikhil@iimg.ac.in') {
      student = this.initNikhilStudentProfile();
    }
    return student;
  }

  public getStudentByUserId(userId: string): StudentProfile | undefined {
    let student = this.students.find(s => s.user_id === userId);
    if (!student && (userId === 'user-admin-nikhil' || userId === 'user-p26nikhil')) {
      student = this.initNikhilStudentProfile();
    }
    return student;
  }

  public initNikhilStudentProfile(): StudentProfile {
    const existing = this.students.find(s => s.email.toLowerCase() === 'p26nikhil@iimg.ac.in');
    if (existing) {
      existing.batch = '2026-2028';
      existing.graduation_year = 2028;
      saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
      return existing;
    }

    const nikhil: StudentProfile = {
      id: 'student-nikhil-p',
      user_id: 'user-admin-nikhil',
      student_id: 'P26NIKHIL',
      full_name: 'Nikhil P.',
      email: 'p26nikhil@iimg.ac.in',
      phone: '+91 98765 43210',
      location: 'IIM Campus',
      degree: 'B.Tech',
      department: 'Computer Science & Engineering',
      specialization: 'Cloud Systems & Artificial Intelligence',
      batch: '2026-2028',
      graduation_year: 2028,
      current_semester: 4,
      cgpa: 9.4,
      career_objective: 'Dual Administrator & Systems Architect specializing in campus placement digital workflows and cloud engineering.',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'Tailwind CSS', 'System Architecture'],
      tags: ['Technical', 'Top Performer', 'Placement Representative', 'Student Coordinator'],
      is_active: true,
      is_profile_verified: true,
      visibility: 'institution_only',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.students.unshift(nikhil);
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);

    if (!this.educations[nikhil.id] || this.educations[nikhil.id].length === 0) {
      this.educations[nikhil.id] = [{
        id: 'edu-nikhil-1',
        student_id: nikhil.id,
        institution_name: 'Indian Institute of Management Guwahati (IIMG)',
        degree: 'MBA',
        field_of_study: 'Management Studies',
        start_year: 2026,
        end_year: 2028,
        grade_or_cgpa: '9.4 CGPA',
      }];
      saveToStorage(STORAGE_KEYS.EDUCATIONS, this.educations);
    }

    if (!this.experiences[nikhil.id] || this.experiences[nikhil.id].length === 0) {
      this.experiences[nikhil.id] = [{
        id: 'exp-nikhil-1',
        student_id: nikhil.id,
        title: 'Lead Placement Coordinator & Systems Administrator',
        role: 'Lead Placement Coordinator & Systems Administrator',
        company: 'IIMG Corporate Relations & Placement Cell',
        location: 'Campus',
        start_date: '2024-05',
        is_current: true,
        description: 'Managing automated digital credentialing, company drives, and administrative portal analytics.',
      }];
      saveToStorage(STORAGE_KEYS.EXPERIENCES, this.experiences);
    }

    if (!this.projects[nikhil.id] || this.projects[nikhil.id].length === 0) {
      this.projects[nikhil.id] = [{
        id: 'proj-nikhil-1',
        student_id: nikhil.id,
        title: 'Unified Institutional Placement & Credentials Vault',
        description: 'High-performance student career portfolio and recruiter management platform with cloud data storage & role authorization.',
        tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      }];
      saveToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    }

    return nikhil;
  }

  public createStudentProfile(data: Partial<StudentProfile> & { email: string; full_name: string }): StudentProfile {
    const studentId = `std-${Date.now()}`;
    const newStudent: StudentProfile = {
      id: studentId,
      user_id: data.user_id || `usr-${Date.now()}`,
      student_id: data.student_id || `STU${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: data.full_name,
      email: data.email,
      degree: data.degree || 'B.Tech Computer Science & Engineering',
      department: data.department || 'Computer Science & Engineering',
      batch: data.batch || '2026-2028',
      graduation_year: data.graduation_year || 2028,
      current_semester: data.current_semester || 6,
      cgpa: data.cgpa ?? 8.5,
      skills: data.skills || ['Python', 'TypeScript', 'React'],
      tags: data.tags || ['Student'],
      is_active: true,
      is_profile_verified: false,
      visibility: 'institution_only',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.students.unshift(newStudent);
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
    return newStudent;
  }

  public calculateProfileCompletion(studentId: string): { percentage: number; missingFields: string[] } {
    const student = this.getStudentById(studentId);
    if (!student) return { percentage: 0, missingFields: ['Profile Details'] };

    const missing: string[] = [];
    let score = 0;

    if (student.full_name) score += 10;
    else missing.push('Full Name');

    if (student.phone) score += 10;
    else missing.push('Phone Number');

    if (student.career_objective) score += 15;
    else missing.push('Career Objective');

    if (student.skills && student.skills.length > 0) score += 15;
    else missing.push('Skills & Competencies');

    if (student.linkedin_url || student.github_url) score += 15;
    else missing.push('LinkedIn or GitHub Profile');

    const certs = this.getCertificates(studentId);
    if (certs.length > 0) score += 15;
    else missing.push('At least one Certificate');

    const exps = this.getExperiences(studentId);
    const projs = this.getProjects(studentId);
    if (exps.length > 0 || projs.length > 0) score += 20;
    else missing.push('Academic Project or Internship');

    return {
      percentage: Math.min(100, score),
      missingFields: missing,
    };
  }

  public updateStudentProfile(studentId: string, updates: Partial<StudentProfile>): StudentProfile {
    const idx = this.students.findIndex(s => s.id === studentId);
    if (idx === -1) throw new Error('Student not found');
    const updated = { ...this.students[idx], ...updates, updated_at: new Date().toISOString() };
    this.students[idx] = updated;
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);

    // Asynchronously sync to Supabase if connected
    import('./supabaseData').then(({ SupabaseDataService }) => {
      SupabaseDataService.upsertStudentProfile(updated).catch(() => {});
    }).catch(() => {});

    return updated;
  }

  public verifyStudentProfile(studentId: string, isVerified: boolean): void {
    this.updateStudentProfile(studentId, { is_profile_verified: isVerified });
    this.logAdminAction('Dean Placement', isVerified ? 'Verified Profile' : 'Revoked Profile Verification', 'student', `Student ID: ${studentId}`, studentId);
  }

  // --- Educations ---
  public getEducations(studentId: string): EducationItem[] {
    return this.educations[studentId] || [];
  }

  public addEducation(studentId: string, item: Omit<EducationItem, 'id' | 'student_id'>): EducationItem {
    const newItem: EducationItem = {
      ...item,
      id: `edu-${Date.now()}`,
      student_id: studentId,
    };
    if (!this.educations[studentId]) this.educations[studentId] = [];
    this.educations[studentId].push(newItem);
    saveToStorage(STORAGE_KEYS.EDUCATIONS, this.educations);
    return newItem;
  }

  public updateEducation(studentId: string, id: string, updates: Partial<EducationItem>): EducationItem {
    if (!this.educations[studentId]) throw new Error('Education not found');
    const idx = this.educations[studentId].findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Education item not found');
    const updated = { ...this.educations[studentId][idx], ...updates };
    this.educations[studentId][idx] = updated;
    saveToStorage(STORAGE_KEYS.EDUCATIONS, this.educations);
    return updated;
  }

  public deleteEducation(studentId: string, id: string): void {
    if (this.educations[studentId]) {
      this.educations[studentId] = this.educations[studentId].filter(e => e.id !== id);
      saveToStorage(STORAGE_KEYS.EDUCATIONS, this.educations);
    }
  }

  // --- Experiences ---
  public getExperiences(studentId: string): ExperienceItem[] {
    return this.experiences[studentId] || [];
  }

  public addExperience(studentId: string, item: Omit<ExperienceItem, 'id' | 'student_id'>): ExperienceItem {
    const newItem: ExperienceItem = {
      ...item,
      id: `exp-${Date.now()}`,
      student_id: studentId,
    };
    if (!this.experiences[studentId]) this.experiences[studentId] = [];
    this.experiences[studentId].push(newItem);
    saveToStorage(STORAGE_KEYS.EXPERIENCES, this.experiences);
    return newItem;
  }

  public deleteExperience(studentId: string, id: string): void {
    if (this.experiences[studentId]) {
      this.experiences[studentId] = this.experiences[studentId].filter(e => e.id !== id);
      saveToStorage(STORAGE_KEYS.EXPERIENCES, this.experiences);
    }
  }

  // --- Projects ---
  public getProjects(studentId: string): ProjectItem[] {
    return this.projects[studentId] || [];
  }

  public addProject(studentId: string, item: Omit<ProjectItem, 'id' | 'student_id'>): ProjectItem {
    const newItem: ProjectItem = {
      ...item,
      id: `proj-${Date.now()}`,
      student_id: studentId,
    };
    if (!this.projects[studentId]) this.projects[studentId] = [];
    this.projects[studentId].push(newItem);
    saveToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    return newItem;
  }

  public deleteProject(studentId: string, id: string): void {
    if (this.projects[studentId]) {
      this.projects[studentId] = this.projects[studentId].filter(p => p.id !== id);
      saveToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    }
  }

  // --- Achievements ---
  public getAchievements(studentId: string): AchievementItem[] {
    return this.achievements[studentId] || [];
  }

  public addAchievement(studentId: string, item: Omit<AchievementItem, 'id' | 'student_id' | 'created_at'>): AchievementItem {
    const newItem: AchievementItem = {
      ...item,
      id: `ach-${Date.now()}`,
      student_id: studentId,
      created_at: new Date().toISOString(),
    };
    if (!this.achievements[studentId]) this.achievements[studentId] = [];
    this.achievements[studentId].unshift(newItem);
    saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, this.achievements);
    return newItem;
  }

  public deleteAchievement(studentId: string, id: string): void {
    if (this.achievements[studentId]) {
      this.achievements[studentId] = this.achievements[studentId].filter(a => a.id !== id);
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, this.achievements);
    }
  }

  // --- Competitions ---
  public getCompetitions(studentId: string): CompetitionItem[] {
    return this.competitions[studentId] || [];
  }

  public addCompetition(
    arg1: string | (Omit<CompetitionItem, 'id' | 'created_at'> & { student_id?: string }),
    arg2?: Omit<CompetitionItem, 'id' | 'student_id' | 'created_at'>
  ): CompetitionItem {
    let studentId: string;
    let itemData: any;

    if (typeof arg1 === 'string') {
      studentId = arg1;
      itemData = arg2 || {};
    } else {
      studentId = arg1.student_id || 'std-01';
      itemData = arg1;
    }

    const newItem: CompetitionItem = {
      ...itemData,
      id: `comp-${Date.now()}`,
      student_id: studentId,
      created_at: new Date().toISOString(),
    };
    if (!this.competitions[studentId]) this.competitions[studentId] = [];
    this.competitions[studentId].unshift(newItem);
    saveToStorage(STORAGE_KEYS.COMPETITIONS, this.competitions);
    return newItem;
  }

  public deleteCompetition(arg1: string, arg2?: string): void {
    const id = arg2 ? arg2 : arg1;
    const studentId = arg2 ? arg1 : undefined;

    if (studentId && this.competitions[studentId]) {
      this.competitions[studentId] = this.competitions[studentId].filter(c => c.id !== id);
    } else {
      Object.keys(this.competitions).forEach(sId => {
        this.competitions[sId] = this.competitions[sId].filter(c => c.id !== id);
      });
    }
    saveToStorage(STORAGE_KEYS.COMPETITIONS, this.competitions);
  }

  // --- Certificates & Documents ---
  public getCertificates(studentId: string): CertificateDocument[] {
    return this.certificates[studentId] || [];
  }

  public addCertificate(
    arg1: string | (Omit<CertificateDocument, 'id' | 'upload_date'> & { student_id?: string }),
    arg2?: Omit<CertificateDocument, 'id' | 'student_id' | 'upload_date'>
  ): CertificateDocument {
    let studentId: string;
    let certData: any;

    if (typeof arg1 === 'string') {
      studentId = arg1;
      certData = arg2 || {};
    } else {
      studentId = arg1.student_id || 'std-01';
      certData = arg1;
    }

    const newCert: CertificateDocument = {
      ...certData,
      id: `cert-${Date.now()}`,
      student_id: studentId,
      verification_status: certData.verification_status || 'pending',
      upload_date: new Date().toISOString(),
    };
    if (!this.certificates[studentId]) this.certificates[studentId] = [];
    this.certificates[studentId].unshift(newCert);
    saveToStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
    return newCert;
  }

  public deleteCertificate(arg1: string, arg2?: string): void {
    const certId = arg2 ? arg2 : arg1;
    const studentId = arg2 ? arg1 : undefined;

    if (studentId && this.certificates[studentId]) {
      this.certificates[studentId] = this.certificates[studentId].filter(c => c.id !== certId);
    } else {
      Object.keys(this.certificates).forEach(sId => {
        this.certificates[sId] = this.certificates[sId].filter(c => c.id !== certId);
      });
    }
    saveToStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
  }

  public verifyCertificate(studentId: string, certId: string, status: VerificationStatus, notes?: string): void {
    if (this.certificates[studentId]) {
      const c = this.certificates[studentId].find(item => item.id === certId);
      if (c) {
        c.verification_status = status;
        if (notes) c.admin_notes = notes;
        saveToStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
        this.logAdminAction('Placement Officer', `Verified Certificate: ${status}`, 'document', `Cert: ${c.title}`, certId);
      }
    }
  }

  public getAllPendingDocuments(): Array<CertificateDocument & {
    student_name: string;
    student_roll: string;
    student_dept: string;
    student_batch: string;
    student_email: string;
  }> {
    const list: Array<CertificateDocument & {
      student_name: string;
      student_roll: string;
      student_dept: string;
      student_batch: string;
      student_email: string;
    }> = [];

    const students = this.getAllStudents();
    students.forEach(student => {
      const certs = this.getCertificates(student.id);
      certs.forEach(cert => {
        if (cert.verification_status === 'pending') {
          list.push({
            ...cert,
            student_name: student.full_name,
            student_roll: student.student_id,
            student_dept: student.department,
            student_batch: student.batch || '2026-2028',
            student_email: student.email,
          });
        }
      });
    });

    return list.sort((a, b) => new Date(b.upload_date || '').getTime() - new Date(a.upload_date || '').getTime());
  }

  public getAllDocuments(): Array<CertificateDocument & {
    student_name: string;
    student_roll: string;
    student_dept: string;
    student_batch: string;
    student_email: string;
  }> {
    const list: Array<CertificateDocument & {
      student_name: string;
      student_roll: string;
      student_dept: string;
      student_batch: string;
      student_email: string;
    }> = [];

    const students = this.getAllStudents();
    students.forEach(student => {
      const certs = this.getCertificates(student.id);
      certs.forEach(cert => {
        list.push({
          ...cert,
          student_name: student.full_name,
          student_roll: student.student_id,
          student_dept: student.department,
          student_batch: student.batch || '2026-2028',
          student_email: student.email,
        });
      });
    });

    return list.sort((a, b) => new Date(b.upload_date || '').getTime() - new Date(a.upload_date || '').getTime());
  }

  // --- Opportunities (Internships & Jobs) ---
  private normalizeOpportunity(opp: Opportunity): Opportunity {
    return {
      ...opp,
      required_skills: Array.isArray(opp.required_skills) ? opp.required_skills : [],
      eligible_batches: Array.isArray(opp.eligible_batches) && opp.eligible_batches.length > 0 ? opp.eligible_batches : ['2026', '2027'],
      eligible_departments: Array.isArray(opp.eligible_departments) && opp.eligible_departments.length > 0
        ? opp.eligible_departments
        : (Array.isArray(opp.department) && opp.department.length > 0 ? opp.department : ['All']),
      min_cgpa: opp.min_cgpa ?? 7.0,
    };
  }

  public getOpportunities(type?: 'internship' | 'job'): Opportunity[] {
    const all = this.opportunities.map(o => this.normalizeOpportunity(o));
    if (type) {
      return all.filter(o => o.type === type);
    }
    return all;
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    const opp = this.opportunities.find(o => o.id === id);
    return opp ? this.normalizeOpportunity(opp) : undefined;
  }

  public addOpportunity(opp: Omit<Opportunity, 'id' | 'created_at'>): Opportunity {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.opportunities.unshift(newOpp);
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.logAdminAction('Placement Head', 'Posted Opportunity', 'opportunity', `${newOpp.type}: ${newOpp.title} at ${newOpp.company}`, newOpp.id);

    // Sync to Supabase if connected
    import('./supabaseData').then(({ SupabaseDataService }) => {
      SupabaseDataService.upsertOpportunity(newOpp).catch(() => {});
    }).catch(() => {});

    return newOpp;
  }

  public deleteOpportunity(id: string): void {
    this.opportunities = this.opportunities.filter(o => o.id !== id);
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
  }

  // Bookmarks
  public getBookmarkedOpportunities(studentId?: string): string[] {
    return [...this.bookmarkedOpportunityIds];
  }

  public toggleBookmark(studentIdOrOppId: string, oppId?: string): boolean {
    const targetId = oppId ? oppId : studentIdOrOppId;
    if (this.bookmarkedOpportunityIds.includes(targetId)) {
      this.bookmarkedOpportunityIds = this.bookmarkedOpportunityIds.filter(b => b !== targetId);
    } else {
      this.bookmarkedOpportunityIds.push(targetId);
    }
    saveToStorage(STORAGE_KEYS.BOOKMARKS, this.bookmarkedOpportunityIds);
    return this.bookmarkedOpportunityIds.includes(targetId);
  }

  // Applications
  public getApplications(studentId: string): StudentApplication[] {
    return this.applications[studentId] || [];
  }

  public saveApplication(app: Omit<StudentApplication, 'id'>): StudentApplication {
    const newApp: StudentApplication = {
      ...app,
      id: `app-${Date.now()}`,
    };
    if (!this.applications[app.student_id]) this.applications[app.student_id] = [];
    const existingIdx = this.applications[app.student_id].findIndex(
      a => a.opportunity_id === app.opportunity_id
    );
    if (existingIdx !== -1) {
      this.applications[app.student_id][existingIdx] = newApp;
    } else {
      this.applications[app.student_id].unshift(newApp);
    }
    saveToStorage(STORAGE_KEYS.APPLICATIONS, this.applications);
    return newApp;
  }

  // --- Notifications ---
  private normalizeNotification(notif: InstitutionalNotification): InstitutionalNotification {
    return {
      ...notif,
      target_departments: Array.isArray(notif.target_departments) && notif.target_departments.length > 0
        ? notif.target_departments
        : (notif.target_audience?.type === 'department' && notif.target_audience.value ? [notif.target_audience.value] : ['All Departments']),
    };
  }

  public getNotifications(): InstitutionalNotification[] {
    return this.notifications.map(n => this.normalizeNotification(n));
  }

  public addNotification(notif: Omit<InstitutionalNotification, 'id' | 'created_at'>): InstitutionalNotification {
    const newNotif: InstitutionalNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.logAdminAction('Placement Admin', 'Broadcast Circular', 'notification', newNotif.title, newNotif.id);
    return newNotif;
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  public getReadNotifications(): string[] {
    return [...this.readNotificationIds];
  }

  public markNotificationAsRead(id: string): void {
    if (!this.readNotificationIds.includes(id)) {
      this.readNotificationIds.push(id);
      saveToStorage(STORAGE_KEYS.READ_NOTIFS, this.readNotificationIds);
    }
  }

  public markAllNotificationsAsRead(): void {
    this.readNotificationIds = this.notifications.map(n => n.id);
    saveToStorage(STORAGE_KEYS.READ_NOTIFS, this.readNotificationIds);
  }

  // --- Tags ---
  public getTags(): string[] {
    return [...this.tags];
  }

  // --- Activity Logs ---
  public getLogs(): AdminActivityLog[] {
    return this.activityLogs.map(l => ({
      id: l.id,
      user_email: (l as any).user_email || (l as any).admin_name || 'admin@university.edu',
      action: l.action,
      entity_type: l.entity_type,
      details: l.details,
      created_at: (l as any).created_at || (l as any).timestamp || new Date().toISOString(),
    }));
  }

  public logAdminAction(adminName: string, action: string, entityType: string, details: string, entityId?: string): void {
    const log: AdminActivityLog = {
      id: `log-${Date.now()}`,
      admin_id: 'admin-current',
      admin_name: adminName,
      action,
      entity_type: entityType as any,
      entity_id: entityId,
      details,
      timestamp: new Date().toISOString()
    };
    this.activityLogs.unshift(log);
    if (this.activityLogs.length > 100) {
      this.activityLogs = this.activityLogs.slice(0, 100);
    }
    saveToStorage(STORAGE_KEYS.LOGS, this.activityLogs);
  }

  // --- Settings & Allowed Domains ---
  public getAllowedEmailDomains(): string[] {
    return this.settings.allowed_email_domains || ['iimg.ac.in', 'institution.edu'];
  }

  public setAllowedEmailDomains(domains: string[]): void {
    this.settings.allowed_email_domains = domains;
    saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
  }

  public getAdminEmails(): string[] {
    const list = this.settings.admin_emails || INITIAL_INSTITUTION_SETTINGS.admin_emails || ['p26nikhil@iimg.ac.in', 'admin@iimg.ac.in', 'admin@institution.edu'];
    if (!list.includes('p26nikhil@iimg.ac.in')) {
      return ['p26nikhil@iimg.ac.in', ...list];
    }
    return list;
  }

  public setAdminEmails(emails: string[]): void {
    const clean = Array.from(new Set(emails.map(e => e.trim().toLowerCase()).filter(Boolean)));
    if (!clean.includes('p26nikhil@iimg.ac.in')) {
      clean.unshift('p26nikhil@iimg.ac.in');
    }
    this.settings.admin_emails = clean;
    saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
  }

  public isAdminEmail(email: string): boolean {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    const adminList = this.getAdminEmails().map(e => e.toLowerCase());
    return (
      adminList.includes(clean) ||
      clean === 'p26nikhil@iimg.ac.in' ||
      clean.startsWith('admin@') ||
      clean.includes('admin')
    );
  }

  public hasDualRole(email?: string): boolean {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return clean === 'p26nikhil@iimg.ac.in' || (this.isAdminEmail(clean) && clean.includes('p26'));
  }

  public getSettings(): InstitutionSettings {
    return {
      ...INITIAL_INSTITUTION_SETTINGS,
      ...this.settings,
      allowed_email_domains:
        Array.isArray(this.settings?.allowed_email_domains) && this.settings.allowed_email_domains.length > 0
          ? this.settings.allowed_email_domains
          : INITIAL_INSTITUTION_SETTINGS.allowed_email_domains || ['iimg.ac.in', 'institution.edu'],
    };
  }

  public updateSettings(updates: Partial<InstitutionSettings>): InstitutionSettings {
    this.settings = { ...this.settings, ...updates };
    saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    return { ...this.settings };
  }

  // --- Case Competitions (Pushed by Admin & Applied by Students) ---
  private caseCompetitionListeners: (() => void)[] = [];

  public subscribeCaseCompetitions(listener: () => void): () => void {
    this.caseCompetitionListeners.push(listener);
    return () => {
      this.caseCompetitionListeners = this.caseCompetitionListeners.filter(l => l !== listener);
    };
  }

  private notifyCaseCompetitionListeners(): void {
    this.caseCompetitionListeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error notifying case competition listener:', err);
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('case_competitions_updated'));
    }
  }

  public syncLiveAndUpcomingCaseCompetitions(): { added: number; total: number } {
    const existingIds = new Set(this.caseCompetitions.map(c => c.id));
    let addedCount = 0;

    INITIAL_CASE_COMPETITIONS.forEach(comp => {
      if (!existingIds.has(comp.id)) {
        this.caseCompetitions.push(comp);
        addedCount++;
      } else {
        const existing = this.caseCompetitions.find(c => c.id === comp.id);
        if (existing) {
          if (!existing.stage && comp.stage) existing.stage = comp.stage;
          if (!existing.starts_at && comp.starts_at) existing.starts_at = comp.starts_at;
          if (!existing.apply_url && comp.apply_url) existing.apply_url = comp.apply_url;
          if (comp.apply_url && (!existing.registration_link || existing.registration_link === 'https://unstop.com' || existing.registration_link === 'https://bain.com')) {
            existing.registration_link = comp.apply_url;
            existing.apply_url = comp.apply_url;
            addedCount++;
          }
        }
      }
    });

    if (addedCount > 0) {
      saveToStorage(STORAGE_KEYS.CASE_COMPETITIONS, this.caseCompetitions);
      this.notifyCaseCompetitionListeners();
    }
    return { added: addedCount, total: this.caseCompetitions.length };
  }

  public getCaseCompetitions(): CaseCompetition[] {
    return [...this.caseCompetitions].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }

  public getCaseCompetitionById(id: string): CaseCompetition | undefined {
    return this.caseCompetitions.find(c => c.id === id);
  }

  public pushCaseCompetition(
    data: Omit<CaseCompetition, 'id' | 'created_at'>
  ): CaseCompetition {
    const newComp: CaseCompetition = {
      ...data,
      id: `case-comp-${Date.now()}`,
      created_at: new Date().toISOString(),
      eligible_batches: data.eligible_batches && data.eligible_batches.length > 0 ? data.eligible_batches : ['2026-2028'],
      status: data.status || 'active',
      stage: data.stage || 'live',
    };
    this.caseCompetitions.unshift(newComp);
    saveToStorage(STORAGE_KEYS.CASE_COMPETITIONS, this.caseCompetitions);

    this.logAdminAction(
      'Placement Admin',
      'Pushed Case Competition',
      'competition',
      `Pushed "${newComp.title}" hosted by ${newComp.organizer} with deadline ${newComp.deadline}`,
      newComp.id
    );

    this.notifyCaseCompetitionListeners();

    return newComp;
  }

  public updateCaseCompetition(id: string, updates: Partial<CaseCompetition>): CaseCompetition | null {
    const idx = this.caseCompetitions.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.caseCompetitions[idx] = { ...this.caseCompetitions[idx], ...updates };
    saveToStorage(STORAGE_KEYS.CASE_COMPETITIONS, this.caseCompetitions);
    this.notifyCaseCompetitionListeners();
    return this.caseCompetitions[idx];
  }

  public deleteCaseCompetition(id: string): void {
    const target = this.caseCompetitions.find(c => c.id === id);
    this.caseCompetitions = this.caseCompetitions.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CASE_COMPETITIONS, this.caseCompetitions);

    if (target) {
      this.logAdminAction(
        'Placement Admin',
        'Deleted Case Competition',
        'competition',
        `Deleted case challenge "${target.title}"`,
        target.id
      );
    }

    this.notifyCaseCompetitionListeners();
  }

  public getCaseApplications(competitionId?: string): CaseCompetitionApplication[] {
    if (competitionId) {
      return this.caseApplications.filter(a => a.competition_id === competitionId);
    }
    return [...this.caseApplications];
  }

  public getStudentCaseApplications(studentId: string): CaseCompetitionApplication[] {
    return this.caseApplications.filter(a => a.student_id === studentId);
  }

  public hasStudentAppliedToCase(competitionId: string, studentId: string): CaseCompetitionApplication | undefined {
    return this.caseApplications.find(a => a.competition_id === competitionId && a.student_id === studentId);
  }

  public applyToCaseCompetition(
    data: Omit<CaseCompetitionApplication, 'id' | 'applied_at' | 'status'>
  ): CaseCompetitionApplication {
    const existing = this.hasStudentAppliedToCase(data.competition_id, data.student_id);
    if (existing) {
      return existing;
    }

    const application: CaseCompetitionApplication = {
      ...data,
      id: `case-app-${Date.now()}`,
      status: 'submitted',
      applied_at: new Date().toISOString(),
    };

    this.caseApplications.unshift(application);
    saveToStorage(STORAGE_KEYS.CASE_APPLICATIONS, this.caseApplications);

    const comp = this.getCaseCompetitionById(data.competition_id);
    if (comp) {
      this.logAdminAction(
        data.student_name,
        'Applied to Case Competition',
        'competition',
        `${data.student_name} (${data.team_name}) submitted solution deck for "${comp.title}"`,
        comp.id
      );
    }

    this.notifyCaseCompetitionListeners();

    return application;
  }

  public updateCaseApplicationStatus(
    applicationId: string,
    status: CaseCompetitionApplication['status']
  ): void {
    const idx = this.caseApplications.findIndex(a => a.id === applicationId);
    if (idx !== -1) {
      this.caseApplications[idx].status = status;
      saveToStorage(STORAGE_KEYS.CASE_APPLICATIONS, this.caseApplications);
      this.notifyCaseCompetitionListeners();
    }
  }

  public getUserPassword(email: string): string | null {
    const creds = getFromStorage<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, {
      'p26nikhil@iimg.ac.in': 'admin@2026',
      'admin@iimg.ac.in': 'admin@2026',
    });
    return creds[email.trim().toLowerCase()] || null;
  }

  public setUserPassword(email: string, password: string): void {
    const creds = getFromStorage<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, {
      'p26nikhil@iimg.ac.in': 'admin@2026',
      'admin@iimg.ac.in': 'admin@2026',
    });
    creds[email.trim().toLowerCase()] = password;
    saveToStorage(STORAGE_KEYS.CREDENTIALS, creds);
  }

  public verifyUserPassword(email: string, passwordAttempt: string): boolean {
    const clean = email.trim().toLowerCase();
    const creds = getFromStorage<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, {
      'p26nikhil@iimg.ac.in': 'admin@2026',
      'admin@iimg.ac.in': 'admin@2026',
    });

    const storedPass = creds[clean];
    if (storedPass) {
      return storedPass === passwordAttempt;
    }

    // Default institutional password for pre-seeded demo students if not yet customized
    const isStudent = this.students.some(s => s.email.toLowerCase() === clean);
    if (isStudent) {
      if (passwordAttempt === 'student@2026' || passwordAttempt === 'admin@2026' || passwordAttempt === 'iimg@2026') {
        creds[clean] = passwordAttempt;
        saveToStorage(STORAGE_KEYS.CREDENTIALS, creds);
        return true;
      }
    }

    return false;
  }
}

export const store = new StoreService();
