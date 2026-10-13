import React, { useState, useEffect, useCallback } from 'react';
import { getCompetition, getTeams } from '../api/competitionApi';
import { useApiCall } from '../hooks/useApiCall';
import ActiveTeamSelector from '../components/judging/ActiveTeamSelector';
import SkipTeamButton from '../components/judging/SkipTeamButton';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Alert from '../components/ui/Alert';

/**
 * JudgingSessionPage
 *
 * Admin control panel for managing the live judging session.
 * Composes Task 2 components: ActiveTeamSelector, SkipTeamButton, and Revisit.
 */
export default function JudgingSessionPage() {
  const [competitionId, setCompetitionId] = useState('comp-002');
  const [activeTeamId, setActiveTeamId] = useState(null);

  const compCall = useApiCall(getCompetition);
  const teamsCall = useApiCall(getTeams);

  const loadData = useCallback(async () => {
    if (!competitionId) return;
    try {
      const comp = await compCall.execute(competitionId);
      setActiveTeamId(comp.activeTeamId);
      await teamsCall.execute(competitionId);
    } catch {
      // Error in hook state
    }
  }, [competitionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadData();
  }, [loadData]);

  const competition = compCall.data;
  const teams = teamsCall.data || [];
  const activeTeam = teams.find((t) => t.id === activeTeamId);

  const handleActiveTeamChanged = (result) => {
    setActiveTeamId(result.activeTeamId);
  };

  const handleTeamSkipped = () => {
    setActiveTeamId(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-surface-100 tracking-tight">Live Judging Session</h1>
        <p className="text-surface-400 mt-1">Control the active team evaluation flow</p>
      </div>

      {/* Competition ID selector */}
      <div className="animate-fade-in flex items-center gap-3 p-4 glass-card">
        <label htmlFor="judging-comp-id" className="text-sm font-medium text-surface-300 whitespace-nowrap">
          Competition ID:
        </label>
        <input
          id="judging-comp-id"
          type="text"
          value={competitionId}
          onChange={(e) => setCompetitionId(e.target.value)}
          placeholder="Enter competition ID"
          className="flex-1 px-4 py-2.5 bg-surface-800/60 border border-surface-700 rounded-xl text-surface-100 placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-500"
        />
        <Button variant="secondary" size="sm" onClick={loadData} id="load-session-btn">
          Load
        </Button>
      </div>

      {/* Competition info bar */}
      {compCall.loading ? (
        <div className="glass-card p-6 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      ) : compCall.error ? (
        <Alert
          type="error"
          title="Failed to load competition"
          message={compCall.error.message}
        />
      ) : competition ? (
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/20 rounded-xl">
                <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-surface-100">{competition.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={competition.status} />
                  <StatusBadge status={competition.resultsStatus} />
                </div>
              </div>
            </div>

            {/* Active team quick view with skip button */}
            {activeTeam && (
              <div className="flex items-center gap-4 animate-fade-in">
                <div className="text-right">
                  <span className="text-xs text-primary-400 uppercase tracking-wider font-semibold block">
                    Now Presenting
                  </span>
                  <p className="text-sm font-semibold text-surface-100">{activeTeam.name}</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/30 flex items-center justify-center animate-pulse-glow">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <SkipTeamButton
                  competitionId={competitionId}
                  teamId={activeTeam.id}
                  teamName={activeTeam.name}
                  onSkipped={handleTeamSkipped}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Main content: Team Selector */}
      {competition && (
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <ActiveTeamSelector
            competitionId={competitionId}
            currentActiveTeamId={activeTeamId}
            onActiveTeamChanged={handleActiveTeamChanged}
          />
        </div>
      )}

      {/* Quick Legend */}
      {competition && teams.length > 0 && (
        <div className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500" />
              </span>
              <span className="text-xs text-surface-400">Active (presenting)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success-500/60" />
              <span className="text-xs text-surface-400">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning-500/60" />
              <span className="text-xs text-surface-400">Skipped (can revisit)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-surface-600" />
              <span className="text-xs text-surface-400">Pending</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
