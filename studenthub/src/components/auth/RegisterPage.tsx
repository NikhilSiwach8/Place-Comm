import React, { useState } from 'react';
import { Mail, Lock, User, Hash, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { store } from '../../services/store';
import { IIMGLogo } from '../common/IIMGLogo';

interface RegisterPageProps {
  onLoginClick: () => void;
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onLoginClick,
  onSuccess,
  onBackToLanding,
}) => {
  const { register } = useAuth();
  const settings = store.getSettings();

  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [batch, setBatch] = useState('2026-2028');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !studentId || !email || !password) {
      setError('Please fill out all mandatory fields.');
      return;
    }

    const domain = email.trim().toLowerCase().split('@')[1];
    const isAllowed = settings.allowed_email_domains.some(d => d.toLowerCase() === domain);

    if (!isAllowed) {
      setError(
        `Registration restricted: "${domain || 'entered email'}" is not an authorized domain. You must use your assigned institutional email ending in @${settings.allowed_email_domains[0] || 'iimg.ac.in'}.`
      );
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      email,
      password,
      fullName,
      studentId,
      department: 'Management Studies',
      batch,
      degree: 'MBA'
    });
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Failed to complete registration.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={onBackToLanding}
          className="inline-block cursor-pointer mb-4 hover:opacity-95 transition-opacity"
          title="IIM Guwahati Home"
        >
          <IIMGLogo variant="stacked" size="xl" showSubtitle={true} showTagline={true} interactive={true} />
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create your student profile
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
          Enrolled students must register with their institutional email (@{(settings?.allowed_email_domains || ['iimg.ac.in', 'institution.edu']).join(', @')})
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Aniket Verma"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Student Roll / ID"
                placeholder="e.g. CS2023098"
                value={studentId}
                onChange={e => setStudentId(e.target.value.toUpperCase())}
                leftIcon={<Hash className="w-4 h-4" />}
                required
              />
            </div>

            <Input
              label="Institutional Email"
              type="email"
              placeholder={`yourname@${settings.allowed_email_domains[0] || 'iimg.ac.in'}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              helperText={`Must end in @${settings.allowed_email_domains[0] || 'iimg.ac.in'}`}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Select
              label="Batch / Cohort"
              value={batch}
              onChange={e => setBatch(e.target.value)}
              options={[
                { label: '2026-2028 (IIMG Cohort)', value: '2026-2028' },
                { label: '2025-2027 (Senior Cohort)', value: '2025-2027' },
                { label: '2024-2026 (Graduating Cohort)', value: '2024-2026' },
              ]}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Complete Registration
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <button
              onClick={onLoginClick}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
