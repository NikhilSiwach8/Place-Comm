import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Filter,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { InstitutionalNotification, NotificationPriority } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { EmptyState } from '../common/EmptyState';

export const NotificationCenter: React.FC = () => {
  const { currentStudent } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

  const notifications = store.getNotifications();
  const readIds = store.getReadNotifications();

  const handleMarkAsRead = (id: string) => {
    store.markNotificationAsRead(id);
    // force re-render
    setSelectedPriority(prev => prev);
  };

  const handleMarkAllRead = () => {
    store.markAllNotificationsAsRead();
    // force re-render
    setSelectedPriority(prev => prev);
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || n.priority === selectedPriority;

    const isRead = readIds.includes(n.id);
    const matchesRead =
      readFilter === 'all' ||
      (readFilter === 'unread' && !isRead) ||
      (readFilter === 'read' && isRead);

    return matchesSearch && matchesCategory && matchesPriority && matchesRead;
  });

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Campus Bulletins &amp; Announcements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official alerts pushed by the Placement Cell, Dean’s Office, and Department Heads.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-3.5 h-3.5 text-blue-600" />}
          >
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <Input
            placeholder="Search circulars, subjects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div>
          <Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            options={[
              { label: 'All Categories', value: 'all' },
              { label: 'Placement & Drives', value: 'Placement' },
              { label: 'Academic Schedules', value: 'Academic' },
              { label: 'Events & Workshops', value: 'Event' },
              { label: 'Competitions & Hackathons', value: 'Competition' },
              { label: 'Document Verification', value: 'Verification' },
              { label: 'General Announcements', value: 'General' },
            ]}
          />
        </div>
        <div>
          <Select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            options={[
              { label: 'All Priorities', value: 'all' },
              { label: 'Urgent', value: 'Urgent' },
              { label: 'Important', value: 'Important' },
              { label: 'Normal', value: 'Normal' },
            ]}
          />
        </div>
        <div>
          <Select
            value={readFilter}
            onChange={e => setReadFilter(e.target.value as any)}
            options={[
              { label: 'All (Read & Unread)', value: 'all' },
              { label: 'Unread Only', value: 'unread' },
              { label: 'Read Only', value: 'read' },
            ]}
          />
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title="No Bulletins Found"
          description="You are fully up-to-date with all campus circulars and announcements."
        />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(n => {
            const isRead = readIds.includes(n.id);
            return (
              <Card
                key={n.id}
                className={`transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
                  !isRead ? 'border-l-4 border-l-blue-600 bg-blue-50/20 dark:bg-blue-950/10' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
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
                      {!isRead && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {n.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Published:{' '}
                        {new Date(n.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>
                        Target: {n.target_departments?.join(', ') || (n.target_audience?.type === 'department' && n.target_audience.value ? n.target_audience.value : 'All Departments')}
                      </span>
                      {n.action_url && (
                        <a
                          href={n.action_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          Official Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {!isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-xs font-semibold text-slate-500 hover:text-blue-600 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
