import React from 'react';
import {
  Users,
  FileText,
  Award,
  Briefcase,
  Clock,
  TrendingUp,
  ShieldCheck,
  Send,
  ArrowRight,
  Sparkles,
  Download,
  Building,
  Trophy
} from 'lucide-react';
import { store } from '../../services/store';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { IIMGLogo } from '../common/IIMGLogo';

interface AdminDashboardProps {
  onNavigate: (view: string, id?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const students = store.getAllStudents();
  const opportunities = store.getOpportunities();
  const logs = store.getLogs();
  const caseComps = store.getCaseCompetitions();
  const totalCaseApps = store.getCaseApplications().length;

  const totalStudents = students.length;
  const verifiedStudents = students.filter(s => s.is_profile_verified).length;

  // Count pending certificates across all students
  let totalPendingCerts = 0;
  let totalCerts = 0;
  students.forEach(s => {
    const certs = store.getCertificates(s.id);
    totalCerts += certs.length;
    totalPendingCerts += certs.filter(c => c.verification_status === 'pending').length;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block p-1 bg-white/10 dark:bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
            <IIMGLogo variant="stacked" size="xs" showSubtitle={false} interactive />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-400/30">
                IIMG Admin Console
              </span>
              <span className="text-xs text-slate-300">Batch 2026-2028</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1.5">
              Campus Placement &amp; Academic Overview
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Indian Institute of Management Guwahati placement drives, student verification, and credential auditing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('admin_case_competitions')}
            leftIcon={<Trophy className="w-3.5 h-3.5 text-purple-600" />}
          >
            Case Competitions
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('admin_opportunities')}
            leftIcon={<Briefcase className="w-3.5 h-3.5 text-blue-600" />}
          >
            Post Drive
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('admin_notifications')}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Push Notice
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {totalStudents}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{verifiedStudents}</span> verified profiles
          </div>
        </Card>

        <Card
          className="hover:border-amber-400 transition-all cursor-pointer"
          onClick={() => onNavigate('admin_waiting_line')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Proofs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-2">
            <span>{totalPendingCerts}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
              In Waiting Line
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Review &amp; verify credentials</span>
            <span className="text-amber-600 font-bold">Open Queue →</span>
          </div>
        </Card>

        <Card className="hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Opportunities</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {opportunities.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {opportunities.filter(o => o.type === 'internship').length} Internships • {opportunities.filter(o => o.type === 'job').length} Full-time
          </div>
        </Card>

        <Card
          className="hover:border-purple-400 transition-all cursor-pointer"
          onClick={() => onNavigate('admin_case_competitions')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Case Competitions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-2">
            <span>{caseComps.length}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-bold">
              {totalCaseApps} Applied
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Pushed to Batch 2026-2028</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">Push &amp; Manage →</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Pending Verifications & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Verification Queue */}
          <Card>
            <CardHeader
              title="Pending Student Credential Verifications"
              subtitle="Review uploaded degree proofs, AWS certifications, and internship records"
              icon={<Award className="w-4 h-4 text-amber-500" />}
              action={
                <button
                  onClick={() => onNavigate('admin_waiting_line')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Open Verification Waiting Line →
                </button>
              }
            />

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.slice(0, 3).map(student => {
                const pending = store.getCertificates(student.id).filter(c => c.verification_status === 'pending');
                if (pending.length === 0) return null;
                return (
                  <div key={student.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {student.full_name} <span className="font-normal text-slate-400">({student.student_id})</span>
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          {pending[0].title} • {pending[0].issuing_organization}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          store.verifyCertificate(student.id, pending[0].id, 'verified', 'Approved by Dean Placement');
                          alert(`Verified ${pending[0].title} for ${student.full_name}!`);
                        }}
                        className="text-xs font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate('admin_students', student.id)}
                        className="text-xs"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Top Recruiters & Placement Stats */}
          <Card>
            <CardHeader
              title="Top Institutional Recruitment Partners"
              subtitle="Corporate firms actively driving on-campus shortlists"
              icon={<Building className="w-4 h-4 text-blue-500" />}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { name: 'Google Cloud', offers: '4 Offers', ctc: '₹32 LPA' },
                { name: 'Microsoft IDC', offers: '6 Offers', ctc: '₹44 LPA' },
                { name: 'Goldman Sachs', offers: '5 Offers', ctc: '₹28 LPA' },
                { name: 'Amazon AWS', offers: '8 Offers', ctc: '₹34 LPA' },
              ].map((partner, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {partner.name}
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {partner.offers}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Top CTC: {partner.ctc}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Admin Audit Activity Logs */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Admin Audit Activity Logs"
              subtitle="Verifiable institutional action stream"
              icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
              action={
                <button
                  onClick={() => onNavigate('admin_logs')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  All Logs →
                </button>
              }
            />
            <div className="space-y-3">
              {logs.slice(0, 5).map(log => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    By: {log.user_email}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
