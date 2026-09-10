import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Bell,
  ExternalLink,
  ChevronRight,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface StudentDashboardProps {
  onNavigate: (view: string, id?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentStudent } = useAuth();

  if (!currentStudent) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading student dashboard...
      </div>
    );
  }

  const completion = store.calculateProfileCompletion(currentStudent.id);
  const opportunities = store.getOpportunities();
  const internships = opportunities.filter(o => o.type === 'internship').slice(0, 3);
  const jobs = opportunities.filter(o => o.type === 'job').slice(0, 3);
  const notifications = store.getNotifications().slice(0, 4);
  const certificates = store.getCertificates(currentStudent.id).slice(0, 3);
  const achievements = store.getAchievements(currentStudent.id).slice(0, 3);
  const competitions = store.getCompetitions(currentStudent.id).slice(0, 3);
  const liveCaseComps = store.getCaseCompetitions().filter(c => {
    const isPast = new Date(c.deadline) < new Date();
    return (c.stage === 'live' || (!c.stage && !isPast)) && c.status !== 'upcoming' && !isPast;
  });

  // Combine deadlines from opportunities and live case competitions for the "Upcoming Deadlines" widget
  const upcomingDeadlines = [
    ...opportunities.map(o => ({
      id: o.id,
      title: `${o.company}: ${o.title}`,
      deadline: o.deadline,
      type: o.type === 'internship' ? 'Internship Deadline' : 'Job Drive Deadline',
      linkType: o.type === 'internship' ? 'internships' : 'jobs'
    })),
    ...liveCaseComps.map(c => ({
      id: c.id,
      title: `${c.organizer}: ${c.title}`,
      deadline: c.deadline,
      type: 'Case Competition Deadline',
      linkType: 'competitions'
    })),
    {
      id: 'event-sih',
      title: 'Smart India Hackathon Internal Abstract Submission',
      deadline: '2026-09-25',
      type: 'Competition Deadline',
      linkType: 'competitions'
    }
  ].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-sm shadow-blue-500/20 shrink-0">
            {currentStudent.avatar_url ? (
              <img
                src={currentStudent.avatar_url}
                alt={currentStudent.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              currentStudent.full_name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Welcome back, {currentStudent.full_name.split(' ')[0]}!
              </h1>
              {currentStudent.is_profile_verified && (
                <span title="Institutional Verified Profile">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentStudent.student_id} • {currentStudent.degree} in {currentStudent.department} • CGPA: {currentStudent.cgpa}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('internships')}
            leftIcon={<GraduationCap className="w-3.5 h-3.5 text-blue-600" />}
          >
            Internships
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('profile')}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* A. Profile Completion Card */}
      <ProfileCompletionCard
        percentage={completion.percentage}
        missingFields={completion.missingFields}
        onCompleteClick={() => onNavigate('profile')}
      />

      {/* B. Grid layout: Left Column (Opportunities & Achievements), Right Column (Upcoming & Bulletins) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* D. Featured Internships */}
          <Card>
            <CardHeader
              title="Featured Campus Internships"
              subtitle="Verified openings tailored to your department"
              icon={<GraduationCap className="w-4 h-4" />}
              action={
                <button
                  onClick={() => onNavigate('internships')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View all ({opportunities.filter(o => o.type === 'internship').length}) →
                </button>
              }
            />

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {internships.map(internship => (
                <div
                  key={internship.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {internship.title}
                      </h4>
                      <Badge variant="blue" size="sm">
                        {internship.work_mode}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {internship.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {internship.location}
                      </span>
                      {internship.stipend_or_salary && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            {internship.stipend_or_salary}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Deadline: {new Date(internship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={internship.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    >
                      Apply Now <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* E. Placement Drives — Yet to Arrive */}
          <Card>
            <CardHeader
              title="Campus Placement Drives"
              subtitle="Batch 2026-2028 Corporate Recruitment Season"
              icon={<Briefcase className="w-4 h-4 text-amber-500" />}
              action={
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                  <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Yet to Arrive
                </span>
              }
            />

            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/70 via-slate-50 to-amber-50/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-amber-950/10 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Recruitment Season Commencing Soon
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed max-w-xl">
                    Campus placement drives are currently yet to start. The Office of Corporate Relations &amp; Career Development is currently scheduling corporate JDs, CTC discussions, and interview slots.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('jobs')}
                  className="shrink-0"
                >
                  Placement Readiness &amp; Roadmap →
                </Button>
              </div>

              <div className="pt-2 border-t border-amber-200/50 dark:border-amber-900/30 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pre-Placement Auditing Active
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Slot 0 JDs: Scheduled for upcoming window
                </span>
              </div>
            </div>
          </Card>

          {/* F & G. Competitions & Recent Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Competitions */}
            <Card>
              <CardHeader
                title="Competitions & Hackathons"
                icon={<Trophy className="w-4 h-4 text-amber-500" />}
                action={
                  <button
                    onClick={() => onNavigate('competitions')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Manage →
                  </button>
                }
              />

              {liveCaseComps.length > 0 && (
                <button
                  onClick={() => onNavigate('competitions')}
                  className="w-full mb-3 text-left p-2.5 bg-purple-50/80 dark:bg-purple-950/40 rounded-xl border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between gap-2 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                      {liveCaseComps.length} Live B-School Case Challenges Open
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    Apply →
                  </span>
                </button>
              )}

              {competitions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No competition records added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {competitions.map(comp => (
                    <div
                      key={comp.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {comp.competition_name}
                        </span>
                        <Badge
                          size="sm"
                          variant={comp.result === 'Winner' ? 'amber' : 'blue'}
                        >
                          {comp.result}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {comp.organizer} • {new Date(comp.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Verified Certificates */}
            <Card>
              <CardHeader
                title="Verified Credentials Vault"
                icon={<Award className="w-4 h-4 text-purple-500" />}
                action={
                  <button
                    onClick={() => onNavigate('certificates')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Vault →
                  </button>
                }
              />
              {certificates.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Upload certificates to receive institutional verification.
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.map(cert => (
                    <div
                      key={cert.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {cert.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {cert.issuing_organization}
                        </div>
                      </div>
                      <Badge
                        size="sm"
                        variant={
                          cert.verification_status === 'verified'
                            ? 'emerald'
                            : cert.verification_status === 'rejected'
                            ? 'rose'
                            : 'amber'
                        }
                      >
                        {cert.verification_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Sidebar Area (1 col) */}
        <div className="space-y-6">
          {/* Institutional Profile Card */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Institutional Profile
              </span>
              <Badge variant={currentStudent.is_profile_verified ? 'emerald' : 'amber'} size="sm">
                {currentStudent.is_profile_verified ? 'Verified' : 'Pending Verification'}
              </Badge>
            </div>

            <div className="p-3.5 bg-slate-800/70 rounded-xl border border-slate-700/80 mb-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {currentStudent.department}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Student ID: {currentStudent.student_id} • CGPA: {currentStudent.cgpa}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-white border-slate-700 hover:bg-slate-800"
                onClick={() => onNavigate('profile')}
              >
                View Profile
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onNavigate('certificates')}
              >
                Credentials
              </Button>
            </div>
          </Card>

          {/* B. Upcoming Deadlines */}
          <Card>
            <CardHeader
              title="Upcoming Deadlines"
              subtitle="Priority dates to keep on your radar"
              icon={<Clock className="w-4 h-4 text-amber-500" />}
            />
            <div className="space-y-3">
              {upcomingDeadlines.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate(item.linkType, item.id)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {item.type}
                    </span>
                    <span className="text-slate-400">
                      {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* C. Institutional Bulletins & Notifications */}
          <Card>
            <CardHeader
              title="Campus Bulletins"
              subtitle="Official announcements pushed by administration"
              icon={<Bell className="w-4 h-4 text-blue-500" />}
              action={
                <button
                  onClick={() => onNavigate('notifications')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  All →
                </button>
              }
            />
            <div className="space-y-3">
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => onNavigate('notifications', n.id)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
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
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
