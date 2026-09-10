import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, UserRole } from '../types';
import { store } from '../services/store';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  currentUser: User | null;
  currentStudent: StudentProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  hasDualRole: boolean;
  toggleRole: () => void;
  switchRole: (role: 'student' | 'admin') => void;
  login: (email: string, password?: string, preferredRole?: 'student' | 'admin') => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password?: string;
    fullName: string;
    studentId: string;
    department?: string;
    batch: string;
    degree?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRoleQuick: (role: 'student' | 'admin') => void;
  updateCurrentStudentProfile: (updates: Partial<StudentProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'studenthub_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    // Listen for Supabase auth state changes if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const uEmail = (session.user.email || '').toLowerCase();
              const isDual = store.hasDualRole(uEmail);
              const isAdmin = store.isAdminEmail(uEmail);
              const authUser: User = {
                id: session.user.id,
                email: uEmail,
                role: isAdmin ? 'admin' : 'student',
                created_at: session.user.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              if (isMounted) {
                setCurrentUser(authUser);
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
                const stud = store.getStudentByEmail(uEmail) || store.getStudentByUserId(session.user.id);
                setCurrentStudent(stud || null);
              }
            } else if (event === 'SIGNED_OUT') {
              // Handled by explicit logout
            }
          }
        );
        authSubscription = authListener.subscription;
      } catch (err) {
        console.warn('Failed to attach Supabase auth listener:', err);
      }
    }

    async function initAuth() {
      try {
        // 1. Check if Supabase has an active authenticated session
        if (isSupabaseConfigured && supabase) {
          try {
            const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
            if (!sessionErr && sessionData?.session?.user) {
              const sbUser = sessionData.session.user;
              const cleanEmail = (sbUser.email || '').toLowerCase();
              const isDual = store.hasDualRole(cleanEmail);
              const isAdmin = store.isAdminEmail(cleanEmail);

              // Check if user had a previous saved role preference
              const stored = localStorage.getItem(AUTH_USER_KEY);
              let preferredRole: UserRole = isAdmin ? 'admin' : 'student';
              if (stored) {
                try {
                  const p = JSON.parse(stored);
                  if (p.email?.toLowerCase() === cleanEmail && (p.role === 'admin' || p.role === 'student')) {
                    preferredRole = p.role;
                  }
                } catch {}
              }

              const authenticatedUser: User = {
                id: sbUser.id,
                email: cleanEmail,
                role: isDual ? preferredRole : (isAdmin ? 'admin' : 'student'),
                created_at: sbUser.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };

              if (isMounted) {
                setCurrentUser(authenticatedUser);
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));
                const stud = store.getStudentByEmail(cleanEmail) || store.getStudentByUserId(sbUser.id);
                setCurrentStudent(stud || null);
                setIsLoading(false);
                return;
              }
            }
          } catch (sbErr) {
            console.warn('Supabase getSession notice:', sbErr);
          }
        }

        // 2. Check persisted local storage user
        const stored = localStorage.getItem(AUTH_USER_KEY);
        if (stored) {
          try {
            const parsedUser: User = JSON.parse(stored);
            if (isMounted) {
              const isDual = store.hasDualRole(parsedUser.email);
              if (!isDual && parsedUser?.email && store.isAdminEmail(parsedUser.email)) {
                parsedUser.role = 'admin';
              }
              setCurrentUser(parsedUser);
              const stud = store.getStudentByEmail(parsedUser.email) || store.getStudentByUserId(parsedUser.id);
              setCurrentStudent(stud || null);
            }
          } catch {
            localStorage.removeItem(AUTH_USER_KEY);
          }
        } else {
          // No user session active
          if (isMounted) {
            setCurrentUser(null);
            setCurrentStudent(null);
          }
        }
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const login = async (
    email: string,
    password?: string,
    preferredRole?: 'student' | 'admin'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // Check institutional domain constraint
    const settings = store.getSettings();
    const domain = cleanEmail.split('@')[1];
    const allowedDomains = settings?.allowed_email_domains || ['iimg.ac.in', 'institution.edu'];
    const isDomainAllowed = allowedDomains.some(d => d.toLowerCase() === domain);

    if (!isDomainAllowed) {
      setIsLoading(false);
      return {
        success: false,
        error: `Institutional access restricted. Only emails from authorized domains (${allowedDomains.map(d => '@' + d).join(', ')}) are permitted.`
      };
    }

    if (!password || !password.trim()) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Password is required. Please enter your institutional credentials.'
      };
    }

    // Try Supabase Auth first if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sbAuthData, error: sbAuthError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (!sbAuthError && sbAuthData?.user) {
          const isAdmin = store.isAdminEmail(cleanEmail);
          const isDual = store.hasDualRole(cleanEmail);
          const authUser: User = {
            id: sbAuthData.user.id,
            email: cleanEmail,
            role: isDual ? (preferredRole || 'admin') : (isAdmin ? 'admin' : 'student'),
            created_at: sbAuthData.user.created_at,
            updated_at: new Date().toISOString(),
          };

          setCurrentUser(authUser);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));

          const stud = store.getStudentByEmail(cleanEmail) || store.getStudentByUserId(sbAuthData.user.id);
          setCurrentStudent(stud || null);

          if (isAdmin) {
            const adminName = cleanEmail === 'p26nikhil@iimg.ac.in' ? 'Nikhil P. (Admin)' : 'Institutional Administrator';
            store.logAdminAction(adminName, 'ADMIN_LOGIN', 'institutional_auth', `Institutional administrator logged in (${cleanEmail})`);
          }

          setIsLoading(false);
          return { success: true };
        }
      } catch (err) {
        console.warn('Supabase sign-in exception, evaluating institutional credentials:', err);
      }
    }

    // Verify institutional credentials against store
    const isPasswordValid = store.verifyUserPassword(cleanEmail, password);
    if (!isPasswordValid) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid password. Please check your credentials and try again.'
      };
    }

    // 0. Dual Authentication User (e.g. p26nikhil@iimg.ac.in)
    if (store.hasDualRole(cleanEmail)) {
      const activeRole: UserRole = preferredRole || 'admin';
      const studentProfile = store.getStudentByEmail(cleanEmail);
      const dualUser: User = {
        id: 'user-admin-nikhil',
        email: cleanEmail,
        role: activeRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCurrentUser(dualUser);
      setCurrentStudent(studentProfile || null);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(dualUser));
      store.logAdminAction('Nikhil P. (Dual Auth)', 'DUAL_LOGIN', 'auth', `Dual Admin/Student authenticated with ${activeRole.toUpperCase()} view (${cleanEmail})`);
      setIsLoading(false);
      return { success: true };
    }

    // Institutional Admin Login
    if (store.isAdminEmail(cleanEmail)) {
      const adminUser: User = {
        id: cleanEmail === 'p26nikhil@iimg.ac.in' ? 'user-admin-nikhil' : 'user-admin-main',
        email: cleanEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCurrentUser(adminUser);
      const studentProfile = store.getStudentByEmail(cleanEmail);
      setCurrentStudent(studentProfile || null);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
      const adminName = cleanEmail === 'p26nikhil@iimg.ac.in' ? 'Nikhil P. (Admin)' : 'Institutional Administrator';
      store.logAdminAction(adminName, 'ADMIN_LOGIN', 'settings', `Administrator authenticated and logged in (${cleanEmail})`);
      setIsLoading(false);
      return { success: true };
    }

    // Find student in local store
    const existingStudent = store.getStudentByEmail(cleanEmail);
    if (!existingStudent) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No student record found for this institutional email. Please complete registration or contact the placement office.'
      };
    }

    if (!existingStudent.is_active) {
      setIsLoading(false);
      return {
        success: false,
        error: 'This account is currently deactivated by institutional administration. Please contact the administrator.'
      };
    }

    const studentUser: User = {
      id: existingStudent.user_id || `user-${existingStudent.id}`,
      email: cleanEmail,
      role: 'student',
      created_at: existingStudent.created_at,
      updated_at: new Date().toISOString()
    };

    setCurrentUser(studentUser);
    setCurrentStudent(existingStudent);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(studentUser));
    setIsLoading(false);
    return { success: true };
  };

  const register = async (data: {
    email: string;
    password?: string;
    fullName: string;
    studentId: string;
    department: string;
    batch: string;
    degree: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = data.email.trim().toLowerCase();

    // Check institutional domain
    const settings = store.getSettings();
    const domain = cleanEmail.split('@')[1];
    const allowedDomains = settings?.allowed_email_domains || ['iimg.ac.in', 'institution.edu'];
    const isDomainAllowed = allowedDomains.some(d => d.toLowerCase() === domain);

    if (!isDomainAllowed) {
      setIsLoading(false);
      return {
        success: false,
        error: `Registration failed: "${domain || 'unknown'}" is not an approved institutional domain. Allowed domains: ${allowedDomains.map(d => '@' + d).join(', ')}`
      };
    }

    // Check if duplicate student email or student ID
    const existing = store.getStudentByEmail(cleanEmail);
    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'An account with this institutional email already exists. Please sign in.' };
    }

    const allStudents = store.getAllStudents();
    const duplicateId = allStudents.find(s => s.student_id.toLowerCase() === data.studentId.trim().toLowerCase());
    if (duplicateId) {
      setIsLoading(false);
      return { success: false, error: `Student ID "${data.studentId}" is already registered.` };
    }

    let supabaseUserId: string | null = null;

    // Register with Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sbData, error: sbError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password || 'DefaultPassword123!',
          options: {
            data: {
              full_name: data.fullName,
              student_id: data.studentId,
              department: data.department || 'Management Studies',
              degree: data.degree || 'MBA',
              batch: data.batch,
              role: 'student',
            },
          },
        });

        if (sbError) {
          // If already exists in Supabase, proceed with linking
          console.warn('Supabase auth signUp notice:', sbError.message);
        } else if (sbData?.user) {
          supabaseUserId = sbData.user.id;
        }
      } catch (err) {
        console.warn('Supabase registration error:', err);
      }
    }

    const newUserId = supabaseUserId || `user-${Date.now()}`;
    const newProfile = store.createStudentProfile({
      user_id: newUserId,
      student_id: data.studentId.trim().toUpperCase(),
      full_name: data.fullName.trim(),
      email: cleanEmail,
      degree: data.degree || 'MBA',
      department: data.department || 'Management Studies',
      batch: data.batch,
      graduation_year: parseInt(data.batch.split('-')[1]) || 2028,
      current_semester: 1,
      cgpa: 8.50,
      skills: ['Problem Solving'],
      tags: ['Student'],
      is_active: true,
      is_profile_verified: false,
      visibility: 'institution_only'
    });

    if (data.password) {
      store.setUserPassword(cleanEmail, data.password);
    }

    const user: User = {
      id: newUserId,
      email: cleanEmail,
      role: 'student',
      created_at: newProfile.created_at,
      updated_at: newProfile.updated_at
    };

    setCurrentUser(user);
    setCurrentStudent(newProfile);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Error during Supabase sign-out:', err);
    }
    setCurrentUser(null);
    setCurrentStudent(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const hasDualRole = store.hasDualRole(currentUser?.email);

  const switchRole = (targetRole: 'student' | 'admin') => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      role: targetRole,
      updated_at: new Date().toISOString()
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
    const stud = store.getStudentByEmail(currentUser.email) || store.getStudentByUserId(currentUser.id);
    setCurrentStudent(stud || null);
    const actorName = currentUser.email === 'p26nikhil@iimg.ac.in' ? 'Nikhil P.' : 'Institutional User';
    store.logAdminAction(
      actorName,
      'ROLE_SWITCH',
      'auth_context',
      `User switched active perspective to ${targetRole.toUpperCase()} view (${currentUser.email})`
    );
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const nextRole = currentUser.role === 'admin' ? 'student' : 'admin';
    switchRole(nextRole);
  };

  const switchRoleQuick = (targetRole: 'student' | 'admin') => {
    if (currentUser && hasDualRole) {
      switchRole(targetRole);
      return;
    }
    if (targetRole === 'admin') {
      const adminEmail = 'p26nikhil@iimg.ac.in';
      const adminUser: User = {
        id: 'user-admin-nikhil',
        email: adminEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCurrentUser(adminUser);
      const stud = store.getStudentByEmail(adminEmail);
      setCurrentStudent(stud || null);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
      store.logAdminAction('Nikhil P. (Admin)', 'SWITCH_ROLE', 'settings', `Active user switched to Admin view (${adminEmail})`);
    } else {
      const students = store.getAllStudents();
      if (students.length > 0) {
        const stud = students[0];
        const studUser: User = {
          id: stud.user_id,
          email: stud.email,
          role: 'student',
          created_at: stud.created_at,
          updated_at: new Date().toISOString()
        };
        setCurrentUser(studUser);
        setCurrentStudent(stud);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(studUser));
      } else {
        setCurrentUser(null);
        setCurrentStudent(null);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  };

  const updateCurrentStudentProfile = (updates: Partial<StudentProfile>) => {
    if (!currentStudent) return;
    const updated = store.updateStudentProfile(currentStudent.id, updates);
    setCurrentStudent(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentStudent,
        role: currentUser?.role || 'student',
        isAuthenticated: !!currentUser,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        hasDualRole,
        toggleRole,
        switchRole,
        login,
        register,
        logout,
        switchRoleQuick,
        updateCurrentStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
