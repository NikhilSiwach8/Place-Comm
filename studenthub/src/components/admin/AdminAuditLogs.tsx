import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock, Download } from 'lucide-react';
import { store } from '../../services/store';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';

export const AdminAuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const logs = store.getLogs();

  const filteredLogs = logs.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.action.toLowerCase().includes(term) ||
      l.details.toLowerCase().includes(term) ||
      l.user_email.toLowerCase().includes(term);

    const matchesAction = actionFilter === 'all' || l.action.toLowerCase().includes(actionFilter.toLowerCase());

    return matchesSearch && matchesAction;
  });

  const handleExportLogs = () => {
    const headers = ['Timestamp', 'Action', 'Performed By', 'Entity Type', 'Details'];
    const rows = filteredLogs.map(l => [
      l.created_at,
      `"${l.action}"`,
      l.user_email,
      l.entity_type,
      `"${l.details}"`
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csv);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Institutional Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable log of all administrative actions, student verifications, and security events.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportLogs}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Audit CSV
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search action, email, or details..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div>
          <Select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            options={[
              { label: 'All Actions', value: 'all' },
              { label: 'Certificates', value: 'certificate' },
              { label: 'Opportunities', value: 'opportunity' },
              { label: 'Verifications', value: 'verified' },
            ]}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Timestamp</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">Admin / User</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5 pr-5">Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 pl-5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                    {l.action}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                    {l.user_email}
                  </td>
                  <td className="p-3.5">
                    <Badge size="sm" variant="slate">
                      {l.entity_type}
                    </Badge>
                  </td>
                  <td className="p-3.5 pr-5 text-slate-600 dark:text-slate-300">
                    {l.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
