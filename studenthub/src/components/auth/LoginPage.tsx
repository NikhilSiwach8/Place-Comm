import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { store } from '../../services/store';
import { IIMGLogo } from '../common/IIMGLogo';

interface LoginPageProps {
  onRegisterClick: () => void;
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onRegisterClick,
  onSuccess,
  onBackToLanding,
}) => {
  const { login } = useAuth();
  const settings = store.getSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your institutional email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(cleanEmail, password);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
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

        <h2 className="text-center text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Sign in to Academic &amp; Placement Vault
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Authorized domains: {(settings?.allowed_email_domains || ['iimg.ac.in', 'institution.edu']).map(d => `@${d}`).join(', ')}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              placeholder="student@iimg.ac.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with your authorized institutional email and account password.
            </p>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an institutional profile yet?{' '}
            <button
              onClick={onRegisterClick}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Reset Password
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your registered institutional email to receive a secure recovery token.
            </p>
            {resetSent ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password reset token sent to your institutional inbox!</span>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Institutional Email"
                  type="email"
                  placeholder="name@iimg.ac.in"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    if (forgotEmail) setResetSent(true);
                  }}
                >
                  Send Reset Link
                </Button>
              </div>
            )}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setResetSent(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
