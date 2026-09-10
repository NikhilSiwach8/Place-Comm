import React, { useState } from 'react';
import {
  Award,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Eye,
  Download,
  Share2,
  Trash2,
  Plus,
  ShieldCheck,
  FileText,
  Tag,
  AlertCircle,
  Info,
  Layers,
  Hourglass,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { Certificate, CertificateType, VerificationStatus } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/Input';
import { EmptyState } from '../common/EmptyState';

export const CertificateManagement: React.FC = () => {
  const { currentStudent } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'waiting_line' | 'verified'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CertificateType>('professional_certification');
  const [newIssuer, setNewIssuer] = useState('');
  const [newIssueDate, setNewIssueDate] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newCredentialId, setNewCredentialId] = useState('');
  const [newVerificationUrl, setNewVerificationUrl] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newTags, setNewTags] = useState('');

  if (!currentStudent) return null;

  const certificates = store.getCertificates(currentStudent.id);
  const pendingCount = certificates.filter(c => c.verification_status === 'pending').length;
  const verifiedCount = certificates.filter(c => c.verification_status === 'verified').length;
  const rejectedCount = certificates.filter(c => c.verification_status === 'rejected').length;

  const filteredCerts = certificates.filter(cert => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuing_organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.credential_id && cert.credential_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || cert.type === selectedType;
    
    let matchesTab = true;
    if (activeTab === 'waiting_line') matchesTab = cert.verification_status === 'pending';
    if (activeTab === 'verified') matchesTab = cert.verification_status === 'verified';

    const matchesStatus = selectedStatus === 'all' || cert.verification_status === selectedStatus;

    return matchesSearch && matchesType && matchesTab && matchesStatus;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIssuer.trim()) return;

    store.addCertificate({
      student_id: currentStudent.id,
      title: newTitle.trim(),
      type: newType,
      issuing_organization: newIssuer.trim(),
      issue_date: newIssueDate || new Date().toISOString().split('T')[0],
      expiry_date: newExpiryDate || undefined,
      credential_id: newCredentialId.trim() || undefined,
      verification_url: newVerificationUrl.trim() || undefined,
      file_url: newFile ? URL.createObjectURL(newFile) : 'https://example.com/cert.pdf',
      tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });

    setShowUploadModal(false);
    setToastMessage(`"${newTitle.trim()}" has been submitted to the Admin Verification Waiting Line. An administrator will review and verify your document.`);
    setTimeout(() => setToastMessage(null), 5000);

    // Reset
    setNewTitle('');
    setNewIssuer('');
    setNewIssueDate('');
    setNewExpiryDate('');
    setNewCredentialId('');
    setNewVerificationUrl('');
    setNewFile(null);
    setNewTags('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this certificate from your student vault?')) {
      store.deleteCertificate(id);
    }
  };

  const handleShare = (cert: Certificate) => {
    const shareableUrl = `${window.location.origin}/verify/credential/${cert.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setShareSuccessId(cert.id);
    setTimeout(() => setShareSuccessId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start justify-between shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Queued in Waiting Line
              </p>
              <p className="text-xs mt-0.5">{toastMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-amber-600 hover:text-amber-800 text-xs font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Batch 2026-2028 Vault
            </span>
            {pendingCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                <Hourglass className="w-3 h-3 text-amber-600" />
                {pendingCount} in Waiting Line
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Certificates &amp; Verified Vault
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Uploaded credentials enter the verification waiting line and require administrative audit before final clearance.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowUploadModal(true)}
          leftIcon={<Upload className="w-3.5 h-3.5" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Waiting Line Protocol Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-slate-50 to-blue-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-blue-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Administrative Verification Waiting Line Protocol
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Whenever you upload any credential, internship letter, marksheet, or award, it automatically enters the <strong>Admin Verification Waiting Line</strong>. 
              The IIMG Placement &amp; Administration team verifies its legitimacy before issuing final institutional verification.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {pendingCount} Pending / {certificates.length} Total
            </div>
            <div className="text-[10px] text-slate-500">Waiting line queue status</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Documents ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab('waiting_line')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'waiting_line'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
        >
          <Hourglass className="w-3.5 h-3.5" />
          In Waiting Line ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'verified'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Officially Verified ({verifiedCount})
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search credentials, issuers, or IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div>
          <Select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            options={[
              { label: 'All Credential Types', value: 'all' },
              { label: 'Academic Certificates', value: 'academic' },
              { label: 'Professional Certifications', value: 'professional_certification' },
              { label: 'Internship Proofs', value: 'internship' },
              { label: 'Competition & Hackathon', value: 'competition' },
              { label: 'Course Completion', value: 'course_completion' },
              { label: 'Other Documents', value: 'other' },
            ]}
          />
        </div>
        <div>
          <Select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            options={[
              { label: 'All Verification Statuses', value: 'all' },
              { label: 'Verified by Placement Cell', value: 'verified' },
              { label: 'In Waiting Line (Pending)', value: 'pending' },
              { label: 'Action Needed / Rejected', value: 'rejected' },
            ]}
          />
        </div>
      </div>

      {/* Certificate Cards */}
      {filteredCerts.length === 0 ? (
        <EmptyState
          icon={<Award className="w-6 h-6" />}
          title={activeTab === 'waiting_line' ? "No Documents in Waiting Line" : "No Certificates Found"}
          description={
            activeTab === 'waiting_line'
              ? "All your uploaded documents have been verified or you haven't uploaded new ones yet."
              : "Upload your academic awards, certifications, and internship letters to place them into the verification waiting line."
          }
          actionLabel="Upload Document"
          onAction={() => setShowUploadModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map(cert => (
            <Card key={cert.id} className="flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
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
                    {cert.verification_status === 'verified' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {cert.verification_status === 'pending' && <Clock className="w-3 h-3 mr-1 animate-spin" />}
                    {cert.verification_status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {cert.verification_status === 'pending'
                      ? 'IN WAITING LINE'
                      : cert.verification_status === 'verified'
                      ? 'OFFICIALLY VERIFIED'
                      : 'REVISION NEEDED'}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {cert.issuing_organization}
                </p>

                {/* Waiting Line Explanatory Notice */}
                {cert.verification_status === 'pending' && (
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>In waiting line. Admins have been notified to inspect and verify before final upload clearance.</span>
                  </div>
                )}

                {cert.verification_status === 'verified' && (
                  <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Audited and certified by IIMG Placement &amp; Verification Cell.</span>
                  </div>
                )}

                <div className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                  <div className="flex justify-between">
                    <span>Issue Date:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
                  </div>
                  {cert.credential_id && (
                    <div className="flex justify-between">
                      <span>Credential ID:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {cert.credential_id}
                      </span>
                    </div>
                  )}
                  {cert.upload_date && (
                    <div className="flex justify-between text-[10px]">
                      <span>Uploaded On:</span>
                      <span>{new Date(cert.upload_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {cert.admin_notes && (
                    <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300">
                      <strong>Admin note:</strong> {cert.admin_notes}
                    </div>
                  )}
                </div>

                {cert.tags && cert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {cert.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    title="Preview Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {cert.verification_url && (
                    <a
                      href={cert.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      title="Verify at Issuer URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleShare(cert)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded relative"
                    title="Copy Verification Link"
                  >
                    <Share2 className="w-4 h-4" />
                    {shareSuccessId === cert.id && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        Copied Link!
                      </span>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded"
                  title="Remove from vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewCert && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewCert(null)}
          title={previewCert.title}
          subtitle={`Issued by ${previewCert.issuing_organization} • Status: ${previewCert.verification_status === 'pending' ? 'In Waiting Line (Pending Admin Review)' : previewCert.verification_status}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-8 bg-slate-100 dark:bg-slate-950 rounded-xl flex flex-col items-center justify-center text-center border border-slate-200 dark:border-slate-800">
              <Award className="w-16 h-16 text-blue-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {previewCert.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Issued by {previewCert.issuing_organization} on {new Date(previewCert.issue_date).toLocaleDateString()}
              </p>
              {previewCert.credential_id && (
                <div className="mt-2 text-xs font-mono bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-800">
                  ID: {previewCert.credential_id}
                </div>
              )}
              {previewCert.verification_status === 'pending' ? (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Currently in Waiting Line for Admin Verification
                </div>
              ) : (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Institutional Verified Credential
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              {previewCert.verification_url ? (
                <a
                  href={previewCert.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  Visit Official Verification Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div />
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (previewCert.file_url) {
                    const link = document.createElement('a');
                    link.href = previewCert.file_url;
                    link.download = `${previewCert.title.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf`;
                    link.target = '_blank';
                    link.click();
                  } else {
                    const blob = new Blob([`Institutional Verification Certificate\nTitle: ${previewCert.title}\nIssuer: ${previewCert.issuer}\nDate: ${previewCert.issue_date}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${previewCert.title.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.txt`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }
                }}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download File
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Certificate Modal */}
      {showUploadModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowUploadModal(false)}
          title="Upload Document to Verification Waiting Line"
          subtitle="All student uploads enter the waiting line to be verified by admins before final clearance"
          maxWidth="lg"
        >
          {/* Waiting line explanation banner inside modal */}
          <div className="p-3 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Verification Waiting Line Notice:</strong> As required by institutional placement policies, this upload will be placed in the <strong>Admin Waiting Line</strong>. Admins will review the document and issue institutional verification.
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <Input
              label="Document / Credential Title"
              placeholder="e.g. AWS Certified Solutions Architect / Semester Marksheet"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Category / Type"
                value={newType}
                onChange={e => setNewType(e.target.value as CertificateType)}
                options={[
                  { label: 'Professional Certification', value: 'professional_certification' },
                  { label: 'Academic Certificate / Marksheet', value: 'academic' },
                  { label: 'Internship Completion Letter', value: 'internship' },
                  { label: 'Competition & Hackathon', value: 'competition' },
                  { label: 'Extracurricular & Leadership', value: 'leadership' },
                  { label: 'Course Completion', value: 'course_completion' },
                  { label: 'Other Document', value: 'other' },
                ]}
              />
              <Input
                label="Issuing Organization / Authority"
                placeholder="e.g. Amazon Web Services, IIM Guwahati, Google"
                value={newIssuer}
                onChange={e => setNewIssuer(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Issue Date"
                type="date"
                value={newIssueDate}
                onChange={e => setNewIssueDate(e.target.value)}
                required
              />
              <Input
                label="Expiry Date (If applicable)"
                type="date"
                value={newExpiryDate}
                onChange={e => setNewExpiryDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Credential ID / Registration #"
                placeholder="e.g. AWS-PSA-98210 / IIMG-DOC-401"
                value={newCredentialId}
                onChange={e => setNewCredentialId(e.target.value)}
              />
              <Input
                label="Online Verification URL (Optional)"
                placeholder="https://credly.com/..."
                value={newVerificationUrl}
                onChange={e => setNewVerificationUrl(e.target.value)}
              />
            </div>

            <Input
              label="Tags (Comma separated)"
              placeholder="Cloud, DevOps, AWS, Solutions"
              value={newTags}
              onChange={e => setNewTags(e.target.value)}
            />

            {/* File Upload Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Upload Document Proof (PDF / PNG / JPG)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {newFile ? newFile.name : 'Select or drop your document proof (Max 15MB)'}
                </p>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  id="cert-file"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setNewFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="cert-file"
                  className="mt-3 inline-block px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 rounded-lg cursor-pointer hover:bg-blue-100"
                >
                  Choose Document
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Hourglass className="w-3.5 h-3.5" />}>
                Submit to Verification Waiting Line
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
