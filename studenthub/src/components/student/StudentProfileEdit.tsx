import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { Card, CardHeader } from '../common/Card';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';

interface StudentProfileEditProps {
  onCancel: () => void;
  onSaved: () => void;
}

export const StudentProfileEdit: React.FC<StudentProfileEditProps> = ({ onCancel, onSaved }) => {
  const { currentStudent } = useAuth();

  if (!currentStudent) return null;

  const [formData, setFormData] = useState({
    full_name: currentStudent.full_name,
    phone: currentStudent.phone || '',
    career_objective: currentStudent.career_objective || '',
    cgpa: currentStudent.cgpa,
    graduation_year: currentStudent.graduation_year || 2028,
    batch: '2026-2028',
    linkedin_url: currentStudent.linkedin_url || '',
    github_url: currentStudent.github_url || '',
    portfolio_url: currentStudent.portfolio_url || '',
  });

  const [skills, setSkills] = useState<string[]>([...currentStudent.skills]);
  const [newSkill, setNewSkill] = useState('');
  const [tags, setTags] = useState<string[]>([...currentStudent.tags]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    store.updateStudentProfile(currentStudent.id, {
      ...formData,
      batch: '2026-2028',
      graduation_year: 2028,
      skills,
      tags,
    });

    setIsSubmitting(false);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Edit Student Profile
          </h2>
          <p className="text-xs text-slate-500">
            Keep your academic and contact details up-to-date for campus placements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Academic Details */}
        <Card className="space-y-4">
          <CardHeader title="General Information" />
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Batch
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Batch 2026-2028</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  IIMG Cohort
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="CGPA (out of 10)"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={formData.cgpa}
              onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="Graduation Year"
              type="number"
              value={formData.graduation_year}
              onChange={e => setFormData({ ...formData, graduation_year: parseInt(e.target.value) || 2028 })}
              required
            />
          </div>

          <Textarea
            label="Career Objective / Professional Summary"
            rows={3}
            placeholder="Summarize your technical strengths and career ambitions..."
            value={formData.career_objective}
            onChange={e => setFormData({ ...formData, career_objective: e.target.value })}
          />
        </Card>

        {/* Links & Skills */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <CardHeader title="Social & Portfolio Links" />
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin_url}
              onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
            />
            <Input
              label="GitHub Profile URL"
              placeholder="https://github.com/username"
              value={formData.github_url}
              onChange={e => setFormData({ ...formData, github_url: e.target.value })}
            />
            <Input
              label="Personal Portfolio / Website"
              placeholder="https://myportfolio.dev"
              value={formData.portfolio_url}
              onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
            />
          </Card>

          {/* Skills Management */}
          <Card className="space-y-4">
            <CardHeader title="Skills & Competencies" subtitle="Add tech stacks, frameworks, and domains" />
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Docker, TypeScript, PyTorch"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs border border-blue-200 dark:border-blue-900"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};
