import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Plus,
  Calendar,
  ExternalLink,
  Users,
  User,
  Trash2,
  CheckCircle2,
  Sparkles,
  Link2,
  Building,
  Send,
  FileText,
  Clock,
  Briefcase,
  AlertCircle,
  Eye,
  Check,
  ChevronRight,
  Filter,
  Search,
  RefreshCw,
  Flame,
  Rocket,
  CheckCircle,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { CompetitionItem, CompetitionType, CaseCompetition, CaseCompetitionApplication } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { EmptyState } from '../common/EmptyState';

interface CompetitionPortalProps {
  adminMode?: boolean;
}

export const CompetitionPortal: React.FC<CompetitionPortalProps> = ({ adminMode = false }) => {
  const { currentStudent } = useAuth();
  
  // Explicitly restrict administrative options: on student side (adminMode === false), isAdmin is strictly false!
  const isAdmin = adminMode;

  // Real-time dynamic state synchronized with store
  const [caseCompetitions, setCaseCompetitions] = useState<CaseCompetition[]>(() => store.getCaseCompetitions());
  const [allApplications, setAllApplications] = useState<CaseCompetitionApplication[]>(() => store.getCaseApplications());
  const [competitions, setCompetitions] = useState<CompetitionItem[]>(() => 
    currentStudent ? store.getCompetitions(currentStudent.id) : []
  );

  // Auto-sync status state
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('just now');
  const [autoUpdateNotice, setAutoUpdateNotice] = useState<string | null>(null);

  // Helper utilities for URL normalization and domain display
  const normalizeUrl = (url?: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const getHostName = (url?: string): string => {
    if (!url) return '';
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\//i, '').split('/')[0];
    }
  };

  // View tabs
  const [activeTab, setActiveTab] = useState<'case_competitions' | 'my_history'>('case_competitions');

  // Quick filters for case competitions
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterStage, setFilterStage] = useState<'all' | 'live' | 'upcoming' | 'applied'>('all');

  // Modals state
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [showPushCaseModal, setShowPushCaseModal] = useState(false);
  const [editingCaseCompetition, setEditingCaseCompetition] = useState<CaseCompetition | null>(null);
  const [selectedCaseToApply, setSelectedCaseToApply] = useState<CaseCompetition | null>(null);
  const [selectedCaseForApplicants, setSelectedCaseForApplicants] = useState<CaseCompetition | null>(null);
  const [viewingApplication, setViewingApplication] = useState<CaseCompetitionApplication | null>(null);

  // Student competition history form states
  const [eventName, setEventName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [type, setType] = useState<CompetitionType>('Case Competition');
  const [date, setDate] = useState('');
  const [teamOrIndividual, setTeamOrIndividual] = useState<'Team' | 'Individual'>('Team');
  const [result, setResult] = useState('Finalist');
  const [description, setDescription] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [skills, setSkills] = useState('');

  // Admin Push Case Competition form states (only accessible when adminMode is true)
  const [caseTitle, setCaseTitle] = useState('');
  const [caseOrganizer, setCaseOrganizer] = useState('');
  const [caseTheme, setCaseTheme] = useState('');
  const [caseBatches, setCaseBatches] = useState('2026-2028');
  const [casePrize, setCasePrize] = useState('');
  const [caseDeadline, setCaseDeadline] = useState('');
  const [caseStage, setCaseStage] = useState<'live' | 'upcoming'>('live');
  const [caseStartsAt, setCaseStartsAt] = useState('');
  const [caseGuidelines, setCaseGuidelines] = useState('');
  const [caseBriefUrl, setCaseBriefUrl] = useState('');
  const [caseRegistrationLink, setCaseRegistrationLink] = useState('');

  // Admin Edit Case Competition form states
  const [editTitle, setEditTitle] = useState('');
  const [editOrganizer, setEditOrganizer] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [editBatches, setEditBatches] = useState('');
  const [editPrize, setEditPrize] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editStage, setEditStage] = useState<'live' | 'upcoming'>('live');
  const [editStartsAt, setEditStartsAt] = useState('');
  const [editGuidelines, setEditGuidelines] = useState('');
  const [editBriefUrl, setEditBriefUrl] = useState('');
  const [editApplyUrl, setEditApplyUrl] = useState('');

  const openEditModal = (comp: CaseCompetition) => {
    setEditingCaseCompetition(comp);
    setEditTitle(comp.title);
    setEditOrganizer(comp.organizer);
    setEditTheme(comp.theme);
    setEditBatches(comp.eligible_batches?.join(', ') || '2026-2028');
    setEditPrize(comp.prize);
    setEditDeadline(comp.deadline);
    setEditStage(comp.stage === 'upcoming' ? 'upcoming' : 'live');
    setEditStartsAt(comp.starts_at || '');
    setEditGuidelines(comp.guidelines);
    setEditBriefUrl(comp.case_brief_url || '');
    setEditApplyUrl(comp.apply_url || comp.registration_link || '');
  };

  // Student Apply Form states
  const [applyTeamName, setApplyTeamName] = useState('');
  const [applyMembers, setApplyMembers] = useState('');
  const [applyPitchUrl, setApplyPitchUrl] = useState('');
  const [applySummary, setApplySummary] = useState('');

  // --- Automatic Synchronization & Real-Time Event Listener ---
  useEffect(() => {
    // Initial sync to ensure all live & upcoming catalog competitions are present
    const initSync = store.syncLiveAndUpcomingCaseCompetitions();
    setCaseCompetitions(store.getCaseCompetitions());
    setAllApplications(store.getCaseApplications());
    if (currentStudent) {
      setCompetitions(store.getCompetitions(currentStudent.id));
    }

    const refreshFromStore = () => {
      setCaseCompetitions(store.getCaseCompetitions());
      setAllApplications(store.getCaseApplications());
      if (currentStudent) {
        setCompetitions(store.getCompetitions(currentStudent.id));
      }
      setLastSyncedText('just now');
    };

    // Subscribe to store updates
    const unsubscribe = store.subscribeCaseCompetitions(refreshFromStore);

    // Cross-tab and window event listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'studenthub_case_competitions' || e.key === 'studenthub_case_applications') {
        refreshFromStore();
      }
    };

    window.addEventListener('case_competitions_updated', refreshFromStore);
    window.addEventListener('storage', handleStorage);

    // Automated live background poller: polls every 20 seconds to auto-update live & upcoming challenges
    const poller = setInterval(() => {
      const syncRes = store.syncLiveAndUpcomingCaseCompetitions();
      if (syncRes.added > 0) {
        refreshFromStore();
        setAutoUpdateNotice(`Auto-Update: ${syncRes.added} newly launched corporate competition(s) are now live or upcoming!`);
        setTimeout(() => setAutoUpdateNotice(null), 5000);
      }
    }, 20000);

    return () => {
      unsubscribe();
      window.removeEventListener('case_competitions_updated', refreshFromStore);
      window.removeEventListener('storage', handleStorage);
      clearInterval(poller);
    };
  }, [currentStudent?.id]);

  // Manual Trigger for Live Sync
  const handleManualSync = () => {
    setIsAutoSyncing(true);
    setTimeout(() => {
      const syncRes = store.syncLiveAndUpcomingCaseCompetitions();
      setCaseCompetitions(store.getCaseCompetitions());
      setAllApplications(store.getCaseApplications());
      setIsAutoSyncing(false);
      setLastSyncedText('just now');
      if (syncRes.added > 0) {
        setAutoUpdateNotice(`Live Feed Updated: ${syncRes.added} new corporate challenge(s) loaded.`);
      } else {
        setAutoUpdateNotice('All live and upcoming case competitions are up to date.');
      }
      setTimeout(() => setAutoUpdateNotice(null), 3500);
    }, 400);
  };

  // Handle student history add submit
  const handleAddHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !organizer.trim() || !currentStudent) return;

    store.addCompetition({
      student_id: currentStudent.id,
      competition_name: eventName.trim(),
      organizer: organizer.trim(),
      type,
      date: date || new Date().toISOString().split('T')[0],
      team_or_individual: teamOrIndividual,
      result,
      description,
      certificate_url: certificateUrl.trim() || undefined,
      skills_demonstrated: skills.split(',').map(s => s.trim()).filter(Boolean),
    });

    setShowAddHistoryModal(false);
    setEventName('');
    setOrganizer('');
    setDescription('');
    setCertificateUrl('');
    setSkills('');
  };

  const handleDeleteHistory = (id: string) => {
    if (confirm('Are you sure you want to remove this personal competition record?')) {
      store.deleteCompetition(id);
      if (currentStudent) {
        setCompetitions(store.getCompetitions(currentStudent.id));
      }
    }
  };

  // Handle Admin Push Case Competition submit (only executable in adminMode)
  const handlePushCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle.trim() || !caseOrganizer.trim() || !caseDeadline) return;

    const directApplyUrl = normalizeUrl(caseRegistrationLink);

    store.pushCaseCompetition({
      title: caseTitle.trim(),
      organizer: caseOrganizer.trim(),
      theme: caseTheme.trim() || 'General Strategy & Innovation',
      eligible_batches: caseBatches.split(',').map(b => b.trim()).filter(Boolean),
      prize: casePrize.trim() || 'Pre-Placement Interview (PPI) Opportunities',
      deadline: caseDeadline,
      stage: caseStage,
      starts_at: caseStartsAt.trim() || undefined,
      guidelines: caseGuidelines.trim() || 'Open for Indian Institute of Management Guwahati students.',
      case_brief_url: normalizeUrl(caseBriefUrl) || undefined,
      apply_url: directApplyUrl || undefined,
      registration_link: directApplyUrl || undefined,
      status: caseStage === 'upcoming' ? 'upcoming' : 'active',
      created_by_email: currentStudent?.institutional_email || 'placement@iimg.ac.in',
    });

    setShowPushCaseModal(false);
    setCaseTitle('');
    setCaseOrganizer('');
    setCaseTheme('');
    setCasePrize('');
    setCaseDeadline('');
    setCaseStartsAt('');
    setCaseGuidelines('');
    setCaseBriefUrl('');
    setCaseRegistrationLink('');
  };

  // Handle Admin Edit Case Competition submit
  const handleEditCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCaseCompetition || !editTitle.trim() || !editOrganizer.trim() || !editDeadline) return;

    const directApplyUrl = normalizeUrl(editApplyUrl);

    store.updateCaseCompetition(editingCaseCompetition.id, {
      title: editTitle.trim(),
      organizer: editOrganizer.trim(),
      theme: editTheme.trim() || 'General Strategy & Innovation',
      eligible_batches: editBatches.split(',').map(b => b.trim()).filter(Boolean),
      prize: editPrize.trim(),
      deadline: editDeadline,
      stage: editStage,
      starts_at: editStartsAt.trim() || undefined,
      guidelines: editGuidelines.trim(),
      case_brief_url: normalizeUrl(editBriefUrl) || undefined,
      apply_url: directApplyUrl || undefined,
      registration_link: directApplyUrl || undefined,
      status: editStage === 'upcoming' ? 'upcoming' : 'active',
    });

    setEditingCaseCompetition(null);
  };

  const handleDeleteCaseCompetition = (id: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this Case Competition from the institutional portal?')) {
      store.deleteCaseCompetition(id);
    }
  };

  // Handle Student Apply Submit
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseToApply || !currentStudent) return;
    if (!applyTeamName.trim()) return;

    store.applyToCaseCompetition({
      competition_id: selectedCaseToApply.id,
      student_id: currentStudent.id,
      student_name: currentStudent.full_name,
      student_roll: currentStudent.roll_number,
      student_email: currentStudent.institutional_email,
      student_batch: currentStudent.batch || '2026-2028',
      team_name: applyTeamName.trim(),
      team_members: applyMembers.trim() || `${currentStudent.full_name} (${currentStudent.roll_number})`,
      pitch_deck_url: applyPitchUrl.trim() || undefined,
      solution_summary: applySummary.trim() || undefined,
    });

    setSelectedCaseToApply(null);
    setApplyTeamName('');
    setApplyMembers('');
    setApplyPitchUrl('');
    setApplySummary('');
  };

  // Calculate live and upcoming counts
  const liveCount = caseCompetitions.filter(c => {
    const isPast = new Date(c.deadline) < new Date();
    return (c.stage === 'live' || (!c.stage && !isPast)) && c.status !== 'upcoming' && !isPast;
  }).length;

  const upcomingCount = caseCompetitions.filter(c => c.stage === 'upcoming' || c.status === 'upcoming').length;

  const myAppliedCount = currentStudent
    ? allApplications.filter(a => a.student_id === currentStudent.id).length
    : 0;

  // Filtered case competitions
  const filteredCaseCompetitions = caseCompetitions.filter(comp => {
    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.guidelines.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBatch =
      filterBatch === 'all' ||
      comp.eligible_batches.some(b => b.toLowerCase().includes(filterBatch.toLowerCase()));

    const deadlineDate = new Date(comp.deadline);
    const isPastDeadline = deadlineDate < new Date();
    const isLive = (comp.stage === 'live' || (!comp.stage && !isPastDeadline)) && comp.status !== 'upcoming';
    const isUpcoming = comp.stage === 'upcoming' || comp.status === 'upcoming';
    const studentApp = currentStudent
      ? allApplications.find(a => a.competition_id === comp.id && a.student_id === currentStudent.id)
      : undefined;

    let matchesStage = true;
    if (filterStage === 'live') {
      matchesStage = isLive && !isPastDeadline;
    } else if (filterStage === 'upcoming') {
      matchesStage = isUpcoming;
    } else if (filterStage === 'applied') {
      matchesStage = !!studentApp;
    }

    return matchesSearch && matchesBatch && matchesStage;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Auto-Update Notification Banner */}
      {autoUpdateNotice && (
        <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 rounded-xl text-xs text-purple-900 dark:text-purple-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-semibold">{autoUpdateNotice}</span>
          </div>
          <button
            onClick={() => setAutoUpdateNotice(null)}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAdmin ? 'Case Competitions Desk' : 'Corporate Case Competitions'}
            </h1>
            <Badge variant="purple" size="sm">
              Batch 2026–2028
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Push corporate challenges, set deadlines, and manage student team pitch deck submissions.'
              : 'Live and upcoming corporate B-school challenges automatically updated from Corporate Relations & Placement Cell.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* CRITICAL: ONLY ADMIN MODE SHOWS PUSH BUTTON - NEVER VISIBLE ON STUDENT SIDE */}
          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPushCaseModal(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Push Case Competition
            </Button>
          )}

          {/* Student option to record personal competition win */}
          {currentStudent && (
            <Button
              variant={isAdmin ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setShowAddHistoryModal(true)}
              leftIcon={<Award className="w-3.5 h-3.5" />}
            >
              Log Personal Win
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('case_competitions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'case_competitions'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{isAdmin ? 'Pushed Case Challenges' : 'Institutional Case Challenges'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
            {caseCompetitions.length}
          </span>
        </button>

        {currentStudent && (
          <button
            onClick={() => setActiveTab('my_history')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'my_history'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Tracked Honors &amp; Wins</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {competitions.length}
            </span>
          </button>
        )}
      </div>

      {/* TAB 1: CASE COMPETITIONS LIST */}
      {activeTab === 'case_competitions' && (
        <div className="space-y-4">
          {/* Live Feed Status Bar: Shows Automatic Updates for Live and Upcoming Competitions */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Live B-School Case Portal
              </span>
              <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
                • Automatically synchronizing live submissions and upcoming corporate announcements
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Auto-updated {lastSyncedText}
              </span>
              <button
                onClick={handleManualSync}
                disabled={isAutoSyncing}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-2xs"
                title="Force refresh live and upcoming challenges"
              >
                <RefreshCw className={`w-3 h-3 text-purple-600 dark:text-purple-400 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          {/* Quick Stage Filter Bar (All / Live Now / Upcoming / Applied) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStage('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStage === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              All Challenges ({caseCompetitions.length})
            </button>

            <button
              onClick={() => setFilterStage('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStage === 'live'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-50/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Live Submissions ({liveCount})</span>
            </button>

            <button
              onClick={() => setFilterStage('upcoming')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStage === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-50/50'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Upcoming Challenges ({upcomingCount})</span>
            </button>

            {currentStudent && (
              <button
                onClick={() => setFilterStage('applied')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStage === 'applied'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-50/50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>My Applications ({myAppliedCount})</span>
              </button>
            )}
          </div>

          {/* Search and Secondary Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search case challenge, company, or theme..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-purple-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Showing {filteredCaseCompetitions.length} of {caseCompetitions.length} corporate challenges
              </span>
              {/* Only shown if in admin mode */}
              {isAdmin && (
                <button
                  onClick={() => setShowPushCaseModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline ml-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Push Challenge
                </button>
              )}
            </div>
          </div>

          {/* Case Competitions Grid */}
          {filteredCaseCompetitions.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Trophy className="w-8 h-8 text-purple-400" />}
                title="No Case Competitions Found"
                description={
                  isAdmin
                    ? 'Publish a new case competition so students can view briefs and submit team solution decks.'
                    : 'No case competitions match your active filter. New corporate challenges are automatically updated as they go live or are scheduled by the placement cell.'
                }
                actionLabel={isAdmin ? 'Push New Case Competition' : undefined}
                onAction={isAdmin ? () => setShowPushCaseModal(true) : undefined}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCaseCompetitions.map(comp => {
                const compApps = allApplications.filter(a => a.competition_id === comp.id);
                const studentApp = currentStudent
                  ? allApplications.find(a => a.competition_id === comp.id && a.student_id === currentStudent.id)
                  : undefined;
                
                const deadlineDate = new Date(comp.deadline);
                const now = new Date();
                const isPastDeadline = deadlineDate < now;
                const daysRemaining = Math.max(0, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                const isUpcoming = comp.stage === 'upcoming' || comp.status === 'upcoming';
                const isLive = (comp.stage === 'live' || (!comp.stage && !isPastDeadline)) && !isUpcoming && !isPastDeadline;

                return (
                  <Card key={comp.id} className="flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-2xs">
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Live or Upcoming Badge */}
                            {isLive && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                LIVE NOW
                              </span>
                            )}

                            {isUpcoming && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                                <Rocket className="w-3 h-3 text-blue-600" />
                                UPCOMING
                              </span>
                            )}

                            {isPastDeadline && !isUpcoming && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                Closed
                              </span>
                            )}

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
                              {comp.organizer}
                            </span>

                            {comp.eligible_batches.map((b, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              >
                                {b}
                              </span>
                            ))}
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                            {comp.title}
                          </h3>
                        </div>

                        {/* Admin Action Controls (Edit & Delete) ONLY in admin mode */}
                        {isAdmin && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => openEditModal(comp)}
                              title="Edit Direct Apply Link & Details"
                              className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCaseCompetition(comp.id)}
                              title="Delete case competition"
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Theme and Guidelines */}
                      <div className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Theme:</span>
                          <span>{comp.theme}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {comp.guidelines}
                        </p>
                      </div>

                      {/* Prize / PPO Offerings */}
                      <div className="mt-3 p-2.5 bg-purple-50/70 dark:bg-purple-950/40 rounded-lg border border-purple-100 dark:border-purple-900/60 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <div className="text-xs">
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block">
                            Prize &amp; Career Incentive
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {comp.prize}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    {(() => {
                      const rawUrl = comp.apply_url || comp.registration_link || comp.case_brief_url || '';
                      const directApplyUrl = normalizeUrl(rawUrl);
                      const hasDirectLink = Boolean(directApplyUrl);
                      const directApplyHost = hasDirectLink ? getHostName(directApplyUrl) : '';

                      return (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                            <div className="flex items-center gap-1.5">
                              {isUpcoming ? (
                                <>
                                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                  <span>
                                    Opens: <strong className="text-slate-800 dark:text-slate-200">{comp.starts_at || 'Soon'}</strong>
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                                  <span>
                                    Deadline: <strong className="text-slate-800 dark:text-slate-200">{comp.deadline}</strong>
                                    {!isPastDeadline && (
                                      <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                        ({daysRemaining}d left)
                                      </span>
                                    )}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {comp.case_brief_url && (
                                <a
                                  href={comp.case_brief_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  <FileText className="w-3 h-3" /> Case Brief <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {hasDirectLink && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                  <Link2 className="w-3 h-3 text-purple-500" /> Host: <strong className="text-slate-700 dark:text-slate-300">{directApplyHost}</strong>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Application status / Action CTA */}
                          <div className="flex items-center justify-between gap-2">
                            {/* Left: Applicant count or Student's application status */}
                            <div>
                              {studentApp ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Applied ({studentApp.team_name})
                                  </span>
                                  <button
                                    onClick={() => setViewingApplication(studentApp)}
                                    className="text-[11px] font-semibold text-blue-600 hover:underline ml-1"
                                  >
                                    View Pitch →
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  <span className="text-[11px] text-slate-500">
                                    {compApps.length === 0
                                      ? isUpcoming ? 'Announced for Batch 2026-2028' : 'Direct application link'
                                      : `${compApps.length} student team${compApps.length > 1 ? 's' : ''} applied`}
                                  </span>
                                  {currentStudent && !isPastDeadline && (
                                    <button
                                      onClick={() => {
                                        setSelectedCaseToApply(comp);
                                        setApplyTeamName('');
                                        setApplyMembers(`${currentStudent.full_name} (${currentStudent.roll_number})`);
                                        setApplyPitchUrl('');
                                        setApplySummary('');
                                      }}
                                      className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline text-left mt-0.5"
                                    >
                                      Already applied? Track submission in portal →
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2">
                              {/* Applicants viewer ONLY in admin mode */}
                              {isAdmin && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setSelectedCaseForApplicants(comp)}
                                  leftIcon={<Eye className="w-3 h-3" />}
                                >
                                  Applicants ({compApps.length})
                                </Button>
                              )}

                              {/* Student Direct Application Link */}
                              {currentStudent && (
                                <div>
                                  {isPastDeadline ? (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                                      Closed
                                    </span>
                                  ) : hasDirectLink ? (
                                    <a
                                      href={directApplyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      id={`apply-challenge-${comp.id}`}
                                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 active:scale-95 text-white shadow-2xs transition-all hover:shadow-sm"
                                    >
                                      <span>{isUpcoming ? 'Pre-Register for Challenge' : 'Apply for Challenge'}</span>
                                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    </a>
                                  ) : (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedCaseToApply(comp);
                                        setApplyTeamName('');
                                        setApplyMembers(`${currentStudent.full_name} (${currentStudent.roll_number})`);
                                        setApplyPitchUrl('');
                                        setApplySummary('');
                                      }}
                                      leftIcon={<Send className="w-3.5 h-3.5" />}
                                      className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                      {isUpcoming ? 'Pre-Register Team' : 'Apply for Challenge'}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENT PERSONAL COMPETITION HISTORY */}
      {activeTab === 'my_history' && currentStudent && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="My Verified Competition History"
              subtitle="Demonstrated algorithmic, design, case study, and collaborative wins"
              icon={<Award className="w-4 h-4 text-amber-500" />}
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddHistoryModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Achievement
                </Button>
              }
            />

            {competitions.length === 0 ? (
              <EmptyState
                icon={<Trophy className="w-6 h-6" />}
                title="No Personal Competitions Logged"
                description="Record hackathon standings, case study honors, and national awards with verifiable proof links."
                actionLabel="Add First Record"
                onAction={() => setShowAddHistoryModal(true)}
              />
            ) : (
              <div className="space-y-3">
                {competitions.map(comp => (
                  <div
                    key={comp.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {comp.competition_name}
                          </h4>
                          <Badge
                            size="sm"
                            variant={
                              comp.result.toLowerCase().includes('winner')
                                ? 'amber'
                                : comp.result.toLowerCase().includes('runner') || comp.result.toLowerCase().includes('finalist')
                                ? 'blue'
                                : 'slate'
                            }
                          >
                            {comp.result}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {comp.organizer} • {new Date(comp.date).toLocaleDateString()} • {comp.type}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          {comp.team_or_individual === 'Team' ? (
                            <Users className="w-3.5 h-3.5" />
                          ) : (
                            <User className="w-3.5 h-3.5" />
                          )}
                          {comp.team_or_individual}
                        </span>

                        <button
                          onClick={() => handleDeleteHistory(comp.id)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {comp.description}
                    </p>

                    {comp.skills_demonstrated && comp.skills_demonstrated.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {comp.skills_demonstrated.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-mono"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}

                    {comp.certificate_url && (
                      <div className="pt-1">
                        <a
                          href={comp.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                        >
                          <Link2 className="w-3 h-3" /> View Verified Proof Document
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* MODAL 1: ADMIN PUSH NEW CASE COMPETITION - ONLY RENDERED IF isAdmin IS TRUE */}
      {isAdmin && showPushCaseModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowPushCaseModal(false)}
          title="Push New Case Competition"
          subtitle="Publish an official B-school challenge directly to student portals"
          maxWidth="lg"
        >
          <form onSubmit={handlePushCaseSubmit} className="space-y-4">
            <Input
              label="Competition Title"
              placeholder="e.g. Bain & Company BrAINWARS Consulting Challenge 2026"
              value={caseTitle}
              onChange={e => setCaseTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Host / Corporate Organizer"
                placeholder="e.g. Hindustan Unilever (HUL), Bain, McKinsey"
                value={caseOrganizer}
                onChange={e => setCaseOrganizer(e.target.value)}
                required
              />
              <Input
                label="Theme / Business Focus"
                placeholder="e.g. FMCG Brand Renaissance, Private Equity"
                value={caseTheme}
                onChange={e => setCaseTheme(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Competition Status / Stage"
                value={caseStage}
                onChange={e => setCaseStage(e.target.value as 'live' | 'upcoming')}
                options={[
                  { label: 'Live Now (Submissions Open)', value: 'live' },
                  { label: 'Upcoming (Announced / Starts Soon)', value: 'upcoming' },
                ]}
              />

              <Input
                label="Registration / Start Date (Optional)"
                type="date"
                value={caseStartsAt}
                onChange={e => setCaseStartsAt(e.target.value)}
              />

              <Input
                label="Application Deadline"
                type="date"
                value={caseDeadline}
                onChange={e => setCaseDeadline(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Eligible Batches (comma separated)"
                placeholder="2026-2028"
                value={caseBatches}
                onChange={e => setCaseBatches(e.target.value)}
                required
              />

              <Input
                label="Prize & Career Incentive"
                placeholder="e.g. ₹5,00,000 Cash Prize + Summer PPO / PPI Shortlists"
                value={casePrize}
                onChange={e => setCasePrize(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Guidelines & Submission Rules"
              placeholder="Specify team sizing, eligible specializations, number of rounds, format requirements..."
              rows={3}
              value={caseGuidelines}
              onChange={e => setCaseGuidelines(e.target.value)}
              required
            />

            <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200/70 dark:border-purple-800/60 space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  Direct Application Link for Students
                </span>
              </div>
              <Input
                label="Apply for Challenge Link (Direct Apply URL set by Admin)"
                placeholder="e.g. https://unstop.com/competitions/... or https://company.com/apply"
                value={caseRegistrationLink}
                onChange={e => setCaseRegistrationLink(e.target.value)}
                helperText="Students clicking 'Apply for Challenge' will immediately be directed to this link."
                required
              />
              <Input
                label="Case Brief / Problem Statement Deck URL (Optional)"
                placeholder="https://drive.google.com/..."
                value={caseBriefUrl}
                onChange={e => setCaseBriefUrl(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPushCaseModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                Publish &amp; Push to Students
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: ADMIN EDIT CASE COMPETITION & DIRECT APPLY LINK */}
      {isAdmin && editingCaseCompetition && (
        <Modal
          isOpen={true}
          onClose={() => setEditingCaseCompetition(null)}
          title="Edit Case Competition & Direct Apply Link"
          subtitle={`Updating: ${editingCaseCompetition.title}`}
          maxWidth="lg"
        >
          <form onSubmit={handleEditCaseSubmit} className="space-y-4">
            <Input
              label="Competition Title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Host / Corporate Organizer"
                value={editOrganizer}
                onChange={e => setEditOrganizer(e.target.value)}
                required
              />
              <Input
                label="Theme / Business Focus"
                value={editTheme}
                onChange={e => setEditTheme(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Competition Status / Stage"
                value={editStage}
                onChange={e => setEditStage(e.target.value as 'live' | 'upcoming')}
                options={[
                  { label: 'Live Now (Submissions Open)', value: 'live' },
                  { label: 'Upcoming (Announced / Starts Soon)', value: 'upcoming' },
                ]}
              />

              <Input
                label="Start / Launch Date"
                type="date"
                value={editStartsAt}
                onChange={e => setEditStartsAt(e.target.value)}
              />

              <Input
                label="Application Deadline"
                type="date"
                value={editDeadline}
                onChange={e => setEditDeadline(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Eligible Batches"
                value={editBatches}
                onChange={e => setEditBatches(e.target.value)}
                required
              />
              <Input
                label="Prize & Career Incentive"
                value={editPrize}
                onChange={e => setEditPrize(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Guidelines & Submission Rules"
              rows={3}
              value={editGuidelines}
              onChange={e => setEditGuidelines(e.target.value)}
              required
            />

            <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200/70 dark:border-purple-800/60 space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  Direct Apply Link for Students (Set by Admin)
                </span>
              </div>
              <Input
                label="Direct Apply URL"
                placeholder="https://unstop.com/competitions/... or corporate portal link"
                value={editApplyUrl}
                onChange={e => setEditApplyUrl(e.target.value)}
                helperText="Students clicking 'Apply for Challenge' will directly open this URL in a new tab."
                required
              />
              <Input
                label="Case Brief URL (Optional)"
                placeholder="https://drive.google.com/..."
                value={editBriefUrl}
                onChange={e => setEditBriefUrl(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingCaseCompetition(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                Save &amp; Update Link
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: STUDENT APPLY FOR CASE COMPETITION */}
      {selectedCaseToApply && currentStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCaseToApply(null)}
          title={`Apply: ${selectedCaseToApply.title}`}
          subtitle={`Organized by ${selectedCaseToApply.organizer} • Deadline: ${selectedCaseToApply.deadline}`}
          maxWidth="lg"
        >
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl border border-purple-200 dark:border-purple-800 text-xs">
              <div className="font-bold text-purple-900 dark:text-purple-200">
                Prize: {selectedCaseToApply.prize}
              </div>
              <p className="text-purple-700 dark:text-purple-300 mt-1 leading-normal">
                {selectedCaseToApply.guidelines}
              </p>
            </div>

            <Input
              label="Team Name"
              placeholder="e.g. Ace Consultants / The Strategy Collective"
              value={applyTeamName}
              onChange={e => setApplyTeamName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Team Leader (Primary Contact)"
                value={`${currentStudent.full_name} (${currentStudent.roll_number})`}
                disabled
              />
              <Input
                label="Leader Institutional Email"
                value={currentStudent.institutional_email}
                disabled
              />
            </div>

            <Textarea
              label="All Team Members (Names & Roll Numbers)"
              placeholder="e.g. Nikhil Sharma (CS2024042), Priya Patel (CS2024018), Rajesh Nair (CS2024029)"
              rows={2}
              value={applyMembers}
              onChange={e => setApplyMembers(e.target.value)}
              required
            />

            <Input
              label="Pitch Deck / Executive Summary Document URL"
              placeholder="https://drive.google.com/file/d/..."
              value={applyPitchUrl}
              onChange={e => setApplyPitchUrl(e.target.value)}
              required
            />

            <Textarea
              label="Executive Summary / Strategic Approach Note"
              placeholder="Summarize your key thesis, target market analysis, or solution value proposition..."
              rows={3}
              value={applySummary}
              onChange={e => setApplySummary(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedCaseToApply(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                Submit Team Application
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: ADMIN VIEW APPLICANTS - ONLY ACCESSIBLE IN ADMIN MODE */}
      {isAdmin && selectedCaseForApplicants && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCaseForApplicants(null)}
          title={`Registered Teams: ${selectedCaseForApplicants.title}`}
          subtitle={`${allApplications.filter(a => a.competition_id === selectedCaseForApplicants.id).length} student applications received`}
          maxWidth="xl"
        >
          <div className="space-y-4">
            {allApplications.filter(a => a.competition_id === selectedCaseForApplicants.id).length === 0 ? (
              <EmptyState
                icon={<Users className="w-6 h-6" />}
                title="No Applications Received Yet"
                description="Students from the eligible cohorts haven't submitted team applications for this case yet."
              />
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {allApplications.filter(a => a.competition_id === selectedCaseForApplicants.id).map(app => (
                  <div
                    key={app.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {app.team_name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'shortlisted'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                              : app.status === 'winner'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Leader: <strong className="text-slate-700 dark:text-slate-200">{app.student_name}</strong> ({app.student_roll}) • {app.student_email}
                        </div>
                      </div>

                      {/* Status changer */}
                      <select
                        value={app.status}
                        onChange={e => store.updateCaseApplicationStatus(app.id, e.target.value as any)}
                        className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="winner">Winner / Finalist</option>
                      </select>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Team Members: </span>
                      {app.team_members}
                    </div>

                    {app.solution_summary && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 leading-normal">
                        {app.solution_summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400">
                        Applied on: {new Date(app.applied_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      {app.pitch_deck_url && (
                        <a
                          href={app.pitch_deck_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Link2 className="w-3.5 h-3.5" /> View Pitch Deck / PDF <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setSelectedCaseForApplicants(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: VIEW STUDENT APPLICATION DETAILS */}
      {viewingApplication && (
        <Modal
          isOpen={true}
          onClose={() => setViewingApplication(null)}
          title={`My Application: ${viewingApplication.team_name}`}
          subtitle={`Submitted by ${viewingApplication.student_name} (${viewingApplication.student_roll})`}
          maxWidth="md"
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                  Status
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-200 capitalize">
                  {viewingApplication.status.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {new Date(viewingApplication.applied_at).toLocaleDateString()}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-500 block mb-1">Team Roster</span>
              <p className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-800 dark:text-slate-200">
                {viewingApplication.team_members}
              </p>
            </div>

            {viewingApplication.solution_summary && (
              <div>
                <span className="font-semibold text-slate-500 block mb-1">Executive Summary</span>
                <p className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-800 dark:text-slate-200 leading-normal">
                  {viewingApplication.solution_summary}
                </p>
              </div>
            )}

            {viewingApplication.pitch_deck_url && (
              <div>
                <span className="font-semibold text-slate-500 block mb-1">Submitted Solution Deck</span>
                <a
                  href={viewingApplication.pitch_deck_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
                >
                  <Link2 className="w-3.5 h-3.5" /> Open Pitch Deck Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setViewingApplication(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 5: ADD PERSONAL COMPETITION RECORD */}
      {showAddHistoryModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddHistoryModal(false)}
          title="Add Personal Competition or Hackathon Entry"
          subtitle="All entries appear on your verified student profile and institutional portfolio"
          maxWidth="lg"
        >
          <form onSubmit={handleAddHistorySubmit} className="space-y-4">
            <Input
              label="Event Name"
              placeholder="e.g. Smart India Hackathon 2026"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Organizing Body"
                placeholder="e.g. AICTE, IIM Ahmedabad, ACM"
                value={organizer}
                onChange={e => setOrganizer(e.target.value)}
                required
              />
              <Select
                label="Competition Type"
                value={type}
                onChange={e => setType(e.target.value as CompetitionType)}
                options={[
                  { label: 'Case Competition', value: 'Case Competition' },
                  { label: 'Hackathon', value: 'Hackathon' },
                  { label: 'Coding Contest', value: 'Coding Contest' },
                  { label: 'Research Symposium', value: 'Research' },
                  { label: 'Cultural / Sports', value: 'Cultural' },
                  { label: 'Other Contest', value: 'Other' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Event Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
              <Select
                label="Participation Mode"
                value={teamOrIndividual}
                onChange={e => setTeamOrIndividual(e.target.value as 'Team' | 'Individual')}
                options={[
                  { label: 'Team', value: 'Team' },
                  { label: 'Individual', value: 'Individual' },
                ]}
              />
              <Input
                label="Result / Standing"
                placeholder="e.g. Winner, Top 10, Finalist"
                value={result}
                onChange={e => setResult(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Description & Solution Overview"
              placeholder="Briefly describe what your team built or the problem solved..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Skills Demonstrated (Comma separated)"
                placeholder="Business Modeling, Financial Analysis, Go-To-Market"
                value={skills}
                onChange={e => setSkills(e.target.value)}
              />
              <Input
                label="Certificate / Proof Link"
                placeholder="https://drive.google.com/..."
                value={certificateUrl}
                onChange={e => setCertificateUrl(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddHistoryModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Competition Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
