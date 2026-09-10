import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Bell,
  ShieldCheck,
  FileText,
  Sparkles,
  GraduationCap,
  Building2,
  HelpCircle,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { IIMGLogo } from '../common/IIMGLogo';

interface PlacementYetToArriveProps {
  onNavigate: (view: string, id?: string) => void;
  onSwitchToInternships?: () => void;
}

export const PlacementYetToArrive: React.FC<PlacementYetToArriveProps> = ({
  onNavigate,
  onSwitchToInternships,
}) => {
  const { currentStudent, role } = useAuth();
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(true);
  const [subscribedToast, setSubscribedToast] = useState(false);

  // Student readiness indicators
  const certs = currentStudent ? store.getCertificates(currentStudent.id) : [];
  const verifiedCertsCount = certs.filter(c => c.verification_status === 'verified').length;
  const isProfileComplete = Boolean(
    currentStudent?.full_name &&
    currentStudent?.email &&
    currentStudent?.department &&
    currentStudent?.cgpa
  );
  const hasResume = Boolean(currentStudent?.resume_url);

  const handleToggleAlert = () => {
    setIsAlertSubscribed(prev => !prev);
    setSubscribedToast(true);
    setTimeout(() => setSubscribedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Official Announcement Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />
                Status: Yet to Arrive
              </span>
              <span className="text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                Batch 2026-2028 Placement Season
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Campus Placement Drives Yet to Start
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Official full-time corporate recruitment drives have not commenced yet for this cohort. 
              The <strong className="text-white">Office of Placement &amp; Corporate Relations (IIMG)</strong> is 
              currently vetting corporate recruitment slots, company Job Descriptions (JDs), and finalizing 
              the Day 1 schedule.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {onSwitchToInternships && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSwitchToInternships}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                >
                  Explore Active Internships Instead
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('profile_edit')}
                className="text-slate-200 border-slate-600 hover:bg-slate-800"
                leftIcon={<FileText className="w-4 h-4" />}
              >
                Complete Placement Profile
              </Button>
            </div>
          </div>

          <div className="shrink-0 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center sm:w-60">
            <IIMGLogo variant="stacked" size="sm" showSubtitle={false} showTagline={false} interactive />
            <div className="mt-3 text-xs font-bold text-slate-200">
              IIMG Placement Cell
            </div>
            <div className="text-[11px] text-amber-300 font-medium mt-0.5">
              Pre-Placement Phase Active
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 w-full text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Estimated Kickoff
              </span>
              <div className="text-sm font-bold text-white mt-0.5">
                Phase 1 Window
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Roadmap & Readiness Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Placement Season Roadmap & Key Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Official Placement Roadmap &amp; Milestones"
              subtitle="Sequence of recruitment operations administered by IIMG Corporate Relations"
              icon={<Calendar className="w-4 h-4 text-blue-500" />}
            />

            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 pl-6 space-y-7 py-2">
              {/* Step 1: Active */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="emerald" size="sm">
                    In Progress • Active Now
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">Phase 0</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Student Credential Verification &amp; Resume Vault Auditing
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Students upload project portfolios, academic records, verified competitive honors, and transcripts. 
                  Placement coordinators audit all credentials to ensure recruiters receive 100% verified candidate profiles.
                </p>
              </div>

              {/* Step 2: Yet to Arrive */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="amber" size="sm">
                    Yet to Arrive
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">Phase 1</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Pre-Placement Talks (PPTs) &amp; Corporate JDs Publication
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Corporate partners publish official job descriptions, role eligibility criteria, compensation packages (CTC), 
                  and host interactive campus sessions.
                </p>
              </div>

              {/* Step 3: Yet to Arrive */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="slate" size="sm">
                    Yet to Arrive
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">Phase 2</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Slot 0 &amp; Day 1 On-Campus Placement Drives
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Online coding assessments, technical interviews, case studies, and executive leadership rounds. 
                  Shortlisted candidates receive institutional offer letters through the portal.
                </p>
              </div>

              {/* Step 4: Yet to Arrive */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="slate" size="sm">
                    Yet to Arrive
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">Phase 3</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Rolling Final Placement Windows &amp; Offer Ratification
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Subsequent recruitment slots for specialized domains, leadership tracks, international postings, 
                  and official signing of acceptance undertakings.
                </p>
              </div>
            </div>
          </Card>

          {/* Institutional Pre-Placement FAQ */}
          <Card>
            <CardHeader
              title="Frequently Asked Questions: Placement Drives"
              subtitle="Everything you need to know while the placement season is yet to arrive"
              icon={<HelpCircle className="w-4 h-4 text-indigo-500" />}
            />

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>When will the placement portal open for applications?</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  The placement window unlocks following the completion of student credential audits. 
                  Official notifications will be broadcasted to your institutional email and the Campus Bulletins tab.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Can I apply if my profile or certificates are not yet verified?</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  No. Corporate partners require verified student credentials. Profiles marked with pending or unverified 
                  transcripts cannot be nominated for Slot 0 and Day 1 shortlists.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Can I apply for campus internships while placements are pending?</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Yes! The <strong className="text-slate-800 dark:text-slate-200">Campus Internship Portal</strong> is fully 
                  active with live industrial projects and corporate research stints.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Readiness Checklist & Alerts */}
        <div className="space-y-6">
          {/* Readiness Checklist */}
          <Card>
            <CardHeader
              title="Pre-Placement Readiness"
              subtitle="Get certified before placement drives begin"
              icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
            />

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className={`mt-0.5 shrink-0 ${isProfileComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {isProfileComplete ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Institutional Academic Profile
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isProfileComplete ? 'Complete with CGPA & Department' : 'Incomplete academic profile'}
                  </div>
                </div>
                {!isProfileComplete && (
                  <button
                    onClick={() => onNavigate('profile_edit')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline shrink-0"
                  >
                    Edit →
                  </button>
                )}
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className={`mt-0.5 shrink-0 ${verifiedCertsCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {verifiedCertsCount > 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Verified Documents Vault
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {verifiedCertsCount} official certificate{verifiedCertsCount === 1 ? '' : 's'} verified by placement cell
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('certificates')}
                  className="text-[11px] font-semibold text-blue-600 hover:underline shrink-0"
                >
                  Vault →
                </button>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className={`mt-0.5 shrink-0 ${hasResume ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {hasResume ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Master Placement Resume
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {hasResume ? 'Uploaded and ready for recruiters' : 'Resume upload pending'}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('profile_edit')}
                  className="text-[11px] font-semibold text-blue-600 hover:underline shrink-0"
                >
                  Upload →
                </button>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    IIMG Placement Code of Conduct
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Institutional one-offer policy acknowledged
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => onNavigate('profile')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Review My Placement Profile
              </Button>
            </div>
          </Card>

          {/* Drive Notifications Subscription Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/80 dark:border-blue-900/60">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs mb-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Instant Drive Launch Alert
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Be the first to know when the Placement Season officially launches and company applications go live.
            </p>

            <button
              onClick={handleToggleAlert}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isAlertSubscribed
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {isAlertSubscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Subscribed for Placement Alerts
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" /> Notify Me When Drives Arrive
                </>
              )}
            </button>

            {subscribedToast && (
              <div className="mt-2 text-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                {isAlertSubscribed
                  ? '✓ You will receive instant notifications when placement drives open!'
                  : 'Subscription updated.'}
              </div>
            )}
          </Card>

          {/* Contact Placement Office */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              Office of Placement &amp; Corporate Relations
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 space-y-0.5">
              <div>Indian Institute of Management Guwahati</div>
              <div>Email: <a href="mailto:placement@iimg.ac.in" className="text-blue-600 hover:underline">placement@iimg.ac.in</a></div>
              <div>Location: Administrative Block, Floor 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
