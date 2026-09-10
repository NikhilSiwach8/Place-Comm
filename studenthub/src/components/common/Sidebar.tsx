import React from 'react';
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  Bell,
  Settings,
  Users,
  Send,
  Tags,
  Activity,
  Sliders,
  ExternalLink,
  ArrowLeftRight,
  ShieldCheck,
  Hourglass
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { IIMGLogo } from './IIMGLogo';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number | string;
  badgeColor?: 'red' | 'amber';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { role, currentStudent, hasDualRole, toggleRole } = useAuth();

  const notifications = store.getNotifications();
  const readIds = store.getReadNotifications();
  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;
  const pendingDocsCount = store.getAllPendingDocuments().length;

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'certificates', label: 'Certificates & Vault', icon: Award },
    { id: 'internships', label: 'Internship Portal', icon: GraduationCap },
    { id: 'jobs', label: 'Placement Drives', icon: Briefcase, badge: 'Yet to arrive', badgeColor: 'amber' },
    { id: 'competitions', label: 'Competitions & Honors', icon: Trophy },
    { id: 'notifications', label: 'Campus Bulletins', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined, badgeColor: 'red' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin_dashboard', label: 'Overview Analytics', icon: LayoutDashboard },
    {
      id: 'admin_waiting_line',
      label: 'Doc Verification Queue',
      icon: Hourglass,
      badge: pendingDocsCount > 0 ? `${pendingDocsCount} waiting` : undefined,
      badgeColor: 'amber',
    },
    {
      id: 'admin_case_competitions',
      label: 'Case Competitions',
      icon: Trophy,
    },
    { id: 'admin_students', label: 'Student Directory', icon: Users },
    { id: 'admin_opportunities', label: 'Internships & Jobs', icon: Briefcase },
    { id: 'admin_notifications', label: 'Push Announcements', icon: Send },
    { id: 'admin_tags', label: 'Tags & Attributes', icon: Tags },
    { id: 'admin_logs', label: 'Admin Activity Logs', icon: Activity },
    { id: 'admin_settings', label: 'Institutional Config', icon: Sliders },
  ];

  const items: NavItem[] = role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-y-auto flex flex-col justify-between p-3.5 ${
          isOpen ? 'left-0' : '-left-64 lg:left-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {role === 'admin' ? 'Institutional Administration' : 'Student Navigation'}
          </div>

          {items.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor === 'amber' || typeof item.badge === 'string'
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60'
                        : 'bg-rose-500 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Card / Institutional Info */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {hasDualRole && (
            <div className="p-2.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 rounded-xl border border-amber-200/80 dark:border-amber-800/60 text-left">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Dual Auth Active
                </span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  {role}
                </span>
              </div>
              <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 mt-1 leading-snug">
                Authorized for Admin operations &amp; Student portfolio.
              </p>
              <button
                onClick={() => {
                  toggleRole();
                  onNavigate(role === 'admin' ? 'dashboard' : 'admin_dashboard');
                  onClose();
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Switch to {role === 'admin' ? 'Student View' : 'Admin Console'}
              </button>
            </div>
          )}

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-left">
            <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
              <IIMGLogo variant="icon-only" size="xs" interactive />
              <div className="leading-none">
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">IIMG Guwahati</div>
                <div className="text-[9px] text-slate-400">Official Placement Vault</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                Placement Season
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                Yet to Arrive
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Batch 2026-2028 drives yet to start. Pre-placement audit active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
