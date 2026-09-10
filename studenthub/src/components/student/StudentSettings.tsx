import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Eye,
  Lock,
  Download,
  Moon,
  Sun,
  CheckCircle2,
  Key
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { store } from '../../services/store';
import { Card, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';

export const StudentSettings: React.FC = () => {
  const { currentStudent } = useAuth();
  const { theme, setTheme } = useTheme();

  const [isPublic, setIsPublic] = useState(true);
  const [placementAlerts, setPlacementAlerts] = useState(true);
  const [academicAlerts, setAcademicAlerts] = useState(true);
  const [competitionAlerts, setCompetitionAlerts] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  if (!currentStudent) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    const isCurrentValid = store.verifyUserPassword(currentStudent.email, currentPassword);
    if (!isCurrentValid) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match!');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    store.setUserPassword(currentStudent.email, newPassword);
    setPasswordToast(true);
    setPasswordError(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordToast(false), 3000);
  };

  const handleExportData = () => {
    const studentData = {
      profile: currentStudent,
      educations: store.getEducations(currentStudent.id),
      experiences: store.getExperiences(currentStudent.id),
      projects: store.getProjects(currentStudent.id),
      certificates: store.getCertificates(currentStudent.id),
      competitions: store.getCompetitions(currentStudent.id),
    };

    const json = JSON.stringify(studentData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studenthub_archive_${currentStudent.student_id}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Account &amp; Security Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your placement privacy, institutional notification preferences, and credentials.
        </p>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Preferences updated!
        </div>
      )}

      {passwordToast && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Account password updated securely!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Visibility & Privacy */}
        <Card>
          <CardHeader
            title="Recruitment Privacy &amp; Visibility"
            subtitle="Control who can discover your verified academic profile"
            icon={<Eye className="w-4 h-4 text-blue-600" />}
          />
          <div className="space-y-4 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Allow Verified Campus Recruiters to View My Profile
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Corporate partners visiting campus can discover your CGPA, skills, and projects for direct shortlisting.
                </div>
              </div>
            </label>

            <div className="pt-2">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                Notification Subscriptions
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={placementAlerts}
                    onChange={e => setPlacementAlerts(e.target.checked)}
                    className="rounded text-blue-600 w-3.5 h-3.5"
                  />
                  <span>Campus placement drive alerts &amp; shortlists</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={academicAlerts}
                    onChange={e => setAcademicAlerts(e.target.checked)}
                    className="rounded text-blue-600 w-3.5 h-3.5"
                  />
                  <span>Dean's office academic notices &amp; exam circulars</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={competitionAlerts}
                    onChange={e => setCompetitionAlerts(e.target.checked)}
                    className="rounded text-blue-600 w-3.5 h-3.5"
                  />
                  <span>Hackathons &amp; national coding competition calls</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader
            title="Authentication &amp; Password"
            subtitle="Update your institutional credentials"
            icon={<Key className="w-4 h-4 text-purple-600" />}
          />
          <form onSubmit={handlePasswordChange} className="space-y-3">
            {passwordError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900">
                {passwordError}
              </div>
            )}
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="primary" size="sm">
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Appearance Preference */}
        <Card>
          <CardHeader
            title="Appearance &amp; Display"
            subtitle="Select interface theme"
            icon={<Moon className="w-4 h-4 text-indigo-600" />}
          />
          <div className="grid grid-cols-3 gap-3">
            {(['light', 'dark', 'system'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-3 rounded-xl border text-center text-xs font-bold capitalize transition-all ${
                  theme === t
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t} Mode
              </button>
            ))}
          </div>
        </Card>

        {/* Data Archive Export */}
        <Card>
          <CardHeader
            title="Data Portability &amp; Archives"
            subtitle="Download a complete backup of your portfolio"
            icon={<Download className="w-4 h-4 text-emerald-600" />}
          />
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Exports all your structured profile records, education credentials, project descriptions, and verified certificate data in standard JSON format.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download Full JSON Archive
          </Button>
        </Card>
      </div>
    </div>
  );
};
