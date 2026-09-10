import React from 'react';
import {
  GraduationCap,
  Shield,
  FileCheck2,
  Award,
  Briefcase,
  Trophy,
  Bell,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import { Button } from '../common/Button';
import { IIMGLogo } from '../common/IIMGLogo';

interface LandingPageProps {
  onLoginClick: (role?: 'student' | 'admin') => void;
  onRegisterClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onRegisterClick,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IIMGLogo variant="horizontal" size="sm" interactive />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onLoginClick('student')}
              className="text-xs font-semibold px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Sign In
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={onRegisterClick}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Register Account
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent -z-10" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6">
            <IIMGLogo variant="stacked" size="xl" showSubtitle={true} showTagline={true} interactive={true} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Official Academic &amp; Placement Vault
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Your Academic &amp; Career Profile,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
              All in One Place.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The secure central platform for students to maintain verified academic credentials, manage project portfolios, store official certificates, and unlock campus placement opportunities.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onLoginClick('student')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Student Portal Sign In
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onRegisterClick}
            >
              Institutional Registration
            </Button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Placement officer or campus coordinator?{' '}
            <button
              onClick={() => onLoginClick('admin')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Sign in to Administrative Console &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Engineered for Enterprise Campus Success
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              An institutional solution built with privacy, role separation, and streamlined verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Secure Student Profiles',
                desc: 'Comprehensive personal, academic, and career records protected by strict Row Level Security (RLS).'
              },
              {
                icon: FileCheck2,
                title: 'Academic & Project Portfolio',
                desc: 'Structured showcase of engineering projects, GitHub repositories, coursework, and verified competencies.'
              },
              {
                icon: Award,
                title: 'Certificate Vault',
                desc: 'Upload, categorize, and preserve verified credentials, hackathon wins, and internship certificates.'
              },
              {
                icon: Briefcase,
                title: 'Internships & Jobs',
                desc: 'Curated corporate listings with eligibility matching, deadlines, stipend details, and one-click application links.'
              },
              {
                icon: Trophy,
                title: 'Honors & Competitions',
                desc: 'Chronicle hackathons, regional contests, and leadership achievements with verifiable proof links.'
              },
              {
                icon: Bell,
                title: 'Priority Announcements',
                desc: 'Receive urgent placement schedules, exam circulars, and campus drives targeted to your batch and department.'
              },
              {
                icon: Users,
                title: 'Admin Management',
                desc: 'Faculty and placement cells search students by skills, verify documentation, and monitor recruitment analytics.'
              },
              {
                icon: Lock,
                title: 'Strict Data Privacy',
                desc: 'Students never access other students’ private files. Verification audit logs ensure institutional compliance.'
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              How StudentHub Works
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              5 simple steps from institutional registration to recruitment success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Create Profile', desc: 'Sign in with your @iimg.ac.in institutional account.' },
              { step: '2', title: 'Upload Proofs', desc: 'Securely store degree proofs and verified certificates.' },
              { step: '3', title: 'Curate Projects', desc: 'Document internships, tech stacks, and academic initiatives.' },
              { step: '4', title: 'Discover Drives', desc: 'Browse verified company drives with active application links.' },
              { step: '5', title: 'Track Success', desc: 'Monitor application timelines and celebrate milestones.' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center relative shadow-2xs"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">
                  {step.step}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              StudentHub Platform
            </span>
            <span>— Indian Institute of Management Guwahati</span>
          </div>
          <div>
            Enterprise Institutional Placement &amp; Academic Management Portal.
          </div>
        </div>
      </footer>
    </div>
  );
};
