import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Auth & Landing
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentProfileEdit } from './components/student/StudentProfileEdit';
import { StudentSettings } from './components/student/StudentSettings';
import { CertificateManagement } from './components/certificates/CertificateManagement';
import { OpportunityPortal } from './components/opportunities/OpportunityPortal';
import { CompetitionPortal } from './components/competitions/CompetitionPortal';
import { NotificationCenter } from './components/notifications/NotificationCenter';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStudentDirectory } from './components/admin/AdminStudentDirectory';
import { AdminOpportunitiesManager } from './components/admin/AdminOpportunitiesManager';
import { AdminNotificationPublisher } from './components/admin/AdminNotificationPublisher';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminSettings } from './components/admin/AdminSettings';

const AppContent: React.FC = () => {
  const { isAuthenticated, role, switchRoleQuick, isLoading } = useAuth();

  // Unauthenticated page state
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');

  // Authenticated main view state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();

  // Responsive UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync default view whenever role changes
  useEffect(() => {
    if (role === 'admin' && !currentView.startsWith('admin_')) {
      setCurrentView('admin_dashboard');
    } else if (role === 'student' && currentView.startsWith('admin_')) {
      setCurrentView('dashboard');
    }
  }, [role]);

  // Global Keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string, entityId?: string) => {
    if (view === 'admin_students') {
      setSelectedStudentId(entityId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchResult = (type: string, id: string) => {
    switch (type) {
      case 'student':
        if (role === 'admin') {
          setSelectedStudentId(id);
          setCurrentView('admin_students');
        } else {
          setCurrentView('profile');
        }
        break;
      case 'opportunity':
        setCurrentView('internships');
        break;
      case 'certificate':
        setCurrentView('certificates');
        break;
      case 'notification':
        setCurrentView('notifications');
        break;
      default:
        break;
    }
  };

  // Loading indicator while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Student<span className="text-blue-600">Hub</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Initializing institutional portal...</div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage
          onRegisterClick={() => setAuthView('register')}
          onSuccess={() => setAuthView('landing')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterPage
          onLoginClick={() => setAuthView('login')}
          onSuccess={() => setAuthView('landing')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    return (
      <LandingPage
        onLoginClick={() => setAuthView('login')}
        onRegisterClick={() => setAuthView('register')}
      />
    );
  }

  // Authenticated Portal Layout
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Main Stage View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {/* STUDENT VIEWS */}
          {currentView === 'dashboard' && (
            <StudentDashboard onNavigate={handleNavigate} />
          )}
          {currentView === 'profile' && (
            <StudentProfileView onNavigate={handleNavigate} />
          )}
          {currentView === 'profile_edit' && (
            <StudentProfileEdit
              onCancel={() => setCurrentView('profile')}
              onSaved={() => setCurrentView('profile')}
            />
          )}
          {currentView === 'certificates' && <CertificateManagement />}
          {currentView === 'internships' && (
            <OpportunityPortal initialType="internship" onNavigate={handleNavigate} />
          )}
          {currentView === 'jobs' && (
            <OpportunityPortal initialType="job" onNavigate={handleNavigate} />
          )}
          {currentView === 'competitions' && <CompetitionPortal />}
          {currentView === 'notifications' && <NotificationCenter />}
          {currentView === 'settings' && <StudentSettings />}

          {/* ADMIN VIEWS */}
          {currentView === 'admin_dashboard' && (
            <AdminDashboard onNavigate={handleNavigate} />
          )}
          {currentView === 'admin_waiting_line' && (
            <AdminStudentDirectory
              initialTab="waiting_line"
              selectedStudentId={selectedStudentId}
            />
          )}
          {currentView === 'admin_case_competitions' && (
            <CompetitionPortal adminMode={true} />
          )}
          {currentView === 'admin_students' && (
            <AdminStudentDirectory
              initialTab="directory"
              selectedStudentId={selectedStudentId}
            />
          )}
          {currentView === 'admin_opportunities' && <AdminOpportunitiesManager />}
          {currentView === 'admin_notifications' && <AdminNotificationPublisher />}
          {currentView === 'admin_tags' && <AdminSettings />}
          {currentView === 'admin_logs' && <AdminAuditLogs />}
          {currentView === 'admin_settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
