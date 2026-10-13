import React, { useEffect } from 'react';
import { getCompetition } from '../../api/competitionApi';
import { useApiCall } from '../../hooks/useApiCall';
import StatusBadge from '../ui/StatusBadge';
import Skeleton from '../ui/Skeleton';
import Alert from '../ui/Alert';
import Button from '../ui/Button';

/**
 * CompetitionDetails
 *
 * Displays competition details fetched from GET /api/v1/competitions/:competitionId
 * Shows: id, name, status, activeTeamId, rubricVersion, resultsStatus
 */
export default function CompetitionDetails({ competitionId, onEdit }) {
  const { execute, data: competition, loading, error } = useApiCall(getCompetition);

  useEffect(() => {
    if (competitionId) {
      execute(competitionId).catch(() => {});
    }
  }, [competitionId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="glass-card p-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-11 h-11" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-20" count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 animate-fade-in-up">
        <Alert
          type="error"
          title={`Failed to load competition (${error.code})`}
          message={error.message}
          details={error.details}
        />
        <div className="mt-4">
          <Button variant="secondary" onClick={() => execute(competitionId)} size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!competition) return null;

  const details = [
    {
      label: 'Competition ID',
      value: competition.id,
      mono: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
    },
    {
      label: 'Status',
      value: <StatusBadge status={competition.status} />,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Active Team',
      value: competition.activeTeamId || '—',
      mono: !!competition.activeTeamId,
      highlight: !!competition.activeTeamId,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Rubric Version',
      value: competition.rubricVersion ?? '—',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Results Status',
      value: <StatusBadge status={competition.resultsStatus} />,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-600/20 rounded-xl">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-100">{competition.name}</h2>
            {competition.description && (
              <p className="text-sm text-surface-400 mt-0.5">{competition.description}</p>
            )}
          </div>
        </div>
        {onEdit && (
          <Button variant="secondary" size="sm" onClick={() => onEdit(competition)} id="edit-competition-btn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((item, i) => (
          <div
            key={i}
            className={`
              p-4 rounded-xl border transition-all duration-200
              ${item.highlight
                ? 'bg-primary-600/5 border-primary-600/20'
                : 'bg-surface-800/30 border-surface-700/30 hover:border-surface-600/50'
              }
            `.trim()}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-surface-500">{item.icon}</span>
              <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <div className={item.mono ? 'font-mono text-sm text-surface-200' : 'text-sm text-surface-200'}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Refresh */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execute(competitionId)}
          id="refresh-competition-btn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>
    </div>
  );
}
