import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import StatusBadge from '../ui/StatusBadge';

/**
 * ActiveTeamControls.jsx
 * Owner: Mostafa khaled
 * Feature: Feature 3 — Admin Competition and Judging Setup (Task 2)
 *
 * Requirements:
 * 1. Set / Change Active Team:
 *    - PATCH /api/v1/competitions/:competitionId/active-team
 *    - Body: { "teamId": "<target_team_id>" }
 *    - Response (200): { "competitionId": "...", "activeTeamId": "..." }
 * 2. Skip Active Team:
 *    - POST /api/v1/competitions/:competitionId/teams/:teamId/skip
 *    - Body: { "reason": "..." }
 *    - Core Domain Rule: workflowStatus -> "SKIPPED", evaluationStatus -> "NOT_EVALUATED"
 *      MUST NOT mark as evaluated, MUST NOT assign a score of zero.
 * 3. Revisit Interaction:
 *    - Re-activate any skipped or previously visited team using PATCH /active-team.
 */
export default function ActiveTeamControls({ competitionId }) {
  const {
    competitions,
    currentTeams,
    activeTeam,
    setActiveTeam,
    skipTeam,
    revisitTeam,
  } = usePlatform();

  const targetComp = competitions.find((c) => c.id === competitionId) || null;

  // Local state for Skip Modal
  const [skipModalOpen, setSkipModalOpen] = useState(false);
  const [teamToSkip, setTeamToSkip] = useState(null);
  const [skipReason, setSkipReason] = useState('');
  const [skipValidationError, setSkipValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter / view tabs
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'SKIPPED' | 'VISITED'
  const [feedbackAlert, setFeedbackAlert] = useState(null);

  // Teams breakdown
  const pendingTeams = currentTeams.filter((t) => t.workflowStatus === 'PENDING');
  const skippedTeams = currentTeams.filter((t) => t.workflowStatus === 'SKIPPED');
  const visitedTeams = currentTeams.filter((t) => t.workflowStatus === 'VISITED');

  const filteredTeams = currentTeams.filter((t) => {
    if (filterTab === 'ALL') return true;
    return t.workflowStatus === filterTab;
  });

  // Action: Set Active Team (PATCH /active-team)
  const handleSetActive = async (teamId) => {
    setIsSubmitting(true);
    try {
      const result = await setActiveTeam(competitionId, teamId);
      const teamObj = currentTeams.find((t) => t.id === teamId);
      setFeedbackAlert({
        type: 'success',
        title: 'Active Team Set (PATCH 200 OK)',
        message: `Team "${teamObj?.name || teamId}" is now the active presentation team.`,
      });
    } catch (err) {
      setFeedbackAlert({
        type: 'error',
        title: 'Failed to Set Active Team',
        message: err.message || 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Skip Modal
  const handleOpenSkipModal = (team) => {
    setTeamToSkip(team);
    setSkipReason('');
    setSkipValidationError('');
    setSkipModalOpen(true);
  };

  // Action: Confirm Skip Team (POST /skip)
  const handleConfirmSkip = async () => {
    if (!skipReason.trim()) {
      setSkipValidationError('Please provide a mandatory reason for skipping this team slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await skipTeam(competitionId, teamToSkip.id, skipReason.trim());
      setSkipModalOpen(false);
      setFeedbackAlert({
        type: 'warning',
        title: 'Domain Rule Enforced: Team Marked as SKIPPED',
        message: `"${teamToSkip.name}" was skipped: workflowStatus set to SKIPPED, evaluationStatus retained as NOT_EVALUATED. No zero score was assigned. You may revisit this team at any time.`,
      });
    } catch (err) {
      setFeedbackAlert({
        type: 'error',
        title: 'Failed to Skip Team',
        message: err.message || 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action: Revisit interaction
  const handleRevisit = async (team) => {
    setIsSubmitting(true);
    try {
      await revisitTeam(competitionId, team.id);
      setFeedbackAlert({
        type: 'info',
        title: 'Revisit Interaction Executed',
        message: `Previously ${team.workflowStatus.toLowerCase()} team "${team.name}" has been brought back as the Active Team.`,
      });
    } catch (err) {
      setFeedbackAlert({
        type: 'error',
        title: 'Failed to Revisit Team',
        message: err.message || 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ───────────────── LIVE ACTIVE TEAM HERO CARD ───────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-surface-900/90 via-indigo-950/20 to-surface-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl animate-fade-in-up relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">
                Live Judging Session Active Team
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                Owner: [Mostafa khaled]
              </span>
            </div>

            {activeTeam ? (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-100 tracking-tight">
                  {activeTeam.name}
                </h2>
                <p className="text-sm text-surface-300 font-medium mt-1">
                  Project: <span className="text-primary-300">{activeTeam.projectTitle || 'Autonomous Innovation'}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-surface-400">
                  <span className="font-mono bg-surface-950/80 px-2.5 py-1 rounded-lg border border-surface-800">
                    ID: {activeTeam.id}
                  </span>
                  <span className="bg-surface-950/80 px-2.5 py-1 rounded-lg border border-surface-800">
                    Slot: {activeTeam.assignedSlot || 'Current Slot'}
                  </span>
                  <span className="bg-surface-950/80 px-2.5 py-1 rounded-lg border border-surface-800">
                    Members: {activeTeam.members?.join(', ') || 'N/A'}
                  </span>
                  <StatusBadge status={activeTeam.workflowStatus} />
                  <StatusBadge status={activeTeam.evaluationStatus} />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-surface-400">
                  No Team Currently Set as Active
                </h2>
                <p className="text-xs text-surface-500 mt-1">
                  Select a team from the list below to begin live judging presentation.
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions on the Active Team */}
          {activeTeam && (
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="warning"
                onClick={() => handleOpenSkipModal(activeTeam)}
                id="skip-active-team-btn"
                className="shadow-lg shadow-warning-600/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Skip This Team
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackAlert && (
        <Alert
          type={feedbackAlert.type}
          title={feedbackAlert.title}
          message={feedbackAlert.message}
          onDismiss={() => setFeedbackAlert(null)}
        />
      )}

      {/* ───────────────── DOMAIN RULE SPECIFICATION BANNER ───────────────── */}
      <div className="p-4 rounded-2xl bg-surface-900/50 border border-surface-800 flex items-start gap-3.5 text-xs">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-surface-200">
            Core Technical Architecture Domain Rule (Task 2):
          </p>
          <p className="text-surface-400 leading-relaxed">
            Skipping a team sets <code className="text-amber-300 font-mono font-semibold">workflowStatus</code> to{' '}
            <span className="text-amber-300 font-semibold">"SKIPPED"</span> and{' '}
            <code className="text-amber-300 font-mono font-semibold">evaluationStatus</code> to{' '}
            <span className="text-amber-300 font-semibold">"NOT_EVALUATED"</span>. It{' '}
            <strong className="text-surface-200 uppercase">must not</strong> mark the team as evaluated, and{' '}
            <strong className="text-surface-200 uppercase">must not</strong> assign a score of zero. Admins can
            navigate back and <strong className="text-surface-200">revisit</strong> skipped teams at any time.
          </p>
        </div>
      </div>

      {/* ───────────────── TEAMS SELECTION & REVISIT INTERACTION ───────────────── */}
      <div className="glass-card p-6 sm:p-8 animate-fade-in-up border border-surface-700/60 shadow-xl">
        {/* Table Controls & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-surface-800 gap-4">
          <div>
            <h3 className="text-lg font-bold text-surface-100 flex items-center gap-2">
              <span>All Registered Teams for Judging</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-800 text-surface-400">
                {currentTeams.length} total
              </span>
            </h3>
            <p className="text-xs text-surface-400 mt-0.5">
              Select or switch active team, skip absent teams, or revisit previously skipped teams.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-950 rounded-xl border border-surface-800 text-xs">
            {[
              { id: 'ALL', label: `All (${currentTeams.length})` },
              { id: 'PENDING', label: `Pending (${pendingTeams.length})` },
              { id: 'SKIPPED', label: `Skipped (${skippedTeams.length})`, highlight: skippedTeams.length > 0 },
              { id: 'VISITED', label: `Visited (${visitedTeams.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : tab.highlight
                    ? 'text-amber-400 hover:bg-surface-800'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Teams List */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12 text-surface-500 text-sm">
            No teams found in this category.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeams.map((team) => {
              const isActive = team.id === activeTeam?.id;
              const isSkipped = team.workflowStatus === 'SKIPPED';
              const isVisited = team.workflowStatus === 'VISITED';

              return (
                <div
                  key={team.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-primary-600/10 border-primary-500 shadow-lg shadow-primary-600/10 ring-1 ring-primary-500/30'
                      : isSkipped
                      ? 'bg-amber-950/10 border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-surface-900/60 border-surface-800 hover:border-surface-700 hover:bg-surface-800/40'
                  }`}
                >
                  {/* Left: Team details */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Status beacon indicator */}
                    <div className="mt-1 sm:mt-0">
                      {isActive ? (
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                        </span>
                      ) : isSkipped ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80 flex items-center justify-center text-[9px] text-black font-bold">
                          !
                        </span>
                      ) : isVisited ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500/70" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full bg-surface-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-surface-100">
                          {team.name}
                        </h4>
                        <span className="text-xs font-mono text-surface-500">
                          {team.id}
                        </span>
                        <StatusBadge status={team.workflowStatus} />
                        <StatusBadge status={team.evaluationStatus} />
                        {team.assignedSlot && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-surface-950 text-surface-400 font-mono">
                            {team.assignedSlot}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-surface-300 mt-1">
                        {team.projectTitle}
                      </p>

                      {/* Display skip reason if skipped */}
                      {isSkipped && team.skipReason && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-1.5">
                          <span className="font-semibold shrink-0">Skip Reason:</span>
                          <span className="italic">{team.skipReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions (Set Active, Skip, Revisit) */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                    {isActive ? (
                      <span className="text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Currently Active
                      </span>
                    ) : isSkipped ? (
                      /* Revisit Interaction button for skipped teams */
                      <Button
                        variant="warning"
                        size="sm"
                        loading={isSubmitting}
                        onClick={() => handleRevisit(team)}
                        id={`revisit-team-${team.id}`}
                        title="Revisit skipped team and set active via PATCH /active-team"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Revisit & Set Active
                      </Button>
                    ) : isVisited ? (
                      /* Revisit button for visited teams */
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={isSubmitting}
                        onClick={() => handleRevisit(team)}
                        id={`revisit-visited-team-${team.id}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Revisit
                      </Button>
                    ) : (
                      /* Standard Set Active Team */
                      <Button
                        variant="primary"
                        size="sm"
                        loading={isSubmitting}
                        onClick={() => handleSetActive(team.id)}
                        id={`set-active-${team.id}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                        Set Active
                      </Button>
                    )}

                    {/* Allow skipping any non-active, non-skipped team directly */}
                    {!isActive && !isSkipped && (
                      <button
                        onClick={() => handleOpenSkipModal(team)}
                        className="text-xs text-surface-400 hover:text-amber-400 px-2.5 py-1.5 rounded-lg border border-surface-700/60 hover:border-amber-500/40 bg-surface-950/60 transition-colors cursor-pointer"
                        title="Skip this team slot"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───────────────── SKIP TEAM CONFIRMATION MODAL ───────────────── */}
      <Modal
        isOpen={skipModalOpen}
        onClose={() => setSkipModalOpen(false)}
        title="Skip Team Slot Confirmation"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5">
          {/* Domain Warning Banner */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-300">
                You are about to skip team: <span className="underline">{teamToSkip?.name}</span>
              </p>
              <p className="text-surface-300 leading-relaxed">
                Skipping sets <code className="text-amber-300">workflowStatus: "SKIPPED"</code> and keeps{' '}
                <code className="text-amber-300">evaluationStatus: "NOT_EVALUATED"</code>. The team will NOT receive a
                zero score and can be revisited later when they are ready.
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <Textarea
            id="modal-skip-reason"
            label="Reason for Skipping (Mandatory) *"
            placeholder="e.g., Team hardware failed during setup; team absent from assigned slot..."
            value={skipReason}
            onChange={(e) => {
              setSkipReason(e.target.value);
              if (skipValidationError) setSkipValidationError('');
            }}
            error={skipValidationError}
            rows={3}
            autoFocus
          />

          <div className="p-3 bg-surface-950 rounded-xl border border-surface-800 text-[11px] font-mono text-surface-400">
            API Action: <span className="text-amber-400 font-semibold">POST /api/v1/competitions/{competitionId}/teams/{teamToSkip?.id}/skip</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setSkipModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              loading={isSubmitting}
              onClick={handleConfirmSkip}
              id="confirm-skip-modal-btn"
            >
              Confirm Skip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
