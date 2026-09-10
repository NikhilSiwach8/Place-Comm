import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Award,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Tag,
  Eye,
  ChevronRight,
  Sparkles,
  Hourglass,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { store } from '../../services/store';
import { StudentProfile, Certificate, VerificationStatus } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/Input';
import { EmptyState } from '../common/EmptyState';

interface AdminStudentDirectoryProps {
  selectedStudentId?: string;
  initialTab?: 'directory' | 'waiting_line';
}

export const AdminStudentDirectory: React.FC<AdminStudentDirectoryProps> = ({
  selectedStudentId,
  initialTab = 'directory',
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'waiting_line'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);

  // Waiting Line Specific Filters
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [docStatusFilter, setDocStatusFilter] = useState('pending');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Force re-render on mutation
  const [, setTick] = useState(0);
  const triggerRefresh = () => setTick(t => t + 1);

  // Active student detail drawer/modal
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(() => {
    if (selectedStudentId) {
      return store.getStudentById(selectedStudentId) || null;
    }
    return null;
  });

  // Verification dialog
  const [verifyingItem, setVerifyingItem] = useState<{
    studentId: string;
    studentName: string;
    cert: Certificate;
  } | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [newAdminTag, setNewAdminTag] = useState('');

  const students = store.getAllStudents();
  const allPendingDocs = store.getAllPendingDocuments();
  const allDocs = store.getAllDocuments();

  const filteredStudents = students.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.full_name.toLowerCase().includes(term) ||
      s.student_id.toLowerCase().includes(term) ||
      s.skills.some(sk => sk.toLowerCase().includes(term));

    const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
    const matchesBatch = batchFilter === 'all' || s.batch === batchFilter;
    const matchesVerif =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && s.is_profile_verified) ||
      (verificationFilter === 'unverified' && !s.is_profile_verified);
    const matchesCgpa = s.cgpa >= minCgpaFilter;

    return matchesSearch && matchesDept && matchesBatch && matchesVerif && matchesCgpa;
  });

  const filteredDocs = allDocs.filter(d => {
    const term = docSearchTerm.toLowerCase();
    const matchesSearch =
      d.title.toLowerCase().includes(term) ||
      d.student_name.toLowerCase().includes(term) ||
      d.student_roll.toLowerCase().includes(term) ||
      d.issuing_organization.toLowerCase().includes(term);

    const matchesType = docTypeFilter === 'all' || d.type === docTypeFilter;
    const matchesStatus = docStatusFilter === 'all' || d.verification_status === docStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleToggleProfileVerification = (studentId: string, currentStatus: boolean) => {
    store.verifyStudentProfile(studentId, !currentStatus);
    if (activeStudent && activeStudent.id === studentId) {
      setActiveStudent({ ...activeStudent, is_profile_verified: !currentStatus });
    }
    triggerRefresh();
  };

  const handleCertificateDecision = (status: VerificationStatus) => {
    if (!verifyingItem) return;

    store.verifyCertificate(
      verifyingItem.studentId,
      verifyingItem.cert.id,
      status,
      verificationNotes || (status === 'verified' ? 'Approved by Placement Cell' : 'Requires correction')
    );

    const title = verifyingItem.cert.title;
    const student = verifyingItem.studentName;
    setVerifyingItem(null);
    setVerificationNotes('');

    if (activeStudent && activeStudent.id === verifyingItem.studentId) {
      setActiveStudent(store.getStudentById(activeStudent.id) || null);
    }
    triggerRefresh();

    setActionSuccessMessage(`Document "${title}" for ${student} marked as ${status.toUpperCase()}.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleQuickApprove = (studentId: string, studentName: string, cert: Certificate) => {
    store.verifyCertificate(studentId, cert.id, 'verified', 'Directly approved by Placement Administrator');
    triggerRefresh();
    setActionSuccessMessage(`Approved & verified "${cert.title}" for ${studentName}. Document is now finalized.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent || !newAdminTag.trim()) return;

    const updatedTags = Array.from(new Set([...activeStudent.tags, newAdminTag.trim()]));
    store.updateStudentProfile(activeStudent.id, { tags: updatedTags });
    setActiveStudent({ ...activeStudent, tags: updatedTags });
    setNewAdminTag('');
    triggerRefresh();
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeStudent) return;
    const updatedTags = activeStudent.tags.filter(t => t !== tagToRemove);
    store.updateStudentProfile(activeStudent.id, { tags: updatedTags });
    setActiveStudent({ ...activeStudent, tags: updatedTags });
    triggerRefresh();
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Email', 'Department', 'Degree', 'Batch', 'CGPA', 'Verified', 'Tags'];
    const rows = filteredStudents.map(s => [
      s.student_id,
      `"${s.full_name}"`,
      s.email,
      `"${s.department}"`,
      s.degree,
      s.batch,
      s.cgpa,
      s.is_profile_verified ? 'Yes' : 'No',
      `"${(s.tags || []).join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_directory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast message banner */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Student Directory &amp; Verification
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-900">
              Batch 2026-2028
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional student records, skill auditing, and credential verification waiting line.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'directory' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV ({filteredStudents.length})
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Profiles</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'directory'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('waiting_line')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'waiting_line'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Hourglass className="w-3.5 h-3.5" />
          <span>Document Verification Waiting Line</span>
          {allPendingDocs.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold animate-pulse ${
                activeTab === 'waiting_line'
                  ? 'bg-amber-800 text-amber-100'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {allPendingDocs.length} waiting
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: STUDENT DIRECTORY */}
      {activeTab === 'directory' && (
        <>
          {/* Filtering Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search by student name, roll no, or skill..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div>
              <Select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                options={[
                  { label: 'All Departments', value: 'all' },
                  { label: 'Computer Science', value: 'Computer Science & Engineering' },
                  { label: 'Information Tech', value: 'Information Technology' },
                  { label: 'Management Studies', value: 'Management Studies' },
                ]}
              />
            </div>

            <div>
              <Select
                value={verificationFilter}
                onChange={e => setVerificationFilter(e.target.value)}
                options={[
                  { label: 'All Verifications', value: 'all' },
                  { label: 'Verified Profiles', value: 'verified' },
                  { label: 'Unverified Profiles', value: 'unverified' },
                ]}
              />
            </div>

            <div>
              <Select
                value={minCgpaFilter.toString()}
                onChange={e => setMinCgpaFilter(parseFloat(e.target.value))}
                options={[
                  { label: 'Any CGPA', value: '0' },
                  { label: 'CGPA ≥ 7.0', value: '7.0' },
                  { label: 'CGPA ≥ 8.0', value: '8.0' },
                  { label: 'CGPA ≥ 9.0', value: '9.0' },
                ]}
              />
            </div>
          </div>

          {/* Directory Table */}
          {filteredStudents.length === 0 ? (
            <EmptyState
              icon={<Users className="w-6 h-6" />}
              title="No Students Matched"
              description="Try broadening your department, batch, or CGPA cutoff filter criteria."
            />
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5 pl-5">Student</th>
                      <th className="p-3.5">Roll No</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">CGPA</th>
                      <th className="p-3.5">Batch</th>
                      <th className="p-3.5">Verification</th>
                      <th className="p-3.5">Tags</th>
                      <th className="p-3.5 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map(student => (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                        onClick={() => setActiveStudent(student)}
                      >
                        <td className="p-3.5 pl-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                              {student.avatar_url ? (
                                <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                              ) : (
                                student.full_name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {student.full_name}
                              </div>
                              <div className="text-[10px] text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                          {student.student_id}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">
                          {student.department}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          {student.cgpa}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                          {student.batch || '2026-2028'}
                        </td>
                        <td className="p-3.5">
                          {student.is_profile_verified ? (
                            <Badge variant="emerald" size="sm">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="slate" size="sm">
                              Unverified
                            </Badge>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {student.tags.slice(0, 2).map((t, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px]"
                              >
                                {t}
                              </span>
                            ))}
                            {student.tags.length > 2 && (
                              <span className="text-[10px] text-slate-400">+{student.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              setActiveStudent(student);
                            }}
                          >
                            Inspect <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* TAB 2: DOCUMENT VERIFICATION WAITING LINE */}
      {activeTab === 'waiting_line' && (
        <div className="space-y-6">
          {/* Waiting Line Info Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Hourglass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Institutional Document Verification Queue
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                    {allPendingDocs.length} Pending
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Students cannot publish unverified documents to their official placement credentials. All uploaded documents land in this waiting line for administrative verification and sign-off.
                </p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search by student name, roll number, or document title..."
                value={docSearchTerm}
                onChange={e => setDocSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div>
              <Select
                value={docTypeFilter}
                onChange={e => setDocTypeFilter(e.target.value)}
                options={[
                  { label: 'All Document Types', value: 'all' },
                  { label: 'Academic Certificates', value: 'academic' },
                  { label: 'Professional Certifications', value: 'professional_certification' },
                  { label: 'Internship Proofs', value: 'internship' },
                  { label: 'Competition & Hackathons', value: 'competition' },
                  { label: 'Course Completion', value: 'course_completion' },
                ]}
              />
            </div>
            <div>
              <Select
                value={docStatusFilter}
                onChange={e => setDocStatusFilter(e.target.value)}
                options={[
                  { label: 'In Waiting Line (Pending)', value: 'pending' },
                  { label: 'Verified & Approved', value: 'verified' },
                  { label: 'Rejected / Needs Revision', value: 'rejected' },
                  { label: 'All Verification States', value: 'all' },
                ]}
              />
            </div>
          </div>

          {/* Waiting Line Document Cards */}
          {filteredDocs.length === 0 ? (
            <EmptyState
              icon={<Award className="w-8 h-8 text-amber-500" />}
              title={docStatusFilter === 'pending' ? "Waiting Line is Clear!" : "No Documents Found"}
              description={
                docStatusFilter === 'pending'
                  ? "All student uploaded credentials have been reviewed and verified by the administration."
                  : "No documents match your current search and category filters."
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map(doc => {
                const isPending = doc.verification_status === 'pending';
                const isVerified = doc.verification_status === 'verified';
                const isRejected = doc.verification_status === 'rejected';

                return (
                  <Card
                    key={doc.id}
                    className={`flex flex-col justify-between transition-all ${
                      isPending
                        ? 'border-amber-200 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                        : isVerified
                        ? 'border-emerald-200 dark:border-emerald-800/40'
                        : 'border-rose-200 dark:border-rose-800/40'
                    }`}
                  >
                    <div>
                      {/* Top status & Student Info */}
                      <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {doc.student_name}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {doc.student_roll}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {doc.student_dept} • Batch {doc.student_batch || '2026-2028'}
                          </div>
                        </div>

                        <Badge
                          size="sm"
                          variant={isVerified ? 'emerald' : isRejected ? 'rose' : 'amber'}
                        >
                          {isVerified && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {isPending && <Hourglass className="w-3 h-3 mr-1 animate-spin" />}
                          {isRejected && <XCircle className="w-3 h-3 mr-1" />}
                          {isPending ? 'IN WAITING LINE' : doc.verification_status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Document Details */}
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {doc.title}
                          </h4>
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {doc.issuing_organization}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <span>
                            Type: <strong className="text-slate-700 dark:text-slate-300 capitalize">{doc.type.replace('_', ' ')}</strong>
                          </span>
                          <span>
                            Issue Date: <strong className="text-slate-700 dark:text-slate-300">{doc.issue_date}</strong>
                          </span>
                          {doc.credential_id && (
                            <span>
                              ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{doc.credential_id}</strong>
                            </span>
                          )}
                        </div>

                        {doc.verification_url && (
                          <div className="pt-1">
                            <a
                              href={doc.verification_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              Verify via Issuer Database <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {doc.admin_notes && (
                          <div className="mt-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                            <strong>Admin Note:</strong> {doc.admin_notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setVerifyingItem({
                            studentId: doc.student_id,
                            studentName: doc.student_name,
                            cert: doc,
                          })
                        }
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Audit &amp; Review
                      </Button>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setVerifyingItem({
                                  studentId: doc.student_id,
                                  studentName: doc.student_name,
                                  cert: doc,
                                });
                              }}
                              className="text-xs text-rose-600 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            >
                              Reject
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleQuickApprove(doc.student_id, doc.student_name, doc)}
                              leftIcon={<Check className="w-3.5 h-3.5" />}
                            >
                              Approve &amp; Verify
                            </Button>
                          </>
                        )}
                        {isVerified && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published to Vault
                          </span>
                        )}
                        {isRejected && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuickApprove(doc.student_id, doc.student_name, doc)}
                          >
                            Re-Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Student Details Inspection Modal */}
      {activeStudent && (
        <Modal
          isOpen={true}
          onClose={() => setActiveStudent(null)}
          title={activeStudent.full_name}
          subtitle={`Roll: ${activeStudent.student_id} • ${activeStudent.department} • Batch: ${activeStudent.batch || '2026-2028'} • CGPA: ${activeStudent.cgpa}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Verification Status Banner */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Institutional Profile Verification
                </span>
                <p className="text-[11px] text-slate-500">
                  {activeStudent.is_profile_verified
                    ? 'Student profile is officially verified by placement administration.'
                    : 'Profile has not yet been audited for placement shortlisting.'}
                </p>
              </div>
              <Button
                size="sm"
                variant={activeStudent.is_profile_verified ? 'danger' : 'success'}
                onClick={() =>
                  handleToggleProfileVerification(activeStudent.id, activeStudent.is_profile_verified)
                }
              >
                {activeStudent.is_profile_verified ? 'Revoke Verification' : 'Verify Student Profile'}
              </Button>
            </div>

            {/* Admin Tags */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Placement Tags &amp; Cohort Flags
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {activeStudent.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs border border-blue-200 dark:border-blue-900"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-rose-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Placed - Microsoft, Shortlisted, Placement Ready"
                  value={newAdminTag}
                  onChange={e => setNewAdminTag(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <Button type="submit" size="sm" variant="secondary">
                  Add Tag
                </Button>
              </form>
            </div>

            {/* Certificates & Vault proofs for this student */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Credentials &amp; Certificates ({store.getCertificates(activeStudent.id).length})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {store.getCertificates(activeStudent.id).map(cert => (
                  <div
                    key={cert.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {cert.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {cert.issuing_organization} • ID: {cert.credential_id || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                        {cert.verification_status === 'pending' ? 'In Waiting Line' : cert.verification_status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setVerifyingItem({
                            studentId: activeStudent.id,
                            studentName: activeStudent.full_name,
                            cert,
                          })
                        }
                      >
                        Audit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Certificate Verification Audit Modal */}
      {verifyingItem && (
        <Modal
          isOpen={true}
          onClose={() => setVerifyingItem(null)}
          title={`Audit: ${verifyingItem.cert.title}`}
          subtitle={`Student: ${verifyingItem.studentName} • Issuing Org: ${verifyingItem.cert.issuing_organization}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>
                <strong>Student:</strong> {verifyingItem.studentName}
              </div>
              <div>
                <strong>Issue Date:</strong> {verifyingItem.cert.issue_date}
              </div>
              {verifyingItem.cert.credential_id && (
                <div>
                  <strong>Credential ID:</strong> {verifyingItem.cert.credential_id}
                </div>
              )}
              {verifyingItem.cert.verification_url && (
                <div>
                  <strong>Official Verification URL:</strong>{' '}
                  <a
                    href={verifyingItem.cert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline inline-flex items-center gap-1"
                  >
                    {verifyingItem.cert.verification_url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <Textarea
              label="Verification Notes & Feedback to Student"
              placeholder="e.g. Verified against Credly certification portal. Approved for Placement Vault."
              value={verificationNotes}
              onChange={e => setVerificationNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleCertificateDecision('rejected')}
              >
                Reject Proof
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleCertificateDecision('verified')}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Approve &amp; Finalize
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
