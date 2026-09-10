import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Search,
  Filter,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { Opportunity, OpportunityType, ApplicationStatus } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/Input';
import { EmptyState } from '../common/EmptyState';
import { PlacementYetToArrive } from './PlacementYetToArrive';

interface OpportunityPortalProps {
  initialType?: OpportunityType;
  onNavigate: (view: string, id?: string) => void;
}

export const OpportunityPortal: React.FC<OpportunityPortalProps> = ({
  initialType = 'internship',
  onNavigate,
}) => {
  const { currentStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<OpportunityType>(initialType);
  const [searchTerm, setSearchTerm] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);

  // Track applied status modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<ApplicationStatus>('Applied');
  const [trackingNotes, setTrackingNotes] = useState<string>('');

  const opportunities = store.getOpportunities();
  const bookmarkedIds = currentStudent ? store.getBookmarkedOpportunities(currentStudent.id) : [];
  const applications = currentStudent ? store.getApplications(currentStudent.id) : [];

  const filteredOpportunities = opportunities.filter(opp => {
    if (opp.type !== activeTab) return false;

    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.required_skills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesWorkMode = workModeFilter === 'all' || opp.work_mode === workModeFilter;

    const oppDepts = opp.eligible_departments || (Array.isArray(opp.department) ? opp.department : (opp.department ? [opp.department as unknown as string] : ['All']));
    const matchesDepartment =
      departmentFilter === 'all' ||
      oppDepts.includes('All') ||
      oppDepts.includes(departmentFilter);

    // Eligibility check against current student's CGPA
    const meetsCGPA = !onlyEligible || !currentStudent || !opp.min_cgpa || currentStudent.cgpa >= opp.min_cgpa;

    return matchesSearch && matchesWorkMode && matchesDepartment && meetsCGPA;
  });

  const handleToggleBookmark = (oppId: string) => {
    if (!currentStudent) return;
    store.toggleBookmark(currentStudent.id, oppId);
    // force update state
    setTrackingStatus('Applied');
  };

  const handleSaveApplicationStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !selectedOpportunity) return;

    store.saveApplication({
      student_id: currentStudent.id,
      opportunity_id: selectedOpportunity.id,
      status: trackingStatus,
      applied_date: new Date().toISOString(),
      notes: trackingNotes,
    });

    setSelectedOpportunity(null);
    setTrackingNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeTab === 'internship' ? 'Campus Internships Portal' : 'Placement & Full-Time Job Drives'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'internship'
              ? 'Verified institutional internship opportunities with external application portals and criteria checks.'
              : 'Official recruitment portal for the graduating cohort. Drives are scheduled to arrive shortly.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('internship')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'internship'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Internships ({opportunities.filter(o => o.type === 'internship').length})
          </button>
          <button
            onClick={() => setActiveTab('job')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'job'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Placement Drives</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
              Yet to Arrive
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'job' ? (
        <PlacementYetToArrive
          onNavigate={onNavigate}
          onSwitchToInternships={() => setActiveTab('internship')}
        />
      ) : (
        <>
          {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search roles, companies, tech stacks, or locations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div>
          <Select
            value={workModeFilter}
            onChange={e => setWorkModeFilter(e.target.value)}
            options={[
              { label: 'All Work Modes', value: 'all' },
              { label: 'On-site', value: 'On-site' },
              { label: 'Hybrid', value: 'Hybrid' },
              { label: 'Remote', value: 'Remote' },
            ]}
          />
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={e => setOnlyEligible(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>Eligible for my CGPA ({currentStudent?.cgpa || '8.0'})</span>
          </label>
        </div>
      </div>

      {/* List of Opportunities */}
      {filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6" />}
          title="No Opportunities Found"
          description="Try broadening your search query or removing the CGPA eligibility filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map(opp => {
            const isBookmarked = bookmarkedIds.includes(opp.id);
            const userApp = applications.find(a => a.opportunity_id === opp.id);
            const isEligible = !currentStudent || currentStudent.cgpa >= opp.min_cgpa;

            return (
              <Card
                key={opp.id}
                className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                        {opp.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {opp.title}
                        </h3>
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <span>{opp.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-slate-500 font-normal">
                            <MapPin className="w-3 h-3" /> {opp.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(opp.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                          : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark Opportunity'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <Badge variant="blue" size="sm">
                      {opp.work_mode}
                    </Badge>
                    <Badge variant={opp.type === 'job' ? 'purple' : 'emerald'} size="sm">
                      {opp.job_type}
                    </Badge>
                    {opp.stipend_or_salary && (
                      <Badge variant="emerald" size="sm">
                        {opp.stipend_or_salary}
                      </Badge>
                    )}
                    {opp.duration && (
                      <Badge variant="slate" size="sm">
                        {opp.duration}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {opp.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(opp.required_skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Eligibility check box */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px] space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eligibility Criteria:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Min CGPA {opp.min_cgpa || 'Open'} • Batches: {(opp.eligible_batches || ['2026', '2027']).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Your Status:</span>
                      {isEligible ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Eligible (CGPA: {currentStudent?.cgpa || '8.85'})
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Below cutoff (Req: {opp.min_cgpa || 'N/A'})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Closes: {new Date(opp.deadline).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Track Application status button */}
                    <button
                      onClick={() => {
                        setSelectedOpportunity(opp);
                        if (userApp) {
                          setTrackingStatus(userApp.status);
                          setTrackingNotes(userApp.notes || '');
                        }
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold border transition-colors ${
                        userApp
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800'
                          : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {userApp ? `Status: ${userApp.status}` : 'Log Application'}
                    </button>

                    <a
                      href={opp.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
                    >
                      Apply <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* Track Application Modal */}
      {selectedOpportunity && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOpportunity(null)}
          title={`Application Tracking: ${selectedOpportunity.company}`}
          subtitle={selectedOpportunity.title}
          maxWidth="md"
        >
          <form onSubmit={handleSaveApplicationStatus} className="space-y-4">
            <Select
              label="Application Progress Status"
              value={trackingStatus}
              onChange={e => setTrackingStatus(e.target.value as ApplicationStatus)}
              options={[
                { label: 'Applied', value: 'Applied' },
                { label: 'Under Review', value: 'Under Review' },
                { label: 'Shortlisted for Interview', value: 'Shortlisted' },
                { label: 'Selected / Offer Received', value: 'Selected' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
            />

            <Input
              label="Interview / Follow-up Notes"
              placeholder="e.g. Round 1 Technical scheduled for next Tuesday"
              value={trackingNotes}
              onChange={e => setTrackingNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedOpportunity(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Application Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
