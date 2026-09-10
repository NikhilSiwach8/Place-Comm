import { supabase, isSupabaseConfigured } from './supabase';
import { StudentProfile, Opportunity, CertificateDocument, InstitutionalNotification } from '../types';

/**
 * Data synchronization helper for Supabase PostgreSQL.
 * Seamlessly handles when tables are migrated or when schema is pending.
 */
export class SupabaseDataService {
  private static schemaErrorNotified = false;

  /**
   * Check if a specific table exists and is accessible in the Supabase public schema
   */
  public static async isTableAccessible(tableName: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from(tableName).select('id').limit(1);
      if (error && (error.code === 'PGRST205' || error.message.includes('schema cache') || error.message.includes('Could not find the table'))) {
        return false;
      }
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch all student profiles from Supabase if table exists
   */
  public static async fetchStudents(): Promise<StudentProfile[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (!this.schemaErrorNotified && error.code === 'PGRST205') {
          console.info('Supabase student_profiles table not created yet. Using synchronized local store.');
          this.schemaErrorNotified = true;
        }
        return null;
      }

      return data as StudentProfile[];
    } catch (err) {
      console.warn('Error fetching students from Supabase:', err);
      return null;
    }
  }

  /**
   * Upsert a student profile into Supabase
   */
  public static async upsertStudentProfile(profile: StudentProfile): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('student_profiles')
        .upsert({
          id: profile.id,
          student_id: profile.student_id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          degree: profile.degree,
          department: profile.department,
          batch: profile.batch,
          graduation_year: profile.graduation_year,
          current_semester: profile.current_semester,
          cgpa: profile.cgpa,
          career_objective: profile.career_objective,
          is_active: profile.is_active,
          is_profile_verified: profile.is_profile_verified,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.warn('Could not sync student to Supabase table:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Exception upserting student to Supabase:', err);
      return false;
    }
  }

  /**
   * Fetch opportunities from Supabase
   */
  public static async fetchOpportunities(): Promise<Opportunity[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return null;
      return data as Opportunity[];
    } catch {
      return null;
    }
  }

  /**
   * Upsert an opportunity into Supabase
   */
  public static async upsertOpportunity(opp: Opportunity): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('opportunities')
        .upsert({
          id: opp.id,
          type: opp.type,
          company: opp.company,
          title: opp.title,
          description: opp.description,
          location: opp.location,
          work_mode: opp.work_mode,
          deadline: opp.deadline,
          application_url: opp.application_url,
          status: opp.status,
          updated_at: new Date().toISOString(),
        });

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch notifications from Supabase
   */
  public static async fetchNotifications(): Promise<InstitutionalNotification[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return null;
      return data as InstitutionalNotification[];
    } catch {
      return null;
    }
  }
}
