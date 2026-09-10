import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  DollarSign,
  Clock
} from 'lucide-react';
import { store } from '../../services/store';
import { Opportunity, OpportunityType, WorkMode, JobType } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';

export const AdminOpportunitiesManager: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => store.getOpportunities());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<OpportunityType>('internship');
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [workMode, setWorkMode] = useState<WorkMode>('On-site');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [stipend, setStipend] = useState('');
  const [duration, setDuration] = useState('');
  const [skills, setSkills] = useState('');
  const [deadline, setDeadline] = useState('');
  const [appUrl, setAppUrl] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const newOpp = store.addOpportunity({
      title: title.trim(),
      company: company.trim(),
      type,
      job_type: jobType,
      work_mode: workMode,
      location: location.trim() || 'Bangalore / Remote',
      description,
      requirements: ['Enrolled in final or pre-final year', 'Proficiency in primary stack'],
      required_skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      eligible_departments: ['Computer Science & Engineering', 'Information Technology'],
      eligible_batches: ['2026', '2027'],
      min_cgpa: minCgpa,
      stipend_or_salary: stipend.trim() || undefined,
      duration: duration.trim() || undefined,
      deadline: deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      application_url: appUrl.trim() || 'https://careers.google.com',
      status: 'active',
      tags: ['Campus Drive', 'Tech'],
    });

    setOpportunities(store.getOpportunities());
    setShowAddModal(false);

    // reset
    setTitle('');
    setCompany('');
    setDescription('');
    setStipend('');
    setSkills('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this campus drive listing?')) {
      store.deleteOpportunity(id);
      setOpportunities(store.getOpportunities());
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Placement &amp; Internship Drives
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Post, update, and manage recruitment opportunities published to student portals.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Post New Drive
        </Button>
      </div>

      {/* Placement Season Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
          <Clock className="w-4 h-4" />
        </div>
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">Placement Season Status:</span> Placement drives for the graduating cohort are marked as <strong>"Yet to Arrive"</strong> in the student portal. Students are actively viewing the placement preparation roadmap and readiness checklists, while internship drives remain live.
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map(opp => (
          <Card key={opp.id} className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {opp.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {opp.company} • {opp.location}
                  </div>
                </div>
                <Badge variant={opp.type === 'internship' ? 'emerald' : 'purple'} size="sm">
                  {opp.type.toUpperCase()}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="blue" size="sm">{opp.work_mode}</Badge>
                {opp.stipend_or_salary && <Badge variant="emerald" size="sm">{opp.stipend_or_salary}</Badge>}
                <Badge variant="slate" size="sm">Min CGPA {opp.min_cgpa}</Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {opp.description}
              </p>

              <div className="text-[11px] text-slate-400">
                Deadline: {new Date(opp.deadline).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <a
                href={opp.application_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                External Application Portal <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleDelete(opp.id)}
                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title="Create New Placement Opportunity"
          subtitle="This drive will be broadcast to all eligible enrolled students"
          maxWidth="lg"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Role Title"
                placeholder="e.g. Software Engineer (L3)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <Input
                label="Company Name"
                placeholder="e.g. Google India"
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Type"
                value={type}
                onChange={e => setType(e.target.value as OpportunityType)}
                options={[
                  { label: 'Internship', value: 'internship' },
                  { label: 'Full-Time Job', value: 'job' },
                ]}
              />
              <Select
                label="Work Mode"
                value={workMode}
                onChange={e => setWorkMode(e.target.value as WorkMode)}
                options={[
                  { label: 'On-site', value: 'On-site' },
                  { label: 'Hybrid', value: 'Hybrid' },
                  { label: 'Remote', value: 'Remote' },
                ]}
              />
              <Input
                label="Min CGPA Requirement"
                type="number"
                step="0.1"
                value={minCgpa.toString()}
                onChange={e => setMinCgpa(parseFloat(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Location"
                placeholder="Bangalore, Karnataka"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
              <Input
                label="Stipend / Package"
                placeholder="₹1,25,000 / month or ₹28 LPA"
                value={stipend}
                onChange={e => setStipend(e.target.value)}
              />
              <Input
                label="Duration (if internship)"
                placeholder="6 Months"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              />
            </div>

            <Textarea
              label="Job Description & Responsibilities"
              placeholder="Detail the engineering team, role expectations, and tech stack..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Required Skills (Comma separated)"
                placeholder="Go, Distributed Systems, Kubernetes, gRPC"
                value={skills}
                onChange={e => setSkills(e.target.value)}
              />
              <Input
                label="Application Deadline"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>

            <Input
              label="External Application Link (Company careers page / Form)"
              placeholder="https://careers.google.com/jobs/results/..."
              value={appUrl}
              onChange={e => setAppUrl(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Publish Opportunity
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
