import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Bell, User, FileText, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { Opportunity, InstitutionalNotification, StudentProfile } from '../../types';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, id?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { role, currentStudent } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle modal handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const term = debouncedTerm.toLowerCase();

  // Search opportunities
  const opportunities: Opportunity[] = term
    ? store.getOpportunities().filter(
        o =>
          o.title.toLowerCase().includes(term) ||
          o.company.toLowerCase().includes(term) ||
          o.required_skills.some(s => s.toLowerCase().includes(term)) ||
          o.location.toLowerCase().includes(term)
      ).slice(0, 4)
    : [];

  // Search notifications
  const notifications: InstitutionalNotification[] = term
    ? store.getNotifications().filter(
        n =>
          n.title.toLowerCase().includes(term) ||
          n.category.toLowerCase().includes(term) ||
          n.description.toLowerCase().includes(term)
      ).slice(0, 3)
    : [];

  // Search students (Admins only)
  const students: StudentProfile[] =
    role === 'admin' && term
      ? store.getAllStudents().filter(
          s =>
            s.full_name.toLowerCase().includes(term) ||
            s.student_id.toLowerCase().includes(term) ||
            s.department.toLowerCase().includes(term) ||
            s.skills.some(sk => sk.toLowerCase().includes(term))
        ).slice(0, 4)
      : [];

  const hasResults = opportunities.length > 0 || notifications.length > 0 || students.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder={
              role === 'admin'
                ? "Search students, jobs, internships, announcements..."
                : "Search internships, jobs, notifications..."
            }
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {!term ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type to quickly locate jobs, internships, academic alerts, or student profiles...
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for &ldquo;{searchTerm}&rdquo;
            </div>
          ) : (
            <>
              {/* Opportunities */}
              {opportunities.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Opportunities
                  </div>
                  {opportunities.map(opp => (
                    <div
                      key={opp.id}
                      onClick={() => {
                        onNavigate(opp.type === 'internship' ? 'internships' : 'jobs', opp.id);
                        onClose();
                      }}
                      className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {opp.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {opp.company} • {opp.location} • {opp.type}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Students (Admin only) */}
              {students.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Students
                  </div>
                  {students.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        onNavigate('admin_students', s.id);
                        onClose();
                      }}
                      className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold overflow-hidden">
                          {s.avatar_url ? (
                            <img src={s.avatar_url} alt={s.full_name} className="w-full h-full object-cover" />
                          ) : (
                            s.full_name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {s.full_name} <span className="text-xs text-slate-400 font-normal">({s.student_id})</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {s.department} • CGPA: {s.cgpa}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Notifications */}
              {notifications.length > 0 && (
                <div className="py-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" /> Announcements
                  </div>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigate('notifications', n.id);
                        onClose();
                      }}
                      className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {n.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {n.category} • {n.priority}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
