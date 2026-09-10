import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Award,
  Briefcase,
  FolderGit2,
  Trophy,
  CheckCircle2,
  Edit,
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { StudentProfileEdit } from './StudentProfileEdit';

interface StudentProfileViewProps {
  onNavigate: (view: string) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ onNavigate }) => {
  const { currentStudent } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-500">Student record not loaded.</div>;
  }

  const educations = store.getEducations(currentStudent.id);
  const experiences = store.getExperiences(currentStudent.id);
  const projects = store.getProjects(currentStudent.id);
  const achievements = store.getAchievements(currentStudent.id);
  const competitions = store.getCompetitions(currentStudent.id);
  const certificates = store.getCertificates(currentStudent.id);
  const completion = store.calculateProfileCompletion(currentStudent.id);

  if (isEditing) {
    return <StudentProfileEdit onCancel={() => setIsEditing(false)} onSaved={() => setIsEditing(false)} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Card */}
      <Card className="relative overflow-hidden p-0">
        <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 w-full" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-lg shrink-0 overflow-hidden ring-4 ring-white dark:ring-slate-900">
              {currentStudent.avatar_url ? (
                <img
                  src={currentStudent.avatar_url}
                  alt={currentStudent.full_name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold rounded-xl">
                  {currentStudent.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {currentStudent.full_name}
                </h1>
                {currentStudent.is_profile_verified && (
                  <Badge variant="emerald" size="sm">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Institutional Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Roll No: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentStudent.student_id}</span> • {currentStudent.degree} in {currentStudent.department}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {currentStudent.tags.map((tag, i) => (
                  <Badge key={i} variant="blue" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid: Left Column Details, Right Column Academics & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Career Objective / Summary */}
          {currentStudent.career_objective && (
            <Card>
              <CardHeader
                title="Career Objective & Summary"
                icon={<User className="w-4 h-4 text-blue-500" />}
              />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStudent.career_objective}
              </p>
            </Card>
          )}

          {/* Technical & Professional Skills */}
          <Card>
            <CardHeader
              title="Skills & Competencies"
              icon={<Award className="w-4 h-4 text-indigo-500" />}
            />
            <div className="flex flex-wrap gap-2">
              {currentStudent.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Work Experience & Internships */}
          <Card>
            <CardHeader
              title="Experience & Internships"
              icon={<Briefcase className="w-4 h-4 text-emerald-500" />}
            />
            {experiences.length === 0 ? (
              <p className="text-xs text-slate-400">No professional experience listed yet.</p>
            ) : (
              <div className="space-y-4">
                {experiences.map(exp => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {exp.title}
                        </h4>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exp.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Technical Projects */}
          <Card>
            <CardHeader
              title="Key Projects"
              icon={<FolderGit2 className="w-4 h-4 text-purple-500" />}
            />
            {projects.length === 0 ? (
              <p className="text-xs text-slate-400">No project items added yet.</p>
            ) : (
              <div className="space-y-4">
                {projects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {proj.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {proj.github_url && (
                          <a
                            href={proj.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            title="GitHub"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.live_url && (
                          <a
                            href={proj.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-blue-600"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Academic Snapshot */}
          <Card>
            <CardHeader
              title="Academic Snapshot"
              icon={<GraduationCap className="w-4 h-4 text-blue-500" />}
            />
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Degree &amp; Program</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent.degree}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Academic Batch</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Batch 2026-2028</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Cumulative CGPA</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                  {currentStudent.cgpa} / 10.0
                </span>
              </div>
            </div>
          </Card>

          {/* Contact & Professional Links */}
          <Card>
            <CardHeader
              title="Contact & Web Identity"
              icon={<Globe className="w-4 h-4 text-slate-500" />}
            />
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{currentStudent.email}</span>
              </div>
              {currentStudent.phone && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentStudent.phone}</span>
                </div>
              )}
              {currentStudent.linkedin_url && (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Linkedin className="w-3.5 h-3.5" />
                  <a href={currentStudent.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    {currentStudent.linkedin_url}
                  </a>
                </div>
              )}
              {currentStudent.github_url && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Github className="w-3.5 h-3.5" />
                  <a href={currentStudent.github_url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    {currentStudent.github_url}
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
