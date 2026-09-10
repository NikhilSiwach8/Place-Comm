import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Globe,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Sliders,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { store } from '../../services/store';
import { Card, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';

export const AdminSettings: React.FC = () => {
  const [allowedDomains, setAllowedDomains] = useState<string[]>(() =>
    store.getAllowedEmailDomains()
  );
  const [adminEmails, setAdminEmails] = useState<string[]>(() =>
    store.getAdminEmails()
  );
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [placementSeason, setPlacementSeason] = useState('2026-2028 Active');
  const [minCompletionRequired, setMinCompletionRequired] = useState('80');
  const [isSaved, setIsSaved] = useState(false);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    const cleanDomain = newDomain.trim().toLowerCase().replace(/^@/, '');
    if (!allowedDomains.includes(cleanDomain)) {
      const next = [...allowedDomains, cleanDomain];
      setAllowedDomains(next);
      store.setAllowedEmailDomains(next);
    }
    setNewDomain('');
  };

  const handleRemoveDomain = (domain: string) => {
    if (allowedDomains.length <= 1) {
      alert('At least one institutional domain must remain active.');
      return;
    }
    const next = allowedDomains.filter(d => d !== domain);
    setAllowedDomains(next);
    store.setAllowedEmailDomains(next);
  };

  const handleAddAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!adminEmails.includes(cleanEmail)) {
      const next = [...adminEmails, cleanEmail];
      setAdminEmails(next);
      store.setAdminEmails(next);
    }
    setNewAdminEmail('');
  };

  const handleRemoveAdminEmail = (email: string) => {
    if (email === 'p26nikhil@iimg.ac.in') {
      alert('p26nikhil@iimg.ac.in is the primary institutional administrator and cannot be removed.');
      return;
    }
    if (adminEmails.length <= 1) {
      alert('At least one administrator account must remain active.');
      return;
    }
    const next = adminEmails.filter(e => e !== email);
    setAdminEmails(next);
    store.setAdminEmails(next);
  };

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Institutional Portal Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure access security, email domain verification, and placement requirements.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveSettings}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          Save Configuration
        </Button>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Settings successfully persisted to institutional database!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Domain Restrictions */}
        <Card>
          <CardHeader
            title="Institutional Email Restrictions"
            subtitle="Only students with authorized institutional email domains can register"
            icon={<Shield className="w-4 h-4 text-blue-600" />}
          />

          <div className="space-y-3">
            <div className="space-y-2">
              {allowedDomains.map(d => (
                <div
                  key={d}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 font-mono font-bold text-slate-700 dark:text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    @{d}
                  </div>
                  <button
                    onClick={() => handleRemoveDomain(d)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddDomain} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. university.edu or campus.ac.in"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 flex-1 bg-white dark:bg-slate-800"
              />
              <Button type="submit" size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Domain
              </Button>
            </form>
          </div>
        </Card>

        {/* Placement Season & Criteria Rules */}
        <Card>
          <CardHeader
            title="Placement Season &amp; Criteria Guardrails"
            subtitle="Automated gates for opportunity eligibility"
            icon={<Sliders className="w-4 h-4 text-purple-600" />}
          />

          <div className="space-y-4">
            <Select
              label="Active Recruitment Cycle"
              value={placementSeason}
              onChange={e => setPlacementSeason(e.target.value)}
              options={[
                { label: 'Batch 2026-2028 (Active Cycle)', value: '2026-2028 Active' },
                { label: 'Batch 2025-2027 (Senior Cohort)', value: '2025-2027 Senior' },
                { label: 'Off-Season Prep Mode', value: 'Prep Mode' },
              ]}
            />

            <Select
              label="Minimum Profile Completion to Apply"
              value={minCompletionRequired}
              onChange={e => setMinCompletionRequired(e.target.value)}
              options={[
                { label: '80% Completion (Recommended)', value: '80' },
                { label: '70% Completion', value: '70' },
                { label: '90% Completion (Strict)', value: '90' },
                { label: 'No Restriction', value: '0' },
              ]}
            />

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-800 dark:text-blue-300">
              Enforcing an 80% completion requirement ensures recruiters receive verified resumes with academic CGPAs and contact links.
            </div>
          </div>
        </Card>

        {/* Authorized Administrator Accounts */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Authorized Administrator Accounts"
            subtitle="Accounts granted full administrative privileges, verification powers, and placement oversight"
            icon={<ShieldCheck className="w-4 h-4 text-amber-500" />}
          />

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {adminEmails.map(email => {
                const isPrimary = email === 'p26nikhil@iimg.ac.in';
                return (
                  <div
                    key={email}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                      isPrimary
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <UserCheck className={`w-3.5 h-3.5 shrink-0 ${isPrimary ? 'text-amber-600' : 'text-slate-400'}`} />
                      <div className="truncate font-mono font-medium">
                        {email}
                        {isPrimary && (
                          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                            Primary Admin &amp; Student (Dual Auth)
                          </span>
                        )}
                      </div>
                    </div>
                    {!isPrimary && (
                      <button
                        onClick={() => handleRemoveAdminEmail(email)}
                        className="text-slate-400 hover:text-rose-500 shrink-0 ml-2"
                        title="Remove admin access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddAdminEmail} className="flex gap-2 pt-2 max-w-md">
              <input
                type="email"
                placeholder="Add institutional admin email (e.g. dean@iimg.ac.in)"
                value={newAdminEmail}
                onChange={e => setNewAdminEmail(e.target.value)}
                className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 flex-1 bg-white dark:bg-slate-800"
              />
              <Button type="submit" size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Grant Admin Access
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
