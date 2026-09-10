import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface ProfileCompletionCardProps {
  percentage: number;
  missingFields: string[];
  onCompleteClick: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  percentage,
  missingFields,
  onCompleteClick,
}) => {
  const isComplete = percentage >= 100;

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/30">
                Institutional Placement Readiness
              </span>
              {isComplete && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Your profile is {percentage}% complete
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl leading-relaxed">
              {isComplete
                ? 'Your student profile is thoroughly verified and primed for top-tier campus recruitment drives.'
                : 'Complete the missing fields to elevate your institutional ranking and unlock priority company shortlists.'}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={onCompleteClick}
              className="bg-white hover:bg-blue-50 text-blue-900 font-bold border-none shadow-sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5 text-blue-900" />}
            >
              {isComplete ? 'Review Profile' : 'Complete Profile'}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-blue-950/60 rounded-full h-2.5 overflow-hidden border border-blue-400/20">
          <div
            className="bg-gradient-to-r from-blue-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Missing Suggestions */}
        {!isComplete && missingFields.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-blue-800/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-blue-300 text-[11px] font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-300" /> Suggestions:
            </span>
            {missingFields.slice(0, 4).map((field, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-400/20 text-blue-100 text-[11px]"
              >
                + {field}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
