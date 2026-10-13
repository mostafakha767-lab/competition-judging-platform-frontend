import React, { useState, useEffect } from 'react';
import { setActiveTeam, getTeams } from '../../api/competitionApi';
import { useApiCall } from '../../hooks/useApiCall';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import StatusBadge from '../ui/StatusBadge';
import Skeleton from '../ui/Skeleton';

/**
 * ActiveTeamSelector
 *
 * Admin control to set or switch the currently active team.
 * API: PATCH /api/v1/competitions/:competitionId/active-team
 * Request Body: { teamId: "<target_team_id>" }
 * Response (200): { competitionId, activeTeamId }
 *
 * Also supports the "Revisit" interaction — navigating back to a previously
 * visited or skipped team by re-setting them as the active team.
 */
export default function ActiveTeamSelector({ competitionId, currentActiveTeamId, onActiveTeamChanged }) {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const teamsCall = useApiCall(getTeams);
  const setActiveCall = useApiCall(setActiveTeam);

  useEffect(() => {
    if (competitionId) {
      teamsCall.execute(competitionId).catch(() => {});
    }
  }, [competitionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const teams = teamsCall.data || [];

  const handleSetActive = async (teamId) => {
    const targetId = teamId || selectedTeamId;
    if (!targetId) return;

    try {
      const result = await setActiveCall.execute(competitionId, targetId);
      setSelectedTeamId('');
      if (onActiveTeamChanged) onActiveTeamChanged(result);
    } catch {
      // Error is in hook state
    }
  };

  const getTeamStatusIcon = (team) => {
    if (team.id === currentActiveTeamId) {
      return (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500" />
        </span>
      );
    }
    if (team.workflowStatus === 'SKIPPED') {
      return <span className="w-3 h-3 rounded-full bg-warning-500/60" />;
    }
    if (team.workflowStatus === 'VISITED') {
      return <span className="w-3 h-3 rounded-full bg-success-500/60" />;
    }
    return <span className="w-3 h-3 rounded-full bg-surface-600" />;
  };

  if (teamsCall.loading) {
    return (
      <div className="glass-card p-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-11 h-11" />
          <Skeleton className="h-5 w-44" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary-600/20 rounded-xl">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-100">Active Team Control</h2>
          <p className="text-sm text-surface-400 mt-0.5">Select the team currently being evaluated</p>
        </div>
      </div>

      {/* Current active team indicator */}
      {currentActiveTeamId && (
        <div className="mb-6 p-4 rounded-xl bg-primary-600/10 border border-primary-600/20 flex items-center gap-3 animate-fade-in">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500" />
          </span>
          <div>
            <span className="text-xs text-primary-400 uppercase tracking-wider font-semibold">Now Presenting</span>
            <p className="text-sm text-surface-100 font-mono">{currentActiveTeamId}</p>
          </div>
        </div>
      )}

      {/* Success feedback */}
      {setActiveCall.success && (
        <div className="mb-4">
          <Alert
            type="success"
            title="Active Team Updated"
            message={`Team ${setActiveCall.data?.activeTeamId} is now the active team.`}
            onDismiss={setActiveCall.reset}
          />
        </div>
      )}

      {/* Error feedback */}
      {setActiveCall.error && (
        <div className="mb-4">
          <Alert
            type="error"
            title={`Failed (${setActiveCall.error.code})`}
            message={setActiveCall.error.message}
            details={setActiveCall.error.details}
            onDismiss={setActiveCall.reset}
          />
        </div>
      )}

      {/* Fetch error */}
      {teamsCall.error && (
        <Alert
          type="error"
          title="Failed to load teams"
          message={teamsCall.error.message}
        />
      )}

      {/* Team list */}
      {teams.length > 0 && (
        <div className="space-y-2">
          {teams.map((team) => {
            const isActive = team.id === currentActiveTeamId;
            const isSkipped = team.workflowStatus === 'SKIPPED';

            return (
              <div
                key={team.id}
                className={`
                  group flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                  ${isActive
                    ? 'bg-primary-600/10 border-primary-500/30 shadow-lg shadow-primary-600/5'
                    : 'bg-surface-800/30 border-surface-700/30 hover:border-surface-500/50 hover:bg-surface-800/50'
                  }
                `.trim()}
              >
                <div className="flex items-center gap-3">
                  {getTeamStatusIcon(team)}
                  <div>
                    <p className="text-sm font-semibold text-surface-100">{team.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-surface-500 font-mono">{team.id}</span>
                      <StatusBadge status={team.workflowStatus} />
                      <StatusBadge status={team.evaluationStatus} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isActive ? (
                    <span className="text-xs text-primary-400 font-semibold px-3 py-1.5 bg-primary-600/20 rounded-lg">
                      Currently Active
                    </span>
                  ) : (
                    <Button
                      variant={isSkipped ? 'warning' : 'primary'}
                      size="sm"
                      loading={setActiveCall.loading && selectedTeamId === team.id}
                      onClick={() => {
                        setSelectedTeamId(team.id);
                        handleSetActive(team.id);
                      }}
                      id={`set-active-${team.id}`}
                    >
                      {isSkipped ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Revisit
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                          Set Active
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {teams.length === 0 && !teamsCall.error && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-surface-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-surface-500 text-sm">No teams registered for this competition</p>
        </div>
      )}

      {/* Refresh */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => teamsCall.execute(competitionId)}
          id="refresh-teams-btn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Teams
        </Button>
      </div>
    </div>
  );
}
