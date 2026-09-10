import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  User as UserIcon,
  Menu,
  CheckCheck,
  ChevronDown,
  Layers,
  Settings,
  X,
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { store } from '../../services/store';
import { Badge } from './Badge';
import { IIMGLogo } from './IIMGLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onToggleSidebar,
}) => {
  const { currentUser, currentStudent, role, logout, hasDualRole, toggleRole, switchRole } = useAuth();
  const { actualTheme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const notifications = store.getNotifications();
  const readIds = store.getReadNotifications();
  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate(role === 'admin' ? 'admin_dashboard' : 'dashboard')}
            className="flex items-center cursor-pointer select-none group"
            title="IIMG - Indian Institute of Management Guwahati"
          >
            <IIMGLogo variant="horizontal" size="sm" showSubtitle={true} interactive={true} />
          </div>
        </div>

        {/* Center: Search trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Quick search jobs, announcements, students...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search on mobile */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dual Role Perspective Quick Switch */}
          {hasDualRole && (
            <button
              onClick={() => {
                toggleRole();
                onNavigate(role === 'admin' ? 'dashboard' : 'admin_dashboard');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/80 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Toggle between Student and Administrator perspectives"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">
                {role === 'admin' ? 'Switch to Student View' : 'Switch to Admin Console'}
              </span>
              <span className="sm:hidden font-bold">
                {role === 'admin' ? 'Student' : 'Admin'}
              </span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {actualTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in zoom-in-95">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <Badge variant="rose" size="sm">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => store.markAllNotificationsAsRead()}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(n => {
                      const isUnread = !readIds.includes(n.id);
                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            store.markNotificationAsRead(n.id);
                            setShowNotifications(false);
                            onNavigate('notifications');
                          }}
                          className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                            isUnread ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {n.title}
                            </span>
                            <Badge
                              size="sm"
                              variant={
                                n.priority === 'Urgent'
                                  ? 'rose'
                                  : n.priority === 'Important'
                                  ? 'amber'
                                  : 'blue'
                              }
                            >
                              {n.category}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                            {n.description}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('notifications');
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-2xs">
                {currentStudent?.avatar_url ? (
                  <img src={currentStudent.avatar_url} alt={currentStudent.full_name} className="w-full h-full object-cover" />
                ) : role === 'admin' ? (
                  'AD'
                ) : (
                  currentStudent?.full_name?.charAt(0) || 'U'
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {hasDualRole
                      ? 'Nikhil P.'
                      : role === 'admin'
                      ? 'Institutional Administrator'
                      : currentStudent?.full_name || currentUser?.email || 'Student'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {currentUser?.email}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    {hasDualRole ? (
                      <>
                        <Badge size="sm" variant="amber">
                          Dual Auth (Admin + Student)
                        </Badge>
                        <span className="text-[10px] text-slate-400">
                          Active: <strong className="capitalize text-slate-700 dark:text-slate-200">{role}</strong>
                        </span>
                      </>
                    ) : (
                      <Badge size="sm" variant={role === 'admin' ? 'amber' : 'blue'}>
                        {role === 'admin' ? 'Administrator' : `${currentStudent?.student_id || 'Student'}`}
                      </Badge>
                    )}
                  </div>
                </div>

                {hasDualRole && (
                  <div className="p-2 my-1.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 dark:text-amber-200 mb-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Dual Role Mode
                      </span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                        {role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        toggleRole();
                        onNavigate(role === 'admin' ? 'dashboard' : 'admin_dashboard');
                      }}
                      className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      Switch to {role === 'admin' ? 'Student View' : 'Admin Console'}
                    </button>
                  </div>
                )}

                <div className="py-1">
                  {(role === 'student' || hasDualRole) && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (role !== 'student' && hasDualRole) {
                          switchRole('student');
                        }
                        onNavigate('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      My Student Profile
                    </button>
                  )}

                  {hasDualRole && role === 'student' && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        switchRole('admin');
                        onNavigate('admin_dashboard');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      Institutional Admin Console
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate(role === 'admin' ? 'admin_settings' : 'settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Account Settings
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      onNavigate('landing');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
