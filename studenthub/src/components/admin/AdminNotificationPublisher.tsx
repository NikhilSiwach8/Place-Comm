import React, { useState } from 'react';
import {
  Send,
  Bell,
  Trash2,
  Clock,
  ExternalLink,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { store } from '../../services/store';
import { InstitutionalNotification, NotificationCategory, NotificationPriority } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';

export const AdminNotificationPublisher: React.FC = () => {
  const [notifications, setNotifications] = useState<InstitutionalNotification[]>(() =>
    store.getNotifications()
  );
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('Placement');
  const [priority, setPriority] = useState<NotificationPriority>('Important');
  const [targetDept, setTargetDept] = useState('All');
  const [description, setDescription] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    store.addNotification({
      title: title.trim(),
      category,
      priority,
      target_departments: targetDept === 'All' ? ['All'] : [targetDept],
      target_batches: ['2026', '2027'],
      description: description.trim(),
      action_url: actionUrl.trim() || undefined,
    });

    setNotifications(store.getNotifications());
    setShowPublishModal(false);

    // reset
    setTitle('');
    setDescription('');
    setActionUrl('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this broadcast circular?')) {
      store.deleteNotification(id);
      setNotifications(store.getNotifications());
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Broadcast Circulars &amp; Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish institutional notices, exam schedules, and recruitment drive announcements.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowPublishModal(true)}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          Push Broadcast
        </Button>
      </div>

      {/* Published Notifications list */}
      <div className="space-y-4">
        {notifications.map(n => (
          <Card key={n.id}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </h3>
                  <Badge
                    size="sm"
                    variant={
                      n.priority === 'Urgent'
                        ? 'rose'
                        : n.priority === 'Important'
                        ? 'amber'
                        : 'blue'
                    }
                  >
                    {n.priority}
                  </Badge>
                  <Badge size="sm" variant="slate">
                    {n.category}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>
                    Target: {n.target_departments?.join(', ') || (n.target_audience?.type === 'department' && n.target_audience.value ? n.target_audience.value : 'All Departments')}
                  </span>
                  <span>Published: {new Date(n.created_at).toLocaleDateString()}</span>
                  {n.action_url && (
                    <a
                      href={n.action_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Linked URL <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(n.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded self-start"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowPublishModal(false)}
          title="Push Institutional Broadcast"
          subtitle="This announcement appears instantly in all targeted students' notification centers"
          maxWidth="md"
        >
          <form onSubmit={handlePublishSubmit} className="space-y-4">
            <Input
              label="Subject / Headline"
              placeholder="e.g. Mandatory Pre-Placement Talk: Amazon AWS"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Category"
                value={category}
                onChange={e => setCategory(e.target.value as NotificationCategory)}
                options={[
                  { label: 'Placement & Drives', value: 'Placement' },
                  { label: 'Academic Notice', value: 'Academic' },
                  { label: 'Events & Workshops', value: 'Event' },
                  { label: 'Competitions', value: 'Competition' },
                  { label: 'General Circular', value: 'General' },
                ]}
              />
              <Select
                label="Priority"
                value={priority}
                onChange={e => setPriority(e.target.value as NotificationPriority)}
                options={[
                  { label: 'Normal', value: 'Normal' },
                  { label: 'Important', value: 'Important' },
                  { label: 'Urgent', value: 'Urgent' },
                ]}
              />
              <Select
                label="Target Cohort"
                value={targetDept}
                onChange={e => setTargetDept(e.target.value)}
                options={[
                  { label: 'All Departments', value: 'All' },
                  { label: 'Computer Science', value: 'Computer Science & Engineering' },
                  { label: 'Information Tech', value: 'Information Technology' },
                ]}
              />
            </div>

            <Textarea
              label="Detailed Message Body"
              placeholder="Provide instructions, reporting venue, guidelines, or requirements..."
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />

            <Input
              label="Action Link (Google Meet, Portal URL, or Schedule link)"
              placeholder="https://..."
              value={actionUrl}
              onChange={e => setActionUrl(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPublishModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Dispatch Circular
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
